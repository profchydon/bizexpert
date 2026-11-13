import { useGetDepartmentsQuery } from "@/api/baseQueries/companiesApi/departmentsApi/getDepartments";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

const useDepartment = () => {
  const companyId = useWorkspaceCompanyId();

  const { data: getDepartments } = useGetDepartmentsQuery(
    { companyId: companyId!, params: { paginate: false } },
    { skip: !companyId },
  );

  const departmentById = (id: string) => {
    if (!id) return null;
    // @ts-ignore
    const getDepartmentValue = getDepartments?.data?.data?.find(
      (department: any) => department.id === id,
    );
    return getDepartmentValue?.name;
  };

  return { departmentById, getDepartments };
};

export default useDepartment;
