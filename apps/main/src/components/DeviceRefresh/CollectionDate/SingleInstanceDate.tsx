import React from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";

interface Props {
  selectedDate: Date | null;
  setDate: (value: Date) => void;
}

const SingleInstanceDate: React.FC<Props> = ({ selectedDate, setDate }) => {
  return (
    <div className="space-y-3 mt-4">
      <Label>Collection date</Label>
      <DatePicker
        className="w-full h-[44px]"
        date={selectedDate as Date}
        placeHolder="Select date"
        disablePastDates
        setDate={setDate}
      />
    </div>
  );
};

export default SingleInstanceDate;
