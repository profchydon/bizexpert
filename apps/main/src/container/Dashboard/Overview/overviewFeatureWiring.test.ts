import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path: string) => readFileSync(path, "utf8");

test("overview mounts fixture-backed product banners without a fixture FAB", () => {
  const overview = read("src/container/Dashboard/Overview/index.tsx");
  const globalBody = read(
    "src/container/Dashboard/Overview/GlobalOverviewBody.tsx",
  );
  const header = read(
    "src/container/Dashboard/Overview/OverviewDashboardHeader.tsx",
  );

  assert.match(overview, /resolveOverviewTier/);
  assert.match(overview, /resolveOverviewDashboardData/);
  assert.match(overview, /shouldBlockOverviewOnDashboardError/);
  assert.match(overview, /GlobalOverviewBody/);
  assert.match(overview, /EntityOverviewBody/);
  assert.match(overview, /OfficeOverviewBody/);
  assert.match(globalBody, /<ApprovalsBanner \/>/);
  assert.match(globalBody, /<SetupBanner \/>/);
  assert.match(globalBody, /dashboardOverviewCards/);
  assert.doesNotMatch(overview, /onInvite/);
  assert.doesNotMatch(overview, /FixtureTool/);
  assert.match(header, /OverviewInviteButton/);
  assert.doesNotMatch(header, /Export report/);
});

test("categories breakdown switches to a bar list when types exceed five", () => {
  const source = read(
    "src/container/Dashboard/Overview/WhatsHappening/CategoriesBreakdown/index.tsx",
  );

  assert.match(source, /shouldUseTypesBarList/);
  assert.match(source, /CategoryBarList/);
  assert.match(source, /Types breakdown/);
  assert.match(source, /toTypesBreakdownChartData/);
  assert.match(source, /dashboardTypesBreakdown/);
  assert.match(source, /flex flex-1 flex-col justify-center px-6 py-6/);
  assert.match(source, /overviewCardShellClass/);

  const bars = read(
    "src/container/Dashboard/Overview/WhatsHappening/CategoriesBreakdown/CategoryBarList.tsx",
  );
  assert.match(bars, /rounded-md/);
  assert.doesNotMatch(bars, /rounded-full/);
  assert.match(bars, /utility-brand-600/);
  assert.match(bars, /gap-3/);
  assert.match(bars, /text-xs/);
  assert.match(bars, /font-medium text-primary/);
});

test("whats happening includes the catalog policy summary card", () => {
  const source = read(
    "src/container/Dashboard/Overview/WhatsHappening/index.tsx",
  );

  assert.match(source, /CatalogPolicySummaryCard/);
  assert.match(source, /country=\{country\}/);
  assert.match(source, /showCatalogRequests/);
});

test("spending card shows workspace credit standing", () => {
  const source = read(
    "src/container/Dashboard/Overview/WhatsHappening/Overview/index.tsx",
  );
  const standing = read(
    "src/container/Dashboard/Overview/WhatsHappening/Overview/OverviewCreditStanding.tsx",
  );

  assert.match(source, /useOverviewCreditView/);
  assert.match(source, /dashboardSpendingPanel/);
  assert.match(source, /SPEND_TABS/);
  assert.match(standing, /useEntitiesListCompanyId/);
  assert.match(standing, /shouldListOverviewEntities/);
  assert.match(standing, /shouldLoadOverviewEntityDetail/);
  assert.match(standing, /useGetEntityQuery/);
  assert.match(standing, /skip: !companyId \|\| !canList/);
  assert.doesNotMatch(standing, /useWorkspaceScopedCompanyArgs/);
});

test("spending card report CTA navigates to transactions", () => {
  const source = read(
    "src/container/Dashboard/Overview/WhatsHappening/Overview/SpendingTabContent.tsx",
  );

  assert.match(source, /View transactions/);
  assert.match(source, /routes\.TRANSACTIONS/);
  assert.match(source, /Spending over time/);
  assert.doesNotMatch(source, /Current balance/);
  assert.doesNotMatch(source, /dummyChartData/);
  assert.doesNotMatch(source, /spendingPlaceholderPoints/);
  assert.match(source, /spendAmountForTab/);
  assert.doesNotMatch(source, /formatSpendingAmount\(0/);
});

test("overview charts do not ship fixture series", () => {
  const spending = read(
    "src/container/Dashboard/Overview/dashboardSpending.ts",
  );
  const ordering = read(
    "src/container/Dashboard/Overview/WhatsHappening/OrderFrequency/OrderFrequencyChart.tsx",
  );
  const frequency = read(
    "src/container/Dashboard/Overview/WhatsHappening/OrderFrequency/index.tsx",
  );

  assert.doesNotMatch(spending, /spendingPlaceholderPoints/);
  assert.doesNotMatch(ordering, /dummyChart/);
  assert.match(frequency, /dashboardOrderingFrequency/);
});

test("entity overview replaces the world map with a footprint section", () => {
  const entityBody = read(
    "src/container/Dashboard/Overview/EntityOverviewBody.tsx",
  );
  const whatsHappening = read(
    "src/container/Dashboard/Overview/WhatsHappening/index.tsx",
  );

  assert.match(entityBody, /EntityFootprintSection/);
  assert.match(entityBody, /<SetupBanner \/>/);
  assert.match(entityBody, /showMap=\{false\}/);
  assert.match(entityBody, /showCatalogRequests=\{false\}/);
  assert.match(entityBody, /country=\{region \|\| undefined\}/);
  assert.match(whatsHappening, /showMap \? <OverviewDashboardMap/);

  const switcher = read("src/app/dashboard/NavBar/accountSwitcherScopes.ts");
  assert.match(switcher, /MISSING_SWITCHER_ENTITY_LABEL = "Entity"/);
  assert.doesNotMatch(switcher, /Selected workspace/);
});

test("recent orders reads the dashboard payload instead of GET /orders", () => {
  const card = read(
    "src/container/Dashboard/Overview/WhatsHappening/RecentOrders/index.tsx",
  );
  const table = read(
    "src/container/Dashboard/Overview/WhatsHappening/RecentOrders/RecentOrdersTable/index.tsx",
  );
  const queries = read("src/hooks/useWorkspaceDashboardQueries.ts");

  assert.match(card, /isDashboardRecentOrdersVisible/);
  assert.match(table, /useWorkspaceDashboardQuery/);
  assert.match(table, /dashboardRecentOrders/);
  assert.doesNotMatch(table, /useWorkspaceRecentOrdersQuery/);
  assert.doesNotMatch(table, /useGetOrdersQuery/);
  assert.doesNotMatch(queries, /useGetOrdersQuery/);
  assert.doesNotMatch(queries, /useWorkspaceRecentOrdersQuery/);
});

test("office overview is a snapshot of stats and recent orders", () => {
  const source = read(
    "src/container/Dashboard/Overview/OfficeOverviewBody.tsx",
  );

  assert.match(source, /OfficeStatsCard/);
  assert.match(source, /RecentOrders/);
  assert.doesNotMatch(source, /DoingToday/);
  assert.doesNotMatch(source, /ApprovalsBanner/);
  assert.doesNotMatch(source, /companyId!/);
  assert.doesNotMatch(source, /officeId!/);
});

test("overview queries skip instead of asserting a company id", () => {
  const catalog = read(
    "src/container/Dashboard/Overview/CatalogPolicySummaryCard.tsx",
  );
  const approvals = read(
    "src/container/Dashboard/Overview/ApprovalsBanner.tsx",
  );
  const footprint = read(
    "src/container/Dashboard/Overview/EntityFootprintSection.tsx",
  );
  const setup = read("src/container/Dashboard/Overview/SetupBanner.tsx");
  const equipmentCard = read(
    "src/container/Dashboard/Overview/EntityEquipmentFootprintCard.tsx",
  );

  assert.match(catalog, /useWorkspaceDashboardQuery/);
  assert.match(catalog, /dashboardCatalogPolicySummary/);
  assert.match(catalog, /ProgressBarCircle/);
  assert.match(catalog, /href=\{routes\.CATALOG_POLICIES\}/);
  assert.doesNotMatch(catalog, /useGetEmployeesQuery/);
  assert.doesNotMatch(catalog, /useGetCatalogPoliciesQuery/);
  assert.match(approvals, /companyId: companyId \?\? ""/);
  assert.match(approvals, /canReviewAccountApprovals/);
  assert.match(approvals, /skip: !companyId \|\| !canReviewAccountApprovals/);
  assert.match(approvals, /variant="primary"/);
  assert.doesNotMatch(approvals, /bg-warning-solid/);
  assert.doesNotMatch(approvals, /hover:bg-warning-700/);
  assert.match(footprint, /dashboardEquipmentPanel/);
  assert.match(footprint, /dashboardOfficesPanel/);
  assert.doesNotMatch(footprint, /useGetOfficesQuery/);
  assert.doesNotMatch(footprint, /useWorkspaceDashboardCountrySummaryQuery/);
  assert.match(setup, /dashboardOverviewCards/);
  assert.match(equipmentCard, /ConditionDonut/);
  assert.match(equipmentCard, /Asset value/);
  assert.doesNotMatch(catalog, /companyId!/);
  assert.doesNotMatch(approvals, /companyId!/);
  assert.doesNotMatch(setup, /FixtureTool/);
  assert.doesNotMatch(footprint, /FixtureTool/);
});
