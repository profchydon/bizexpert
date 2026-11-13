"use client";

import React, { useState } from "react";

import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineTitle,
  TimelineIcon,
  TimelineDescription,
  TimelineContent,
  TimelineTime,
  TimelineCheck,
} from "@/components/Custom/Timeline";
import dayjs from "dayjs";
import { IAsset } from "@/types/assets";

interface Props {
  asset?: IAsset;
}

const item_detail = {
  item1: {
    id: "1",
    title: "Product shipping",
    description: "14/09/2024, 7:29am",
    time: "2022-01-01",
  },
  item2: {
    id: "2",
    title: "Product packaging",
    description: "14/09/2024, 7:29am",
    time: "2022-01-01",
  },
  item3: {
    id: "3",
    title: "Order confirmed",
    description: "14/09/2024, 7:29am",
    time: "2022-01-01",
  },
  item4: {
    id: "4",
    title: "Order placed",
    description: "14/09/2024, 7:29am",
    time: "2022-01-01",
  },
};

export const OrderDetailItemTimeline: React.FC<Props> = ({ asset }) => {
  const subOrderEvents = asset?.events;
  const [checked, setChecked] = useState(true);

  const { item1, item2, item3, item4 } = item_detail;

  return (
    <Timeline>
      {subOrderEvents?.map((event) => {
        const words = event.status.split("_");
        const capitalizedWords = words
          .map(
            (word) =>
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
          )
          .join(" ");
        return (
          <TimelineItem key={event.id}>
            <TimelineConnector />
            <TimelineHeader className="mb-2">
              <TimelineIcon />
              <TimelineTitle>{capitalizedWords}</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              <TimelineDescription className="mt-2">
                {dayjs(event.created_at).format("DD/MM/YYYY, HH:mma")}
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};
