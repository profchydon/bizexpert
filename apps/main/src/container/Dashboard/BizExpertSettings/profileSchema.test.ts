import assert from "node:assert/strict";
import { test } from "node:test";
import type { User } from "@/types/bizexpert";
import {
  profileFormSchema,
  toProfilePayload,
  toPublicUser,
  valuesFromUser,
} from "./profileSchema";

const user: User = {
  id: "u1",
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "+2348012345678",
  isActive: true,
};

test("valuesFromUser maps name and phone", () => {
  const values = valuesFromUser(user);
  assert.equal(values.name, "Ada Lovelace");
  assert.equal(values.phone, "+2348012345678");
});

test("toProfilePayload trims name and phone", () => {
  const payload = toProfilePayload({ name: "  Ada  ", phone: "  +234  " });
  assert.deepEqual(payload, { name: "Ada", phone: "+234" });
});

test("toPublicUser drops extra fields", () => {
  const next = toPublicUser({
    ...user,
    phone: null,
  });
  assert.equal(next.phone, undefined);
  assert.equal(next.email, "ada@example.com");
});

test("profileFormSchema requires a name", () => {
  const parsed = profileFormSchema.safeParse({ name: "   ", phone: "" });
  assert.equal(parsed.success, false);
});
