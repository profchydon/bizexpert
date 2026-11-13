import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("EditProfileSlideout", () => {
  it("uses design-ui SlideoutMenu shell and base form components", () => {
    const slideout = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Employees/EmployeeDetails/EditProfileSlideout.tsx",
      ),
      "utf8",
    );
    const form = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Employees/EmployeeDetails/EditEmployeeIdentityFields.tsx",
      ),
      "utf8",
    );

    assert.match(slideout, /SlideoutMenu/);
    assert.match(slideout, /resizeOptions=\{EDIT_PROFILE_SLIDEOUT_RESIZE\}/);
    assert.match(slideout, /font-bold text-primary/);
    assert.match(slideout, /h-px w-full shrink-0 bg-border-secondary/);
    assert.match(slideout, /border-t border-secondary px-6 py-4/);
    assert.doesNotMatch(slideout, /SlideoutMenu\.Header/);
    assert.match(
      readFileSync(
        join(
          process.cwd(),
          "src/container/Dashboard/Employees/EmployeeDetails/employeeDetailSlideoutResize.ts",
        ),
        "utf8",
      ),
      /initial: 880/,
    );
    assert.match(slideout, /Edit profile/);
    assert.match(slideout, /Save changes/);
    assert.doesNotMatch(slideout, /DrawerRight/);
    assert.doesNotMatch(slideout, /EditEmployeeDrawer/);
    assert.match(form, /@\/components\/base\/input\/input/);
    assert.match(
      readFileSync(
        join(
          process.cwd(),
          "src/container/Dashboard/Employees/EmployeeDetails/EditEmployeeIdentityFields.tsx",
        ),
        "utf8",
      ),
      /PhoneCountrySelect|EditEmployeePhoneField/,
    );
    assert.match(
      readFileSync(
        join(
          process.cwd(),
          "src/container/Dashboard/Employees/EmployeeDetails/EditEmployeeRoleFields.tsx",
        ),
        "utf8",
      ),
      /Department[\s\S]*country_id/s,
    );
    assert.match(
      readFileSync(
        join(
          process.cwd(),
          "src/container/Dashboard/Employees/EmployeeDetails/EditEmployeeLocationFields.tsx",
        ),
        "utf8",
      ),
      /AddressAutocomplete/,
    );
    assert.match(
      readFileSync(
        join(
          process.cwd(),
          "src/container/Dashboard/Employees/EmployeeDetails/EditEmployeeLocationFields.tsx",
        ),
        "utf8",
      ),
      /freeTextAddress \?/,
    );
    assert.doesNotMatch(slideout, /freeTextAddress/);
  });
});

describe("buildEditEmployeeFormData", () => {
  it("maps employee API fields into the edit form", async () => {
    const { buildEditEmployeeFormData } =
      await import("./buildEditEmployeeFormData.ts");

    const values = buildEditEmployeeFormData(
      {
        first_name: "Jane",
        last_name: "Doe",
        email: "jane@co.com",
        personal_email: "jane@personal.com",
        phone: "+123",
        job_title: "Engineer",
        manager_id: "mgr-1",
        employment_type: "Full_Time",
        level: "lvl-1",
        level_position: { id: "lvl-1", name: "Senior" },
        department_id: "dept-1",
        departments: [{ id: "dept-1", name: "Engineering" }],
        country: "United Kingdom",
        address: "1 High St",
        landmark: "Near park",
        tax_number: "TAX-1",
      } as never,
      "United Kingdom",
    );

    assert.equal(values.first_name, "Jane");
    assert.equal(values.email, "jane@co.com");
    assert.equal(values.department_id, "dept-1");
    assert.equal(values.level, "lvl-1");
    assert.equal(values.country_id, "United Kingdom");
    assert.equal(values.landmark, "Near park");
  });
});
