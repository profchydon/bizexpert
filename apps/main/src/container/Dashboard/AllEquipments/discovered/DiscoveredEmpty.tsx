"use client";

import { EmptyState } from "@/components/application/empty-state/empty-state";

export function DiscoveredEmpty() {
  return (
    <div className="mt-4 flex items-center justify-center rounded-xl border border-secondary bg-primary py-16">
      <EmptyState size="md">
        <EmptyState.Header pattern="none">
          <EmptyState.Illustration type="cloud" />
        </EmptyState.Header>
        <EmptyState.Content>
          <EmptyState.Title>No discovered devices</EmptyState.Title>
          <EmptyState.Description>
            When the telemetry agent finds a device that is not in your Device
            Fleet, it appears here for review.
          </EmptyState.Description>
        </EmptyState.Content>
      </EmptyState>
    </div>
  );
}
