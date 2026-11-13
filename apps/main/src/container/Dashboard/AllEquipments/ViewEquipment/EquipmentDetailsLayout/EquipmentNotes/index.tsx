"use client";

import React, { FC } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IEquipment } from "@/types/equipments";
import dayjs from "dayjs";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { ViewEquipmentDetailCard } from "../../ViewEquipmentDetailCard";

interface Props {
  equipment: IEquipment;
}

interface Note {
  index: number;
  author: string;
  note: string;
  date_added: string;
  read: boolean;
}

const EquipmentNotes: FC<Props> = ({ equipment }) => {
  const notes = equipment?.note[0] as Note[];

  return (
    <ViewEquipmentDetailCard title="Notes">
      <div className="max-h-[500px] overflow-y-auto">
        {notes?.length > 0 ? (
          notes.map((note) => (
            <div key={note.index} className="flex gap-4 pb-6 last:pb-0">
              <Avatar className="size-10 shrink-0 border border-secondary shadow-xs">
                <AvatarFallback className="bg-secondary text-sm font-semibold text-secondary">
                  {note?.author?.[0] || ""}
                </AvatarFallback>
              </Avatar>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-sm font-medium text-primary">
                    {note?.author || ""}
                  </span>
                  <span className="text-xs text-tertiary">
                    {dayjs(note?.date_added || "").format("hh:mma D MMMM YYYY")}
                  </span>
                </div>

                <div className="text-sm text-tertiary">Left a note</div>

                <div className="mt-2 w-full rounded-xl rounded-tl-none border border-secondary bg-secondary p-4 text-sm text-primary">
                  &ldquo;{note?.note || ""}&rdquo;
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyTableInstance
            title="No notes yet "
            description="Feel free to add notes to this equipment"
          />
        )}
      </div>
    </ViewEquipmentDetailCard>
  );
};

export default EquipmentNotes;
