import Image from "next/image";
import { logo } from "@/assets/images";
import { SETUP_SIDE_PANEL_CONTENT } from "../../data/sidePanelContent";

export function SetupSidePanel({ step }: { step: number }) {
  const content = SETUP_SIDE_PANEL_CONTENT[step] ?? SETUP_SIDE_PANEL_CONTENT[0];

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-gray-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-[400px] w-[400px] rounded-full bg-primary-600/15 blur-[100px]" />
        <div className="absolute -right-16 -bottom-24 h-[300px] w-[300px] rounded-full bg-primary-900/30 blur-[80px]" />
      </div>

      <div className="relative flex h-full flex-col px-8 py-8">
        <Image
          src={logo}
          alt="Rayda"
          className="h-8 w-auto self-start"
          priority
        />

        <div className="mt-12 flex-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-900/50 px-3 py-1 text-xs font-semibold text-primary-300 ring-1 ring-primary-700/50">
            {content.badge}
          </span>
          <h2 className="mt-4 text-2xl leading-8 font-bold whitespace-pre-line text-white">
            {content.heading}
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-400">{content.sub}</p>

          <div className="mt-8 flex flex-col gap-3">
            {content.highlights.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="size-3.5 text-primary-300" />
                </div>
                <p className="text-sm text-gray-400">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-xs text-gray-400">
            No credit card required. Setup takes under 3 minutes. Cancel
            anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
