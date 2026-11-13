import { Button } from "@/components/ui/button";
import { IEmployees } from "@/types/employees";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useState } from "react";

const PendingInviteTableActions: React.FC<{
  item?: IEmployees;
  onDelete: () => void;
  onResend: () => void;
}> = ({ onDelete, onResend, item }) => {
  const { getUserDetails } = useAuthUserDetail();
  const user = getUserDetails();

  const [loading, setLoading] = useState(false);

  const handleResend = () => {
    // setLoading(true);
    onResend();
  };

  return (
    <>
      {user?.id !== item?.id && (
        <div className="flex flex-row justify-end gap-4">
          <Button
            className="h-auto px-0 py-0 text-sm font-semibold text-gray-600 hover:bg-transparent hover:text-gray-700"
            variant="ghost"
            size="sm"
            disabled={loading}
            onClick={handleResend}
            data-testid="pendingtableactions-button"
          >
            Resend
          </Button>
          <Button
            className="h-auto px-0 py-0 text-sm font-semibold text-gray-600 hover:bg-transparent hover:text-gray-700"
            variant="ghost"
            size="sm"
            disabled={loading}
            onClick={onDelete}
            data-testid="pendingtableactions-button-2"
          >
            Delete
          </Button>
        </div>
      )}
    </>
  );
};

export default PendingInviteTableActions;
