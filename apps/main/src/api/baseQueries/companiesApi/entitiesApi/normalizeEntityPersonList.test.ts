import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  mapEntityAdminLabels,
  mapEntityAdminUserIds,
  normalizeEntityPersonList,
} from "./mapEntityPersonLabel";

const admin = {
  id: "019f60df-77c2-720d-9ec0-59a73ce3a0fa",
  first_name: "Oyin",
  last_name: "Tope",
  email: "oyintope@yopmail.com",
  role: "Administrator",
};

describe("normalizeEntityPersonList", () => {
  it("returns an empty array when admins are missing", () => {
    assert.deepEqual(normalizeEntityPersonList(undefined), []);
  });

  it("returns a flat admin array unchanged", () => {
    assert.deepEqual(normalizeEntityPersonList([admin]), [admin]);
  });

  it("reads admins from a paginated payload", () => {
    assert.deepEqual(
      normalizeEntityPersonList({
        data: [admin],
        total: 1,
        per_page: 10,
        current_page: 1,
        last_page: 1,
      }),
      [admin],
    );
  });
});

describe("mapEntityAdminLabels", () => {
  it("maps labels from paginated admins", () => {
    assert.deepEqual(
      mapEntityAdminLabels({
        data: [admin],
        total: 1,
        per_page: 10,
        current_page: 1,
        last_page: 1,
      }),
      ["Oyin Tope"],
    );
  });
});

describe("mapEntityAdminUserIds", () => {
  it("maps ids from paginated admins", () => {
    assert.deepEqual(
      mapEntityAdminUserIds({
        data: [admin],
        total: 1,
        per_page: 10,
        current_page: 1,
        last_page: 1,
      }),
      [admin.id],
    );
  });
});
