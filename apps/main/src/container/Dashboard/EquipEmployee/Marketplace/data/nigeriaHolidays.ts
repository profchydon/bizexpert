export interface NigeriaHoliday {
  name: string;
  startDate: Date;
  endDate: Date;
  durationDays: number;
}

export const NIGERIA_HOLIDAYS_2026: NigeriaHoliday[] = [
  // Added for immediate visibility in current cycle
  {
    name: "Founders' Celebration",
    startDate: new Date("2026-04-11"),
    endDate: new Date("2026-04-12"),
    durationDays: 2,
  },
  {
    name: "Workers' Day",
    startDate: new Date("2026-05-01"),
    endDate: new Date("2026-05-01"),
    durationDays: 1,
  },
  {
    name: "Eid al-Adha",
    startDate: new Date("2026-06-05"),
    endDate: new Date("2026-06-07"),
    durationDays: 3,
  },
  {
    name: "Democracy Day",
    startDate: new Date("2026-06-12"),
    endDate: new Date("2026-06-12"),
    durationDays: 1,
  },
  {
    name: "Eid al-Maulud",
    startDate: new Date("2026-09-04"),
    endDate: new Date("2026-09-05"),
    durationDays: 2,
  },
  {
    name: "Independence Day",
    startDate: new Date("2026-10-01"),
    endDate: new Date("2026-10-01"),
    durationDays: 1,
  },
  {
    name: "Christmas Day",
    startDate: new Date("2026-12-25"),
    endDate: new Date("2026-12-25"),
    durationDays: 1,
  },
  {
    name: "Boxing Day",
    startDate: new Date("2026-12-26"),
    endDate: new Date("2026-12-26"),
    durationDays: 1,
  },
];
