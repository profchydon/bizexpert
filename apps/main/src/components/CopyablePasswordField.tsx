import { Eye, EyeOff, Copy } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface CopyablePasswordFieldProps {
  value: string;
  disabled?: boolean;
}

const CopyablePasswordField: React.FC<CopyablePasswordFieldProps> = ({
  value = "",
  disabled = true,
}) => {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-row items-center border-[1px] border-gray-300 rounded-lg overflow-hidden">
      <Input
        type={visible ? "text" : "password"}
        value={value}
        readOnly
        disabled={disabled}
        className="flex-1 outline-none border-none py-[0.625rem] px-[0.875rem] text-gray-900 rounded-bl-lg rounded-tl-lg"
        data-testid="copyablepasswordfield-input"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="outline-none cursor-pointer text-gray-700 font-semibold flex items-center px-[0.75rem] py-[0.625rem]"
        disabled={!value}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
      <CopyToClipboard text={value || ""} onCopy={() => setCopied(true)}>
        <button
          type="button"
          disabled={!value}
          className="border-l-[1px] disabled:cursor-not-allowed border-l-gray-300 outline-none cursor-pointer text-gray-700 font-semibold flex items-center gap-2 px-[1.125rem] py-[0.625rem]"
        >
          <Copy className="text-gray-700" size={16} />
          <span className="text-sm">{!copied ? "Copy" : "Copied"}</span>
        </button>
      </CopyToClipboard>
    </div>
  );
};

export default CopyablePasswordField;
