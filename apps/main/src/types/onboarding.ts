export type EmployeeCount =
  | "1-50"
  | "51-200"
  | "201-500"
  | "500-1000"
  | "1000+";

export type WorkSetup =
  | "single_office"
  | "multi_office"
  | "fully_remote"
  | "hybrid";

export type SignupPersona = "it_admin" | "hr_ops" | "finance_ops" | "founder";

export type ItSupportStructure = "dedicated_team" | "one_person" | "ad_hoc";

export type DevicePolicy = "byod" | "company_issued" | "both";

export type IntendedMdm =
  | "jamf"
  | "intune"
  | "kandji"
  | "other"
  | "none"
  | "not_sure";

export type LaptopPlatform = "macbooks" | "windows" | "both";

export type ComplianceRequirement =
  | "soc2"
  | "iso27001"
  | "hipaa"
  | "gdpr"
  | "cyber_essentials"
  | "none"
  | "exploring";

export type PlanSlug = "procure" | "manage" | "operate" | "scale";

export interface IOnboardingAbout {
  employee_count: EmployeeCount | null;
  work_setup: WorkSetup | null;
  signup_persona: SignupPersona | null;
  industry: string | null;
}

export interface IOnboardingItSetup {
  it_support_structure: ItSupportStructure | null;
  device_policy: DevicePolicy | null;
  intended_mdm: IntendedMdm | null;
  device_count: number | null;
}

export interface IOnboardingHardwareCompliance {
  laptop_platform: LaptopPlatform | null;
  compliance_requirements: ComplianceRequirement[];
}

export interface IOnboardingCompanyDetails {
  name: string | null;
  trading_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  billing_currency: string | null;
  industry: string | null;
}

export interface IOnboardingProgress {
  step: number;
  completed_steps: number[];
  onboarding_completed: boolean;
  agreement_signed: boolean;
  is_primary: boolean;
  about: IOnboardingAbout;
  it_setup: IOnboardingItSetup;
  hardware_compliance: IOnboardingHardwareCompliance;
  company_details: IOnboardingCompanyDetails;
  plan: { plan_slug: PlanSlug | null } | null;
  requires_payment?: boolean;
  plan_slug?: PlanSlug;
}

export interface IOnboardingAboutRequest {
  employee_count: EmployeeCount;
  work_setup: WorkSetup;
  signup_persona: SignupPersona;
  industry?: string;
}

export interface IOnboardingItSetupRequest {
  it_support_structure: ItSupportStructure;
  device_policy: DevicePolicy;
  intended_mdm: IntendedMdm;
  device_count: number;
}

export interface IOnboardingHardwareComplianceRequest {
  laptop_platform: LaptopPlatform;
  compliance_requirements: ComplianceRequirement[];
}

export interface IOnboardingCompanyDetailsRequest {
  name: string;
  trading_name?: string;
  address: string;
  city?: string;
  state?: string;
  country: string;
  billing_currency: string;
  industry?: string;
}
