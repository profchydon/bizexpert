import React, { FC, useState } from "react";
import { Mail, X, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  emails: string[];
  onChange: (emails: string[]) => void;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AdditionalEmailRecipients: FC<Props> = ({ emails, onChange }) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const addEmail = (rawValue: string) => {
    const cleanedValue = rawValue.trim().replace(/,$/, "");

    if (!cleanedValue) {
      setError("");
      return;
    }

    if (!emailPattern.test(cleanedValue)) {
      setError("Enter a valid email address");
      return;
    }

    if (emails.includes(cleanedValue)) {
      setError("Email already added");
      return;
    }

    onChange([...emails, cleanedValue]);
    setValue("");
    setError("");
  };

  const removeEmail = (email: string) => {
    onChange(emails.filter((item) => item !== email));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addEmail(value);
    }

    if (event.key === "Backspace" && !value && emails.length) {
      event.preventDefault();
      removeEmail(emails[emails.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-gray-900">
          Additional Email Recipients
        </p>
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add teammates to copy on order emails.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <p className="text-xs leading-relaxed text-gray-500">
        Order confirmation emails will be sent to addresses added here.{" "}
        <span className="font-semibold text-gray-700">
          This is for stakeholders who need order visibility (e.g., IT, Finance,
          managers).
        </span>{" "}
        Employees receive a separate email, so do not add their email address
        unless you want them to receive the order confirmation too.
      </p>

      <div
        className={cn(
          "flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2",
          "focus-within:ring-2 focus-within:ring-primary-600/20 focus-within:border-primary-600",
        )}
      >
        <Mail className="h-4 w-4 text-gray-500" />

        {emails.map((email) => (
          <span
            key={email}
            className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
          >
            {email}
            <button
              type="button"
              aria-label={`Remove ${email}`}
              onClick={() => removeEmail(email)}
              className="grid h-4 w-4 place-content-center rounded-full text-gray-500 hover:text-gray-700 hover:bg-white"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        <input
          type="email"
          className="flex-1 min-w-[160px] border-0 bg-transparent text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-0"
          placeholder="Add email and press Enter"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => addEmail(value)}
        />
      </div>

      {error && <p className="text-xs text-error-700">{error}</p>}
    </div>
  );
};

export default AdditionalEmailRecipients;
