import {
  BarChart3,
  CheckCircle2,
  DollarSign,
  Laptop,
  Settings,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SidePanelHighlight = { icon: LucideIcon; text: string };
export type SidePanelStepContent = {
  badge: string;
  heading: string;
  sub: string;
  highlights: SidePanelHighlight[];
};

export const SETUP_SIDE_PANEL_CONTENT: SidePanelStepContent[] = [
  {
    badge: "Getting started",
    heading: "Tell us about\nyour company",
    sub: "We'll use this to personalise your workspace and streamline your experience on the platform.",
    highlights: [
      { icon: BarChart3, text: "Full asset visibility from day one" },
      { icon: Users, text: "Automated new hire provisioning" },
      { icon: Shield, text: "Compliance dashboards built-in" },
      { icon: Zap, text: "AI resolves tickets before you see them" },
      { icon: DollarSign, text: "Track depreciation & cut hardware spend" },
    ],
  },
  {
    badge: "IT configuration",
    heading: "Configure your\nIT environment",
    sub: "We'll auto-configure asset tracking, device policies, and MDM sync to your exact setup.",
    highlights: [
      { icon: Settings, text: "Automatic MDM integration" },
      { icon: Laptop, text: "Device policy rules applied instantly" },
      { icon: Shield, text: "Compliance checks tailored to your stack" },
      { icon: Zap, text: "Skip manual setup — we detect your tools" },
    ],
  },
  {
    badge: "Hardware & compliance",
    heading: "Protect your\nhardware investments",
    sub: "Your requirements inform every recommendation your AI Teammate makes from day one.",
    highlights: [
      { icon: Shield, text: "Compliance-ready from day one" },
      { icon: Laptop, text: "Smart procurement for your device stack" },
      { icon: DollarSign, text: "Depreciation tracking built-in" },
      { icon: Zap, text: "AI flags compliance gaps automatically" },
    ],
  },
  {
    badge: "Company details",
    heading: "Tell us about\nyour business",
    sub: "This helps us personalize your workspace.",
    highlights: [
      { icon: Settings, text: "Personalized workspace configuration" },
      { icon: Users, text: "Tailored vendor recommendations" },
      { icon: Zap, text: "Faster onboarding for your team" },
    ],
  },
  {
    badge: "Almost there",
    heading: "Pick a plan,\nstart shipping",
    sub: "Upgrade, downgrade, or cancel anytime — no lock-in, no surprises.",
    highlights: [
      { icon: CheckCircle2, text: "Start free on Procure — no card required" },
      { icon: Shield, text: "SOC 2 & ISO 27001 compliance engine" },
      { icon: Users, text: "Unlimited admin users on every plan" },
      { icon: Zap, text: "Telemetry agent on every paid plan" },
    ],
  },
];
