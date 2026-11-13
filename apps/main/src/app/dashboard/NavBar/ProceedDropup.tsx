"use client";

import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ProceedDropupProps {
  onContinueShopping: () => void;
  onSendToEmployee: () => void;
  onMoveToStorage: () => void;
  isSendToEmployeeLoading?: boolean;
}

const ProceedDropup: React.FC<ProceedDropupProps> = ({
  onContinueShopping,
  onSendToEmployee,
  onMoveToStorage,
  isSendToEmployeeLoading = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3 overflow-hidden"
          >
            <Button
              size="lg"
              className="w-full"
              onClick={onSendToEmployee}
              isLoading={isSendToEmployeeLoading}
              data-testid="proceeddropup-button"
            >
              Send to employee
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={onMoveToStorage}
              data-testid="proceeddropup-button-2"
            >
              Move to storage
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={onContinueShopping}
          data-testid="proceeddropup-button-3"
        >
          Continue shopping
        </Button>
        <Button
          size="lg"
          className="flex-1 gap-2"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-label="Proceed options"
          data-testid="proceeddropup-button-4"
        >
          Proceed
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProceedDropup;
