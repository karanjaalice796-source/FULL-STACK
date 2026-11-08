"use strict";

const STATUSES = ["Wishlist", "Applied", "Phone Screen", "Interview", "Offer", "Rejected", "Withdrawn"];
const LEARNING_MODULES = [
  {
    id: "resume", category: "APPLICATION BASICS", icon: "▤", duration: "8 min",
    title: "Build a resume that gets read",
    summary: "Make the connection between your experience and the role easy to spot.",
    lessons: [
      "Lead with the experience most relevant to this role. A recruiter should understand your fit in a quick scan.",
      "Turn responsibilities into evidence: describe what you changed, built, improved, or delivered.",
      "Use clear headings, consistent dates, and a simple layout that works in applicant tracking systems.",
      "Proofread the exported PDF and keep a master resume so tailoring never means starting from scratch."
    ],
    exercise: "Choose one role in your tracker. Rewrite one resume bullet to show the action you took and the result."
  },
  {
    id: "tailor", category: "APPLICATION BASICS", icon: "", duration: "6 min",
    title: "Tailor each application, thoughtfully",
    summary: "Focus on the role’s real priorities without rewriting your whole story.",
    lessons: [
      "Read the job description once for responsibilities, then again for repeated skills and outcomes.",
      "Pick two or three requirements that match your strongest evidence. Bring those examples forward.",
      "Use the employer’s language when it accurately describes your work; never add skills you cannot demonstrate.",
      "Save the job link and a short note about your angle in the application tracker."
    ],
    exercise: "Add a short note to an application describing the two experiences you want the hiring team to remember."
  },
  {
    id: "interviews", category: "INTERVIEW PREP", icon: "◷", duration: "10 min",
    title: "Tell clear stories in interviews",
    summary: "Prepare concise examples that show how you think, collaborate, and learn.",
    lessons: [
      "Use a simple structure: context, your responsibility, the action you took, and the outcome.",
      "Be specific about your contribution, especially when describing shared team work.",
      "Choose examples that show different strengths: problem solving, collaboration, and handling a challenge.",
      "Practice aloud, but keep the delivery natural. It is fine to pause and organize your thoughts."
    ],
    exercise: "Add an interview in Trackly and write down one example you can use to explain a meaningful project."
  },
  {
    id: "research", category: "INTERVIEW PREP", icon: "⌕", duration: "7 min",
    title: "Research a company beyond its homepage",
    summary: "Learn enough about the team and product to ask useful, genuine questions.",
    lessons: [
      "Understand who the company serves and what problem its product or service solves.",
      "Look for recent product updates, team priorities, and the language used in the job description.",
      "Connect what you learn to your own experience instead of memorizing company facts.",
      "Prepare questions about the role’s goals, collaboration, and what success looks like."
    ],
    exercise: "Save three questions for your next conversation in the interview’s prep notes."
  },
  {
    id: "follow-up", category: "FOLLOW-THROUGH", icon: "", duration: "5 min",
    title: "Follow up with confidence",
    summary: "Be courteous, specific, and easy to respond to—without overthinking the timing.",
    lessons: [
      "After a conversation, send a short thank-you that refers to one detail you discussed.",
      "If a timeline passes, send one polite check-in and briefly restate your interest.",
      "Use your follow-up date to set a reminder for yourself; do not assume silence means a decision.",
      "Keep applying while you wait so one opportunity does not carry the whole search."
    ],
    exercise: "Set a follow-up date on an active application and draft a two-sentence check-in in its notes."
  },
  {
    id: "networking", category: "FOLLOW-THROUGH", icon: "♧", duration: "6 min",
    title: "Make networking feel more human",
    summary: "Start a real conversation by being clear about why you reached out.",
    lessons: [
      "Reach out with a specific reason: a shared interest, a role, or something you learned from their work.",
      "Ask for a small piece of advice rather than making a broad request for a job.",
      "Keep the first message brief and make it comfortable for the other person to say no.",
      "Record useful context in the contact list so you can follow up thoughtfully."
    ],
    exercise: "Add one relevant contact to an application and note where you met or what you discussed."
  },
  {
    id: "offers", category: "NEXT CHAPTER", icon: "", duration: "8 min",
    title: "Compare offers with the whole picture",
    summary: "Think about the work, people, and practical details—not salary alone.",
    lessons: [
      "Compare role scope, manager support, growth, flexibility, and the day-to-day work.",
      "Review the full compensation details and benefits, and ask questions when anything is unclear.",
      "If you need time, ask for a decision deadline and confirm it in writing.",
      "If you negotiate, stay respectful, be specific about what you are asking for, and make room for a conversation."
    ],
    exercise: "Write down your top three priorities for your next role before comparing opportunities."
  }
];
const state = {
  user: null,
  jobs: [],
  interviews: [],
  contacts: [],
  activities: [],
  stats: {},
  monthlyStats: [],
  page: "overview",
  search: "",
  statusFilter: "all",
  month: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  register: false,
  draggedJobId: null,
  learningOpenId: null,
  learningCompleted: []
};

const $ = (selector) => document.querySelector(selector);
const pageContent = $("#page-content");
const toast = $("#toast");
let toastTimer;

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  let result;
  try { result = await response.json(); } catch { result = {}; }
  if (!response.ok) {
    if (response.status === 401 && state.user) showAuth();
    throw new Error(result.error || "Something went wrong. Please try again.");
  }
  return result;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function showToast(message, error = false) {
  toast.textContent = message;
  toast.classList.toggle("error", error);
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3200);
}

function formatDate(value, options = { month: "short", day: "numeric", year: "numeric" }) {
  if (!value) return "—";
  const date = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en", options).format(date);
}

function initials(name) {
  return String(name || "").trim().split(/\s+/).slice(0, 2).map((part) => part[0] || "").join("").toUpperCase() || "JD";
}

function currency(value) {
  return value == null ? "" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function showAuth() {
  setMobileNavOpen(false);
  state.user = null;
  $("#app-shell").hidden = true;
  $("#auth-screen").hidden = false;
  renderAuthMode();
}

function renderAuthMode() {
  $("#auth-title").textContent = state.register ? "A fresh start." : "Welcome back.";
  $("#auth-copy").textContent = state.register
    ? "Create your private workspace and keep every next step in view."
    : "Your next chapter is still waiting. Pick up where you left off.";
  $("#auth-name-wrap").hidden = !state.register;
  $("#auth-name").required = state.register;
  $("#auth-password").autocomplete = state.register ? "new-password" : "current-password";
  $("#auth-submit").textContent = state.register ? "Create account" : "Sign in";
  $("#auth-switch-copy").textContent = state.register ? "Already have an account?" : "New to Trackly?";
  $("#auth-switch").textContent = state.register ? "Sign in" : "Create an account";
  $("#auth-error").hidden = true;
}

function showApp(user) {
  setMobileNavOpen(false);
  state.user = user;
  $("#auth-screen").hidden = true;
  $("#app-shell").hidden = false;
  $("#profile-name").textContent = user.name;
  $("#profile-avatar").textContent = initials(user.name);
  const topAvatar = $("#profile-shortcut");
  topAvatar.textContent = initials(user.name);
  loadLearningProgress(user.id);
  loadWorkspace();
}

function learningProgressKey(userId) {
  return `trackly-learning-progress:${userId}`;
}

function loadLearningProgress(userId) {
  try {
    const saved = JSON.parse(localStorage.getItem(learningProgressKey(userId)) || "[]");
    state.learningCompleted = Array.isArray(saved)
      ? [...new Set(saved.filter((id) => LEARNING_MODULES.some((module) => module.id === id)))]
      : [];
  } catch (error) {
    console.error("Could not load learning progress.", error);
    state.learningCompleted = [];
    showToast("Your lesson progress could not be loaded in this browser.", true);
  }
}

function saveLearningProgress() {
  try {
    localStorage.setItem(learningProgressKey(state.user.id), JSON.stringify(state.learningCompleted));
    return true;
  } catch (error) {
    console.error("Could not save learning progress.", error);
    showToast("Your lesson progress could not be saved in this browser.", true);
    return false;
  }
}

async function refreshWorkspace() {
  const [jobs, interviews, contacts, activities, stats, monthlyStats] = await Promise.all([
    api("/api/jobs"), api("/api/interviews"), api("/api/contacts"), api("/api/activities"), api("/api/stats"), api("/api/stats/over-time")
  ]);
  state.jobs = jobs.jobs;
  state.interviews = interviews.interviews;
  state.contacts = contacts.contacts;
  state.activities = activities.activities;
  state.stats = stats;
  state.monthlyStats = monthlyStats.months;
  renderPage();
}

async function loadWorkspace() {
  try {
    await refreshWorkspace();
  } catch (error) {
    showToast(error.message, true);
  }
}

function statusClass(status) {
  return `status-${String(status).toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, "")}`;
}

function statusBadge(status) {
  return `<span class="status-pill ${statusClass(status)}">${escapeHtml(status)}</span>`;
}

function companyMark(company, index = 0) {
  const palettes = [["#f0efff", "#6963ca"], ["#e8f4fd", "#4a8cc2"], ["#fff1e8", "#c6804f"], ["#eaf6ed", "#5a9b70"], ["#fceafa", "#b35f9b"], ["#fff5dc", "#b79042"]];
  const [background, foreground] = palettes[index % palettes.length];
  return `<span class="company-logo" style="background:${background};color:${foreground}" aria-hidden="true">${escapeHtml(initials(company))}</span>`;
}

function jobRole(job, index = 0) {
  return `<div class="role-cell">${companyMark(job.company, index)}<span class="role-copy"><span class="role-name">${escapeHtml(job.title)}</span><span class="company-name">${escapeHtml(job.company)}</span></span></div>`;
}

function jobActions(job) {
  return `<span class="row-actions">
    <button class="row-action" type="button" data-action="edit-job" data-id="${escapeHtml(job.id)}" aria-label="Edit ${escapeHtml(job.title)} at ${escapeHtml(job.company)}" title="Edit">✎</button>
    <button class="row-action" type="button" data-action="manage-documents" data-id="${escapeHtml(job.id)}" aria-label="Manage documents for ${escapeHtml(job.title)}" title="Documents">▧</button>
    ${job.jobUrl ? `<a class="row-action" href="${escapeHtml(job.jobUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Open job posting" title="Open job posting">Open</a>` : ""}
    <button class="row-action delete" type="button" data-action="delete-job" data-id="${escapeHtml(job.id)}" aria-label="Delete ${escapeHtml(job.title)} at ${escapeHtml(job.company)}" title="Delete">×</button>
  </span>`;
}

function renderTable(jobs = state.jobs) {
  if (!jobs.length) return `<div class="empty-state"><h3>Your next opportunity is waiting.</h3><p>Add an application to start building your search.</p><button class="button button-primary" data-action="add-job">Add your first application</button></div>`;
  return `<div class="table-wrap"><table><thead><tr><th>ROLE &amp; COMPANY</th><th>STATUS</th><th>DATE APPLIED</th><th>LOCATION</th><th>SALARY</th><th><span class="visually-hidden">Actions</span></th></tr></thead><tbody>${jobs.map((job, index) => `<tr>
    <td>${jobRole(job, index)}</td><td>${statusBadge(job.status)}</td><td>${escapeHtml(formatDate(job.dateApplied))}</td>
    <td>${escapeHtml(job.location || "—")}</td><td>${job.salaryMin || job.salaryMax ? `${escapeHtml(currency(job.salaryMin))}${job.salaryMax ? ` – ${escapeHtml(currency(job.salaryMax))}` : ""}` : "—"}</td><td>${jobActions(job)}</td>
  </tr>`).join("")}</tbody></table></div>`;
}

function statCard(caption, number, label, foot, theme, icon = "") {
  return `<article class="stat-card stat-${theme}"><div class="stat-top">${icon ? `<span class="stat-icon">${icon}</span>` : ""}<span class="stat-caption">${caption}</span></div><div class="stat-number">${number}</div><div class="stat-label">${label}</div><div class="stat-foot"><span class="stat-dot ${theme}-dot"></span>${foot}</div></article>`;
}

function pageHeader(eyebrow, title, copy, action = "") {
  return `<div class="welcome-row"><div><p class="eyebrow"><span class="eyebrow-dot"></span>${eyebrow}</p><h1>${title}</h1><p class="welcome-copy">${copy}</p></div>${action}</div>`;
}

function renderOverview() {
  const total = state.jobs.length;
  const active = state.jobs.filter((job) => ["Applied", "Phone Screen", "Interview"].includes(job.status)).length;
  const followUps = state.stats.followUps || 0;
  const recent = [...state.jobs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const upcoming = state.interviews.filter((interview) => new Date(interview.startsAt) >= new Date()).slice(0, 4);
  const stats = `<section class="stats-grid" aria-label="Application statistics">
    ${statCard("IN MOTION", active, "Active applications", "Your search is moving", "blue")}
    ${statCard("GOOD MOMENTUM", state.stats.interviews || 0, "Upcoming interviews", "Opportunities to shine", "violet", "◷")}
    ${statCard("BIG WINS", state.stats.offers || 0, "Offers received", "Every step counts", "green")}
    ${statCard("DON'T FORGET", followUps, "Follow-ups due", "A thoughtful nudge goes far", "amber", "⌁")}
  </section>`;
  return `${pageHeader("YOUR CAREER DASHBOARD", "Your next chapter <span>starts here.</span>", "A little progress every day adds up. Here's where your search stands.", `<button class="button button-primary" data-action="add-job"><span class="plus-icon">+</span> Add application</button>`)}
    ${stats}
    <div class="dashboard-grid">
      <section class="applications-panel dashboard-apps"><div class="panel-heading"><div><div class="heading-with-count"><h2>Recent applications</h2><span class="total-pill">${total}</span></div><p class="panel-subtitle">Your latest opportunities, all in one place.</p></div><button class="text-button" data-page-link="jobs">View all →</button></div>${renderTable(recent)}</section>
      <section class="applications-panel"><div class="panel-heading"><div><h2>Coming up</h2><p class="panel-subtitle">Interviews on your calendar.</p></div><button class="icon-button" data-action="add-interview" aria-label="Plan interview">+</button></div>${upcoming.length ? `<div class="upcoming-list">${upcoming.map((interview) => `<article class="upcoming-item"><div class="upcoming-date"><strong>${escapeHtml(formatDate(interview.startsAt, { day: "numeric" }))}</strong><span>${escapeHtml(formatDate(interview.startsAt, { month: "short" }))}</span></div><div class="upcoming-copy"><strong>${escapeHtml(interview.type)} interview</strong><span>${escapeHtml(interview.company)} · ${escapeHtml(interview.title)}</span><small>${escapeHtml(formatDate(interview.startsAt, { hour: "numeric", minute: "2-digit" }))}</small></div></article>`).join("")}</div>` : `<div class="mini-empty"><span>◷</span><p>No interviews scheduled yet.</p><button class="text-button" data-action="add-interview">Plan your first interview</button></div>`}</section>
    </div>
    <section class="applications-panel activity-panel"><div class="panel-heading"><div><h2>Recent activity</h2><p class="panel-subtitle">Small steps worth remembering.</p></div></div>${state.activities.length ? `<ol class="activity-list">${state.activities.slice(0, 5).map((activity) => `<li><span><strong>${escapeHtml(activity.message)}</strong><small>${escapeHtml(activity.title)} at ${escapeHtml(activity.company)} · ${escapeHtml(formatDate(activity.created_at, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }))}</small></span></li>`).join("")}</ol>` : `<div class="mini-empty"><p>Your application updates will show here.</p></div>`}</section>
    <footer class="page-footer">Made for your next big thing</footer>`;
}

function filteredJobs() {
  return state.jobs.filter((job) => (state.statusFilter === "all" || job.status === state.statusFilter)
    && `${job.company} ${job.title} ${job.location} ${(job.tags || []).join(" ")}`.toLowerCase().includes(state.search.toLowerCase()))
    .sort((a, b) => (b.dateApplied || b.createdAt).localeCompare(a.dateApplied || a.createdAt));
}

function renderJobsPage() {
  const jobs = filteredJobs();
  return `${pageHeader("YOUR OPPORTUNITIES", "Applications", "Every role you’re pursuing, organized with room for all the details.", `<button class="button button-primary" data-action="add-job"><span class="plus-icon">+</span> Add application</button>`)}
    <section class="applications-panel"><div class="panel-heading"><div><div class="heading-with-count"><h2>Your applications</h2><span class="total-pill">${state.jobs.length}</span></div><p class="panel-subtitle">Search, filter, and keep each next step in view.</p></div>
      <div class="panel-tools"><label class="search-box"><span class="search-icon">⌕</span><span class="visually-hidden">Search applications</span><input id="search-input" type="search" value="${escapeHtml(state.search)}" placeholder="Search companies, roles or tags"><kbd>⌘ K</kbd></label><label class="select-wrap"><span class="visually-hidden">Filter by application status</span><select id="status-filter"><option value="all">All statuses</option>${STATUSES.map((status) => `<option ${state.statusFilter === status ? "selected" : ""}>${escapeHtml(status)}</option>`).join("")}</select></label></div></div>
      ${jobs.length ? renderTable(jobs) : `<div class="empty-state"><h3>${state.jobs.length ? "No applications found." : "Your next opportunity is waiting."}</h3><p>${state.jobs.length ? "Try a different search or status filter." : "Add an application to start building your search."}</p>${state.jobs.length ? "" : `<button class="button button-primary" data-action="add-job">Add your first application</button>`}</div>`}
      <div class="table-footer"><span>Showing ${jobs.length} of ${state.jobs.length} applications</span><span class="footer-note">You’re making progress. Keep going.</span></div>
    </section>`;
}

function renderBoard() {
  return `${pageHeader("ONE STEP AT A TIME", "Your pipeline", "Drag an opportunity to a new stage when it moves forward.", `<button class="button button-primary" data-action="add-job"><span class="plus-icon">+</span> Add application</button>`)}
    <div class="kanban-board">${STATUSES.map((status) => {
      const jobs = state.jobs.filter((job) => job.status === status);
      return `<section class="kanban-column" data-status="${escapeHtml(status)}"><div class="kanban-heading"><span class="status-dot ${statusClass(status)}"></span><h2>${escapeHtml(status)}</h2><span class="total-pill">${jobs.length}</span></div><div class="kanban-cards">${jobs.map((job) => `<article class="kanban-card" draggable="true" data-id="${escapeHtml(job.id)}"><div class="kanban-company">${companyMark(job.company)}<span>${escapeHtml(job.company)}</span>${job.priority ? `<span class="priority-star">★</span>` : ""}</div><h3>${escapeHtml(job.title)}</h3><p>${escapeHtml(job.location || "Location not specified")}</p>${job.dateApplied ? `<small>Applied ${escapeHtml(formatDate(job.dateApplied))}</small>` : ""}${job.followUpDate ? `<small class="follow-up-note">Follow up ${escapeHtml(formatDate(job.followUpDate))}</small>` : ""}<div class="kanban-card-footer">${job.tags.slice(0, 2).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}<label class="visually-hidden" for="card-status-${escapeHtml(job.id)}">Move ${escapeHtml(job.title)} to a different stage</label><select class="kanban-status-select" id="card-status-${escapeHtml(job.id)}" data-id="${escapeHtml(job.id)}" aria-label="Move ${escapeHtml(job.title)} to a different stage">${STATUSES.map((option) => `<option ${option === job.status ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select><button class="row-action" data-action="manage-documents" data-id="${escapeHtml(job.id)}" aria-label="Manage documents for ${escapeHtml(job.title)}">▧</button><button class="row-action" data-action="edit-job" data-id="${escapeHtml(job.id)}" aria-label="Edit ${escapeHtml(job.title)}">✎</button></div></article>`).join("")}<button class="add-card-button" data-action="add-job" data-status="${escapeHtml(status)}">+ Add a role</button></div></section>`;
    }).join("")}</div>`;
}

function renderInterviews() {
  const interviews = [...state.interviews].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  return `${pageHeader("MAKE SPACE TO PREPARE", "Interviews", "Your conversations, dates, and prep notes together.", `<button class="button button-primary" data-action="add-interview"><span class="plus-icon">+</span> Plan interview</button>`)}
    <section class="applications-panel"><div class="panel-heading"><div><h2>Your interview schedule</h2><p class="panel-subtitle">${interviews.length} ${interviews.length === 1 ? "conversation" : "conversations"} planned</p></div></div>
    ${interviews.length ? `<div class="table-wrap"><table><thead><tr><th>DATE &amp; TIME</th><th>COMPANY &amp; ROLE</th><th>TYPE</th><th>LOCATION</th><th>PREP NOTES</th><th></th></tr></thead><tbody>${interviews.map((interview) => `<tr><td>${escapeHtml(formatDate(interview.startsAt, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }))}</td><td><strong class="role-name">${escapeHtml(interview.company)}</strong><br><span class="company-name">${escapeHtml(interview.title)}</span></td><td>${escapeHtml(interview.type)}</td><td>${escapeHtml(interview.location || "—")}</td><td>${escapeHtml(interview.notes || "—")}</td><td><button class="row-action delete" data-action="delete-interview" data-id="${escapeHtml(interview.id)}" aria-label="Delete interview">×</button></td></tr>`).join("")}</tbody></table></div>` : `<div class="empty-state"><span class="empty-icon">◷</span><h3>Make room for a great conversation.</h3><p>Plan interviews here and keep your preparation notes close.</p><button class="button button-primary" data-action="add-interview">Plan your first interview</button></div>`}</section>`;
}

function renderContacts() {
  return `${pageHeader("PEOPLE MAKE THE DIFFERENCE", "Contacts", "Remember the people behind every opportunity.", `<button class="button button-primary" data-action="add-contact"><span class="plus-icon">+</span> Add contact</button>`)}
    <section class="contact-grid">${state.contacts.length ? state.contacts.map((contact, index) => `<article class="contact-card">${companyMark(contact.name, index)}<div class="contact-details"><h2>${escapeHtml(contact.name)}</h2><p>${escapeHtml(contact.role || "Contact")} · ${escapeHtml(contact.company)}</p>${contact.email ? `<a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a>` : ""}${contact.linkedinUrl ? `<a href="${escapeHtml(contact.linkedinUrl)}" target="_blank" rel="noopener noreferrer">LinkedIn profile</a>` : ""}<small>${escapeHtml(contact.title)}</small></div><button class="row-action delete" data-action="delete-contact" data-id="${escapeHtml(contact.id)}" aria-label="Delete ${escapeHtml(contact.name)}">×</button></article>`).join("") : `<section class="applications-panel contact-empty"><div class="empty-state"><span class="empty-icon">♧</span><h3>Keep the good connections close.</h3><p>Add recruiters and hiring managers linked to your applications.</p><button class="button button-primary" data-action="add-contact">Add your first contact</button></div></section>`}</section>`;
}

function renderCalendar() {
  const year = state.month.getFullYear();
  const month = state.month.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const todayKey = new Date().toISOString().slice(0, 10);
  const items = new Map();
  for (const interview of state.interviews) {
    const key = interview.startsAt.slice(0, 10);
    items.set(key, [...(items.get(key) || []), { label: `${interview.type} · ${interview.company}`, type: "interview" }]);
  }
  for (const job of state.jobs) {
    if (job.followUpDate) items.set(job.followUpDate, [...(items.get(job.followUpDate) || []), { label: `Follow up · ${job.company}`, type: "followup" }]);
  }
  const blanks = Array.from({ length: firstDay }, () => `<div class="calendar-day blank"></div>`).join("");
  const cells = Array.from({ length: days }, (_, index) => {
    const day = index + 1;
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return `<div class="calendar-day ${key === todayKey ? "today" : ""}"><span class="calendar-date">${day}</span>${(items.get(key) || []).slice(0, 2).map((item) => `<span class="calendar-event ${item.type}">${escapeHtml(item.label)}</span>`).join("")}</div>`;
  }).join("");
  return `${pageHeader("EVERY IMPORTANT DATE, IN VIEW", "Calendar", "A little planning makes the busy weeks feel lighter.")}
    <section class="applications-panel calendar-panel"><div class="calendar-toolbar"><button class="icon-button" data-action="previous-month" aria-label="Previous month">‹</button><h2>${escapeHtml(new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(state.month))}</h2><button class="icon-button" data-action="next-month" aria-label="Next month">›</button><button class="button button-secondary" data-action="this-month">Today</button></div>
    <div class="calendar-grid calendar-weekdays">${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => `<span>${day}</span>`).join("")}</div><div class="calendar-grid">${blanks}${cells}</div></section>`;
}

function renderStats() {
  const max = Math.max(1, ...STATUSES.map((status) => state.stats.breakdown?.[status] || 0));
  const rows = STATUSES.map((status) => {
    const count = state.stats.breakdown?.[status] || 0;
    return `<div class="chart-row"><span>${escapeHtml(status)}</span><div class="chart-track"><span class="chart-bar ${statusClass(status)}" style="width:${count / max * 100}%"></span></div><strong>${count}</strong></div>`;
  }).join("");
  const monthMax = Math.max(1, ...state.monthlyStats.map((month) => month.count));
  const monthlyRows = state.monthlyStats.map((month) => `<div class="monthly-row"><span>${escapeHtml(new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(`${month.month}-01T12:00:00`)))}</span><div class="chart-track"><span class="chart-bar" style="width:${month.count / monthMax * 100}%"></span></div><strong>${month.count}</strong></div>`).join("");
  const active = state.jobs.filter((job) => ["Applied", "Phone Screen", "Interview"].includes(job.status)).length;
  const offerRate = active ? Math.round((state.stats.offers || 0) / active * 100) : 0;
  return `${pageHeader("LOOK HOW FAR YOU’VE COME", "Search insights", "A clear picture of your momentum and the next step.")}
    <section class="stats-grid">
      ${statCard("TOTAL OPPORTUNITIES", state.stats.total || 0, "Applications tracked", "Every possibility counts", "blue", "▤")}
      ${statCard("THIS MONTH", state.stats.appliedThisMonth || 0, "Applications started", "Keep a steady rhythm", "violet")}
      ${statCard("RESPONSE RATE", `${state.stats.responseRate || 0}%`, "Moved past application", "Your story is getting noticed", "green")}
      ${statCard("OFFER RATE", `${offerRate}%`, "Offers per active lead", "Each conversation matters", "amber", "⌁")}
    </section>
    <div class="insights-grid"><section class="applications-panel"><div class="panel-heading"><div><h2>Pipeline breakdown</h2><p class="panel-subtitle">Where your opportunities stand today.</p></div></div><div class="chart-content">${rows}</div></section>
    <section class="applications-panel"><div class="panel-heading"><div><h2>Your next milestone</h2><p class="panel-subtitle">Progress is built one thoughtful step at a time.</p></div></div><div class="milestone-card"><strong>${state.jobs.length} applications started</strong><p>${state.jobs.length < 5 ? "Keep exploring roles that feel like a good fit." : "You're building great momentum. Make room for your next conversation."}</p><button class="text-button" data-action="add-job">Add an opportunity →</button></div></section></div>
    <div class="applications-panel monthly-chart"><div class="panel-heading"><div><h2>Applications over time</h2><p class="panel-subtitle">New opportunities you've started in the last six months.</p></div></div><div class="monthly-content">${monthlyRows}</div></div>`;
}

function renderSettings() {
  return `${pageHeader("MAKE THIS SPACE YOURS", "Settings", "Your workspace, your preferences.")}
    <section class="applications-panel settings-panel"><div class="panel-heading"><div><h2>Profile</h2><p class="panel-subtitle">The name connected with your personal workspace.</p></div></div><div class="settings-content"><div class="settings-profile"><span class="avatar large-avatar">${escapeHtml(initials(state.user.name))}</span><div><strong>${escapeHtml(state.user.name)}</strong><span>${escapeHtml(state.user.email)}</span></div></div>
    <div class="settings-row"><div><strong>Appearance</strong><span>Choose a calm, light or dark workspace.</span></div><button class="button button-secondary" data-action="toggle-theme" id="theme-button">Switch to ${document.body.classList.contains("dark-mode") ? "light" : "dark"} mode</button></div>
    <div class="settings-row"><div><strong>Your data</strong><span>Download a copy of your applications, interviews and contacts.</span></div><div class="export-actions"><button class="button button-secondary" data-action="export-csv">Export CSV</button><button class="button button-secondary" data-action="export-data">Export JSON</button></div></div>
    <div class="settings-row"><div><strong>Sign out</strong><span>Your private workspace will be ready when you return.</span></div><button class="button button-danger" data-action="logout">Sign out</button></div></div></section>`;
}

function renderLearning() {
  const completed = state.learningCompleted.length;
  const percent = Math.round(completed / LEARNING_MODULES.length * 100);
  const modules = LEARNING_MODULES.map((module) => {
    const isComplete = state.learningCompleted.includes(module.id);
    const isOpen = state.learningOpenId === module.id;
    return `<article class="learning-card ${isOpen ? "is-open" : ""} ${isComplete ? "is-complete" : ""}">
      <button class="learning-card-toggle" type="button" data-action="toggle-learning-module" data-id="${module.id}" aria-expanded="${isOpen}">
        ${module.icon ? `<span class="learning-icon">${module.icon}</span>` : ""}
        <span class="learning-card-main"><span class="learning-category">${module.category} <span>·</span> ${module.duration}</span><strong>${module.title}</strong><small>${module.summary}</small></span>
        <span class="learning-completion">${isComplete ? "✓ Done" : "Learn"} <span class="learning-chevron">${isOpen ? "−" : "+"}</span></span>
      </button>
      ${isOpen ? `<div class="learning-lesson"><h3>What to keep in mind</h3><ol>${module.lessons.map((lesson) => `<li>${lesson}</li>`).join("")}</ol><div class="learning-exercise"><strong>Try this next</strong><p>${module.exercise}</p></div><button class="button ${isComplete ? "button-secondary" : "button-primary"}" data-action="toggle-learning-complete" data-id="${module.id}">${isComplete ? "Mark as not finished" : "Mark lesson complete"}</button></div>` : ""}
    </article>`;
  }).join("");
  return `${pageHeader("SMALL STEPS. STRONGER SEARCH.", "Learn as you go.", "Practical, bite-sized guides to help you feel more prepared at every stage.")}
    <section class="learning-progress-panel"><div class="learning-progress-copy"><div><strong>Your job-search toolkit</strong><p>${completed} of ${LEARNING_MODULES.length} short lessons complete. Come back whenever it helps.</p></div></div><div class="learning-progress-meter"><span>${percent}%</span><div class="progress-track"><span style="width:${percent}%"></span></div></div></section>
    <div class="learning-intro"><h2>Choose what you need today</h2><p>No perfect order—start with the step that feels most useful.</p></div>
    <div class="learning-list">${modules}</div>
    <section class="learning-encouragement"><p>You don’t have to do everything today. One thoughtful step is still progress.</p></section>
    <footer class="page-footer">Learn at your own pace</footer>`;
}

function renderPage() {
  const renderers = { overview: renderOverview, jobs: renderJobsPage, board: renderBoard, interviews: renderInterviews, contacts: renderContacts, calendar: renderCalendar, stats: renderStats, learning: renderLearning, settings: renderSettings };
  const titles = { overview: "Overview", jobs: "Applications", board: "Pipeline", interviews: "Interviews", contacts: "Contacts", calendar: "Calendar", stats: "Insights", learning: "Learning", settings: "Settings" };
  $("#breadcrumb-title").textContent = titles[state.page] || "Overview";
  $("#nav-count").textContent = state.jobs.length;
  document.querySelectorAll(".nav-item").forEach((item) => {
    const active = item.dataset.page === state.page;
    item.classList.toggle("active", active);
    if (active) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });
  pageContent.innerHTML = (renderers[state.page] || renderOverview)();
}

function setMobileNavOpen(open) {
  const menuToggle = $("#menu-toggle");
  const sidebar = $("#mobile-nav");
  const backdrop = $("#nav-backdrop");
  sidebar.classList.toggle("is-open", open);
  backdrop.classList.toggle("is-open", open);
  document.body.classList.toggle("mobile-nav-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
}

$("#menu-toggle").addEventListener("click", () => {
  setMobileNavOpen($("#menu-toggle").getAttribute("aria-expanded") !== "true");
});
$("#nav-backdrop").addEventListener("click", () => setMobileNavOpen(false));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && $("#menu-toggle").getAttribute("aria-expanded") === "true") {
    setMobileNavOpen(false);
    $("#menu-toggle").focus();
  }
});

function openJobDialog(job, status) {
  const form = $("#job-form");
  form.reset();
  $("#job-id").value = job?.id || "";
  $("#dialog-title").textContent = job ? "Edit application" : "Add an application";
  $("#save-job").textContent = job ? "Save changes" : "Save application";
  $("#job-title").value = job?.title || "";
  $("#job-company").value = job?.company || "";
  $("#job-location").value = job?.location || "";
  $("#job-status").value = job?.status || status || "Wishlist";
  $("#job-priority").value = String(job?.priority || 0);
  $("#job-date").value = job?.dateApplied || "";
  $("#job-follow-up").value = job?.followUpDate || "";
  $("#job-salary-min").value = job?.salaryMin ?? "";
  $("#job-salary-max").value = job?.salaryMax ?? "";
  $("#job-link").value = job?.jobUrl || "";
  $("#job-tags").value = (job?.tags || []).join(", ");
  $("#job-notes").value = job?.notes || "";
  $("#job-error").hidden = true;
  $("#job-dialog").showModal();
  $("#job-title").focus();
}

function fillJobOptions(selector) {
  const select = $(selector);
  select.innerHTML = state.jobs.map((job) => `<option value="${escapeHtml(job.id)}">${escapeHtml(job.title)} · ${escapeHtml(job.company)}</option>`).join("");
  if (!state.jobs.length) throw new Error("Add an application before linking a contact or interview.");
}

function openInterviewDialog() {
  try {
    fillJobOptions("#interview-job");
    $("#interview-form").reset();
    $("#interview-error").hidden = true;
    const date = new Date(Date.now() + 86400_000);
    date.setMinutes(Math.ceil(date.getMinutes() / 30) * 30, 0, 0);
    $("#interview-date").value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    $("#interview-dialog").showModal();
  } catch (error) { showToast(error.message, true); }
}

function openContactDialog() {
  try {
    fillJobOptions("#contact-job");
    $("#contact-form").reset();
    $("#contact-error").hidden = true;
    $("#contact-dialog").showModal();
  } catch (error) { showToast(error.message, true); }
}

async function openDocumentDialog(jobId) {
  const job = state.jobs.find((item) => item.id === jobId);
  if (!job) return;
  $("#document-job-id").value = job.id;
  $("#document-job-label").textContent = `${job.title} · ${job.company}`;
  $("#document-form").reset();
  $("#document-error").hidden = true;
  $("#document-dialog").showModal();
  await loadDocuments(job.id);
}

async function loadDocuments(jobId) {
  const list = $("#document-list");
  list.innerHTML = `<p class="document-empty">Loading your saved links…</p>`;
  try {
    const { documents } = await api(`/api/jobs/${encodeURIComponent(jobId)}/documents`);
    list.innerHTML = documents.length ? documents.map((document) => `<article class="document-row"><span class="document-icon">▧</span><span class="document-copy"><strong>${escapeHtml(document.name)}</strong><small>${escapeHtml(document.type)}</small></span><a href="${escapeHtml(document.documentUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(document.name)}">Open</a><button type="button" class="row-action delete" data-action="delete-document" data-id="${escapeHtml(document.id)}" aria-label="Delete ${escapeHtml(document.name)}">×</button></article>`).join("") : `<p class="document-empty">No documents linked to this application yet.</p>`;
  } catch (error) {
    list.innerHTML = `<p class="document-empty error-text">${escapeHtml(error.message)}</p>`;
  }
}

async function deleteItem(endpoint, id, label) {
  if (!confirm(`Remove this ${label}? This cannot be undone.`)) return;
  try {
    await api(`${endpoint}/${encodeURIComponent(id)}`, { method: "DELETE" });
    await refreshWorkspace();
    showToast(`${label[0].toUpperCase()}${label.slice(1)} removed.`);
  } catch (error) { showToast(error.message, true); }
}

function exportData() {
  api("/api/export").then((data) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    link.download = `trackly-export-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("Your data export is ready.");
  }).catch((error) => showToast(error.message, true));
}

function exportCsv() {
  const columns = ["Company", "Job title", "Status", "Location", "Date applied", "Follow-up date", "Salary minimum", "Salary maximum", "Priority", "Tags", "Job URL", "Notes"];
  const rows = state.jobs.map((job) => [
    job.company, job.title, job.status, job.location, job.dateApplied || "", job.followUpDate || "",
    job.salaryMin ?? "", job.salaryMax ?? "", job.priority, job.tags.join(", "), job.jobUrl, job.notes
  ]);
  const csv = [columns, ...rows].map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
  link.download = `trackly-applications-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  showToast("Your applications CSV is ready.");
}

document.querySelectorAll(".nav-item").forEach((item) => item.addEventListener("click", (event) => {
  event.preventDefault();
  state.page = item.dataset.page;
  history.replaceState(null, "", `#${state.page}`);
  renderPage();
  setMobileNavOpen(false);
  if (window.matchMedia("(max-width: 760px)").matches) requestAnimationFrame(() => $("#menu-toggle").focus());
}));

$("#settings-shortcut").addEventListener("click", () => { state.page = "settings"; renderPage(); });
$("#profile-shortcut").addEventListener("click", () => { state.page = "settings"; renderPage(); });
$("#auth-switch").addEventListener("click", () => { state.register = !state.register; renderAuthMode(); });

$("#auth-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const error = $("#auth-error");
  error.hidden = true;
  try {
    const result = await api(`/api/auth/${state.register ? "register" : "login"}`, {
      method: "POST",
      body: { name: $("#auth-name").value, email: $("#auth-email").value, password: $("#auth-password").value }
    });
    $("#auth-form").reset();
    showApp(result.user);
  } catch (issue) { error.textContent = issue.message; error.hidden = false; }
});

$("#job-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = $("#job-id").value;
  const body = {
    title: $("#job-title").value.trim(), company: $("#job-company").value.trim(), location: $("#job-location").value.trim(),
    status: $("#job-status").value, priority: Number($("#job-priority").value), dateApplied: $("#job-date").value || null,
    followUpDate: $("#job-follow-up").value || null, salaryMin: $("#job-salary-min").value ? Number($("#job-salary-min").value) : null,
    salaryMax: $("#job-salary-max").value ? Number($("#job-salary-max").value) : null, jobUrl: $("#job-link").value.trim(),
    tags: $("#job-tags").value.split(",").map((tag) => tag.trim()).filter(Boolean), notes: $("#job-notes").value.trim()
  };
  try {
    await api(id ? `/api/jobs/${encodeURIComponent(id)}` : "/api/jobs", { method: id ? "PATCH" : "POST", body });
    $("#job-dialog").close();
    await refreshWorkspace();
    showToast(id ? "Application updated." : "Application added. One step closer!");
  } catch (error) { $("#job-error").textContent = error.message; $("#job-error").hidden = false; }
});

$("#interview-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const jobId = $("#interview-job").value;
  try {
    await api(`/api/jobs/${encodeURIComponent(jobId)}/interviews`, { method: "POST", body: {
      type: $("#interview-type").value.trim(), startsAt: new Date($("#interview-date").value).toISOString(),
      location: $("#interview-location").value.trim(), notes: $("#interview-notes").value.trim()
    } });
    $("#interview-dialog").close();
    await refreshWorkspace();
    showToast("Interview added to your calendar. You’ve got this!");
  } catch (error) { $("#interview-error").textContent = error.message; $("#interview-error").hidden = false; }
});

$("#contact-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const jobId = $("#contact-job").value;
  try {
    await api(`/api/jobs/${encodeURIComponent(jobId)}/contacts`, { method: "POST", body: {
      name: $("#contact-name").value.trim(), role: $("#contact-role").value.trim(),
      email: $("#contact-email").value.trim(), linkedinUrl: $("#contact-linkedin").value.trim()
    } });
    $("#contact-dialog").close();
    await refreshWorkspace();
    showToast("Contact saved. Good connections are worth keeping.");
  } catch (error) { $("#contact-error").textContent = error.message; $("#contact-error").hidden = false; }
});

$("#document-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const jobId = $("#document-job-id").value;
  try {
    await api(`/api/jobs/${encodeURIComponent(jobId)}/documents`, { method: "POST", body: {
      name: $("#document-name").value.trim(), type: $("#document-type").value, documentUrl: $("#document-url").value.trim()
    } });
    $("#document-form").reset();
    $("#document-error").hidden = true;
    await loadDocuments(jobId);
    showToast("Document link saved to this application.");
  } catch (error) { $("#document-error").textContent = error.message; $("#document-error").hidden = false; }
});

document.addEventListener("click", async (event) => {
  const close = event.target.closest("[data-close]");
  if (close) { $(`#${close.dataset.close}`).close(); return; }
  const pageLink = event.target.closest("[data-page-link]");
  if (pageLink) { state.page = pageLink.dataset.pageLink; renderPage(); return; }
  const action = event.target.closest("[data-action]");
  if (!action) return;
  switch (action.dataset.action) {
    case "add-job": openJobDialog(null, action.dataset.status); break;
    case "edit-job": openJobDialog(state.jobs.find((job) => job.id === action.dataset.id)); break;
    case "delete-job": await deleteItem("/api/jobs", action.dataset.id, "application"); break;
    case "add-interview": openInterviewDialog(); break;
    case "delete-interview": await deleteItem("/api/interviews", action.dataset.id, "interview"); break;
    case "add-contact": openContactDialog(); break;
    case "delete-contact": await deleteItem("/api/contacts", action.dataset.id, "contact"); break;
    case "manage-documents": await openDocumentDialog(action.dataset.id); break;
    case "delete-document":
      try {
        await api(`/api/documents/${encodeURIComponent(action.dataset.id)}`, { method: "DELETE" });
        await loadDocuments($("#document-job-id").value);
        showToast("Document link removed.");
      } catch (error) { showToast(error.message, true); }
      break;
    case "previous-month": state.month = new Date(state.month.getFullYear(), state.month.getMonth() - 1, 1); renderPage(); break;
    case "next-month": state.month = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 1); renderPage(); break;
    case "this-month": state.month = new Date(new Date().getFullYear(), new Date().getMonth(), 1); renderPage(); break;
    case "toggle-theme":
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("trackly-theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
      renderPage();
      break;
    case "export-data": exportData(); break;
    case "export-csv": exportCsv(); break;
    case "toggle-learning-module":
      state.learningOpenId = state.learningOpenId === action.dataset.id ? null : action.dataset.id;
      renderPage();
      break;
    case "toggle-learning-complete": {
      const id = action.dataset.id;
      state.learningCompleted = state.learningCompleted.includes(id)
        ? state.learningCompleted.filter((item) => item !== id)
        : [...state.learningCompleted, id];
      if (saveLearningProgress()) {
        state.learningOpenId = id;
        renderPage();
        showToast(state.learningCompleted.includes(id) ? "Lesson complete. You’ve got this!" : "Lesson moved back to your list.");
      }
      break;
    }
    case "logout":
      try { await api("/api/auth/logout", { method: "POST" }); }
      catch (error) { showToast(error.message, true); return; }
      showAuth();
      break;
  }
});

pageContent.addEventListener("input", (event) => {
  if (event.target.id === "search-input") { state.search = event.target.value; renderPage(); const input = $("#search-input"); input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
});
pageContent.addEventListener("change", (event) => {
  if (event.target.id === "status-filter") { state.statusFilter = event.target.value; renderPage(); }
  if (event.target.matches(".kanban-status-select")) {
    api(`/api/jobs/${encodeURIComponent(event.target.dataset.id)}`, { method: "PATCH", body: { status: event.target.value } })
      .then(refreshWorkspace).then(() => showToast("Pipeline stage updated. Keep that momentum going!"))
      .catch((error) => showToast(error.message, true));
  }
});

async function moveJobToStatus(id, status) {
  const job = state.jobs.find((item) => item.id === id);
  if (!job || job.status === status) return;
  try {
    await api(`/api/jobs/${encodeURIComponent(id)}`, { method: "PATCH", body: { status } });
    await refreshWorkspace();
    showToast(`Moved to ${status}. Keep that momentum going!`);
  } catch (error) { showToast(error.message, true); }
}

pageContent.addEventListener("pointerdown", (event) => {
  const card = event.target.closest(".kanban-card");
  if (!card || event.target.closest("button, select, a")) return;
  state.pointerDrag = { id: card.dataset.id, x: event.clientX, y: event.clientY, active: false };
});
pageContent.addEventListener("pointermove", (event) => {
  if (!state.pointerDrag) return;
  if (!state.pointerDrag.active && Math.hypot(event.clientX - state.pointerDrag.x, event.clientY - state.pointerDrag.y) > 8) {
    state.pointerDrag.active = true;
    pageContent.querySelector(`[data-id="${CSS.escape(state.pointerDrag.id)}"].kanban-card`)?.classList.add("pointer-dragging");
  }
  if (state.pointerDrag.active) {
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(".kanban-column");
    pageContent.querySelectorAll(".kanban-column").forEach((column) => column.classList.toggle("drop-target", column === target));
  }
});
pageContent.addEventListener("pointerup", async (event) => {
  if (!state.pointerDrag) return;
  const { id, active } = state.pointerDrag;
  const target = active ? document.elementFromPoint(event.clientX, event.clientY)?.closest(".kanban-column") : null;
  state.pointerDrag = null;
  pageContent.querySelectorAll(".kanban-card, .kanban-column").forEach((item) => item.classList.remove("pointer-dragging", "drop-target"));
  if (target) await moveJobToStatus(id, target.dataset.status);
});
pageContent.addEventListener("pointercancel", () => {
  state.pointerDrag = null;
  pageContent.querySelectorAll(".kanban-card, .kanban-column").forEach((item) => item.classList.remove("pointer-dragging", "drop-target"));
});
pageContent.addEventListener("dragstart", (event) => {
  if (event.target.closest(".kanban-card")) event.preventDefault();
});
pageContent.addEventListener("dragover", (event) => {
  if (event.target.closest(".kanban-column")) event.preventDefault();
});
pageContent.addEventListener("drop", (event) => {
  const column = event.target.closest(".kanban-column");
  const id = state.draggedJobId || event.dataTransfer.getData("text/plain");
  if (!column || !id) return;
  event.preventDefault();
  moveJobToStatus(id, column.dataset.status);
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    state.page = "jobs";
    renderPage();
    $("#search-input")?.focus();
  }
});

$("#today-label").textContent = new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(new Date());
if (localStorage.getItem("trackly-theme") === "dark") document.body.classList.add("dark-mode");
state.page = location.hash.slice(1) || "overview";
if (!["overview", "jobs", "board", "interviews", "contacts", "calendar", "stats", "learning", "settings"].includes(state.page)) state.page = "overview";

api("/api/auth/me").then(({ user }) => showApp(user)).catch(() => showAuth());
