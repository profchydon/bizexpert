import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { IEmployees } from "@/types/employees";
import type { DeviceLine, OffboardReviewEmployee } from "@/types/offboard";
import { DISPOSITION_ACTION, buildOffboardAssets } from "./buildOffboardAssets";

const device = (overrides: Partial<DeviceLine> = {}): DeviceLine => ({
  id: "device-1",
  name: "Apple MacBook Pro M2",
  serial: "SN-1",
  imageUrl: "https://img/device.png",
  disposition: "STORE",
  wipeType: "None",
  fee: 105,
  ...overrides,
});

const reviewEmployee = (
  overrides: Partial<OffboardReviewEmployee> = {},
): OffboardReviewEmployee => ({
  id: "emp-1",
  name: "Femi Adesanya",
  role: "Analyst",
  country: "Nigeria",
  window: { start: "2026-06-08", end: "2026-06-14" },
  devices: [device()],
  ...overrides,
});

const fullEmployee = (overrides: Partial<IEmployees> = {}): IEmployees =>
  ({
    id: "emp-1",
    first_name: "Femi",
    last_name: "Adesanya",
    email: "femi@rayda.co",
    address: "12 Marina Road",
    country: "Nigeria",
    country_code: "NG",
    employment_type: "Contract",
    phone: "+2348170000000",
    job_title: "Investment Analyst",
    ...overrides,
  }) as unknown as IEmployees;

describe("buildOffboardAssets", () => {
  it("maps each disposition to its fee action type", () => {
    assert.equal(DISPOSITION_ACTION.STORE, "Store");
    assert.equal(DISPOSITION_ACTION.REASSIGN, "Transfer");
    assert.equal(DISPOSITION_ACTION.DISPOSE, "Archive");
  });

  it("flattens one asset per device with action type and collection date", () => {
    const assets = buildOffboardAssets(
      [
        reviewEmployee({
          devices: [
            device({ id: "d1", disposition: "STORE" }),
            device({ id: "d2", disposition: "DISPOSE" }),
          ],
        }),
      ],
      [],
    );

    assert.equal(assets.length, 2);
    assert.equal(assets[0].id, "d1");
    assert.equal(assets[0].actionType, "Store");
    assert.equal(assets[0].collectionDate, "2026-06-08");
    assert.equal(assets[1].actionType, "Archive");
  });

  it("enriches the assignee from the full employee record", () => {
    const [asset] = buildOffboardAssets([reviewEmployee()], [fullEmployee()]);

    assert.equal(asset.assignee?.id, "emp-1");
    assert.equal(asset.assignee?.name, "Femi Adesanya");
    assert.equal(asset.assignee?.email, "femi@rayda.co");
    assert.equal(asset.assignee?.phone, "+2348170000000");
    assert.equal(asset.assignee?.employment_type, "Contract");
    assert.equal(asset.assignee?.job_title, "Investment Analyst");
  });

  it("falls back to review fields when no full employee is found", () => {
    const [asset] = buildOffboardAssets([reviewEmployee()], []);

    assert.equal(asset.assignee?.id, "emp-1");
    assert.equal(asset.assignee?.name, "Femi Adesanya");
    assert.equal(asset.assignee?.country, "Nigeria");
    assert.equal(asset.assignee?.job_title, "Analyst");
    assert.equal(asset.assignee?.email, "");
  });

  it("attaches the reassign receiver for transfers", () => {
    const [asset] = buildOffboardAssets(
      [
        reviewEmployee({
          devices: [
            device({
              disposition: "REASSIGN",
              reassignTarget: {
                id: "emp-9",
                name: "Russel Hahn",
                country: "Nigeria",
              },
            }),
          ],
        }),
      ],
      [],
    );

    assert.equal(asset.actionType, "Transfer");
    assert.equal(asset.receiver?.id, "emp-9");
  });
});
