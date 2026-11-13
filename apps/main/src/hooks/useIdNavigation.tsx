import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

const useIdNavigation = (
  ids: string[],
  basePath = "/dashboard/all-equipments",
) => {
  const router = useRouter();
  const param = useParams();
  const currentId = param?.equipmentId as string;

  const currentIndex = useMemo(() => ids?.indexOf(currentId), [ids, currentId]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < ids?.length - 1;

  const goToIndex = (index: number) => {
    const nextId = ids[index];
    if (nextId && nextId !== currentId) {
      router.push(`${basePath}/${nextId}`);
    }
  };

  return {
    currentId,
    currentIndex,
    hasPrev,
    hasNext,
    goToPrev: () => currentIndex > 0 && goToIndex(currentIndex - 1),
    goToNext: () =>
      currentIndex >= 0 &&
      currentIndex < ids?.length - 1 &&
      goToIndex(currentIndex + 1),
  };
};

export default useIdNavigation;
