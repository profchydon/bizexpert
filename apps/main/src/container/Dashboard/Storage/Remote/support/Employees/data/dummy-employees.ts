import { makePhoneFromId } from "../utils/employee-phone";
import { DUMMY_EMPLOYEES_1 } from "./dummy-employees-1";
import { DUMMY_EMPLOYEES_2 } from "./dummy-employees-2";
import { DUMMY_EMPLOYEES_3 } from "./dummy-employees-3";

export const DUMMY_EMPLOYEES = [
  ...DUMMY_EMPLOYEES_1,
  ...DUMMY_EMPLOYEES_2,
  ...DUMMY_EMPLOYEES_3,
].map((e) => ({
  ...e,
  phone: makePhoneFromId(e.id),
}));

export type Employee = (typeof DUMMY_EMPLOYEES)[number];
