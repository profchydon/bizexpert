import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const OrderNote = ({
  note,
  setNote,
}: {
  note: string;
  setNote: (value: string) => void;
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes" className="text-base font-medium text-gray-700">
        Order note (Optional)
      </Label>
      <Textarea
        id="notes"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="E.g My house is opposite the electric pole."
        className="w-full border-gray-200 placeholder:text-gray-400"
        rows={5}
      />
    </div>
  );
};

export default OrderNote;
