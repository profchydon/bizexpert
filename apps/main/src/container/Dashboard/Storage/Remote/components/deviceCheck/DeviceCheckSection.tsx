"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { CheckCircle, ClockRefresh } from "@untitledui/icons";
import {
  CheckConditionGrid,
  CheckGradeHero,
  CheckPhotoGrid,
  CheckStatTiles,
  PhotoViewer,
} from "@/components/application/device-check";
import { GRADE_LABELS } from "../../data/storageMeta";
import type { DeviceCheckDetailState } from "../../types/equipmentDetail";
import type { StoredDevice } from "../../types/storage";
import { buildDeviceCheck } from "../../utils/buildDeviceCheck";
import { formatDate } from "../../utils/deriveDevice";
import { CheckFreshness } from "../CheckFreshness";

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5">
      <h4 className="text-xs font-semibold tracking-wide text-tertiary uppercase">
        {title}
      </h4>
      {children}
    </section>
  );
}

interface Props {
  device: StoredDevice;
  deviceCheck?: DeviceCheckDetailState;
}

export function DeviceCheckSection({ device, deviceCheck }: Props) {
  const [viewer, setViewer] = useState({ open: false, index: 0 });
  const state = deviceCheck ?? buildDeviceCheck(device);

  if (state.kind === "new")
    return (
      <CheckGradeHero
        grade={state.grade}
        label={state.label ?? ""}
        subtitle={state.subtitle}
        summary={state.note}
      />
    );
  if (state.kind === "awaiting")
    return (
      <CheckGradeHero
        label="Awaiting device check"
        subtitle={state.subtitle ?? "Not yet inspected"}
        summary={
          state.note ??
          "The grade and full report appear once the check is completed."
        }
      />
    );

  const r = state.report;
  const present = r.accessories.filter((a) => a.present);
  return (
    <div className="flex flex-col gap-5">
      {state.pendingRecheck && (
        <div className="flex items-start gap-2.5 rounded-lg border border-utility-warning-200 bg-utility-warning-50 p-3">
          <ClockRefresh className="mt-0.5 size-4 shrink-0 text-utility-warning-600" />
          <p className="text-sm text-utility-warning-700">
            A new device check is in progress. The results below are from the
            previous check and will update once it's complete.
          </p>
        </div>
      )}
      <CheckGradeHero
        grade={r.grade}
        label={GRADE_LABELS[r.grade]}
        subtitle={
          <span className="inline-flex items-center gap-1.5">
            <CheckFreshness device={device} />
            <span className="text-quaternary">· {formatDate(r.checkedAt)}</span>
          </span>
        }
        serialVerified={r.serialVerified}
        summary={r.notes}
      />
      <Group title="Inspection summary">
        <CheckStatTiles powersOn={r.powersOn} accessories={r.accessories} />
      </Group>
      {r.condition.length > 0 && (
        <Group title="Condition by component">
          <CheckConditionGrid condition={r.condition} />
        </Group>
      )}
      {present.length > 0 && (
        <Group title="Accessories included">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {present.map((a) => (
              <span
                key={a.name}
                className="flex items-center gap-1.5 text-sm text-secondary"
              >
                <CheckCircle className="size-4 shrink-0 text-fg-success-primary" />{" "}
                {a.name}
              </span>
            ))}
          </div>
        </Group>
      )}
      {r.photos.length > 0 && (
        <Group title="Photos">
          <CheckPhotoGrid
            photos={r.photos}
            onOpen={(index) => setViewer({ open: true, index })}
          />
        </Group>
      )}
      <PhotoViewer
        photos={r.photos}
        isOpen={viewer.open}
        initialIndex={viewer.index}
        onClose={() => setViewer({ open: false, index: 0 })}
      />
    </div>
  );
}
