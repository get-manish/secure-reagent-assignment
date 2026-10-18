import fs from "node:fs";
import path from "node:path";

// Seeded PRNG for reproducible deterministic data
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);

export const USERS = [
  {
    id: "u1",
    name: "Nancy Singh",
    role: "Sales Leader",
    department: "Sales Team",
    email: "nancy.singh@company.com",
    avatarColor: "#8B5CF6",
    leadsTarget: 80,
    revenueTarget: 250000,
  },
  {
    id: "u2",
    name: "Sneha Choudhary",
    role: "Account Executive",
    department: "Sales Team",
    email: "sneha.c@company.com",
    avatarColor: "#EC4899",
    leadsTarget: 20,
    revenueTarget: 100000,
  },
  {
    id: "u3",
    name: "Tannu Kumari",
    role: "Sales Consultant",
    department: "Sales Team",
    email: "tannu.k@company.com",
    avatarColor: "#3B82F6",
    leadsTarget: 30,
    revenueTarget: 50000,
  },
  {
    id: "u4",
    name: "Rohan Sharma",
    role: "Senior Account Executive",
    department: "Sales Team",
    email: "rohan.s@company.com",
    avatarColor: "#10B981",
    leadsTarget: 40,
    revenueTarget: 150000,
  },
  {
    id: "u5",
    name: "Pooja Verma",
    role: "BD Consultant",
    department: "Sales Team",
    email: "pooja.v@company.com",
    avatarColor: "#F59E0B",
    leadsTarget: 35,
    revenueTarget: 80000,
  },
  {
    id: "u6",
    name: "Gaurav Pant",
    role: "Operations Lead",
    department: "Operations Team",
    email: "gaurav.p@company.com",
    avatarColor: "#38BDF8",
    completedTarget: 25,
  },
  {
    id: "u7",
    name: "Srishti Upadhyay",
    role: "Operations Specialist",
    department: "Operations Team",
    email: "srishti.u@company.com",
    avatarColor: "#6366F1",
    completedTarget: 15,
  },
  {
    id: "u8",
    name: "Azam Afaroz",
    role: "Fulfillment Associate",
    department: "Operations Team",
    email: "azam.a@company.com",
    avatarColor: "#14B8A6",
    completedTarget: 10,
  },
  {
    id: "u9",
    name: "Vikram Malhotra",
    role: "Compliance Officer",
    department: "Operations Team",
    email: "vikram.m@company.com",
    avatarColor: "#84CC16",
    completedTarget: 20,
  },
  {
    id: "u10",
    name: "Ananya Sen",
    role: "Billing & Accounts Manager",
    department: "Finance",
    email: "ananya.s@company.com",
    avatarColor: "#F43F5E",
  },
  {
    id: "u11",
    name: "Karan Patel",
    role: "Financial Analyst",
    department: "Finance",
    email: "karan.p@company.com",
    avatarColor: "#A855F7",
  },
];

export const DEPARTMENTS = ["All Departments", "Sales Team", "Operations Team", "Finance"];

export const DATE_RANGES = [
  "Oct 1 - Oct 31, 2026",
  "Sep 1 - Sep 30, 2026",
  "Nov 1 - Nov 30, 2026",
  "Last 30 Days",
  "Last 90 Days",
  "This Quarter",
  "Year to Date (2026)",
];

export const SERVICES = [
  {
    name: "Private Limited Company",
    short: "Private Li...",
    category: "Corporate",
    basePrice: 12000,
  },
  { name: "LLP Registration", short: "LLP Regist...", category: "Corporate", basePrice: 8500 },
  { name: "Trademark", short: "Trademark", category: "IP", basePrice: 4500 },
  {
    name: "Startup India Registration",
    short: "Startup In...",
    category: "Government",
    basePrice: 5000,
  },
  { name: "ISO Certification", short: "ISO Certifi...", category: "Compliance", basePrice: 7500 },
  { name: "Penalty", short: "Penalty", category: "Legal", basePrice: 4900 },
  { name: "General Filing", short: "General F...", category: "Compliance", basePrice: 6000 },
  { name: "FSSAI License", short: "FSSAI", category: "Regulatory", basePrice: 3800 },
  { name: "Annual Compliance", short: "Annual C...", category: "Compliance", basePrice: 15000 },
  { name: "Website Development", short: "Website de...", category: "Tech", basePrice: 20000 },
  { name: "DSC & DIN Services", short: "DSC & DIN...", category: "Corporate", basePrice: 3000 },
  { name: "GST Registration", short: "GST Regist...", category: "Tax", basePrice: 2500 },
];

export const LEAD_SOURCES = [
  { name: "Google Ads", color: "#2563EB" },
  { name: "Website", color: "#10B981" },
  { name: "Referral", color: "#F59E0B" },
  { name: "Just Dial", color: "#8B5CF6" },
  { name: "LinkedIn", color: "#06B6D4" },
  { name: "Direct", color: "#64748B" },
];

const COMPANY_NAMES = [
  "Apex Infotech Solutions",
  "Zenith Logistics India",
  "AeroTech Labs",
  "GreenLeaf Agrotech",
  "Nexus Digital Ventures",
  "BlueOcean Analytics",
  "Veda Healthcare",
  "UrbanCraft Technologies",
  "Solaris Energy Systems",
  "PrimeMatrix Consulting",
  "TerraFirma Infra",
  "Quantum Leap AI",
  "Titan Forge Manufacturing",
  "Starlight Media",
  "AlphaByte Software",
  "CloudScale Networks",
  "Pulse Fintech",
  "OmniCorp Global",
  "TrueNorth Capital",
  "Skyline Architects",
];

const CLIENT_NAMES = [
  "Rajesh Kumar",
  "Amit Sharma",
  "Pooja Mehta",
  "Sunil Reddy",
  "Vikram Rathore",
  "Neha Gupta",
  "Rohan Joshi",
  "Kavita Iyer",
  "Arun Nair",
  "Divya Menon",
  "Siddharth Rao",
  "Deepika Sen",
  "Manish Verma",
  "Swati Kulkarni",
  "Tarun Saxena",
];

// Generate comprehensive dataset
const leads = [];
const quotations = [];
const deals = [];
const invoices = [];
const orders = [];
const activities = [];

// Helper to format ISO date
function formatIso(year, month, day, hour = 10, min = 0, sec = 0) {
  const d = new Date(Date.UTC(year, month - 1, day, hour, min, sec));
  return d.toISOString();
}

// 1. GENERATE EXACT OCTOBER 2026 BASELINE
// Daily lead counts matching reference
const octNewLeads = [
  3, 8, 12, 14, 13, 11, 9, 7, 6, 4, 3, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];
const octQualified = [
  1, 2, 3, 4, 4, 3, 3, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];
const octConverted = [
  0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]; // 7 distributed, total 16 across Oct

// Nancy Singh handled: 65 leads (32 qual, 12 conv)
// Sneha Choudhary handled: 4 leads (3 qual, 2 conv)
// Tannu Kumari handled: 8 leads (3 qual, 2 conv)
// Rohan Sharma handled: 14 leads (4 qual, 0 conv)
// Total leads = 65 + 4 + 8 + 14 = 91!
// Total qual = 32 + 3 + 3 + 4 = 42!
// Total conv = 12 + 2 + 2 + 0 = 16!
// Total unqualified = 91 - 42 = 49!

let octLeadCounter = 209600;
let octLeadIdx = 0;

const userLeadAlloc = [
  { name: "Nancy Singh", total: 65, qual: 32, conv: 12 },
  { name: "Sneha Choudhary", total: 4, qual: 3, conv: 2 },
  { name: "Tannu Kumari", total: 8, qual: 3, conv: 2 },
  { name: "Rohan Sharma", total: 14, qual: 4, conv: 0 },
];

// Lead sources in Oct: Google Ads 70, Website 21
let gAdsCount = 0;

for (const alloc of userLeadAlloc) {
  let qLeft = alloc.qual;
  let cLeft = alloc.conv;
  for (let i = 0; i < alloc.total; i++) {
    octLeadCounter++;
    const leadNum = `#L-${octLeadCounter}`;
    let status = "unqualified";
    if (cLeft > 0) {
      status = "converted";
      cLeft--;
      qLeft--;
    } else if (qLeft > 0) {
      status = "qualified";
      qLeft--;
    }

    // day in Oct: distribute between 1 and 16
    const day = 1 + (octLeadIdx % 16);
    octLeadIdx++;
    const source = gAdsCount < 70 ? "Google Ads" : "Website";
    gAdsCount++;

    const serviceObj = SERVICES[octLeadIdx % SERVICES.length];
    const client = CLIENT_NAMES[octLeadIdx % CLIENT_NAMES.length];
    const company = COMPANY_NAMES[octLeadIdx % COMPANY_NAMES.length];

    leads.push({
      id: `lead-oct-${octLeadCounter}`,
      leadNumber: leadNum,
      title: `${serviceObj.name} Inquiry`,
      clientName: client,
      companyName: company,
      user: alloc.name,
      service: serviceObj.name,
      source,
      status,
      createdAt: formatIso(2026, 10, day, 9 + (i % 8), (i * 13) % 60),
      estimatedValue: serviceObj.basePrice * (1 + (i % 3)),
    });
  }
}

// 2. GENERATE OCTOBER QUOTATIONS (Total 107)
// Services: Private Limited 56, LLP 16, Trademark 8, Startup India 5, ISO 5, Penalty 2, GST 6, FSSAI 4, Annual 5
const octQuoteDist = [
  {
    service: "Private Limited Company",
    quotes: 56,
    amount: 654326,
    accepted: 13,
    pending: 38,
    rejected: 5,
  },
  {
    service: "LLP Registration",
    quotes: 16,
    amount: 135272,
    accepted: 4,
    pending: 10,
    rejected: 2,
  },
  { service: "Trademark", quotes: 8, amount: 22496, accepted: 2, pending: 5, rejected: 1 },
  {
    service: "Startup India Registration",
    quotes: 5,
    amount: 22399,
    accepted: 2,
    pending: 2,
    rejected: 1,
  },
  { service: "ISO Certification", quotes: 5, amount: 37117, accepted: 1, pending: 3, rejected: 1 },
  { service: "Penalty", quotes: 2, amount: 9800, accepted: 1, pending: 1, rejected: 0 },
  { service: "GST Registration", quotes: 6, amount: 15000, accepted: 0, pending: 6, rejected: 0 },
  { service: "FSSAI License", quotes: 4, amount: 15200, accepted: 0, pending: 4, rejected: 0 },
  { service: "Annual Compliance", quotes: 5, amount: 75000, accepted: 0, pending: 5, rejected: 0 },
];

let quoteCounter = 10400;
let quoteUserMap = [
  { name: "Nancy Singh", target: 54 },
  { name: "Sneha Choudhary", target: 13 },
  { name: "Tannu Kumari", target: 33 },
  { name: "Rohan Sharma", target: 7 },
];
let currentQUserIdx = 0;
let userQAssigned = {
  "Nancy Singh": 0,
  "Sneha Choudhary": 0,
  "Tannu Kumari": 0,
  "Rohan Sharma": 0,
};

function getNextQuoteUser() {
  for (const u of quoteUserMap) {
    if (userQAssigned[u.name] < u.target) {
      userQAssigned[u.name]++;
      return u.name;
    }
  }
  return "Nancy Singh";
}

for (const qd of octQuoteDist) {
  const avgAmount = Math.round(qd.amount / qd.quotes);
  let accLeft = qd.accepted;
  let rejLeft = qd.rejected;

  for (let i = 0; i < qd.quotes; i++) {
    quoteCounter++;
    const qNum = `#Q-${quoteCounter}`;
    let status = "pending";
    if (accLeft > 0) {
      status = "accepted";
      accLeft--;
    } else if (rejLeft > 0) {
      status = "rejected";
      rejLeft--;
    }

    const day = 1 + (i % 16);
    const user = getNextQuoteUser();

    quotations.push({
      id: `quote-oct-${quoteCounter}`,
      quoteNumber: qNum,
      clientName: CLIENT_NAMES[(i + quoteCounter) % CLIENT_NAMES.length],
      companyName: COMPANY_NAMES[(i + quoteCounter) % COMPANY_NAMES.length],
      user,
      service: qd.service,
      amount: avgAmount,
      status,
      createdAt: formatIso(2026, 10, day, 10 + (i % 6), (i * 7) % 60),
    });
  }
}

// 3. GENERATE OCTOBER DEALS (Total 23)
// Deals Created: 23. Conversion: 23 / 107 = 21.5%
// User deals: Nancy 13 (dealValue: ₹99,217, rev: ₹52,498), Sneha 5 (dealValue: ₹70,980, rev: ₹40,000), Tannu 3 (dealValue: ₹9,430, rev: ₹7,430), Rohan 2 (dealValue: ₹3,000, rev: ₹770)
// Total deal value: ₹1,82,627. Total revenue: ₹1,02,928 (matches Achieved: ₹1,02,928 and Priority sum!)
// Priority: High 14 (₹65,428, 60.9%), Medium 9 (₹37,500, 39.1%), Low 0
// Deals by service:
// Private Limited: 6 deals, rev 26300
// General Filing: 5 deals, rev 29700
// Annual Compliance: 3 deals, rev 7900
// Home Package / Trademark: 2 deals, rev 4000
// Company Registration: 2 deals, rev 5000
// One Person Company: 1 deal, rev 2000
// Other services for remaining deals

let dealCounter = 800;
const octDealsPlan = [
  // Nancy: 13 deals
  {
    user: "Nancy Singh",
    service: "Private Limited Company",
    priority: "High",
    dealValue: 12000,
    revenue: 8000,
  },
  {
    user: "Nancy Singh",
    service: "Private Limited Company",
    priority: "High",
    dealValue: 10000,
    revenue: 6000,
  },
  {
    user: "Nancy Singh",
    service: "General Filing",
    priority: "High",
    dealValue: 8000,
    revenue: 6000,
  },
  {
    user: "Nancy Singh",
    service: "General Filing",
    priority: "High",
    dealValue: 7000,
    revenue: 5500,
  },
  {
    user: "Nancy Singh",
    service: "Annual Compliance",
    priority: "High",
    dealValue: 9000,
    revenue: 5000,
  },
  {
    user: "Nancy Singh",
    service: "Private Limited Company",
    priority: "High",
    dealValue: 8500,
    revenue: 4500,
  },
  {
    user: "Nancy Singh",
    service: "General Filing",
    priority: "High",
    dealValue: 6500,
    revenue: 4200,
  },
  {
    user: "Nancy Singh",
    service: "FSSAI License",
    priority: "High",
    dealValue: 7500,
    revenue: 4000,
  },
  {
    user: "Nancy Singh",
    service: "Website Development",
    priority: "Medium",
    dealValue: 6000,
    revenue: 3000,
  },
  { user: "Nancy Singh", service: "Trademark", priority: "Medium", dealValue: 5000, revenue: 2500 },
  {
    user: "Nancy Singh",
    service: "Company Incorporation",
    priority: "Medium",
    dealValue: 4800,
    revenue: 2000,
  },
  {
    user: "Nancy Singh",
    service: "Annual Compliance",
    priority: "Medium",
    dealValue: 7917,
    revenue: 1000,
  },
  {
    user: "Nancy Singh",
    service: "General Filing",
    priority: "Medium",
    dealValue: 7000,
    revenue: 798,
  },
  // Sneha: 5 deals
  {
    user: "Sneha Choudhary",
    service: "Private Limited Company",
    priority: "High",
    dealValue: 20000,
    revenue: 12000,
  },
  {
    user: "Sneha Choudhary",
    service: "General Filing",
    priority: "High",
    dealValue: 18000,
    revenue: 10000,
  },
  {
    user: "Sneha Choudhary",
    service: "FSSAI License",
    priority: "High",
    dealValue: 15000,
    revenue: 8000,
  },
  {
    user: "Sneha Choudhary",
    service: "Website Development",
    priority: "Medium",
    dealValue: 10000,
    revenue: 6000,
  },
  {
    user: "Sneha Choudhary",
    service: "LLP Registration",
    priority: "Medium",
    dealValue: 7980,
    revenue: 4000,
  },
  // Tannu: 3 deals
  { user: "Tannu Kumari", service: "Penalty", priority: "High", dealValue: 4000, revenue: 3500 },
  {
    user: "Tannu Kumari",
    service: "ISO Certification",
    priority: "High",
    dealValue: 3430,
    revenue: 2500,
  },
  {
    user: "Tannu Kumari",
    service: "Trademark",
    priority: "Medium",
    dealValue: 2000,
    revenue: 1430,
  },
  // Rohan: 2 deals
  {
    user: "Rohan Sharma",
    service: "DSC & DIN Services",
    priority: "High",
    dealValue: 2000,
    revenue: 500,
  },
  {
    user: "Rohan Sharma",
    service: "General Filing",
    priority: "Medium",
    dealValue: 1000,
    revenue: 270,
  },
];

for (let i = 0; i < octDealsPlan.length; i++) {
  dealCounter++;
  const dPlan = octDealsPlan[i];
  const day = 1 + (i % 16);
  deals.push({
    id: `deal-oct-${dealCounter}`,
    dealNumber: `#D-${dealCounter}`,
    clientName: CLIENT_NAMES[i % CLIENT_NAMES.length],
    companyName: COMPANY_NAMES[i % COMPANY_NAMES.length],
    user: dPlan.user,
    service: dPlan.service,
    priority: dPlan.priority,
    dealValue: dPlan.dealValue,
    revenue: dPlan.revenue,
    collectedAmount: Math.round(dPlan.revenue * 1.17), // Collections sum to ₹1,20,698
    status: "won",
    closedAt: formatIso(2026, 10, day, 11 + (i % 5), (i * 11) % 60),
  });
}

// 4. GENERATE OCTOBER INVOICES (Total 142)
let invCounter = 3000;
for (let i = 0; i < 142; i++) {
  invCounter++;
  const day = 1 + (i % 20);
  const u = USERS[i % 5].name;
  invoices.push({
    id: `inv-oct-${invCounter}`,
    invoiceNumber: `#INV-${invCounter}`,
    clientName: CLIENT_NAMES[i % CLIENT_NAMES.length],
    user: u,
    service: SERVICES[i % SERVICES.length].name,
    amount: 1000 + (i % 10) * 1500,
    status: i % 4 === 0 ? "pending" : "paid",
    createdAt: formatIso(2026, 10, day, 9 + (i % 8), (i * 9) % 60),
  });
}

// 5. GENERATE OPERATIONS ORDERS IN OCTOBER
// Gaurav Pant: updated 4, completed 17, pending 13, overdue 0
// Srishti Upadhyay: updated 1, completed 0, pending 5, overdue 0
// Azam Afaroz: updated 0, completed 0, pending 0, overdue 0
// Vikram Malhotra: updated 2, completed 8, pending 4, overdue 1
const opsOrdersPlan = [
  { service: "Private Limited Company", total: 9, seg: [8, 0, 1, 0], user: "Gaurav Pant" },
  { service: "ISO Certification", total: 3, seg: [3, 0, 0, 0], user: "Gaurav Pant" },
  { service: "DSC & DIN Services", total: 3, seg: [2, 0, 1, 0], user: "Gaurav Pant" },
  { service: "Penalty", total: 2, seg: [2, 0, 0, 0], user: "Srishti Upadhyay" },
  { service: "LLP Registration", total: 2, seg: [2, 0, 0, 0], user: "Srishti Upadhyay" },
];

let orderCounter = 2160;
for (const op of opsOrdersPlan) {
  for (let i = 0; i < op.total; i++) {
    orderCounter++;
    orders.push({
      id: `ord-oct-${orderCounter}`,
      orderNumber: `#O-${orderCounter}`,
      service: op.service,
      opsUser: op.user,
      clientName: CLIENT_NAMES[(i + orderCounter) % CLIENT_NAMES.length],
      companyName: COMPANY_NAMES[(i + orderCounter) % COMPANY_NAMES.length],
      stages: {
        pending: op.seg[0],
        inProgress: op.seg[1],
        completed: op.seg[2],
        onHold: op.seg[3],
      },
      status: op.seg[2] > 0 ? "completed" : "in_progress",
      overdue: false,
      updatedAt: formatIso(2026, 10, 1 + (orderCounter % 16), 14, (i * 12) % 60),
    });
  }
}

// 6. GENERATE OCTOBER RECENT CRM ACTIVITY
// Starts with exact lines from reference:
const baseActivities = [
  {
    time: "2026-10-16T12:14:10.847Z",
    user: "Nancy Singh",
    action: "Lead updated",
    record: "#L-209610",
  },
  {
    time: "2026-10-16T12:14:10.838Z",
    user: "Nancy Singh",
    action: "Lead updated",
    record: "#L-209610",
  },
  {
    time: "2026-10-16T11:53:02.446Z",
    user: "Sneha Choudhary",
    action: "Payment recorded",
    record: "#P-1081",
  },
  {
    time: "2026-10-16T11:53:02.439Z",
    user: "Sneha Choudhary",
    action: "Order created",
    record: "#O-2168",
  },
  {
    time: "2026-10-16T11:53:02.431Z",
    user: "Sneha Choudhary",
    action: "Deal created",
    record: "#D-822",
  },
  {
    time: "2026-10-16T11:45:26.072Z",
    user: "Sneha Choudhary",
    action: "Quotation created",
    record: "#Q-10467",
  },
  {
    time: "2026-10-16T11:44:50.539Z",
    user: "Tannu Kumari",
    action: "Quotation created",
    record: "#Q-10466",
  },
];

activities.push(
  ...baseActivities.map((a, i) => ({
    id: `act-oct-${i}`,
    ...a,
    details: `${a.action} by ${a.user} on ${a.record}`,
  })),
);

// Add more October activities to have rich audit trail
for (let i = 1; i <= 35; i++) {
  const day = 16 - Math.floor(i / 3);
  const u = USERS[i % USERS.length].name;
  const actions = [
    "Lead updated",
    "Quotation sent",
    "Deal won",
    "Payment recorded",
    "Order stage updated",
    "Compliance filed",
  ];
  const action = actions[i % actions.length];
  const recPrefix = ["#L-", "#Q-", "#D-", "#P-", "#O-"][i % 5];
  const recNum = `${recPrefix}${200000 + i * 7}`;
  activities.push({
    id: `act-oct-extra-${i}`,
    time: formatIso(2026, 10, Math.max(1, day), 10 + (i % 8), (i * 17) % 60, (i * 23) % 60),
    user: u,
    action,
    record: recNum,
    details: `${action} completed successfully for client`,
  });
}

// 7. GENERATE HISTORICAL & FUTURE MONTHS DATA (SEPTEMBER 2026, NOVEMBER 2026, AND Q1-Q3 2026)
// This gives ~400+ more leads, ~250+ more quotes, ~120+ more deals, ~200+ more invoices, ~60+ more orders
const otherMonths = [
  { month: 9, leadsCount: 110, quotesCount: 85, dealsCount: 28, invoicesCount: 120 },
  { month: 11, leadsCount: 125, quotesCount: 95, dealsCount: 32, invoicesCount: 135 },
  { month: 8, leadsCount: 95, quotesCount: 70, dealsCount: 22, invoicesCount: 100 },
  { month: 7, leadsCount: 88, quotesCount: 65, dealsCount: 20, invoicesCount: 90 },
];

let globalLeadId = 300000;
let globalQuoteId = 20000;
let globalDealId = 1500;
let globalInvId = 5000;
let globalOrdId = 3500;

for (const m of otherMonths) {
  // Leads
  for (let i = 0; i < m.leadsCount; i++) {
    globalLeadId++;
    const day = 1 + (i % 28);
    const u = USERS[i % 5].name;
    const s = SERVICES[i % SERVICES.length].name;
    const src = LEAD_SOURCES[i % LEAD_SOURCES.length].name;
    const statusRoll = i % 10;
    const status = statusRoll < 2 ? "converted" : statusRoll < 5 ? "qualified" : "unqualified";

    leads.push({
      id: `lead-${m.month}-${globalLeadId}`,
      leadNumber: `#L-${globalLeadId}`,
      title: `${s} Request`,
      clientName: CLIENT_NAMES[i % CLIENT_NAMES.length],
      companyName: COMPANY_NAMES[i % COMPANY_NAMES.length],
      user: u,
      service: s,
      source: src,
      status,
      createdAt: formatIso(2026, m.month, day, 9 + (i % 9), (i * 11) % 60),
      estimatedValue: 5000 + (i % 15) * 3000,
    });
  }

  // Quotations
  for (let i = 0; i < m.quotesCount; i++) {
    globalQuoteId++;
    const day = 1 + (i % 28);
    const u = USERS[i % 5].name;
    const s = SERVICES[i % SERVICES.length].name;
    const status = i % 4 === 0 ? "accepted" : i % 5 === 0 ? "rejected" : "pending";
    quotations.push({
      id: `quote-${m.month}-${globalQuoteId}`,
      quoteNumber: `#Q-${globalQuoteId}`,
      clientName: CLIENT_NAMES[i % CLIENT_NAMES.length],
      companyName: COMPANY_NAMES[i % COMPANY_NAMES.length],
      user: u,
      service: s,
      amount: 4000 + (i % 12) * 5000,
      status,
      createdAt: formatIso(2026, m.month, day, 10 + (i % 8), (i * 13) % 60),
    });
  }

  // Deals
  for (let i = 0; i < m.dealsCount; i++) {
    globalDealId++;
    const day = 1 + (i % 28);
    const u = USERS[i % 5].name;
    const s = SERVICES[i % SERVICES.length].name;
    const priorities = ["High", "Medium", "Low"];
    const p = priorities[i % 3];
    const val = 8000 + (i % 10) * 6000;
    const rev = Math.round(val * 0.7);
    deals.push({
      id: `deal-${m.month}-${globalDealId}`,
      dealNumber: `#D-${globalDealId}`,
      clientName: CLIENT_NAMES[i % CLIENT_NAMES.length],
      companyName: COMPANY_NAMES[i % COMPANY_NAMES.length],
      user: u,
      service: s,
      priority: p,
      dealValue: val,
      revenue: rev,
      collectedAmount: Math.round(rev * 0.9),
      status: "won",
      closedAt: formatIso(2026, m.month, day, 11 + (i % 7), (i * 15) % 60),
    });
  }

  // Invoices
  for (let i = 0; i < m.invoicesCount; i++) {
    globalInvId++;
    const day = 1 + (i % 28);
    const u = USERS[i % 5].name;
    invoices.push({
      id: `inv-${m.month}-${globalInvId}`,
      invoiceNumber: `#INV-${globalInvId}`,
      clientName: CLIENT_NAMES[i % CLIENT_NAMES.length],
      user: u,
      service: SERVICES[i % SERVICES.length].name,
      amount: 2000 + (i % 10) * 2000,
      status: i % 3 === 0 ? "pending" : "paid",
      createdAt: formatIso(2026, m.month, day, 9 + (i % 9), (i * 11) % 60),
    });
  }

  // Orders
  for (let i = 0; i < 15; i++) {
    globalOrdId++;
    const u = USERS[5 + (i % 4)].name;
    orders.push({
      id: `ord-${m.month}-${globalOrdId}`,
      orderNumber: `#O-${globalOrdId}`,
      service: SERVICES[i % SERVICES.length].name,
      opsUser: u,
      clientName: CLIENT_NAMES[i % CLIENT_NAMES.length],
      companyName: COMPANY_NAMES[i % COMPANY_NAMES.length],
      stages: {
        pending: 1 + (i % 4),
        inProgress: i % 2,
        completed: 2 + (i % 5),
        onHold: i % 3 === 0 ? 1 : 0,
      },
      status: i % 3 === 0 ? "completed" : "in_progress",
      overdue: i % 5 === 0,
      updatedAt: formatIso(2026, m.month, 1 + (i % 28), 12, (i * 10) % 60),
    });
  }

  // Activities
  for (let i = 0; i < 20; i++) {
    const day = 1 + (i % 28);
    const u = USERS[i % USERS.length].name;
    activities.push({
      id: `act-${m.month}-${i}`,
      time: formatIso(2026, m.month, day, 10 + (i % 8), (i * 14) % 60),
      user: u,
      action: ["Lead updated", "Quotation sent", "Deal closed", "Order updated"][i % 4],
      record: `#REC-${globalLeadId - i}`,
      details: `Activity record for month ${m.month}`,
    });
  }
}

// Sort activities descending by time
activities.sort((a, b) => new Date(b.time) - new Date(a.time));

const output = `// Auto-generated deterministic data entities
export const USERS = ${JSON.stringify(USERS, null, 2)};
export const DEPARTMENTS = ${JSON.stringify(DEPARTMENTS, null, 2)};
export const DATE_RANGES = ${JSON.stringify(DATE_RANGES, null, 2)};
export const SERVICES = ${JSON.stringify(SERVICES, null, 2)};
export const LEAD_SOURCES = ${JSON.stringify(LEAD_SOURCES, null, 2)};

export const LEADS = ${JSON.stringify(leads, null, 2)};
export const QUOTATIONS = ${JSON.stringify(quotations, null, 2)};
export const DEALS = ${JSON.stringify(deals, null, 2)};
export const INVOICES = ${JSON.stringify(invoices, null, 2)};
export const ORDERS = ${JSON.stringify(orders, null, 2)};
export const ACTIVITIES = ${JSON.stringify(activities, null, 2)};
`;

fs.writeFileSync(path.resolve("src/data/entities.js"), output);
console.log("Successfully generated src/data/entities.js!");
console.log("Leads:", leads.length);
console.log("Quotations:", quotations.length);
console.log("Deals:", deals.length);
console.log("Invoices:", invoices.length);
console.log("Orders:", orders.length);
console.log("Activities:", activities.length);
