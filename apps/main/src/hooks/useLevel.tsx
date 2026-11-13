import { useGetLevelsQuery } from "@/api/baseQueries/companiesApi/levelsApi/getLevels";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

const useLevel = () => {
  const companyId = useWorkspaceCompanyId();

  const { data: getLevels } = useGetLevelsQuery(
    { companyId: companyId! },
    { skip: !companyId },
  );

  const levelsById = (id: string) => {
    if (!id) return null;
    // @ts-ignore
    const getDepartmentValue = getLevels?.data?.data?.find(
      (level: any) => level.id === id,
    );
    return getDepartmentValue?.name;
  };

  return { levelsById, getLevels };
};

export default useLevel;
