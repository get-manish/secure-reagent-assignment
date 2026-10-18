import { computeAnalytics } from "../services/analyticsEngine.js";
import {
  USERS as RAW_USERS,
  DEPARTMENTS as RAW_DEPARTMENTS,
  DATE_RANGES as RAW_DATE_RANGES,
  SERVICES as RAW_SERVICES,
  LEAD_SOURCES as RAW_LEAD_SOURCES,
} from "./entities.js";

export const DATE_RANGES = RAW_DATE_RANGES;
export const USERS = ["All Users", ...RAW_USERS.map((u) => u.name)];
export const DEPARTMENTS = RAW_DEPARTMENTS;
export const SERVICES = RAW_SERVICES;
export const LEAD_SOURCES = RAW_LEAD_SOURCES;

// Base default computed values for October 2026
const defaultData = computeAnalytics({
  range: "Oct 1 - Oct 31, 2026",
  user: "All Users",
  department: "All Departments",
});

export const kpis = defaultData.kpis;
export const target = defaultData.target;
export const leadFunnel = defaultData.leadFunnel;
export const unqualified = defaultData.unqualified;
export const dailyLeads = defaultData.dailyLeads;
export const leadSources = defaultData.leadSources;

export const quotesByService = defaultData.quotesByService;
export const quoteValue = defaultData.quoteValue;
export const quoteDetails = defaultData.quoteDetails;
export const quoteConversion = defaultData.quoteConversion;

export const dealsByService = defaultData.dealsByService;
export const revenueByCategory = defaultData.revenueByCategory;
export const priority = defaultData.priority;
export const dailyRevenue = defaultData.dailyRevenue;
export const revenueTotals = defaultData.revenueTotals;

export const salesTeam = defaultData.salesTeam;
export const opsTeam = defaultData.opsTeam;
export const orders = defaultData.orders;
export const activity = defaultData.activity;
