import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import TagsInput from "react-tagsinput";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const data = [
  {
    name: "Drew Cano",
    title: "UX Designer",
    status: "Filled",
  },
  {
    name: "Orlando Diggs",
    title: "UI Designer",
    status: "Pending",
  },
];

const InviteEmployee = () => {
  const [emails, setEmails] = useState<string[]>([]);

  return (
    <div>
      <div className="flex flex-col gap-y-3">
        <Label>Add emails</Label>
        <div>
          <TagsInput
            value={emails}
            onChange={(values) => setEmails(values)}
            className="bg-white rounded-lg border border-gray-200 px-2 p-1"
            inputProps={{
              className:
                "react-tagsinput-input text-gray-700 placeholder:w-[400px] mb-0",
              placeholder: "Add employees",
            }}
            tagProps={{
              className:
                "react-tagsinput-tag bg-white text-gray-700 border border-gray-300 rounded-md text-gray-900 text-sm font-medium mt-[5px]",
              classNameRemove: "react-tagsinput-remove text-gray-400",
            }}
          />
        </div>
        <div className="text-gray-600 text-sm">
          Add all the employees you want to invite here{" "}
          <span className="text-error-900">
            (Press tab button to enter multiple email addresses).
          </span>
        </div>
      </div>

      {/* <Separator className="my-7" /> */}

      {/* <div className="flex flex-col gap-y-4">
        <Label>Link Invites</Label>

        <Table>
          <TableBody>
            {data?.map((employee) => (
              <TableRow key={employee.title} className="tex-sm">
                <TableCell className="w-[200px]">
                  <div className="flex flex-col gap-y-1">
                    <span className="font-semibold text-gray-700 text-sm">
                      {employee.name}
                    </span>
                    <span className="text-gray-700 text-sm">
                      {employee.title}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="w-[200px]">
                  <div>
                    {employee.status === "Filled" && (
                      <Badge variant="success">{employee.status}</Badge>
                    )}
                    {employee.status === "Pending" && (
                      <Badge variant="pending">{employee.status}</Badge>
                    )}
                  </div>
                </TableCell>

                <TableCell className="">
                  <div className="grid place-content-end">
                    <div className="grid grid-cols-[auto,auto] gap-x-4">
                      <div className="justify-self-end">
                        <Button variant="outline" className="text-sm">
                          Decline
                        </Button>
                      </div>
                      <div>
                        <Button className="text-sm">View details</Button>
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div> */}
    </div>
  );
};

export default InviteEmployee;
