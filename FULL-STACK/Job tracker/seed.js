"use strict";

const { randomUUID, scryptSync, randomBytes } = require("node:crypto");
const { createDatabase } = require("./server");

const db = createDatabase();
const email = "demo@trackly.app";
if (db.prepare("SELECT id FROM users WHERE email=?").get(email)) {
  console.log("The demo workspace already exists.");
  db.close();
  process.exit(0);
}

const now = new Date();
const isoDay = (offset = 0) => {
  const date = new Date(now);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};
const id = randomUUID();
const salt = randomBytes(16).toString("hex");
const password = process.env.DEMO_PASSWORD || "trackly-demo-2026";
db.prepare("INSERT INTO users (id,name,email,password_hash,password_salt,created_at) VALUES (?,?,?,?,?,?)")
  .run(id, "Taylor Jordan", email, scryptSync(password, salt, 64).toString("hex"), salt, now.toISOString());

const insertJob = db.prepare(`INSERT INTO jobs
  (id,user_id,company,title,location,job_url,salary_min,salary_max,status,priority,date_applied,follow_up_date,notes,tags,created_at,updated_at)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
const sampleJobs = [
  { company: "Linear", title: "Product Designer", location: "Remote", status: "Interview", date: -10, followUp: 3, priority: 2, tags: ["remote", "design systems"] },
  { company: "Figma", title: "UX Designer", location: "New York, NY", status: "Applied", date: -6, followUp: 2, priority: 1, tags: ["dream job"] },
  { company: "Notion", title: "Product Designer", location: "San Francisco, CA", status: "Phone Screen", date: -4, followUp: 5, priority: 0, tags: ["product"] },
  { company: "Webflow", title: "Design Systems Lead", location: "Remote", status: "Offer", date: -18, followUp: null, priority: 3, tags: ["remote", "offer"] },
  { company: "Airtable", title: "Senior Product Designer", location: "Remote", status: "Wishlist", date: null, followUp: null, priority: 1, tags: ["startup", "remote"] }
];
const jobIds = [];
for (const sample of sampleJobs) {
  const jobId = randomUUID();
  jobIds.push(jobId);
  insertJob.run(jobId, id, sample.company, sample.title, sample.location, "", 100000, 150000, sample.status,
    sample.priority, sample.date == null ? null : isoDay(sample.date), sample.followUp == null ? null : isoDay(sample.followUp),
    "Remember to personalize the follow-up and keep notes from every conversation.", JSON.stringify(sample.tags), now.toISOString(), now.toISOString());
  db.prepare("INSERT INTO activities (id,user_id,job_id,message,created_at) VALUES (?,?,?,?,?)")
    .run(randomUUID(), id, jobId, `Added to ${sample.status}`, now.toISOString());
}

const interviewDate = new Date();
interviewDate.setDate(interviewDate.getDate() + 3);
interviewDate.setHours(14, 0, 0, 0);
db.prepare("INSERT INTO interviews (id,user_id,job_id,type,starts_at,location,notes,created_at) VALUES (?,?,?,?,?,?,?,?)")
  .run(randomUUID(), id, jobIds[0], "Product design", interviewDate.toISOString(), "Video call", "Prepare a short portfolio walkthrough and questions about the design team.", now.toISOString());
db.prepare("INSERT INTO contacts (id,user_id,job_id,name,role,email,linkedin_url,created_at) VALUES (?,?,?,?,?,?,?,?)")
  .run(randomUUID(), id, jobIds[0], "Alex Morgan", "Design recruiter", "alex@example.test", "https://www.linkedin.com/", now.toISOString());

console.log(`Demo workspace created. Email: ${email}`);
if (process.env.DEMO_PASSWORD) console.log("Password: (set by DEMO_PASSWORD)");
else console.log(`Password: ${password}`);
db.close();
