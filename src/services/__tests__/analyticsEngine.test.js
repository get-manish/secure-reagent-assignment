import { describe, it, expect } from "vitest";
import { computeAnalytics } from "../analyticsEngine.js";
import { getFilterOptions, getRecordDetails } from "../mockApi.js";

describe("Analytics Engine & Mock API", () => {
  it("computes exact October 2026 baseline matching the reference design", () => {
    const data = computeAnalytics({
      range: "Oct 1 - Oct 31, 2026",
      user: "All Users",
      department: "All Departments",
    });

    // Check KPIs
    const kpiMap = Object.fromEntries(data.kpis.map((k) => [k.id, k.value]));
    expect(kpiMap.new).toBe("91");
    expect(kpiMap.qual).toBe("42");
    expect(kpiMap.conv).toBe("16");
    expect(kpiMap.unq).toBe("49");
    expect(kpiMap.rate).toBe("25.3%");
    expect(kpiMap.quo).toBe("107");
    expect(kpiMap.deal).toBe("23");
    expect(kpiMap.inv).toBe("142");

    // Target
    expect(data.target.goal).toBe("₹85,00,000");
    expect(data.target.achieved).toBe("₹1,02,928");
    expect(data.target.achievedPct).toBe(1.2);
    expect(data.target.remaining).toBe("₹83,97,072");

    // Lead Funnel
    expect(data.leadFunnel[0].value).toBe(91);
    expect(data.leadFunnel[1].value).toBe(42);
    expect(data.leadFunnel[2].value).toBe(16);
    expect(data.unqualified.value).toBe(49);

    // Lead Sources
    const gAds = data.leadSources.find((s) => s.name === "Google Ads");
    const web = data.leadSources.find((s) => s.name === "Website");
    expect(gAds.value).toBe(70);
    expect(web.value).toBe(21);

    // Quotation analytics
    expect(data.quoteConversion.deals).toBe(23);
    expect(data.quoteConversion.quotes).toBe(107);
    expect(data.quoteConversion.pct).toBe(21.5);

    // Revenue totals
    expect(data.revenueTotals.total).toBe("₹1,82,627");
    expect(data.revenueTotals.collected).toBe("₹1,20,698");
    expect(data.revenueTotals.efficiency).toBe("66.1%");

    // Sales team
    const nancy = data.salesTeam.find((m) => m.name === "Nancy Singh");
    expect(nancy).toBeDefined();
    expect(nancy.leads).toBe(65);
    expect(nancy.qualified).toBe(32);
    expect(nancy.converted).toBe(12);
  });

  it("dynamically recalculates metrics when date range changes", () => {
    const sepData = computeAnalytics({
      range: "Sep 1 - Sep 30, 2026",
      user: "All Users",
      department: "All Departments",
    });

    const octData = computeAnalytics({
      range: "Oct 1 - Oct 31, 2026",
      user: "All Users",
      department: "All Departments",
    });

    // September has its own distinct lead count
    const sepLeads = sepData.kpis.find((k) => k.id === "new").value;
    const octLeads = octData.kpis.find((k) => k.id === "new").value;
    expect(sepLeads).not.toBe(octLeads);
    expect(Number(sepLeads)).toBeGreaterThan(50);
  });

  it("filters dashboard data when a specific user is selected", () => {
    const nancyData = computeAnalytics({
      range: "Oct 1 - Oct 31, 2026",
      user: "Nancy Singh",
      department: "All Departments",
    });

    // Nancy only handled 65 leads in Oct
    const nancyLeads = nancyData.kpis.find((k) => k.id === "new").value;
    expect(nancyLeads).toBe("65");
    expect(nancyData.salesTeam.length).toBe(1);
    expect(nancyData.salesTeam[0].name).toBe("Nancy Singh");
  });

  it("filters visibility by department", () => {
    const opsData = computeAnalytics({
      range: "Oct 1 - Oct 31, 2026",
      user: "All Users",
      department: "Operations Team",
    });

    expect(opsData.showOps).toBe(true);
    expect(opsData.showSales).toBe(false);
  });

  it("mockApi getFilterOptions returns full list of options", async () => {
    const options = await getFilterOptions();
    expect(options.dateRanges.length).toBeGreaterThan(4);
    expect(options.users).toContain("Nancy Singh");
    expect(options.users).toContain("Gaurav Pant");
    expect(options.departments).toContain("Sales Team");
    expect(options.departments).toContain("Operations Team");
  });

  it("mockApi getRecordDetails retrieves valid details for CRM record IDs", async () => {
    const leadDetail = await getRecordDetails("#L-209610");
    expect(leadDetail).toBeDefined();
    expect(leadDetail.type).toBe("Lead");

    const quoteDetail = await getRecordDetails("#Q-10467");
    expect(quoteDetail).toBeDefined();
    expect(quoteDetail.type).toBe("Quotation");

    const dealDetail = await getRecordDetails("#D-822");
    expect(dealDetail).toBeDefined();
    expect(dealDetail.type).toBe("Deal");
  });
});
