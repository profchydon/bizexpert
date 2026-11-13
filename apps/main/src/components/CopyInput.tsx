import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";

interface CopyInputProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  readonlyMode?: boolean;
}

const CopyInput: React.FC<CopyInputProps> = ({
  value,
  disabled,
  placeholder,
  onChange,
  readonlyMode,
}) => {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-row items-center border-[1px] border-gray-300 rounded-lg">
      <Input
        className="flex-1 outline-none border-none py-[0.625rem] px-[0.875rem] text-gray-900 rounded-bl-lg rounded-tl-lg"
        value={value}
        disabled={disabled || readonlyMode}
        placeholder={placeholder}
        onChange={({ target: { value } }) => {
          onChange(value);
          setCopied(false);
        }}
        data-testid="copyinput-input"
      />
      <CopyToClipboard
        text={readonlyMode ? placeholder || "" : value || ""}
        onCopy={() => setCopied(true)}
      >
        <button
          type="button"
          disabled={readonlyMode ? !placeholder : !value}
          className="border-l-[1px] disabled:cursor-not-allowed border-l-gray-300 outline-none cursor-pointer text-gray-700 font-semibold flex flex-row items-center gap-2 w-fit py-[0.625rem] px-[1.125rem]"
        >
          <Copy className="text-gray-700" size={16} />
          <span className="text-sm">{!copied ? "Copy" : "Copied"}</span>
        </button>
      </CopyToClipboard>
    </div>
  );
};

export default CopyInput;
