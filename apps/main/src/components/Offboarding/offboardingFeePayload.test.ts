import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { transformDataForOffboardingFee } from "./util";

const group = (assigneeId: string, assets: any[]) => ({
  assignee: { id: assigneeId },
  assets,
});

const asset = (overrides: Record<string, any> = {}) => ({
  id: "eq-1",
  actionType: "Store",
  ...overrides,
});

describe("transformDataForOffboardingFee", () => {
  it("maps each disposition to the right flag", () => {
    const output = transformDataForOffboardingFee([
      group("emp-1", [
        asset({ id: "eq-1", actionType: "Store" }),
        asset({ id: "eq-2", actionType: "Transfer" }),
        asset({ id: "eq-3", actionType: "Archive" }),
      ]),
    ]);

    const equipment = output["emp-1"].equipment;
    assert.equal(equipment[0].storage, true);
    assert.equal(equipment[1].reassign, true);
    assert.equal(equipment[2].dispose, true);
  });

  it("sends dispose (not archive) for archived devices", () => {
    const output = transformDataForOffboardingFee([
      group("emp-1", [asset({ id: "eq-9", actionType: "Archive" })]),
    ]);

    const [equipment] = output["emp-1"].equipment;
    assert.equal(equipment.dispose, true);
    assert.equal(equipment.archive, undefined);
  });

  it("adds factory_reset alongside the disposition flag", () => {
    const output = transformDataForOffboardingFee([
      group("emp-1", [
        asset({ id: "eq-7", actionType: "Store", factoryReset: true }),
      ]),
    ]);

    const [equipment] = output["emp-1"].equipment;
    assert.equal(equipment.storage, true);
    assert.equal(equipment.factory_reset, true);
  });

  it("omits factory_reset when the device is not reset", () => {
    const output = transformDataForOffboardingFee([
      group("emp-1", [
        asset({ id: "eq-1", actionType: "Store", factoryReset: false }),
      ]),
    ]);

    const [equipment] = output["emp-1"].equipment;
    assert.equal(equipment.factory_reset, undefined);
  });

  it("groups equipment under each assignee id", () => {
    const output = transformDataForOffboardingFee([
      group("emp-1", [asset({ id: "eq-1" })]),
      group("emp-2", [asset({ id: "eq-2", actionType: "Transfer" })]),
    ]);

    assert.equal(output["emp-1"].equipment.length, 1);
    assert.equal(output["emp-2"].equipment[0].reassign, true);
  });
});
