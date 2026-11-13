import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { OrderMessage } from "@/types/orderMessage";
import { isAdminSender, mapMessages } from "./mapMessages";

const base = (over: Partial<OrderMessage>): OrderMessage => ({
  id: "m1",
  body: "hello",
  created_at: "2026-07-21T10:00:00Z",
  ...over,
});

describe("mapMessages", () => {
  it("maps Admin senders to the rayda (incoming) side as Rayda Operations", () => {
    const [msg] = mapMessages([
      base({ sender: { type: "Admin", name: "Joe Andy" } }),
    ]);
    assert.equal(msg.sender, "rayda");
    assert.equal(msg.senderName, "Rayda Operations");
  });

  it("maps User senders to the customer (outgoing) side with their name", () => {
    const [msg] = mapMessages([
      base({ sender: { type: "User", name: "Jane Doe" } }),
    ]);
    assert.equal(msg.sender, "customer");
    assert.equal(msg.senderName, "Jane Doe");
  });

  it("falls back to a default name when sender name is missing", () => {
    const [admin] = mapMessages([base({ sender: { type: "Admin" } })]);
    const [company] = mapMessages([base({ sender: { type: "User" } })]);
    assert.equal(admin.senderName, "Rayda Operations");
    assert.equal(company.senderName, "You");
  });

  it("splits attachments into files and links", () => {
    const [msg] = mapMessages([
      base({
        attachments: [
          {
            id: "a1",
            type: "file",
            url: "https://cdn/x.pdf",
            title: "x.pdf",
            mime_type: "application/pdf",
            size: 2048,
          },
          {
            id: "a2",
            type: "link",
            url: "https://rayda.co",
            title: "Rayda",
          },
        ],
      }),
    ]);
    assert.equal(msg.files?.length, 1);
    assert.equal(msg.files?.[0].ext, "PDF");
    assert.equal(msg.files?.[0].url, "https://cdn/x.pdf");
    assert.equal(msg.files?.[0].size, "2.0 KB");
    assert.equal(msg.links?.length, 1);
    assert.equal(msg.links?.[0].url, "https://rayda.co");
  });

  it("detects image attachments from the mime type", () => {
    const [msg] = mapMessages([
      base({
        attachments: [
          {
            id: "a1",
            type: "file",
            url: "https://cdn/p.png",
            title: "p.png",
            mime_type: "image/png",
          },
        ],
      }),
    ]);
    assert.equal(msg.files?.[0].isImage, true);
  });

  it("maps a quoted message into replyTo", () => {
    const [msg] = mapMessages([
      base({
        quoted_message: {
          id: "q1",
          body: "original",
          sender: { name: "Rayda Operations" },
        },
      }),
    ]);
    assert.equal(msg.replyTo?.id, "q1");
    assert.equal(msg.replyTo?.senderName, "Rayda Operations");
    assert.equal(msg.replyTo?.message, "original");
  });

  it("flags optimistic messages by id prefix", () => {
    const [msg] = mapMessages([base({ id: "optimistic-1720000000000" })]);
    assert.equal(msg.isOptimistic, true);
  });

  it("sorts messages chronologically", () => {
    const mapped = mapMessages([
      base({ id: "b", created_at: "2026-07-21T12:00:00Z" }),
      base({ id: "a", created_at: "2026-07-21T09:00:00Z" }),
    ]);
    assert.deepEqual(
      mapped.map((m) => m.id),
      ["a", "b"],
    );
  });
});

describe("isAdminSender", () => {
  it("is true only for admin senders (case-insensitive)", () => {
    assert.equal(isAdminSender({ type: "Admin" }), true);
    assert.equal(isAdminSender({ type: "AdminUser" }), true);
    assert.equal(isAdminSender({ type: "User" }), false);
    assert.equal(isAdminSender(undefined), false);
  });
});
