import type { QuestionDefinition } from "../lib/types";

export const STEP_0_QUESTIONS: QuestionDefinition[] = [
  {
    key: "employee_count",
    question: "How many employees are in your organization?",
    options: [
      { value: "1-50", label: "1–50" },
      { value: "51-200", label: "51–200" },
      { value: "201-500", label: "201–500" },
      { value: "500-1000", label: "500–1,000" },
      { value: "1000+", label: "1,000+" },
    ],
    multiSelect: false,
  },
  {
    key: "work_setup",
    question: "How is your team set up?",
    options: [
      { value: "single_office", label: "Single office" },
      { value: "multi_office", label: "Multi-office" },
      { value: "fully_remote", label: "Fully remote" },
      { value: "hybrid", label: "Hybrid" },
    ],
    multiSelect: false,
  },
  {
    key: "signup_persona",
    question: "What best describes your role?",
    options: [
      { value: "it_admin", label: "IT Admin/Manager" },
      { value: "hr_ops", label: "HR/People Ops" },
      { value: "finance_ops", label: "Finance/Operations" },
      { value: "founder", label: "Founder wearing multiple hats" },
    ],
    multiSelect: false,
  },
];

export const STEP_1_QUESTIONS: QuestionDefinition[] = [
  {
    key: "it_support_structure",
    question: "Do you have a dedicated IT person or team?",
    options: [
      { value: "dedicated_team", label: "Yes, dedicated IT team" },
      { value: "one_person", label: "Yes, one IT person" },
      { value: "ad_hoc", label: "No, IT is handled ad hoc" },
    ],
    multiSelect: false,
  },
  {
    key: "device_policy",
    question: "What is your device policy?",
    options: [
      { value: "byod", label: "BYOD (Bring Your Own Device)" },
      { value: "company_issued", label: "Company-issued" },
      { value: "both", label: "Both" },
    ],
    multiSelect: false,
  },
  {
    key: "intended_mdm",
    question: "Do you use an MDM (Mobile Device Manager)?",
    options: [
      { value: "jamf", label: "Yes — Jamf" },
      { value: "intune", label: "Yes — Intune" },
      { value: "kandji", label: "Yes — Kandji" },
      { value: "other", label: "Yes — Other" },
      { value: "none", label: "No" },
      { value: "not_sure", label: "Not sure" },
    ],
    multiSelect: false,
  },
  {
    key: "device_count",
    question: "How many devices do you plan to enrol on Rayda?",
    options: [],
    multiSelect: false,
    kind: "count",
  },
];

export const STEP_2_QUESTIONS: QuestionDefinition[] = [
  {
    key: "laptop_platform",
    question: "What laptops does your company issue?",
    options: [
      { value: "macbooks", label: "MacBooks" },
      { value: "windows", label: "Windows (HP, Dell, Lenovo…)" },
      { value: "both", label: "Both" },
    ],
    multiSelect: false,
  },
  {
    key: "compliance_requirements",
    question: "Do you have any compliance requirements?",
    options: [
      { value: "soc2", label: "SOC 2" },
      { value: "iso27001", label: "ISO 27001" },
      { value: "hipaa", label: "HIPAA" },
      { value: "gdpr", label: "GDPR" },
      { value: "cyber_essentials", label: "Cyber Essentials" },
      { value: "none", label: "None" },
      { value: "exploring", label: "Exploring" },
    ],
    multiSelect: true,
    exclusiveOptions: ["none", "exploring"],
  },
];

export const ALL_QUESTION_STEPS = [
  STEP_0_QUESTIONS,
  STEP_1_QUESTIONS,
  STEP_2_QUESTIONS,
];
