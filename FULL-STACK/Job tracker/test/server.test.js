"use strict";

const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createServer } = require("../server");

const folder = fs.mkdtempSync(path.join(os.tmpdir(), "trackly-test-"));
const server = createServer({ databasePath: path.join(folder, "test.db") });
let baseUrl;
const cookies = new Map();
const users = {};

const listening = new Promise((resolve) => server.listen(0, "127.0.0.1", () => {
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  resolve();
}));

after(() => {
  server.close();
  server.database.close();
  fs.rmSync(folder, { recursive: true, force: true });
});

async function request(pathname, { user, method = "GET", body, origin } = {}) {
  await listening;
  const response = await fetch(`${baseUrl}${pathname}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(origin ? { Origin: origin } : {}),
      ...(user && cookies.has(user) ? { Cookie: cookies.get(user) } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const setCookie = response.headers.get("set-cookie");
  if (user && setCookie) cookies.set(user, setCookie.split(";")[0]);
  return { status: response.status, body: await response.json() };
}

test("register, authenticate and scope jobs to their owner", async () => {
  const registered = await request("/api/auth/register", {
    user: "first", method: "POST", body: { name: "First User", email: "first@example.test", password: "correct-horse-42" }
  });
  assert.equal(registered.status, 201);
  assert.equal((await request("/api/auth/me", { user: "first" })).body.user.email, "first@example.test");
  assert.equal((await request("/api/jobs", { user: "first", method: "POST", origin: "https://evil.example", body: { company: "Bad", title: "Cross-site" } })).status, 403);
  assert.equal((await request("/api/auth/register", {
    user: "duplicate", method: "POST", body: { name: "Other", email: "FIRST@example.test", password: "correct-horse-42" }
  })).status, 409);

  const created = await request("/api/jobs", {
    user: "first", method: "POST", body: { company: "Northstar", title: "Frontend Engineer", status: "Applied", dateApplied: "2026-11-07" }
  });
  assert.equal(created.status, 201);
  const jobId = created.body.job.id;
  assert.equal((await request("/api/jobs", { user: "second" })).status, 401);

  await request("/api/auth/register", { user: "second", method: "POST", body: { name: "Second User", email: "second@example.test", password: "another-pass-42" } });
  assert.equal((await request(`/api/jobs/${jobId}`, { user: "second" })).status, 404);
  assert.equal((await request("/api/jobs", { user: "second" })).body.jobs.length, 0);

  const moved = await request(`/api/jobs/${jobId}`, { user: "first", method: "PATCH", body: { status: "Interview" } });
  assert.equal(moved.body.job.status, "Interview");
  assert.equal((await request("/api/activities", { user: "first" })).body.activities[0].message, "Status changed from Applied to Interview");
  assert.equal((await request("/api/stats", { user: "first" })).body.breakdown.Interview, 1);
  assert.equal((await request("/api/stats/by-status", { user: "first" })).body.breakdown.Interview, 1);
  assert.equal((await request("/api/stats/over-time", { user: "first" })).body.months.length, 6);
  assert.equal((await request("/api/jobs", { user: "first", method: "POST", body: { company: "", title: "Bad", status: "Secret" } })).status, 400);
  assert.equal((await request("/api/jobs", { user: "first", method: "POST", body: { company: "Northstar", title: "Bad link", jobUrl: "javascript:alert(1)" } })).status, 400);

  const interview = await request(`/api/jobs/${jobId}/interviews`, {
    user: "first", method: "POST", body: { type: "Technical", startsAt: "2026-11-18T14:30:00.000Z", location: "Video call" }
  });
  assert.equal(interview.status, 201);
  assert.equal((await request("/api/interviews", { user: "first" })).body.interviews[0].type, "Technical");
  const contact = await request(`/api/jobs/${jobId}/contacts`, {
    user: "first", method: "POST", body: { name: "Alex Morgan", role: "Recruiter", email: "alex@example.test" }
  });
  assert.equal(contact.status, 201);
  assert.equal((await request("/api/contacts", { user: "first" })).body.contacts[0].name, "Alex Morgan");
  const document = await request(`/api/jobs/${jobId}/documents`, {
    user: "first", method: "POST", body: { name: "Product design resume", type: "Resume", documentUrl: "https://example.test/resume.pdf" }
  });
  assert.equal(document.status, 201);
  assert.equal((await request(`/api/jobs/${jobId}/documents`, { user: "first" })).body.documents[0].name, "Product design resume");
  assert.equal((await request("/api/export", { user: "first" })).body.documents.length, 1);
  assert.equal((await request(`/api/jobs/${jobId}`, { user: "first", method: "DELETE" })).status, 200);
  assert.equal((await request("/api/interviews", { user: "first" })).body.interviews.length, 0);
  assert.equal((await request("/api/contacts", { user: "first" })).body.contacts.length, 0);
  assert.equal((await request("/api/documents", { user: "first" })).body.documents.length, 0);
});

test("login rejects bad credentials and logout clears the session", async () => {
  assert.equal((await request("/api/auth/login", { user: "first", method: "POST", body: { email: "first@example.test", password: "wrong-password" } })).status, 401);
  assert.equal((await request("/api/auth/logout", { user: "first", method: "POST" })).status, 200);
});
