import type { TimelineEvent } from "../types/storage";
import { formatDate } from "../utils/deriveDevice";

export function LifecycleTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="flex flex-col">
      {events.map((event, i) => (
        <li key={event.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span className="mt-1 size-2.5 rounded-full bg-brand-solid" />
            {i < events.length - 1 && (
              <span className="w-px flex-1 bg-border-secondary" />
            )}
          </div>
          <div className="pb-4">
            <p className="text-sm font-medium text-primary">{event.label}</p>
            {event.detail && (
              <p className="text-sm text-tertiary">{event.detail}</p>
            )}
            <p className="mt-0.5 text-xs text-quaternary">
              {formatDate(event.at)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
