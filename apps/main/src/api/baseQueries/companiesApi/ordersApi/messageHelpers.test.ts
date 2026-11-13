import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

import type { OrderMessage, OrderMessagesPage } from "@/types/orderMessage";
import {
  buildMessageFormData,
  buildOptimisticMessage,
  quotedFrom,
  unwrapMessagesPage,
} from "./messageHelpers";

describe("buildMessageFormData", () => {
  it("appends body, quote id, attachments and links", () => {
    const file = new File(["data"], "spec.pdf", { type: "application/pdf" });
    const fd = buildMessageFormData({
      body: "hi",
      quoted_message_id: "q1",
      attachments: [file],
      links: [{ url: "https://rayda.co", title: "Rayda" }],
    });
    assert.equal(fd.get("body"), "hi");
    assert.equal(fd.get("quoted_message_id"), "q1");
    assert.equal((fd.get("attachments[]") as File).name, "spec.pdf");
    assert.equal(fd.get("links[0][url]"), "https://rayda.co");
    assert.equal(fd.get("links[0][title]"), "Rayda");
  });

  it("omits empty optional fields", () => {
    const fd = buildMessageFormData({ body: "only text" });
    assert.equal(fd.get("body"), "only text");
    assert.equal(fd.get("quoted_message_id"), null);
    assert.equal(fd.get("attachments[]"), null);
  });
});

describe("quotedFrom", () => {
  const messages: OrderMessage[] = [
    { id: "m1", body: "first", created_at: "", sender: { name: "A" } },
  ];

  it("returns a quote reference when the source exists", () => {
    const quote = quotedFrom(messages, "m1");
    assert.equal(quote?.id, "m1");
    assert.equal(quote?.body, "first");
  });

  it("returns null for unknown or missing ids", () => {
    assert.equal(quotedFrom(messages, "nope"), null);
    assert.equal(quotedFrom(messages, undefined), null);
  });
});

describe("buildOptimisticMessage", () => {
  it("builds a company-owned message with object-url attachments", () => {
    mock.method(URL, "createObjectURL", () => "blob:preview");
    const objectUrls: string[] = [];
    const file = new File(["x"], "img.png", { type: "image/png" });
    const msg = buildOptimisticMessage(
      { body: "text", attachments: [file] },
      null,
      objectUrls,
    );
    assert.ok(msg.id.startsWith("optimistic-"));
    assert.equal(msg.sender?.type, "User");
    assert.equal(msg.body, "text");
    assert.equal(msg.attachments?.[0].url, "blob:preview");
    assert.equal(msg.attachments?.[0].mime_type, "image/png");
    assert.deepEqual(objectUrls, ["blob:preview"]);
    mock.restoreAll();
  });
});

describe("unwrapMessagesPage", () => {
  it("unwraps a ServerResponse envelope", () => {
    const page: OrderMessagesPage = {
      data: [{ id: "m1", created_at: "" }],
      thread_state: { unread_count: 2 },
    };
    const result = unwrapMessagesPage({
      success: true,
      message: "ok",
      data: page,
    });
    assert.equal(result.data.length, 1);
    assert.equal(result.thread_state?.unread_count, 2);
  });

  it("accepts an already-unwrapped page", () => {
    const result = unwrapMessagesPage({
      data: [{ id: "m1", created_at: "" }],
    });
    assert.equal(result.data.length, 1);
  });

  it("defaults to an empty list when data is absent", () => {
    const result = unwrapMessagesPage({} as OrderMessagesPage);
    assert.deepEqual(result.data, []);
  });
});
