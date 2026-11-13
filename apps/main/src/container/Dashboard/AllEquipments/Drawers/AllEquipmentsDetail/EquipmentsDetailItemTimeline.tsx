"use client";

import React, { useState } from "react";

import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineConnect,
  TimelineHeader,
  TimelineTitle,
  TimelineIcon,
  TimelineDescription,
  TimelineContent,
  TimelineTime,
  TimelineCheck,
} from "@/components/Custom/Timeline";
import dayjs from "dayjs";
import { IEquipment_History } from "@/types/equipments";
import { removeUserscore } from "@/utils/underScoreTransformer";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

interface Props {
  data: IEquipment_History[] | undefined;
}

export const EquipmentsDetailItemTimeline: React.FC<Props> = ({ data }) => {
  const transformEventTypeToDetermineDescription = (
    eventType: string,
    assignee: string | null,
  ) => {
    if (!eventType) return null;

    if (eventType === "equipment_added") return `Device added`;
    if (eventType === "unassigned") return `Device unassigned`;
    if (eventType === "assigned")
      return `Device was assigned to ${assignee || ""}`;
  };

  return (
    <Timeline>
      <>
        {data?.map((item, index) => {
          const { event_type, event_date, assignee } = item;
          const isFirstItem = index === 0;
          const isLastItem = index === data.length - 1;

          return (
            <TimelineItem className="mb-4" key={index}>
              {isFirstItem && <TimelineConnect />}
              {!isFirstItem && !isLastItem && <TimelineConnector />}
              {/* {isLastItem && <TimelineCheck />} */}

              <TimelineHeader>
                {isFirstItem && <TimelineIcon />}
                {!isFirstItem && <TimelineCheck />}
                <TimelineTitle className="text-sm">
                  {capitalizeFirstLetter(removeUserscore(event_type)) || ""}
                </TimelineTitle>
              </TimelineHeader>

              <TimelineContent>
                <TimelineDescription className="text-sm font-normal my-1">
                  {transformEventTypeToDetermineDescription(
                    event_type,
                    assignee?.name as string,
                  )}
                </TimelineDescription>
                <TimelineTime className="text-sm my-1">
                  {event_date ? dayjs(event_date).format("MMM DD, YYYY") : ""}
                </TimelineTime>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </>
    </Timeline>
  );
};
