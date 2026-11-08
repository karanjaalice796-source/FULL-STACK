"use strict";

const http = require("node:http");
const { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHmac } = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT) || 3000;
const APP_ROOT = __dirname;
const STATUSES = ["Wishlist", "Applied", "Phone Screen", "Interview", "Offer", "Rejected", "Withdrawn"];
const MAX_BODY_BYTES = 1_000_000;

function createDatabase(filePath = path.join(APP_ROOT, "data", "trackly.db")) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const db = new DatabaseSync(filePath);
  db.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      company TEXT NOT NULL,
      title TEXT NOT NULL,
      location TEXT NOT NULL DEFAULT '',
      job_url TEXT NOT NULL DEFAULT '',
      salary_min INTEGER,
      salary_max INTEGER,
      status TEXT NOT NULL CHECK (status IN ('Wishlist','Applied','Phone Screen','Interview','Offer','Rejected','Withdrawn')),
      priority INTEGER NOT NULL DEFAULT 0,
      date_applied TEXT,
      follow_up_date TEXT,
      notes TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS jobs_user_status_idx ON jobs(user_id, status);
    CREATE TABLE IF NOT EXISTS interviews (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      starts_at TEXT NOT NULL,
      location TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS interviews_user_start_idx ON interviews(user_id, starts_at);
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      linkedin_url TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'Resume',
      document_url TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
  return db;
}

function clean(value, maxLength = 5000) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function jobInput(input, partial = false) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { error: "Provide a job object." };
  const fields = {};
  const strings = [
    ["company", 120], ["title", 120], ["location", 160], ["job_url", 1000],
    ["notes", 5000], ["follow_up_date", 10], ["date_applied", 10]
  ];
  for (const [field, max] of strings) {
    const key = field === "job_url" ? "jobUrl" : field === "follow_up_date" ? "followUpDate" : field === "date_applied" ? "dateApplied" : field;
    if (input[key] !== undefined || !partial && ["company", "title"].includes(field)) fields[field] = clean(input[key], max);
  }
  if (!partial && (!fields.company || !fields.title)) return { error: "Company and job title are required." };
  if (input.status !== undefined) {
    if (!STATUSES.includes(input.status)) return { error: `Status must be one of: ${STATUSES.join(", ")}.` };
    fields.status = input.status;
  } else if (!partial) fields.status = "Wishlist";
  if (input.priority !== undefined) {
    if (!Number.isInteger(input.priority) || input.priority < 0 || input.priority > 5) return { error: "Priority must be a whole number from 0 to 5." };
    fields.priority = input.priority;
  }
  for (const field of ["salaryMin", "salaryMax"]) {
    if (input[field] === undefined) continue;
    if (input[field] === null || input[field] === "") fields[field === "salaryMin" ? "salary_min" : "salary_max"] = null;
    else if (!Number.isInteger(input[field]) || input[field] < 0 || input[field] > 100_000_000) return { error: "Salary must be a valid non-negative whole number." };
    else fields[field === "salaryMin" ? "salary_min" : "salary_max"] = input[field];
  }
  if (fields.salary_min != null && fields.salary_max != null && fields.salary_min > fields.salary_max) return { error: "Minimum salary cannot exceed maximum salary." };
  for (const field of ["date_applied", "follow_up_date"]) {
    if (fields[field] && !isDate(fields[field])) return { error: "Dates must use YYYY-MM-DD format." };
  }
  if (input.tags !== undefined) {
    if (!Array.isArray(input.tags)) return { error: "Tags must be a list." };
    fields.tags = JSON.stringify([...new Set(input.tags.map((tag) => clean(tag, 30).toLowerCase()).filter(Boolean))].slice(0, 12));
  }
  if (input.jobUrl !== undefined && fields.job_url) {
    try {
      if (!["http:", "https:"].includes(new URL(fields.job_url).protocol)) return { error: "Job link must be an http or https URL." };
    } catch { return { error: "Job link must be a valid http or https URL." }; }
  }
  return { fields };
}

function mapJob(row) {
  return {
    id: row.id, company: row.company, title: row.title, location: row.location, jobUrl: row.job_url,
    salaryMin: row.salary_min, salaryMax: row.salary_max, status: row.status, priority: row.priority,
    dateApplied: row.date_applied, followUpDate: row.follow_up_date, notes: row.notes,
    tags: JSON.parse(row.tags), createdAt: row.created_at, updatedAt: row.updated_at
  };
}

function mapInterview(row) {
  return { id: row.id, jobId: row.job_id, company: row.company, title: row.title, type: row.type, startsAt: row.starts_at, location: row.location, notes: row.notes };
}

function tokenFor(userId) {
  const secret = process.env.JWT_SECRET || "local-dev-secret-change-before-deploy";
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ sub: userId, exp: Date.now() + 7 * 86400_000 })).toString("base64url");
  const signingInput = `${header}.${payload}`;
  const signature = createHmac("sha256", secret).update(signingInput).digest("base64url");
  return `${signingInput}.${signature}`;
}

function userFromRequest(request) {
  const cookies = Object.fromEntries((request.headers.cookie || "").split(";").map((part) => {
    const [key, ...value] = part.trim().split("=");
    return [key, value.join("=")];
  }).filter(([key]) => key));
  const token = cookies.trackly_session;
  if (!token) return null;
  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) return null;
  const expected = createHmac("sha256", process.env.JWT_SECRET || "local-dev-secret-change-before-deploy").update(`${header}.${payload}`).digest();
  let actual;
  try { actual = Buffer.from(signature, "base64url"); } catch { return null; }
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return decoded.exp > Date.now() && typeof decoded.sub === "string" ? decoded.sub : null;
  } catch { return null; }
}

function cookieHeader(token, request) {
  const secure = process.env.NODE_ENV === "production";
  return `trackly_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${7 * 86400}${secure ? "; Secure" : ""}`;
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("Request body is too large."), { status: 413 }));
        request.destroy();
      }
    });
    request.on("end", () => {
      if (!body) return resolve({});
      try { resolve(JSON.parse(body)); } catch { reject(Object.assign(new Error("Request body must be valid JSON."), { status: 400 })); }
    });
    request.on("error", reject);
  });
}

function send(response, status, data, headers = {}) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers });
  response.end(JSON.stringify(data));
}

function createServer(options = {}) {
  if (process.env.NODE_ENV === "production" && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
    throw new Error("Set JWT_SECRET to at least 32 characters before running in production.");
  }
  const dbPath = options.databasePath || process.env.DATABASE_PATH || path.join(APP_ROOT, "data", "trackly.db");
  const db = options.db || createDatabase(dbPath);
  const authAttempts = new Map();
  const handler = async (request, response) => {
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("X-Frame-Options", "DENY");
    response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    response.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://img.magnific.com data: blob:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'");
    const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
    const pathname = url.pathname;
    const method = request.method;
    try {
      if (pathname.startsWith("/api/")) {
        const origin = request.headers.origin;
        if (origin && origin !== new URL(`http://${request.headers.host || "localhost"}`).origin && method !== "GET") {
          return send(response, 403, { error: "Cross-origin requests are not allowed." });
        }
        if (method === "POST" && ["/api/auth/login", "/api/auth/register"].includes(pathname)) {
          const now = Date.now();
          const key = request.socket.remoteAddress || "unknown";
          const attempts = (authAttempts.get(key) || []).filter((time) => now - time < 15 * 60_000);
          if (attempts.length >= 12) {
            response.setHeader("Retry-After", "900");
            return send(response, 429, { error: "Too many sign-in attempts. Please wait a little and try again." });
          }
          attempts.push(now);
          authAttempts.set(key, attempts);
        }
        if (method === "POST" && pathname === "/api/auth/register") {
          const body = await readBody(request);
          const name = clean(body.name, 80);
          const email = clean(body.email, 254).toLowerCase();
          if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof body.password !== "string" || body.password.length < 8 || body.password.length > 200) {
            return send(response, 400, { error: "Enter your name, a valid email, and a password of at least 8 characters." });
          }
          if (db.prepare("SELECT id FROM users WHERE email = ?").get(email)) return send(response, 409, { error: "An account with that email already exists." });
          const id = randomUUID();
          const salt = randomBytes(16).toString("hex");
          const hash = scryptSync(body.password, salt, 64).toString("hex");
          db.prepare("INSERT INTO users (id,name,email,password_hash,password_salt,created_at) VALUES (?,?,?,?,?,?)")
            .run(id, name, email, hash, salt, new Date().toISOString());
          return send(response, 201, { user: { id, name, email } }, { "Set-Cookie": cookieHeader(tokenFor(id), request) });
        }
        if (method === "POST" && pathname === "/api/auth/login") {
          const body = await readBody(request);
          const email = clean(body.email, 254).toLowerCase();
          const row = db.prepare("SELECT id,name,email,password_hash,password_salt FROM users WHERE email = ?").get(email);
          const passwordHash = typeof body.password === "string" ? scryptSync(body.password, row?.password_salt || "invalid-user-salt", 64).toString("hex") : "";
          const valid = row && Buffer.from(passwordHash, "hex").length === Buffer.from(row.password_hash, "hex").length
            && timingSafeEqual(Buffer.from(passwordHash, "hex"), Buffer.from(row.password_hash, "hex"));
          if (!valid) return send(response, 401, { error: "Email or password is incorrect." });
          return send(response, 200, { user: { id: row.id, name: row.name, email: row.email } }, { "Set-Cookie": cookieHeader(tokenFor(row.id), request) });
        }
        if (method === "POST" && pathname === "/api/auth/logout") return send(response, 200, { ok: true }, { "Set-Cookie": "trackly_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0" });

        const userId = userFromRequest(request);
        if (!userId || !db.prepare("SELECT id FROM users WHERE id = ?").get(userId)) return send(response, 401, { error: "Please sign in to continue." });
        if (method === "GET" && pathname === "/api/auth/me") {
          const user = db.prepare("SELECT id,name,email FROM users WHERE id = ?").get(userId);
          return send(response, 200, { user });
        }

        const jobMatch = pathname.match(/^\/api\/jobs(?:\/([^/]+))?(?:\/(interviews|contacts|documents))?$/);
        if (jobMatch && !jobMatch[2]) {
          const id = jobMatch[1];
          if (method === "GET" && !id) {
            const query = clean(url.searchParams.get("search"), 120).toLowerCase();
            const status = url.searchParams.get("status");
            let rows = db.prepare("SELECT * FROM jobs WHERE user_id = ? ORDER BY date_applied DESC, created_at DESC").all(userId);
            if (STATUSES.includes(status)) rows = rows.filter((job) => job.status === status);
            if (query) rows = rows.filter((job) => `${job.company} ${job.title} ${job.location}`.toLowerCase().includes(query));
            return send(response, 200, { jobs: rows.map(mapJob) });
          }
          if (method === "POST" && !id) {
            const { fields, error } = jobInput(await readBody(request));
            if (error) return send(response, 400, { error });
            const now = new Date().toISOString();
            const jobId = randomUUID();
            const keys = ["company", "title", "location", "job_url", "salary_min", "salary_max", "status", "priority", "date_applied", "follow_up_date", "notes", "tags"];
            const values = keys.map((key) => fields[key] ?? (["salary_min", "salary_max"].includes(key) ? null : ["location", "job_url", "notes"].includes(key) ? "" : key === "priority" ? 0 : key === "tags" ? "[]" : null));
            db.prepare(`INSERT INTO jobs (id,user_id,${keys.join(",")},created_at,updated_at) VALUES (${Array(keys.length + 4).fill("?").join(",")})`)
              .run(jobId, userId, ...values, now, now);
            addActivity(db, userId, jobId, `Added to ${fields.status}`);
            return send(response, 201, { job: mapJob(db.prepare("SELECT * FROM jobs WHERE id=? AND user_id=?").get(jobId, userId)) });
          }
          const row = id && db.prepare("SELECT * FROM jobs WHERE id=? AND user_id=?").get(id, userId);
          if (id && !row) return send(response, 404, { error: "Application not found." });
          if (method === "GET" && id) return send(response, 200, { job: mapJob(row) });
          if (method === "PATCH" && id) {
            const body = await readBody(request);
            const parsed = jobInput(body, true);
            if (parsed.error) return send(response, 400, { error: parsed.error });
            const updates = parsed.fields;
            if (!Object.keys(updates).length) return send(response, 400, { error: "Provide at least one field to update." });
            const nextStatus = updates.status || row.status;
            if (updates.status && updates.status !== row.status) addActivity(db, userId, id, `Status changed from ${row.status} to ${updates.status}`);
            const setters = Object.keys(updates).map((field) => `${field}=?`);
            db.prepare(`UPDATE jobs SET ${setters.join(",")}, updated_at=? WHERE id=? AND user_id=?`)
              .run(...Object.values(updates), new Date().toISOString(), id, userId);
            if (updates.status && nextStatus !== row.status) db.prepare("UPDATE jobs SET status=? WHERE id=? AND user_id=?").run(nextStatus, id, userId);
            return send(response, 200, { job: mapJob(db.prepare("SELECT * FROM jobs WHERE id=? AND user_id=?").get(id, userId)) });
          }
          if (method === "DELETE" && id) {
            db.prepare("DELETE FROM jobs WHERE id=? AND user_id=?").run(id, userId);
            return send(response, 200, { ok: true });
          }
        }

        if (method === "GET" && pathname === "/api/stats/by-status") {
          const rows = db.prepare("SELECT status, COUNT(*) AS count FROM jobs WHERE user_id=? GROUP BY status").all(userId);
          const breakdown = Object.fromEntries(STATUSES.map((status) => [status, rows.find((row) => row.status === status)?.count || 0]));
          return send(response, 200, { breakdown });
        }
        if (method === "GET" && pathname === "/api/stats/over-time") {
          const now = new Date();
          const months = Array.from({ length: 6 }, (_, index) => {
            const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (5 - index), 1));
            return date.toISOString().slice(0, 7);
          });
          const rows = db.prepare("SELECT substr(date_applied,1,7) AS month, COUNT(*) AS count FROM jobs WHERE user_id=? AND date_applied IS NOT NULL GROUP BY month").all(userId);
          const counts = new Map(rows.map((row) => [row.month, row.count]));
          return send(response, 200, { months: months.map((month) => ({ month, count: counts.get(month) || 0 })) });
        }
        if (method === "GET" && ["/api/stats", "/api/stats/summary"].includes(pathname)) {
          const rows = db.prepare("SELECT status, COUNT(*) AS count FROM jobs WHERE user_id=? GROUP BY status").all(userId);
          const breakdown = Object.fromEntries(STATUSES.map((status) => [status, rows.find((row) => row.status === status)?.count || 0]));
          const jobs = db.prepare("SELECT date_applied FROM jobs WHERE user_id=?").all(userId);
          const appliedJobs = jobs.filter((job) => job.date_applied);
          const appliedThisMonth = appliedJobs.filter((job) => job.date_applied.slice(0, 7) === new Date().toISOString().slice(0, 7)).length;
          const interviews = db.prepare("SELECT COUNT(*) AS count FROM interviews WHERE user_id=? AND starts_at >= ?").get(userId, new Date().toISOString()).count;
          const offers = breakdown.Offer;
          const followUps = db.prepare("SELECT COUNT(*) AS count FROM jobs WHERE user_id=? AND follow_up_date<=date('now','+7 day') AND follow_up_date IS NOT NULL AND status NOT IN ('Offer','Rejected','Withdrawn')").get(userId).count;
          const submitted = jobs.length - breakdown.Wishlist - breakdown.Withdrawn;
          const responded = breakdown["Phone Screen"] + breakdown.Interview + breakdown.Offer + breakdown.Rejected;
          return send(response, 200, { total: jobs.length, breakdown, appliedThisMonth, interviews, offers, followUps, responseRate: submitted ? Math.round(responded / submitted * 100) : 0 });
        }

        if (jobMatch && jobMatch[2]) {
          const jobId = jobMatch[1];
          if (!jobId || !db.prepare("SELECT id FROM jobs WHERE id=? AND user_id=?").get(jobId, userId)) return send(response, 404, { error: "Application not found." });
          const resource = jobMatch[2];
          if (resource === "interviews") {
            if (method === "GET") return send(response, 200, { interviews: db.prepare("SELECT i.*,j.company,j.title FROM interviews i JOIN jobs j ON i.job_id=j.id WHERE i.user_id=? AND i.job_id=? ORDER BY i.starts_at").all(userId, jobId).map(mapInterview) });
            if (method === "POST") {
              const body = await readBody(request);
              if (!clean(body.type, 50) || !body.startsAt || Number.isNaN(Date.parse(body.startsAt))) return send(response, 400, { error: "Interview type and a valid date/time are required." });
              const id = randomUUID();
              db.prepare("INSERT INTO interviews (id,user_id,job_id,type,starts_at,location,notes,created_at) VALUES (?,?,?,?,?,?,?,?)")
                .run(id, userId, jobId, clean(body.type, 50), new Date(body.startsAt).toISOString(), clean(body.location, 160), clean(body.notes, 2000), new Date().toISOString());
              db.prepare("UPDATE jobs SET status='Interview',updated_at=? WHERE id=? AND user_id=?").run(new Date().toISOString(), jobId, userId);
              addActivity(db, userId, jobId, `Interview scheduled: ${clean(body.type, 50)}`);
              return send(response, 201, { interview: db.prepare("SELECT i.*,j.company,j.title FROM interviews i JOIN jobs j ON i.job_id=j.id WHERE i.id=?").get(id) });
            }
          }
          if (resource === "contacts") {
            if (method === "GET") return send(response, 200, { contacts: db.prepare("SELECT * FROM contacts WHERE user_id=? AND job_id=? ORDER BY name").all(userId, jobId).map(mapContact) });
            if (method === "POST") {
              const body = await readBody(request);
              const name = clean(body.name, 100);
              if (!name) return send(response, 400, { error: "Contact name is required." });
              const id = randomUUID();
              db.prepare("INSERT INTO contacts (id,user_id,job_id,name,role,email,linkedin_url,created_at) VALUES (?,?,?,?,?,?,?,?)")
                .run(id, userId, jobId, name, clean(body.role, 100), clean(body.email, 254), clean(body.linkedinUrl, 1000), new Date().toISOString());
              return send(response, 201, { contact: mapContact(db.prepare("SELECT * FROM contacts WHERE id=?").get(id)) });
            }
          }
          if (resource === "documents") {
            if (method === "GET") return send(response, 200, { documents: db.prepare("SELECT * FROM documents WHERE user_id=? AND job_id=? ORDER BY created_at DESC").all(userId, jobId).map(mapDocument) });
            if (method === "POST") {
              const body = await readBody(request);
              const name = clean(body.name, 120);
              const documentUrl = clean(body.documentUrl, 1000);
              const type = clean(body.type, 50) || "Resume";
              try {
                if (!name || !["http:", "https:"].includes(new URL(documentUrl).protocol)) return send(response, 400, { error: "Provide a document name and a valid http or https link." });
              } catch { return send(response, 400, { error: "Provide a document name and a valid http or https link." }); }
              const id = randomUUID();
              db.prepare("INSERT INTO documents (id,user_id,job_id,name,type,document_url,created_at) VALUES (?,?,?,?,?,?,?)")
                .run(id, userId, jobId, name, type, documentUrl, new Date().toISOString());
              return send(response, 201, { document: mapDocument(db.prepare("SELECT * FROM documents WHERE id=?").get(id)) });
            }
          }
        }

        if (method === "GET" && pathname === "/api/interviews") {
          const rows = db.prepare("SELECT i.*,j.company,j.title FROM interviews i JOIN jobs j ON i.job_id=j.id WHERE i.user_id=? ORDER BY i.starts_at").all(userId);
          return send(response, 200, { interviews: rows.map(mapInterview) });
        }
        if (method === "DELETE" && pathname.startsWith("/api/interviews/")) {
          db.prepare("DELETE FROM interviews WHERE id=? AND user_id=?").run(pathname.split("/").pop(), userId);
          return send(response, 200, { ok: true });
        }
        if (method === "GET" && pathname === "/api/contacts") {
          const rows = db.prepare("SELECT c.*,j.company,j.title FROM contacts c JOIN jobs j ON c.job_id=j.id WHERE c.user_id=? ORDER BY c.name").all(userId);
          return send(response, 200, { contacts: rows.map(mapContact) });
        }
        if (method === "DELETE" && pathname.startsWith("/api/contacts/")) {
          db.prepare("DELETE FROM contacts WHERE id=? AND user_id=?").run(pathname.split("/").pop(), userId);
          return send(response, 200, { ok: true });
        }
        if (method === "GET" && pathname === "/api/documents") {
          const rows = db.prepare("SELECT d.*,j.company,j.title FROM documents d JOIN jobs j ON d.job_id=j.id WHERE d.user_id=? ORDER BY d.created_at DESC").all(userId);
          return send(response, 200, { documents: rows.map(mapDocument) });
        }
        if (method === "DELETE" && pathname.startsWith("/api/documents/")) {
          db.prepare("DELETE FROM documents WHERE id=? AND user_id=?").run(pathname.split("/").pop(), userId);
          return send(response, 200, { ok: true });
        }
        if (method === "GET" && pathname === "/api/activities") {
          const activities = db.prepare("SELECT a.id,a.message,a.created_at,j.company,j.title FROM activities a JOIN jobs j ON a.job_id=j.id WHERE a.user_id=? ORDER BY a.created_at DESC LIMIT 20").all(userId);
          return send(response, 200, { activities });
        }
        if (method === "GET" && pathname === "/api/export") {
          const jobs = db.prepare("SELECT * FROM jobs WHERE user_id=? ORDER BY created_at DESC").all(userId).map(mapJob);
          const interviews = db.prepare("SELECT i.*,j.company,j.title FROM interviews i JOIN jobs j ON i.job_id=j.id WHERE i.user_id=?").all(userId).map(mapInterview);
          const contacts = db.prepare("SELECT * FROM contacts WHERE user_id=?").all(userId).map(mapContact);
          const documents = db.prepare("SELECT * FROM documents WHERE user_id=?").all(userId).map(mapDocument);
          return send(response, 200, { exportedAt: new Date().toISOString(), jobs, interviews, contacts, documents });
        }
        return send(response, 404, { error: "API route not found." });
      }

      const assets = { "/": ["index.html", "text/html"], "/index.html": ["index.html", "text/html"], "/app.js": ["app.js", "text/javascript"], "/styles.css": ["styles.css", "text/css"] };
      const asset = assets[pathname];
      if (!asset || !["GET", "HEAD"].includes(method)) return send(response, 404, { error: "Page not found." });
      const content = fs.readFileSync(path.join(APP_ROOT, asset[0]));
      response.writeHead(200, { "Content-Type": `${asset[1]}; charset=utf-8`, "Cache-Control": "no-cache" });
      response.end(method === "HEAD" ? undefined : content);
    } catch (error) {
      if (error.status) return send(response, error.status, { error: error.message });
      console.error("Request failed:", error);
      if (!response.headersSent) send(response, 500, { error: "The server could not complete your request." });
    }
  };
  const server = http.createServer(handler);
  server.database = db;
  return server;
}

function addActivity(db, userId, jobId, message) {
  db.prepare("INSERT INTO activities (id,user_id,job_id,message,created_at) VALUES (?,?,?,?,?)")
    .run(randomUUID(), userId, jobId, message, new Date().toISOString());
}

function mapContact(row) {
  return { id: row.id, jobId: row.job_id, name: row.name, role: row.role, email: row.email, linkedinUrl: row.linkedin_url, company: row.company, title: row.title };
}

function mapDocument(row) {
  return { id: row.id, jobId: row.job_id, name: row.name, type: row.type, documentUrl: row.document_url, company: row.company, title: row.title, createdAt: row.created_at };
}

if (require.main === module) {
  const server = createServer();
  server.listen(PORT, () => console.log(`Trackly is ready at http://localhost:${PORT}`));
}

module.exports = { createServer, createDatabase, STATUSES };
