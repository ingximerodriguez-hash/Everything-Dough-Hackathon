import React, { useMemo, useState } from "react";

const LEADS = [
  { id: "ED-1024", name: "Maya Rodriguez", email: "maya.r@example.com", phone: "203-555-0141", source: "Google Organic", city: "Stamford", county: "Fairfield", eventType: "Kids Birthday", guests: 18, budget: 1450, eventDate: "2026-05-28", stage: "New Inquiry", status: "Hot", probability: 91, scoreReason: "Strong fit: kids party, nearby, date selected, clear guest count.", nextAction: "Send package options and ask for preferred time window.", lastTouch: "Today" },
  { id: "ED-1025", name: "Jordan Lee", email: "jordan.lee@company.com", phone: "914-555-0188", source: "LinkedIn", city: "White Plains", county: "Westchester", eventType: "Corporate Team Building", guests: 42, budget: 3800, eventDate: "2026-06-12", stage: "Proposal Sent", status: "Hot", probability: 86, scoreReason: "High value corporate event with budget and guest count confirmed.", nextAction: "Follow up with corporate invoice and add-on options.", lastTouch: "1 day ago" },
  { id: "ED-1026", name: "Sofia Patel", email: "sofia.p@example.com", phone: "203-555-0119", source: "Instagram", city: "Darien", county: "Fairfield", eventType: "Intimate Workshop", guests: 10, budget: 950, eventDate: "2026-05-18", stage: "Needs Follow-Up", status: "Warm", probability: 69, scoreReason: "Good event fit, but budget is lower and client has not confirmed venue.", nextAction: "Offer CoCreate Stamford as venue option and send smaller package.", lastTouch: "3 days ago" },
  { id: "ED-1027", name: "Eric Thompson", email: "eric.t@example.com", phone: "914-555-0166", source: "Google Organic", city: "Rye", county: "Westchester", eventType: "Mixology + Pizza", guests: 24, budget: 2300, eventDate: "2026-07-02", stage: "Contract Pending", status: "Hot", probability: 82, scoreReason: "Add-on interest and date flexibility increase likelihood.", nextAction: "Send contract and deposit link.", lastTouch: "2 days ago" },
  { id: "ED-1028", name: "Nina Gomez", email: "nina.g@example.com", phone: "203-555-0128", source: "Facebook", city: "Norwalk", county: "Fairfield", eventType: "Coffee Tasting", guests: 14, budget: 1200, eventDate: "2026-06-01", stage: "Ghosted", status: "At Risk", probability: 38, scoreReason: "No response after quote. Could be revived with a value-based message.", nextAction: "Send gentle re-engagement message with limited dates.", lastTouch: "9 days ago" },
  { id: "ED-1029", name: "Chris Morgan", email: "chris.m@example.com", phone: "203-555-0173", source: "TikTok", city: "Greenwich", county: "Fairfield", eventType: "Wedding Catering", guests: 75, budget: 5200, eventDate: "2026-09-14", stage: "Qualified", status: "Hot", probability: 78, scoreReason: "Large event, strong budget, but needs menu consultation.", nextAction: "Schedule discovery call and collect venue constraints.", lastTouch: "Today" },
  { id: "ED-1030", name: "Priya Shah", email: "priya.s@example.com", phone: "914-555-0197", source: "Referral", city: "Scarsdale", county: "Westchester", eventType: "Kids Birthday", guests: 16, budget: 1300, eventDate: "2026-05-23", stage: "Booked", status: "Booked", probability: 100, scoreReason: "Deposit paid. Automation should move to event prep reminders.", nextAction: "Confirm guest count one week before and send day-before reminder.", lastTouch: "Today" }
];

const STAGES = ["New Inquiry", "Qualified", "Proposal Sent", "Contract Pending", "Booked", "Needs Follow-Up", "Ghosted"];
const TAB_NAMES = ["crm", "agent", "workflow", "spreadsheet", "insights", "tests"];
const NODE_NAMES = ["Webhook/Form", "CRM Upsert", "AI Classifier", "Email/SMS", "Calendar", "Contract", "After-Event Follow-Up", "Owner Alert"];
const MONTHLY_GROWTH = [
  { month: "Jan", inquiries: 18, booked: 5, revenue: 5800 },
  { month: "Feb", inquiries: 21, booked: 6, revenue: 6900 },
  { month: "Mar", inquiries: 24, booked: 8, revenue: 8100 },
  { month: "Apr", inquiries: 28, booked: 9, revenue: 9400 },
  { month: "May", inquiries: 33, booked: 12, revenue: 11800 }
];
const SPREADSHEET_COLUMNS = ["Name", "Email", "Phone", "Source", "Event Type", "City", "Guests", "Budget", "Stage", "AI Score", "Next Action"];
const SPREADSHEET_ASSISTANT_PROMPTS = [
  { question: "Which ghosted or at-risk leads should I contact first?", answer: "Start with Nina Gomez because she already requested a coffee tasting quote and has not responded in 9 days. Send a smaller package option and ask if the original quote needs revision.", action: "Draft re-engagement SMS" },
  { question: "Which event type creates the most revenue?", answer: "Wedding Catering is currently the highest revenue category in the demo pipeline, with $5,200 estimated revenue.", action: "Flag high-value event type" },
  { question: "Which leads are ready for contracts or deposits?", answer: "Eric Thompson is in Contract Pending. The assistant should prepare the contract and deposit link so the date can be secured.", action: "Prepare contract task" },
  { question: "What should I do this week?", answer: "Prioritize hot leads, follow up with ghosted leads, confirm booked event reminders, and review high-value corporate or wedding opportunities.", action: "Create weekly task list" }
];
const WORKFLOW_STEPS = [
  ["01", "Capture Inquiry", "CRM", "Lead arrives from website form, Google search, Instagram, Facebook, TikTok, or referral."],
  ["02", "Clean Data", "n8n", "Normalize name, email, phone, city, county, event type, guest count, budget, venue need, and date."],
  ["03", "Score Lead", "AI Agent", "Predict Hot, Warm, At Risk, or Booked based on fit, urgency, event value, and response behavior."],
  ["04", "Follow Up", "Email/SMS", "Generate a personalized message based on event type and stage."],
  ["05", "Contract Step", "CRM Pipeline", "Move lead through proposal, contract, deposit, booked, ghosted, or declined."],
  ["06", "Event Reminder", "n8n Scheduler", "Send one-week guest-count confirmation and day-before event reminder automatically."],
  ["07", "Event Completed", "CRM", "After the class, mark the event as completed and trigger the retention workflow."],
  ["08", "After-Event Follow-Up", "AI Agent + n8n", "Send thank-you message, review request, photo/social media request, future event offer, and referral opportunity."]
];
const AFTER_EVENT_FOLLOW_UP = {
  thankYou: "Hi {name}, thank you for choosing Everything Dough. We loved bringing the pizza-making experience to your event.",
  reviewRequest: "Would you be open to leaving us a quick review? It helps more families and teams discover our classes.",
  socialContent: "If you have photos from the event, we would love to see them. With your permission, we can feature a few on our social media.",
  futureOffer: "For a future celebration, team event, or seasonal workshop, we can create a custom pizza-making experience again.",
  referralAsk: "If you know another family, school, or company looking for a hands-on event, we would be grateful for a referral."
};
const MESSAGES = {
  "Kids Birthday": { sms: "Hi Maya, thanks for reaching out to Everything Dough. For a kids' birthday in Stamford with around 18 guests, we can bring the full pizza-making setup to you or help with a CoCreate Stamford option. Are you looking for afternoon or evening?", email: "Subject: Pizza-making birthday options\n\nHi Maya,\n\nThank you for your inquiry. Based on your guest count and location, this looks like a strong fit for our mobile kids' pizza-making class. We bring the ovens, ingredients, tools, and setup.\n\nNext step: confirm the preferred time window, venue address, and whether you want add-ons such as dessert making or apron decorating.\n\nBest,\nEverything Dough" },
  "Corporate Team Building": { sms: "Hi Jordan, thanks for asking about a corporate pizza-making event. Your 42-person team-building request looks like a great fit. I can send package options and add-ons today.", email: "Subject: Corporate team-building pizza experience\n\nHi Jordan,\n\nThanks for reaching out. For a 42-person corporate event in White Plains, we can structure the session as a hands-on team-building experience with optional add-ons such as mixology or coffee tasting.\n\nNext step: confirm timing, venue logistics, and billing requirements so we can finalize the proposal.\n\nBest,\nEverything Dough" },
  "Intimate Workshop": { sms: "Hi Sofia, following up on your intimate pizza workshop request. If you do not have a venue, CoCreate Stamford may be a good option. Would you like me to send that package?", email: "Subject: Intimate pizza workshop options\n\nHi Sofia,\n\nThank you for your inquiry. For a smaller workshop, we can keep the experience hands-on and flexible. Since your venue is not confirmed, CoCreate Stamford may be a useful option.\n\nNext step: confirm whether you prefer an at-home setup or a hosted location.\n\nBest,\nEverything Dough" },
  "Mixology + Pizza": { sms: "Hi Eric, your pizza + mixology event is almost ready to finalize. I can send the contract and deposit link today so the date is secured.", email: "Subject: Contract for pizza + mixology event\n\nHi Eric,\n\nYour selected date and package are ready for the next step. I can send the contract and deposit link so we can hold the date and start event prep.\n\nBest,\nEverything Dough" },
  "Coffee Tasting": { sms: "Hi Nina, just checking in on your coffee tasting inquiry. We still have a few upcoming dates available. Would you like me to revise the quote or send a smaller package?", email: "Subject: Checking in on your coffee tasting event\n\nHi Nina,\n\nI wanted to follow up on your coffee tasting inquiry. If the original quote was not the right fit, we can review a smaller package or adjust the experience.\n\nBest,\nEverything Dough" },
  "Wedding Catering": { sms: "Hi Chris, your wedding catering inquiry looks like a strong fit. The next step is a quick discovery call to confirm venue rules, guest count, and menu preferences.", email: "Subject: Wedding pizza catering discovery call\n\nHi Chris,\n\nThank you for considering Everything Dough for your wedding. Since this is a larger event, the next step is to confirm venue logistics, service timing, menu preferences, and equipment constraints.\n\nBest,\nEverything Dough" }
};

function getStatusClass(status) {
  if (status === "Hot") return "border-green-200 bg-green-50 text-green-800";
  if (status === "Warm") return "border-yellow-200 bg-yellow-50 text-yellow-800";
  if (status === "Booked") return "border-blue-200 bg-blue-50 text-blue-800";
  if (status === "At Risk") return "border-red-200 bg-red-50 text-red-800";
  return "border-orange-200 bg-orange-50 text-stone-800";
}
function titleCase(value) { return value.charAt(0).toUpperCase() + value.slice(1); }
function getSelectedLead(selectedId, items = LEADS) { return items.find((lead) => lead.id === selectedId) || items[0]; }
function filterLeads({ items, query, stageFilter, channelFilter }) {
  const safeQuery = String(query || "").trim().toLowerCase();
  return items.filter((lead) => {
    const searchable = [lead.name, lead.email, lead.city, lead.county, lead.eventType, lead.source, lead.stage].join(" ").toLowerCase();
    return (safeQuery === "" || searchable.includes(safeQuery)) && (stageFilter === "All" || lead.stage === stageFilter) && (channelFilter === "All" || lead.source === channelFilter);
  });
}
function summarizeLeads(items) {
  if (!items.length) return { totalPipeline: 0, avgProb: 0, hotLeads: 0, booked: 0 };
  return {
    totalPipeline: items.reduce((sum, lead) => sum + lead.budget, 0),
    avgProb: Math.round(items.reduce((sum, lead) => sum + lead.probability, 0) / items.length),
    hotLeads: items.filter((lead) => lead.status === "Hot").length,
    booked: items.filter((lead) => lead.stage === "Booked").length
  };
}
function groupByKey(items, key) {
  return items.reduce((acc, item) => { const value = item[key] || "Unknown"; acc[value] = (acc[value] || 0) + 1; return acc; }, {});
}
function revenueByEventType(items) {
  const grouped = items.reduce((acc, lead) => { acc[lead.eventType] = (acc[lead.eventType] || 0) + lead.budget; return acc; }, {});
  return Object.entries(grouped).map(([eventType, revenue]) => ({ eventType, revenue })).sort((a, b) => b.revenue - a.revenue);
}
function getTopRevenueEvent(items) { return revenueByEventType(items)[0] || { eventType: "No events", revenue: 0 }; }
function isBusinessGrowing(data) { return data.length > 1 && data[data.length - 1].revenue > data[0].revenue && data[data.length - 1].booked > data[0].booked && data[data.length - 1].inquiries > data[0].inquiries; }
function getRevenueGrowthPercent(data) { return data.length < 2 || data[0].revenue === 0 ? 0 : Math.round(((data[data.length - 1].revenue - data[0].revenue) / data[0].revenue) * 100); }
function getSpreadsheetAssistantTasks(items) {
  return items.filter((lead) => lead.stage === "Ghosted" || lead.stage === "Contract Pending" || lead.status === "Hot").map((lead) => ({ lead: lead.name, stage: lead.stage, aiScore: lead.probability, recommendation: lead.nextAction }));
}
function getSpreadsheetSummary(items) {
  const summary = summarizeLeads(items);
  const topEvent = getTopRevenueEvent(items);
  return `Pipeline: $${summary.totalPipeline.toLocaleString()} | Hot prospects: ${summary.hotLeads} | Top revenue event: ${topEvent.eventType}`;
}
function createAgentSteps(lead) {
  return [
    `Lead selected: ${lead.name} | ${lead.eventType} | ${lead.city}`,
    `AI score: ${lead.probability}% conversion probability | ${lead.status}`,
    `CRM update: move or keep deal in ${lead.stage}.`,
    `n8n action: prepare SMS and email follow-up for ${lead.eventType}.`,
    lead.stage === "Booked" ? "Scheduler: create one-week guest-count confirmation and day-before reminder." : "Scheduler: wait 48 hours. If no response, send follow-up and alert owner.",
    "After-event workflow: send thank-you message, review request, photo/social media request, future event offer, and referral ask.",
    "Manual work replaced: data entry, message writing, reminder timing, follow-up, retention, and lead prioritization."
  ];
}
function getMessageForLead(lead) { return MESSAGES[lead.eventType] || MESSAGES["Kids Birthday"]; }
function getFirstName(fullName) { return String(fullName || "there").trim().split(" ")[0] || "there"; }
function buildAfterEventMessage(lead) {
  const firstName = getFirstName(lead.name);
  return [
    AFTER_EVENT_FOLLOW_UP.thankYou.replace("{name}", firstName),
    AFTER_EVENT_FOLLOW_UP.reviewRequest,
    AFTER_EVENT_FOLLOW_UP.socialContent,
    AFTER_EVENT_FOLLOW_UP.futureOffer,
    AFTER_EVENT_FOLLOW_UP.referralAsk
  ].join("\n\n");
}
function runDemoTests() {
  const results = [];
  const assert = (name, condition) => results.push({ name, passed: Boolean(condition) });
  assert("Lead dataset is loaded", LEADS.length === 7);
  assert("Fallback lead works", getSelectedLead("missing-id").id === LEADS[0].id);
  assert("Search finds Stamford kids birthday lead", filterLeads({ items: LEADS, query: "stamford", stageFilter: "All", channelFilter: "All" }).length === 1);
  assert("Stage filter finds booked event", filterLeads({ items: LEADS, query: "", stageFilter: "Booked", channelFilter: "All" }).length === 1);
  assert("Channel filter finds Google Organic leads", filterLeads({ items: LEADS, query: "", stageFilter: "All", channelFilter: "Google Organic" }).length === 2);
  assert("Summary pipeline total is correct", summarizeLeads(LEADS).totalPipeline === 16100);
  assert("Average probability is correct", summarizeLeads(LEADS).avgProb === 78);
  assert("Every event type has a generated message", LEADS.every((lead) => Boolean(MESSAGES[lead.eventType])));
  assert("Workflow includes after-event follow-up", WORKFLOW_STEPS.length === 8);
  assert("Empty summary does not divide by zero", summarizeLeads([]).avgProb === 0);
  assert("Unknown query returns zero leads", filterLeads({ items: LEADS, query: "xyz-no-match", stageFilter: "All", channelFilter: "All" }).length === 0);
  assert("Agent creates seven automation log steps", createAgentSteps(LEADS[0]).length === 7);
  assert("Every lead has a valid conversion probability", LEADS.every((lead) => lead.probability >= 0 && lead.probability <= 100));
  assert("Every lead has a valid stage", LEADS.every((lead) => STAGES.includes(lead.stage)));
  assert("Every workflow step has four fields", WORKFLOW_STEPS.every((step) => step.length === 4));
  assert("Message fallback returns an SMS", Boolean(getMessageForLead({ eventType: "Unknown" }).sms));
  assert("Tabs include spreadsheet assistant", TAB_NAMES.length === 6 && TAB_NAMES.includes("spreadsheet"));
  assert("n8n blueprint includes after-event node", NODE_NAMES.includes("After-Event Follow-Up"));
  assert("Source grouping includes Google Organic", groupByKey(LEADS, "source")["Google Organic"] === 2);
  assert("Wedding catering is the highest revenue event", getTopRevenueEvent(LEADS).eventType === "Wedding Catering");
  assert("Revenue by event type equals total pipeline", revenueByEventType(LEADS).reduce((sum, item) => sum + item.revenue, 0) === summarizeLeads(LEADS).totalPipeline);
  assert("Business growth trend is positive", isBusinessGrowing(MONTHLY_GROWTH) === true);
  assert("Revenue growth percent is positive", getRevenueGrowthPercent(MONTHLY_GROWTH) > 0);
  assert("Status class fallback is safe", getStatusClass("Unknown").includes("stone"));
  assert("After-event message includes review request", buildAfterEventMessage(LEADS[0]).toLowerCase().includes("review"));
  assert("After-event message includes referral ask", buildAfterEventMessage(LEADS[0]).toLowerCase().includes("referral"));
  assert("After-event message has paragraph breaks", buildAfterEventMessage(LEADS[0]).includes("\n\n"));
  assert("First name helper handles empty names", getFirstName("") === "there");
  assert("Spreadsheet assistant has prompt examples", SPREADSHEET_ASSISTANT_PROMPTS.length === 4);
  assert("Spreadsheet assistant tasks include contract pending lead", getSpreadsheetAssistantTasks(LEADS).some((task) => task.stage === "Contract Pending"));
  assert("Spreadsheet summary includes pipeline", getSpreadsheetSummary(LEADS).includes("Pipeline"));
  return results;
}

function CardBox({ children, className = "" }) { return <div className={`rounded-2xl border border-orange-200 bg-white shadow-sm ${className}`}>{children}</div>; }
function BadgeBox({ children, className = "" }) { return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}>{children}</span>; }
function MiniLabel({ children }) { return <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">{children}</span>; }
function MetricCard({ label, value, subtext }) { return <CardBox className="p-5"><p className="text-sm text-stone-500">{label}</p><p className="mt-3 text-3xl font-semibold text-red-700">{value}</p><p className="mt-1 text-xs text-amber-800">{subtext}</p></CardBox>; }
function BarList({ data, labelKey, valueKey, valuePrefix = "" }) {
  const maxValue = Math.max(...data.map((item) => item[valueKey]), 1);
  return <div className="space-y-3">{data.map((item) => <div key={item[labelKey]}><div className="mb-1 flex justify-between text-xs text-stone-500"><span>{item[labelKey]}</span><span>{valuePrefix}{typeof item[valueKey] === "number" ? item[valueKey].toLocaleString() : item[valueKey]}</span></div><div className="h-3 overflow-hidden rounded-full bg-amber-100"><div className="h-full rounded-full bg-red-600" style={{ width: `${(item[valueKey] / maxValue) * 100}%` }} /></div></div>)}</div>;
}
function LineTrend({ data }) {
  const maxInquiry = Math.max(...data.map((item) => item.inquiries), 1);
  return <div className="space-y-4">{data.map((item) => <div key={item.month} className="grid grid-cols-[48px_1fr_80px] items-center gap-3 text-sm"><span className="font-medium text-stone-600">{item.month}</span><div className="space-y-1"><div className="h-2 rounded-full bg-amber-100"><div className="h-2 rounded-full bg-red-600" style={{ width: `${(item.inquiries / maxInquiry) * 100}%` }} /></div><div className="h-2 rounded-full bg-amber-100"><div className="h-2 rounded-full bg-amber-500" style={{ width: `${(item.booked / maxInquiry) * 100}%` }} /></div></div><span className="text-xs text-stone-500">{item.inquiries} / {item.booked}</span></div>)}<p className="text-xs text-stone-500">Top bar: inquiries. Bottom bar: booked events.</p></div>;
}
function RevenueGrowthChart({ data }) {
  const maxRevenue = Math.max(...data.map((item) => item.revenue), 1);
  const growthPercent = getRevenueGrowthPercent(data);
  return <div className="space-y-4">{data.map((item) => <div key={item.month} className="grid grid-cols-[48px_1fr_96px] items-center gap-3 text-sm"><span className="font-medium text-stone-600">{item.month}</span><div className="h-4 overflow-hidden rounded-full bg-amber-100"><div className="h-full rounded-full bg-red-600" style={{ width: `${(item.revenue / maxRevenue) * 100}%` }} /></div><span className="text-xs text-stone-500">${item.revenue.toLocaleString()}</span></div>)}<div className="rounded-2xl bg-amber-50 p-3 text-sm text-stone-700">Synthetic growth signal: revenue increased {growthPercent}% from January to May, while booked events increased from {data[0].booked} to {data[data.length - 1].booked}.</div></div>;
}

export default function EverythingDoughCrmN8nDemo() {
  const [selectedId, setSelectedId] = useState(LEADS[0].id);
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [channelFilter, setChannelFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("crm");
  const [agentRunning, setAgentRunning] = useState(false);
  const [log, setLog] = useState(["Ready: CRM connected to lead table, email, SMS, calendar, contracts, and n8n workflow."]);

  const selectedLead = getSelectedLead(selectedId);
  const filteredLeads = useMemo(() => filterLeads({ items: LEADS, query, stageFilter, channelFilter }), [query, stageFilter, channelFilter]);
  const summary = useMemo(() => summarizeLeads(LEADS), []);
  const testResults = useMemo(() => runDemoTests(), []);
  const testsPassed = testResults.every((result) => result.passed);
  const message = getMessageForLead(selectedLead);
  const afterEventMessage = buildAfterEventMessage(selectedLead);
  const sourceData = useMemo(() => Object.entries(groupByKey(LEADS, "source")).map(([source, count]) => ({ source, count })), []);
  const stageData = useMemo(() => { const grouped = groupByKey(LEADS, "stage"); return STAGES.map((stage) => ({ stage, count: grouped[stage] || 0 })); }, []);
  const revenueEventData = useMemo(() => revenueByEventType(LEADS), []);
  const topRevenueEvent = useMemo(() => getTopRevenueEvent(LEADS), []);
  const businessGrowing = useMemo(() => isBusinessGrowing(MONTHLY_GROWTH), []);
  const conversionTrend = MONTHLY_GROWTH;
  const runAgent = () => {
    setAgentRunning(true);
    setLog(["Running Alexandra workflow simulation..."]);
    createAgentSteps(selectedLead).forEach((step, index, steps) => {
      window.setTimeout(() => { setLog((previous) => [...previous, step]); if (index === steps.length - 1) setAgentRunning(false); }, 350 * (index + 1));
    });
  };

  return <div className="min-h-screen bg-orange-50 text-stone-900"><div className="mx-auto max-w-7xl p-4 md:p-8">
    <div className="mb-6 grid gap-4 md:grid-cols-[1.4fr_.6fr]"><CardBox className="p-6 md:p-8"><div className="flex flex-wrap items-center gap-2"><BadgeBox className="border-red-200 bg-red-50 text-red-700">Everything Dough demo</BadgeBox><BadgeBox className="border-amber-300 bg-amber-50 text-amber-800">CRM + n8n AI agent</BadgeBox><BadgeBox className={testsPassed ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"}>{testsPassed ? "Tests passed" : "Tests failing"}</BadgeBox></div><h1 className="mt-4 text-4xl font-extrabold tracking-tight text-red-700 md:text-6xl">Everything Dough</h1><p className="mt-2 text-lg font-semibold text-amber-800">CRM and n8n workflow demo for pizza-making events</p><p className="mt-4 max-w-3xl text-base leading-7 text-stone-700">This prototype simulates Alexandra's manual workflow: capture inquiries, organize leads, classify high-value opportunities, personalize follow-up, send contracts, schedule reminders, and create a repeatable system for expansion.</p><div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={runAgent} disabled={agentRunning} className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60">{agentRunning ? "Agent running..." : "Run AI agent demo"}</button><button type="button" className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100">CRM settings</button></div></CardBox><CardBox className="p-5"><h2 className="text-base font-semibold text-red-700">Connected systems</h2><div className="mt-4 space-y-3 text-sm">{["CRM leads", "Email + SMS", "Calendar", "Contracts", "n8n agent"].map((system) => <div key={system} className="flex items-center justify-between rounded-2xl bg-orange-50 p-3"><span>{system}</span><BadgeBox className="border-orange-200 bg-white text-stone-700">Live</BadgeBox></div>)}</div></CardBox></div>
    <div className="mb-6 grid gap-4 md:grid-cols-4"><MetricCard label="Pipeline value" value={`$${summary.totalPipeline.toLocaleString()}`} subtext="Synthetic demo data" /><MetricCard label="Avg conversion score" value={`${summary.avgProb}%`} subtext="AI lead scoring" /><MetricCard label="Hot prospects" value={summary.hotLeads} subtext="Prioritize first" /><MetricCard label="Booked events" value={summary.booked} subtext="Move to reminders" /></div>
    <div className="mb-4 grid grid-cols-2 rounded-2xl border border-orange-200 bg-white p-1 shadow-sm md:grid-cols-6">{TAB_NAMES.map((tab) => <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`rounded-xl px-3 py-2 text-sm font-medium ${activeTab === tab ? "bg-red-600 text-white" : "text-stone-700 hover:bg-amber-100"}`}>{tab === "crm" ? "CRM" : tab === "agent" ? "AI Agent" : tab === "workflow" ? "n8n Workflow" : tab === "spreadsheet" ? "AI Spreadsheet" : titleCase(tab)}</button>)}</div>

    {activeTab === "crm" && <div className="space-y-4"><CardBox className="p-4"><div className="grid gap-3 md:grid-cols-[1fr_220px_220px]"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, city, event type, source, or stage..." className="rounded-2xl border border-orange-300 bg-white px-4 py-2 text-sm outline-none focus:border-red-600" /><select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)} className="rounded-2xl border border-orange-300 bg-white px-4 py-2 text-sm outline-none focus:border-red-600"><option value="All">All stages</option>{STAGES.map((stage) => <option key={stage} value={stage}>{stage}</option>)}</select><select value={channelFilter} onChange={(event) => setChannelFilter(event.target.value)} className="rounded-2xl border border-orange-300 bg-white px-4 py-2 text-sm outline-none focus:border-red-600"><option value="All">All channels</option>{[...new Set(LEADS.map((lead) => lead.source))].map((source) => <option key={source} value={source}>{source}</option>)}</select></div></CardBox><div className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]"><CardBox className="p-5"><h2 className="text-base font-semibold text-red-700">Lead pipeline</h2><div className="mt-4 space-y-3">{filteredLeads.length === 0 ? <div className="rounded-2xl border border-dashed border-orange-300 bg-white p-8 text-center text-sm text-stone-500">No leads match this filter.</div> : filteredLeads.map((lead) => <button key={lead.id} type="button" onClick={() => setSelectedId(lead.id)} className={`w-full rounded-2xl border p-4 text-left transition hover:bg-orange-50 ${selectedId === lead.id ? "border-red-600 bg-orange-50" : "border-orange-200 bg-white"}`}><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{lead.name}</p><BadgeBox className={getStatusClass(lead.status)}>{lead.status}</BadgeBox></div><p className="mt-1 text-sm text-stone-500">{lead.eventType} | {lead.city}, {lead.county}</p></div><div className="text-right"><p className="font-semibold text-red-700">{lead.probability}%</p><p className="text-xs text-stone-500">conversion</p></div></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-amber-100"><div className="h-full rounded-full bg-red-600" style={{ width: `${lead.probability}%` }} /></div><div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-stone-500"><MiniLabel>{lead.lastTouch}</MiniLabel><MiniLabel>{lead.source}</MiniLabel><MiniLabel>{lead.stage}</MiniLabel></div></button>)}</div></CardBox><CardBox className="p-5"><h2 className="text-base font-semibold text-red-700">Selected lead</h2><div className="mt-4 space-y-4"><div><p className="text-2xl font-semibold">{selectedLead.name}</p><p className="text-sm text-stone-500">{selectedLead.email} | {selectedLead.phone}</p></div><div className="grid grid-cols-2 gap-3 text-sm"><div className="rounded-2xl bg-orange-50 p-3"><p className="text-stone-500">Event</p><p className="font-medium">{selectedLead.eventType}</p></div><div className="rounded-2xl bg-orange-50 p-3"><p className="text-stone-500">Guests</p><p className="font-medium">{selectedLead.guests}</p></div><div className="rounded-2xl bg-orange-50 p-3"><p className="text-stone-500">Budget</p><p className="font-medium">${selectedLead.budget.toLocaleString()}</p></div><div className="rounded-2xl bg-orange-50 p-3"><p className="text-stone-500">Event date</p><p className="font-medium">{selectedLead.eventDate}</p></div></div><div className="rounded-2xl border border-orange-200 bg-white p-4"><p className="text-sm font-semibold">AI score reason</p><p className="mt-2 text-sm leading-6 text-stone-600">{selectedLead.scoreReason}</p></div><div className="rounded-2xl border border-orange-200 bg-white p-4"><p className="text-sm font-semibold">Recommended next action</p><p className="mt-2 text-sm leading-6 text-stone-600">{selectedLead.nextAction}</p></div><button type="button" onClick={runAgent} disabled={agentRunning} className="w-full rounded-2xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60">Execute n8n action</button></div></CardBox></div></div>}

    {activeTab === "agent" && <div className="grid gap-4 lg:grid-cols-[.9fr_1.1fr]"><CardBox className="p-5"><h2 className="text-base font-semibold text-red-700">AI agent simulation</h2><button type="button" onClick={runAgent} disabled={agentRunning} className="mt-4 w-full rounded-2xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60">{agentRunning ? "Running..." : `Run for ${selectedLead.name}`}</button><div className="mt-4 rounded-2xl bg-red-600 p-4 font-mono text-xs text-white">{log.map((item, index) => <div key={`${index}-${item}`} className="mb-2 last:mb-0"><span className="text-amber-100">[{String(index + 1).padStart(2, "0")}]</span> {item}</div>)}</div></CardBox><div className="grid gap-4"><CardBox className="p-5"><h2 className="text-base font-semibold text-red-700">Generated SMS</h2><div className="mt-4 rounded-2xl border border-orange-200 bg-white p-4 text-sm leading-6 text-stone-700">{message.sms}</div></CardBox><CardBox className="p-5"><h2 className="text-base font-semibold text-red-700">Generated email</h2><pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-orange-200 bg-white p-4 text-sm leading-6 text-stone-700">{message.email}</pre></CardBox><CardBox className="p-5"><h2 className="text-base font-semibold text-red-700">After-event follow-up</h2><pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-orange-200 bg-amber-50 p-4 text-sm leading-6 text-stone-700">{afterEventMessage}</pre></CardBox></div></div>}

    {activeTab === "workflow" && <div className="space-y-4"><CardBox className="p-5"><h2 className="text-base font-semibold text-red-700">Manual workflow converted into n8n automation</h2><div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{WORKFLOW_STEPS.map(([code, title, owner, detail]) => <div key={code} className="rounded-2xl border border-orange-200 bg-white p-4"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-sm font-semibold text-amber-900">{code}</div><p className="font-semibold">{title}</p><p className="mt-1 text-xs font-medium uppercase tracking-wide text-stone-500">{owner}</p><p className="mt-3 text-sm leading-6 text-stone-600">{detail}</p></div>)}</div></CardBox><CardBox className="p-5"><h2 className="text-base font-semibold text-red-700">n8n node blueprint</h2><div className="mt-4 grid gap-3 md:grid-cols-4 lg:grid-cols-8">{NODE_NAMES.map((node) => <div key={node} className="rounded-2xl border border-orange-200 bg-white p-4 text-center text-sm font-medium">{node}</div>)}</div><div className="mt-4 rounded-2xl bg-amber-100 p-4 text-sm leading-6 text-stone-700">Trigger examples: new website form, new row in spreadsheet, new CRM contact, incoming email, or manual button. The agent writes back to CRM fields: lead score, stage, next action, follow-up date, message draft, and owner alert.</div></CardBox></div>}

    {activeTab === "spreadsheet" && <div className="grid gap-4 lg:grid-cols-[.9fr_1.1fr]"><CardBox className="p-5"><h2 className="text-base font-semibold text-red-700">AI Spreadsheet Assistant</h2><p className="mt-3 text-sm leading-6 text-stone-600">This assistant represents Alexandra's spreadsheet of inquiries, bookings, ghosted leads, and declined opportunities. It lets her ask questions in plain English instead of manually filtering rows.</p><div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-stone-700"><strong>Spreadsheet summary:</strong> {getSpreadsheetSummary(LEADS)}</div><div className="mt-4"><p className="text-sm font-semibold text-stone-700">Connected columns</p><div className="mt-2 flex flex-wrap gap-2">{SPREADSHEET_COLUMNS.map((column) => <MiniLabel key={column}>{column}</MiniLabel>)}</div></div></CardBox><CardBox className="p-5"><h2 className="text-base font-semibold text-red-700">Ask the spreadsheet</h2><div className="mt-4 space-y-3">{SPREADSHEET_ASSISTANT_PROMPTS.map((prompt) => <div key={prompt.question} className="rounded-2xl border border-orange-200 bg-white p-4"><p className="text-sm font-semibold text-stone-800">{prompt.question}</p><p className="mt-2 text-sm leading-6 text-stone-600">{prompt.answer}</p><BadgeBox className="mt-3 border-amber-300 bg-amber-50 text-amber-800">{prompt.action}</BadgeBox></div>)}</div></CardBox><CardBox className="p-5 lg:col-span-2"><h2 className="text-base font-semibold text-red-700">Assistant-generated task list from spreadsheet rows</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{getSpreadsheetAssistantTasks(LEADS).map((task) => <div key={`${task.lead}-${task.stage}`} className="rounded-2xl border border-orange-200 bg-orange-50 p-4"><div className="flex items-center justify-between gap-3"><p className="font-semibold text-stone-800">{task.lead}</p><BadgeBox className="border-red-200 bg-red-50 text-red-700">{task.aiScore}%</BadgeBox></div><p className="mt-1 text-xs font-medium uppercase tracking-wide text-stone-500">{task.stage}</p><p className="mt-3 text-sm leading-6 text-stone-600">{task.recommendation}</p></div>)}</div></CardBox></div>}

    {activeTab === "insights" && <div className="grid gap-4 lg:grid-cols-2"><CardBox className="p-5"><h2 className="text-base font-semibold text-red-700">Event with most revenue</h2><div className="mt-4 rounded-2xl bg-amber-50 p-5"><p className="text-sm text-stone-500">Top event category</p><p className="mt-2 text-3xl font-semibold text-red-700">{topRevenueEvent.eventType}</p><p className="mt-1 text-lg font-semibold text-amber-800">${topRevenueEvent.revenue.toLocaleString()} estimated revenue</p><p className="mt-3 text-sm leading-6 text-stone-600">This tells Alexandra which event type is creating the strongest revenue opportunity in the current CRM pipeline.</p></div></CardBox><CardBox className="p-5"><h2 className="text-base font-semibold text-red-700">Revenue by event type</h2><div className="mt-4"><BarList data={revenueEventData} labelKey="eventType" valueKey="revenue" valuePrefix="$" /></div></CardBox><CardBox className="p-5"><h2 className="text-base font-semibold text-red-700">Lead source mix</h2><div className="mt-4"><BarList data={sourceData} labelKey="source" valueKey="count" /></div></CardBox><CardBox className="p-5"><h2 className="text-base font-semibold text-red-700">Pipeline by stage</h2><div className="mt-4"><BarList data={stageData} labelKey="stage" valueKey="count" /></div></CardBox><CardBox className="p-5 lg:col-span-2"><h2 className="text-base font-semibold text-red-700">Business growth graph</h2><div className="mt-4"><RevenueGrowthChart data={MONTHLY_GROWTH} /></div><p className="mt-4 text-sm leading-6 text-stone-600">Growth status: <strong>{businessGrowing ? "Growing" : "Not enough evidence of growth"}</strong>. This uses synthetic monthly revenue, inquiries, and booked events for the demo.</p></CardBox><CardBox className="p-5 lg:col-span-2"><h2 className="text-base font-semibold text-red-700">Demand and bookings trend</h2><div className="mt-4"><LineTrend data={conversionTrend} /></div></CardBox></div>}

    {activeTab === "tests" && <CardBox className="p-5"><h2 className="text-base font-semibold text-red-700">Runtime validation tests</h2><div className="mt-4 space-y-3">{testResults.map((result) => <div key={result.name} className="flex items-center justify-between rounded-2xl border border-orange-200 bg-white p-3 text-sm"><span>{result.name}</span><BadgeBox className={result.passed ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"}>{result.passed ? "PASS" : "FAIL"}</BadgeBox></div>)}</div></CardBox>}
    <div className="mt-6 rounded-2xl border border-orange-200 bg-amber-50 p-4 text-sm leading-6 text-stone-700 shadow-sm"><strong>Demo note:</strong> This is a prototype using synthetic CRM records. A production version would connect HubSpot or Google Sheets, Gmail, SMS, calendar, contracts, and n8n through authenticated APIs.</div>
  </div></div>;
}
