"use client";

import { Lock01 } from "@untitledui/icons";
import { Banner } from "@/components/application/alerts/banner";

// The scope of a personal device install used to be explained by a whole card that renders
// only once the agent is already running, so the reassurance arrived after the decision it
// was written for. The employee is being asked to put company software on their own laptop;
// this is the moment the words are worth something.
//
// Same claims as NotCollectedCard, compressed. Whatever changes there changes here.
export function PersonalScopeNote() {
  return (
    <Banner
      tone="neutral"
      icon={Lock01}
      title="This is a personal device, so the agent collects less"
      description="It reports the security checks only: encryption, firewall, antivirus, screen lock and OS updates. Installed applications, disk contents, battery and hardware are not read. Location, browsing, files, messages, keystrokes and screen contents are never collected, on any device."
      meta="This summary is included in the install request, so the employee sees it before they agree."
    />
  );
}
