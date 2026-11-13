import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildRunHistoryExportUrl,
  getRunHistoryExportFilename,
  runOutcomeToExportParam,
} from "./runHistoryExport";

describe("run history export", () => {
  it("builds the catalog trigger history export URL with filters", () => {
    const url = buildRunHistoryExportUrl({
      catalogId: "catalog-1",
      companyId: "company-1",
      outcome: "MATCHED",
      search: " employee@example.com ",
    });

    assert.match(
      url,
      /\/companies\/company-1\/catalog-policies\/catalog-1\/trigger-history\/export\?/,
    );
    assert.match(url, /format=csv/);
    assert.match(url, /outcome=matched/);
    assert.match(url, /search=employee%40example.com/);
  });

  it("omits the outcome filter when all outcomes are selected", () => {
    assert.equal(runOutcomeToExportParam("ALL"), null);
  });

  it("uses the backend filename when provided", () => {
    assert.equal(
      getRunHistoryExportFilename('attachment; filename="history.csv"'),
      "history.csv",
    );
  });
});
