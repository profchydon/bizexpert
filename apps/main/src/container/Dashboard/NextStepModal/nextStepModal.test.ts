import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const read = (file: string) =>
  readFileSync(
    join(process.cwd(), "src/container/Dashboard/NextStepModal", file),
    "utf8",
  );

describe("NextStepModal setup step", () => {
  it("renders the heading and subtext without a step counter", () => {
    const header = read("ModalHeader.tsx");

    assert.match(header, /Add your employees to get started/);
    assert.match(header, /Choose how you&apos;d like to bring your team into/);
    assert.match(header, /border-b border-secondary px-6 py-5/);
    assert.match(header, /CloseButton size="sm" onPress=\{onSkip\}/);
    assert.doesNotMatch(header, /Step \d? ?of/);
    assert.doesNotMatch(header, /uppercase/);
  });

  it("renders no progress bar", () => {
    const modal = read("index.tsx");

    assert.doesNotMatch(modal, /ProgressBar/);
    assert.throws(() => read("ProgressBar.tsx"), /ENOENT/);
  });

  it("keeps the option card selected and unselected styling", () => {
    const card = read("EmployeeOptionCard.tsx");

    assert.match(
      card,
      /flex cursor-pointer items-center gap-4 rounded-xl border px-4 py-3 text-left transition duration-100/,
    );
    assert.match(card, /border-brand-600 bg-brand-50 ring-1 ring-brand-600/);
    assert.match(
      card,
      /border-secondary bg-primary hover:border-brand-300 hover:bg-brand-25/,
    );
    assert.match(card, /h-9 w-9 shrink-0 items-center justify-center/);
    assert.match(
      card,
      /rounded-full bg-brand-100 px-2 py-0\.5 text-\[10px\] font-semibold text-brand-700/,
    );
  });
});

describe("NextStepModal options", () => {
  it("offers HRIS, CSV and manual mapped to add-employee tabs", () => {
    const options = read("employeeImportOptions.ts");

    assert.match(options, /title: "Connect HRIS"[\s\S]*tab: "hris"/);
    assert.match(options, /title: "Upload Employee CSV"[\s\S]*tab: "import"/);
    assert.match(options, /title: "Add employee manually"[\s\S]*tab: "add"/);
    assert.match(options, /recommended: true/);
  });

  it("gates Get started on a selection and hands the tab back", () => {
    const modal = read("index.tsx");

    assert.match(modal, /w-full rounded-2xl bg-primary shadow-2xl/);
    assert.match(modal, /isDisabled=\{!importMethod\}/);
    assert.match(modal, /onComplete\(selected\.tab\)/);
    assert.match(modal, /Skip for now/);
    assert.match(modal, /Get started/);
    assert.doesNotMatch(modal, /What do you want to do/);
  });

  it("uses the shared ModalOverlay so it traps focus and closes on escape", () => {
    const modal = read("index.tsx");

    assert.match(
      modal,
      /import \{[\s\S]*Dialog,[\s\S]*Modal,[\s\S]*ModalOverlay,[\s\S]*\} from "@\/components\/application\/modals\/modal"/,
    );
    assert.match(modal, /isOpen=\{isOpen\}/);
    assert.match(
      modal,
      /onOpenChange=\{\(open\) => !open && handleClose\(\)\}/,
    );
    assert.match(modal, /isDismissable/);
    assert.match(modal, /<Modal className="max-w-lg">/);
    assert.match(modal, /aria-label="Add your employees to get started"/);
    assert.match(
      modal,
      /items-center justify-center bg-black\/40 p-4 backdrop-blur-sm/,
    );
    assert.doesNotMatch(modal, /fixed inset-0 z-40/);
  });

  it("clears the selection when the modal is dismissed", () => {
    const modal = read("index.tsx");

    assert.match(
      modal,
      /const handleClose = \(\) => \{\s*setImportMethod\(""\)/,
    );
  });
});

describe("Overview wiring", () => {
  it("opens the AddEmployees slideout on the chosen tab", () => {
    const overview = readFileSync(
      join(process.cwd(), "src/container/Dashboard/Overview/index.tsx"),
      "utf8",
    );

    assert.match(
      overview,
      /const handleSetupComplete = \(tab: EmployeeAddTab\)/,
    );
    assert.match(overview, /setAddEmployeesTab\(tab\)/);
    assert.match(overview, /onComplete=\{handleSetupComplete\}/);
    assert.match(overview, /initialTab=\{addEmployeesTab\}/);
  });
});
