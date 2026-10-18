import { computeAnalytics } from "./analyticsEngine.js";
import {
  USERS,
  DEPARTMENTS,
  DATE_RANGES,
  SERVICES,
  LEADS,
  QUOTATIONS,
  DEALS,
  INVOICES,
  ORDERS,
  ACTIVITIES,
} from "../data/entities.js";

const wait = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch complete dashboard data based on filters.
 */
export async function getDashboardData({
  range = DATE_RANGES[0],
  user = "All Users",
  department = "All Departments",
  service = "All Services",
  search = "",
} = {}) {
  await wait();

  if (range && !DATE_RANGES.includes(range)) {
    throw new Error(`Invalid date range: ${range}`);
  }

  const analytics = computeAnalytics({ range, user, department });

  // If service filter is provided and not "All Services"
  let filteredQuotationDetails = analytics.quoteDetails;
  let filteredSalesTeam = analytics.salesTeam;
  let filteredOpsTeam = analytics.opsTeam;
  let filteredActivity = analytics.activity;

  if (service && service !== "All Services") {
    filteredQuotationDetails = filteredQuotationDetails.filter((q) => q.service === service);
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filteredQuotationDetails = filteredQuotationDetails.filter((r) =>
      r.service.toLowerCase().includes(q),
    );
    filteredSalesTeam = filteredSalesTeam.filter(
      (m) => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q),
    );
    filteredOpsTeam = filteredOpsTeam.filter((m) => m.name.toLowerCase().includes(q));
    filteredActivity = filteredActivity.filter(
      (a) =>
        a.user.toLowerCase().includes(q) ||
        a.action.toLowerCase().includes(q) ||
        a.record.toLowerCase().includes(q),
    );
  }

  return {
    ...analytics,
    quoteDetails: filteredQuotationDetails,
    salesTeam: filteredSalesTeam,
    opsTeam: filteredOpsTeam,
    activity: filteredActivity,
  };
}

/**
 * Fetch dynamic filter options for dropdowns.
 */
export async function getFilterOptions() {
  await wait(80);
  const userOptions = ["All Users", ...USERS.map((u) => u.name)];
  const serviceOptions = ["All Services", ...SERVICES.map((s) => s.name)];
  return {
    dateRanges: DATE_RANGES,
    users: userOptions,
    departments: DEPARTMENTS,
    services: serviceOptions,
    teamMembers: USERS,
  };
}

/**
 * Fetch full profile details for a team member (Sales or Operations).
 */
export async function getUserProfile(userName) {
  await wait(100);
  const userObj = USERS.find((u) => u.name === userName);
  if (!userObj) throw new Error(`User not found: ${userName}`);

  const userLeads = LEADS.filter((l) => l.user === userName);
  const userQuotes = QUOTATIONS.filter((q) => q.user === userName);
  const userDeals = DEALS.filter((d) => d.user === userName);
  const userOrders = ORDERS.filter((o) => o.opsUser === userName);
  const userActivities = ACTIVITIES.filter((a) => a.user === userName);

  return {
    ...userObj,
    stats: {
      leads: userLeads.length,
      qualified: userLeads.filter((l) => l.status === "qualified" || l.status === "converted")
        .length,
      converted: userLeads.filter((l) => l.status === "converted").length,
      quotes: userQuotes.length,
      deals: userDeals.length,
      totalDealValue: userDeals.reduce((sum, d) => sum + (d.dealValue || 0), 0),
      revenue: userDeals.reduce((sum, d) => sum + (d.revenue || 0), 0),
      ordersUpdated: userOrders.length,
      stagesCompleted: userOrders.reduce((sum, o) => sum + (o.stages.completed || 0), 0),
      pendingStages: userOrders.reduce((sum, o) => sum + (o.stages.pending || 0), 0),
    },
    recentDeals: userDeals.slice(0, 5),
    recentActivities: userActivities.slice(0, 10),
  };
}

/**
 * Fetch full record details when clicking a record ID.
 */
export async function getRecordDetails(recordId) {
  await wait(120);
  const prefix = recordId.slice(0, 2);

  if (prefix === "#L") {
    const lead = LEADS.find((l) => l.leadNumber === recordId);
    if (lead) {
      return {
        type: "Lead",
        id: lead.leadNumber,
        title: lead.title,
        clientName: lead.clientName,
        companyName: lead.companyName,
        service: lead.service,
        assignedTo: lead.user,
        source: lead.source,
        status: lead.status,
        date: lead.createdAt,
        estimatedValue: `₹${(lead.estimatedValue || 0).toLocaleString("en-IN")}`,
        notes: `Inquiry received via ${lead.source}. Initial requirement assessment completed.`,
      };
    }
  }

  if (prefix === "#Q") {
    const q = QUOTATIONS.find((item) => item.quoteNumber === recordId);
    if (q) {
      return {
        type: "Quotation",
        id: q.quoteNumber,
        clientName: q.clientName,
        companyName: q.companyName,
        service: q.service,
        assignedTo: q.user,
        status: q.status,
        date: q.createdAt,
        amount: `₹${(q.amount || 0).toLocaleString("en-IN")}`,
        notes: `Formal proposal submitted for ${q.service}. Validity 30 days.`,
      };
    }
  }

  if (prefix === "#D") {
    const d = DEALS.find((item) => item.dealNumber === recordId);
    if (d) {
      return {
        type: "Deal",
        id: d.dealNumber,
        clientName: d.clientName,
        companyName: d.companyName,
        service: d.service,
        assignedTo: d.user,
        priority: d.priority,
        status: d.status,
        date: d.closedAt,
        dealValue: `₹${(d.dealValue || 0).toLocaleString("en-IN")}`,
        revenue: `₹${(d.revenue || 0).toLocaleString("en-IN")}`,
        collected: `₹${(d.collectedAmount || 0).toLocaleString("en-IN")}`,
        notes: `Deal closed with ${d.companyName} at ${d.priority} priority.`,
      };
    }
  }

  if (prefix === "#O") {
    const o = ORDERS.find((item) => item.orderNumber === recordId);
    if (o) {
      return {
        type: "Order / Execution",
        id: o.orderNumber,
        clientName: o.clientName,
        companyName: o.companyName,
        service: o.service,
        assignedTo: o.opsUser,
        status: o.status,
        date: o.updatedAt,
        stages: `${o.stages.completed} Completed, ${o.stages.pending} Pending, ${o.stages.inProgress} In Progress, ${o.stages.onHold} On Hold`,
        notes: `Operational workflow active. Handled by ${o.opsUser}.`,
      };
    }
  }

  if (recordId.startsWith("#INV") || recordId.startsWith("#I-")) {
    const inv = INVOICES.find((item) => item.invoiceNumber === recordId);
    if (inv) {
      return {
        type: "Invoice",
        id: inv.invoiceNumber,
        clientName: inv.clientName,
        service: inv.service,
        assignedTo: inv.user,
        status: inv.status,
        date: inv.createdAt,
        amount: `₹${(inv.amount || 0).toLocaleString("en-IN")}`,
        notes: `Tax invoice issued for ${inv.service}. Payment status: ${inv.status}.`,
      };
    }
  }

  if (prefix === "#P") {
    return {
      type: "Payment",
      id: recordId,
      clientName: "Client Transaction",
      date: "2026-10-16T11:53:02.446Z",
      status: "Verified",
      amount: "₹18,500",
      notes: "Direct bank transfer verified via automated payment gateway reconciliation.",
    };
  }

  // Fallback generic record
  return {
    type: "Audit Record",
    id: recordId,
    clientName: "Verified System Record",
    date: new Date().toISOString(),
    status: "Active",
    notes: "CRM Audit entry verified and logged to database.",
  };
}
