import EmptyTableInstance from "@/components/EmptyTableInstance";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { removeUserscore } from "@/utils/underScoreTransformer";
import React, { useState } from "react";

interface Props {
  isConnected: boolean;
  onFinish: () => void;
}

const Configure: React.FC<Props> = ({ isConnected, onFinish }) => {
  const [selectedValue, setSelectedValue] = useState<string>();

  return (
    <div>
      {!isConnected && (
        <EmptyTableInstance
          description="Setup integration to configure"
          title="Setup integration to continue."
        />
      )}
      {isConnected && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Device Assignment Group</Label>
            <Select
              onValueChange={(value) => {
                setSelectedValue(value);
              }}
              value={selectedValue}
              data-testid="configure-select"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>

              <SelectContent>
                {["Contract", "Part_Time", "Full_Time", "Others"].map(
                  (value) => (
                    <SelectItem value={value} key={value}>
                      {removeUserscore(value)}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="primary"
            className="w-full mt-6"
            disabled={!selectedValue}
            onClick={onFinish}
            data-testid="configure-button"
          >
            Finish
          </Button>
        </div>
      )}
    </div>
  );
};

export default Configure;
