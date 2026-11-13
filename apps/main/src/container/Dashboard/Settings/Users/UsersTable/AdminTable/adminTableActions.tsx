import { Button } from "@/components/ui/button";
import { IEmployees } from "@/types/employees";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useState } from "react";

const AdminTableActions: React.FC<{
  item?: IEmployees;
  onDelete: () => void;
  onResend: () => void;
}> = ({ onDelete, onResend, item }) => {
  const { getUserDetails } = useAuthUserDetail();
  const user = getUserDetails();

  const [loading, setLoading] = useState(false);

  const role = item?.roles[0];

  const handleResend = () => {
    // setLoading(true);
    onResend();
  };

  return (
    <>
      {user?.id !== item?.id && (
        <div className="flex flex-row justify-end">
          <Button
            className="h-auto px-0 py-0 text-sm font-semibold text-gray-600 hover:bg-transparent hover:text-gray-700"
            variant="ghost"
            size="sm"
            disabled={loading}
            onClick={onDelete}
            data-testid="admintableactions-button"
          >
            Remove
          </Button>
        </div>
      )}
    </>
  );
};

export default AdminTableActions;
