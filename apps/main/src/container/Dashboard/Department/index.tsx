"use client";

import { download_pdf } from "@/assets/icons";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import DepartmentTable from "./DepartmentTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Levels from "./Levels";
import {
  departmentTabTriggerClass,
  departmentTabsListClass,
} from "./departmentPageClasses";

const Department = () => {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col py-8">
        <PageHeader
          breadCrumbs={["Department & Levels"]}
          pageTitle="Department & Levels"
          pageDescription="View all departments & levels in your organization"
          onBack={() => router.back()}
        >
          <div className="md:self-end flex gap-3">
            {/* <Button variant="outline" className="text-sm">
              <Image
                src={download_pdf}
                className="mr-2"
                width={16.67}
                height={16.12}
                alt="Download PDF"
              />
              <span className="text-sm font-semibold">Download PDF</span>
            </Button> */}

            {/* <Button variant="outline" className="text-sm">
              <Image
                src={download_pdf}
                className="mr-2"
                width={16.67}
                height={16.12}
                alt="Download CSV"
              />
              <span className="text-sm font-semibold">Download CSV</span>
            </Button> */}
          </div>
        </PageHeader>

        <div className="mt-8 w-full">
          <Tabs defaultValue="departments" className="">
            <TabsList className={departmentTabsListClass}>
              <TabsTrigger
                value="departments"
                className={departmentTabTriggerClass}
              >
                Departments
              </TabsTrigger>
              <TabsTrigger value="levels" className={departmentTabTriggerClass}>
                Levels
              </TabsTrigger>
            </TabsList>

            <TabsContent value="departments" className="pt-4">
              <DepartmentTable />
            </TabsContent>

            <TabsContent value="levels">
              <Levels />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Department;
