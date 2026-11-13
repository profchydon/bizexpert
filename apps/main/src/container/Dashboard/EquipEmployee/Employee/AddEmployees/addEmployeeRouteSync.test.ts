import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildAddEmployeeRouteQuery,
  shouldReplaceAddEmployeeRoute,
} from "./addEmployeeRouteSync";

describe("addEmployeeRouteSync", () => {
  it("builds a stable query string from form values", () => {
    assert.equal(
      buildAddEmployeeRouteQuery({
        first_name: "Ada",
        last_name: "",
        email: undefined,
      }),
      "first_name=Ada",
    );
  });

  it("skips replace when the route query is unchanged", () => {
    assert.equal(
      shouldReplaceAddEmployeeRoute(
        "/dashboard/employees",
        "first_name=Ada",
        "first_name=Ada",
        true,
      ),
      false,
    );
  });
});
