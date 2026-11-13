import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import { ISubOrder } from "@/types/orders";
import { collectSubOrderNoteGroups } from "./orderNotes";

const sub = (overrides: Partial<ISubOrder>): ISubOrder =>
  ({ id: "sub-1", ...overrides }) as ISubOrder;

describe("collectSubOrderNoteGroups", () => {
  it("keeps item notes and skips empty groups", () => {
    const groups = collectSubOrderNoteGroups([
      sub({
        id: "with-notes",
        tracking_no: "BTS-E2JSE26",
        equipment: { title: "Creter" } as ISubOrder["equipment"],
        note: [
          {
            author: " ",
            note: "I need to verify this by my team",
            date_added: "2026-09-25 09:59:27",
          },
        ],
      }),
      sub({
        id: "empty",
        note: [],
        equipment: { notes: "[]" } as ISubOrder["equipment"],
      }),
    ]);

    assert.equal(groups.length, 1);
    assert.equal(groups[0]?.label, "Creter · BTS-E2JSE26");
    assert.equal(groups[0]?.notes[0]?.author, "System");
    assert.equal(groups[0]?.notes[0]?.body, "I need to verify this by my team");
  });

  it("includes an employee note string", () => {
    const groups = collectSubOrderNoteGroups([
      sub({
        id: "employee",
        employee_note: "Leave at reception",
      }),
    ]);

    assert.equal(groups[0]?.notes[0]?.author, "Employee");
    assert.equal(groups[0]?.notes[0]?.body, "Leave at reception");
  });
});

describe("order detail note wiring", () => {
  it("renders collected notes on storage details and employee slideouts", () => {
    const card = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Orders/ViewOrder/v2/StorageDestinationCardV2.tsx",
      ),
      "utf8",
    );
    const slideout = readFileSync(
      join(
        process.cwd(),
        "src/components/Drawers/IndividualEmployee/ReferenceEmployeeSlideout.tsx",
      ),
      "utf8",
    );

    assert.match(card, /OrderNotesSection/);
    assert.match(card, /listClassName="max-h-96"/);
    assert.match(card, /collectSubOrderNoteGroups/);
    assert.match(card, /summary\.duration/);
    assert.match(slideout, /OrderNotesSection/);
    assert.match(slideout, /collectSubOrderNoteGroups/);
  });
});
