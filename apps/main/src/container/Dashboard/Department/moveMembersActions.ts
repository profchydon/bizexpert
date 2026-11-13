import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";

type Mutation<T> = (payload: T) => { unwrap: () => Promise<unknown> };

export const moveThenDeleteDepartment = async ({
  moveMember,
  deleteDepartment,
  companyId,
  departmentId,
  destinationDeptId,
  members,
  onSuccess,
}: {
  moveMember: Mutation<{
    companyId: string;
    departmentId: string;
    destination_dept_id: string;
    members: string[];
  }>;
  deleteDepartment: Mutation<{ companyId: string; departmentId: string }>;
  companyId: string;
  departmentId: string;
  destinationDeptId: string;
  members: string[];
  onSuccess: () => void;
}) => {
  try {
    await moveMember({
      companyId,
      departmentId,
      destination_dept_id: destinationDeptId,
      members,
    }).unwrap();
    await deleteDepartment({ companyId, departmentId }).unwrap();
    displaySuccessMessage(
      "Department Successfully Deleted",
      "You have successfully deleted department and members have been moved",
    );
    onSuccess();
  } catch (error) {
    showApiError(error);
  }
};
