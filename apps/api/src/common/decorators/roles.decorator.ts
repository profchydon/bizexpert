import { SetMetadata } from "@nestjs/common";
import { BusinessRole } from "../enums";

export { BusinessRole as Role } from "../enums";

export const ROLES_KEY = "roles";

export const Roles = (...roles: BusinessRole[]) =>
  SetMetadata(ROLES_KEY, roles);
