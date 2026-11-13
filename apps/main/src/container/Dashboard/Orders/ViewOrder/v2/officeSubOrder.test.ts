import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import { ISubOrder } from "@/types/orders";
import { buildSlideoutData } from "@/components/Drawers/IndividualEmployee/slideoutData";
import { verificationStepsFor } from "@/components/Drawers/IndividualEmployee/ReferenceVerificationProgress";
import {
  isOfficeSubOrder,
  subOrderEmployeeName,
  subOrderRecipientNoun,
  subOrderRecipientSubtitle,
} from "./subOrderIdentity";
import { buildRowValues } from "./table/orderInfoRowValues";

const officeRow = {
  id: "ao-1",
  employee_id: null,
  employee_first_name: "Admin Chidi",
  employee_last_name: null,
  job_title: null,
  address: "1 Adeola Odeku Street, Victoria Island, Lagos",
  status: "verification_pending",
  recipient_type: "office",
  office_id: "office-1",
  office_name: "Lagos HQ",
  office_address: "1 Adeola Odeku Street, Victoria Island, Lagos",
  contact_name: "Admin Chidi",
  contact_email: "admin@rayda.co",
  total_amount: 3866,
  assets: [{ id: "a1", name: "MacBook Pro", signature_requested: false }],
} as unknown as ISubOrder;

const employeeRow = {
  id: "ao-2",
  employee_id: "user-1",
  employee_first_name: "Emily",
  employee_last_name: "Clarke",
  job_title: "Designer",
  address: "44 Brick Lane",
  status: "in_progress",
  recipient_type: "employee",
  assets: [],
} as unknown as ISubOrder;

describe("office sub-order identity", () => {
  it("detects office rows by recipient type or office id", () => {
    assert.equal(isOfficeSubOrder(officeRow), true);
    assert.equal(
      isOfficeSubOrder({ office_id: "office-1" } as unknown as ISubOrder),
      true,
    );
    assert.equal(isOfficeSubOrder(employeeRow), false);
    assert.equal(isOfficeSubOrder(undefined), false);
  });

  it("names the office, not the contact", () => {
    assert.equal(subOrderEmployeeName(officeRow), "Lagos HQ");
    assert.equal(
      subOrderEmployeeName({
        ...officeRow,
        office_name: null,
      } as unknown as ISubOrder),
      "Office",
    );
    assert.equal(subOrderEmployeeName(employeeRow), "Emily Clarke");
  });

  it("subtitles an office with its contact and an employee with the role", () => {
    assert.equal(subOrderRecipientSubtitle(officeRow), "Contact: Admin Chidi");
    assert.equal(
      subOrderRecipientSubtitle({
        ...officeRow,
        contact_name: "  ",
      } as unknown as ISubOrder),
      "",
    );
    assert.equal(subOrderRecipientSubtitle(employeeRow), "Designer");
  });

  it("says recipients only when an office is in the order", () => {
    assert.equal(subOrderRecipientNoun([employeeRow], 1), "Employee");
    assert.equal(
      subOrderRecipientNoun([employeeRow, employeeRow], 2),
      "Employees",
    );
    assert.equal(subOrderRecipientNoun([officeRow], 1), "Recipient");
    assert.equal(
      subOrderRecipientNoun([employeeRow, officeRow], 2),
      "Recipients",
    );
  });
});

describe("office rows in the order information table", () => {
  it("builds the office name, contact line and office address", () => {
    const values = buildRowValues(officeRow, "onboarding", "$");
    assert.equal(values.isOffice, true);
    assert.equal(values.name, "Lagos HQ");
    assert.equal(values.role, "Contact: Admin Chidi");
    assert.equal(
      values.address,
      "1 Adeola Odeku Street, Victoria Island, Lagos",
    );
  });

  it("falls back to the office address when the delivery address is empty", () => {
    const values = buildRowValues(
      { ...officeRow, address: "" } as unknown as ISubOrder,
      "onboarding",
      "$",
    );
    assert.equal(
      values.address,
      "1 Adeola Odeku Street, Victoria Island, Lagos",
    );
  });

  it("keeps employee rows unchanged", () => {
    const values = buildRowValues(employeeRow, "onboarding", "$");
    assert.equal(values.isOffice, false);
    assert.equal(values.initials, "EC");
    assert.equal(values.role, "Designer");
  });

  it("renders a building icon instead of initials for office rows", () => {
    const source = readFileSync(
      path.join(__dirname, "table/OrderInfoRowV2.tsx"),
      "utf8",
    );
    assert.match(source, /values\.isOffice \? \(\s*<Building02/);
  });

  it("labels the count badge with the recipient noun", () => {
    const table = readFileSync(
      path.join(__dirname, "table/OrderInfoTableV2.tsx"),
      "utf8",
    );
    assert.match(
      table,
      /recipientNoun=\{subOrderRecipientNoun\(orders, orders\.length\)\}/,
    );
  });
});

describe("office sub-order slideout", () => {
  it("names the office with the contact line and contact email", () => {
    const data = buildSlideoutData(officeRow, "onboarding", "$");
    assert.equal(data.isOffice, true);
    assert.equal(data.name, "Lagos HQ");
    assert.equal(data.contactLine, "Contact: Admin Chidi");
    assert.equal(data.email, "admin@rayda.co");
    assert.equal(data.address, "1 Adeola Odeku Street, Victoria Island, Lagos");
  });

  it("leaves employee slideouts without a contact line", () => {
    const data = buildSlideoutData(employeeRow, "onboarding", "$");
    assert.equal(data.isOffice, false);
    assert.equal(data.contactLine, "");
    assert.equal(data.name, "Emily Clarke");
  });

  it("uses office copy for verification steps", () => {
    const office = verificationStepsFor(false, true);
    assert.equal(
      office[1].desc,
      "Contact confirmed the office address & phone",
    );
    assert.equal(
      verificationStepsFor(false, false)[1].desc,
      "Employee verified address and phone",
    );
    assert.equal(
      verificationStepsFor(true, true)[0].label,
      "Retrieval scheduled",
    );
  });
});
