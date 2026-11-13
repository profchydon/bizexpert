import React, { useMemo, useState } from "react";
import LevelTableColumn from "./tableColumns";
import LevelsTableActions from "./tableActions";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import SearchWithIcon from "@/components/SearchWithIcon";
import { Button } from "@/components/ui/button";
import CreateLevel from "../CreateLevel";
import LevelsEmptyTable from "../LevelsEmptyTable";
import { useGetLevelsQuery } from "@/api/baseQueries/companiesApi/levelsApi/getLevels";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import PageState from "@/components/PageState";
import { ILevel } from "@/types/departments";
import EditLevels from "../EditLevels";
import DeleteLevelModal from "../DeleteLevelModal";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  departmentTableToolbarContentClass,
  departmentTableToolbarSectionClass,
} from "../../departmentPageClasses";

const LevelTable = () => {
  const [levelDetail, setLevelDetail] = useState<ILevel>();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();

  const [isCreateLevelOpen, setIsCreateLevelOpen] = useState(false);
  const toggleCreateLevel = () => setIsCreateLevelOpen(!isCreateLevelOpen);
  const [page, setPage] = useState<number>();

  const {
    data: levelsRes,
    isLoading,
    isFetching,
    isError,
  } = useGetLevelsQuery({
    companyId: companyId!,
    page,
  });
  const levels = levelsRes?.data.data;
  const currentPage = levelsRes?.data.current_page ?? 1;
  const lastPage = levelsRes?.data.last_page ?? 1;

  const columns: any = useMemo(
    () =>
      LevelTableColumn((item: ILevel) => (
        <LevelsTableActions
          item={item}
          onEdit={() => {
            setLevelDetail(item);
            setIsEditOpen(true);
          }}
          onDelete={() => {
            setIsDeleteOpen(true);
            setLevelDetail(item);
          }}
        />
      )),
    [],
  );

  return (
    <div>
      <Card className="overflow-hidden">
        <div className={departmentTableToolbarSectionClass}>
          <div className={departmentTableToolbarContentClass}>
            <SearchWithIcon className="min-w-0 flex-1" />
            <Button
              variant="primary"
              onClick={toggleCreateLevel}
              size="md"
              className="shrink-0"
              data-testid="levelstable-button"
            >
              Create level
            </Button>
          </div>
        </div>
        <PageState isLoading={isLoading || isFetching} isError={isError}>
          <CardContent className="px-0 pt-0 pb-2">
            <DataTable
              data={levels ?? []}
              columns={columns}
              pagination={{
                currentPage,
                lastPage,
                onPageChange: (value) => setPage(value),
              }}
            >
              <LevelsEmptyTable onCreateLevel={toggleCreateLevel} />
            </DataTable>
          </CardContent>
        </PageState>
      </Card>
      <CreateLevel isOpen={isCreateLevelOpen} onClose={toggleCreateLevel} />

      <EditLevels
        level={levelDetail!}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setLevelDetail(undefined);
        }}
      />

      <DeleteLevelModal
        isOpen={isDeleteOpen}
        levelDetail={levelDetail}
        onClose={() => {
          setIsDeleteOpen(false);
          setLevelDetail(undefined);
        }}
      />
    </div>
  );
};

export default LevelTable;
