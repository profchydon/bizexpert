import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { getLocalTimeZone, today } from "@internationalized/date";
import {
  isRequestCheckNeededByUnavailable,
  requestCheckMinNeededByDate,
} from "./requestCheckNeededByDate.ts";

describe("requestCheckNeededByDate", () => {
  it("starts on the next weekday after today", () => {
    const min = requestCheckMinNeededByDate();
    const now = today(getLocalTimeZone());
    const weekday = min.toDate(getLocalTimeZone()).getDay();

    assert.ok(min.compare(now) >= 1);
    assert.equal(isRequestCheckNeededByUnavailable(now), true);
    assert.equal(isRequestCheckNeededByUnavailable(min), false);
    assert.notEqual(weekday, 0);
    assert.notEqual(weekday, 6);
  });

  it("blocks weekends and allows weekdays after today", () => {
    const start = today(getLocalTimeZone()).add({ days: 1 });
    const weekdayOf = (date: ReturnType<typeof today>) =>
      date.toDate(getLocalTimeZone()).getDay();

    let saturday = start;
    while (weekdayOf(saturday) !== 6) {
      saturday = saturday.add({ days: 1 });
    }
    let sunday = start;
    while (weekdayOf(sunday) !== 0) {
      sunday = sunday.add({ days: 1 });
    }
    let monday = start;
    while (weekdayOf(monday) !== 1) {
      monday = monday.add({ days: 1 });
    }

    assert.equal(isRequestCheckNeededByUnavailable(saturday), true);
    assert.equal(isRequestCheckNeededByUnavailable(sunday), true);
    assert.equal(isRequestCheckNeededByUnavailable(monday), false);
  });
});

describe("RequestCheckModal needed-by picker", () => {
  it("passes the weekday-after-today rules into DatePicker", () => {
    const modal = readFileSync(
      "src/container/Dashboard/Storage/Remote/components/check/RequestCheckModal.tsx",
      "utf8",
    );

    assert.match(modal, /requestCheckMinNeededByDate/);
    assert.match(modal, /isRequestCheckNeededByUnavailable/);
    assert.match(modal, /minValue=\{requestCheckMinNeededByDate\(\)\}/);
    assert.match(
      modal,
      /isDateUnavailable=\{isRequestCheckNeededByUnavailable\}/,
    );
    assert.doesNotMatch(modal, /minValue=\{today\(/);
  });
});
