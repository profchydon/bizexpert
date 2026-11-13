import React, { useEffect } from "react";
import DrawerRight from "@/components/DrawerRight";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/Custom/FormField";
import { Textarea } from "@/components/ui/textarea";
import { Form } from "@/components/ui/form";
import { addInviteSchema } from "./validation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CircleHelp } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SendInvite: React.FC<Props> = ({ isOpen, onClose }) => {
  const form = useForm<z.infer<typeof addInviteSchema>>({
    resolver: zodResolver(addInviteSchema),
    defaultValues: {
      emails: "",
      levels: "",
      departments: "",
    },
  });
  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      cancelText="Cancel"
      saveText="Send"
      drawerDescription="Send invite to employees here"
      drawerTitle="Send Invite"
      data-testid="sendinvite-drawerright"
    >
      <Form {...form}>
        <form>
          <div className="flex flex-col gap-4">
            <FormField
              className="col-span-2"
              control={form.control}
              name="email"
              label="Add emails*"
              render={({ field: { onChange, ...restField } }) => (
                <Input
                  placeholder="Add employees"
                  data-testid="sendinvite-input"
                />
              )}
            />
            <Label className="font-normal text-gray-600">
              Add all the employees you want to invite here
            </Label>

            <FormField
              className="col-span-2"
              control={form.control}
              name="levels"
              label={
                <div className="flex items-center gap-0.5">
                  <span>Levels</span>
                  <CircleHelp className="text-gray-400 h-4 w-4" />
                </div>
              }
              render={({ field: { onChange, ...restField } }) => (
                <Select data-testid="sendinvite-select">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <FormField
              className="col-span-2"
              control={form.control}
              name="department"
              label={
                <div className="flex items-center gap-0.5">
                  <span>Departments</span>
                  <CircleHelp className="text-gray-400 h-4 w-4" />
                </div>
              }
              render={({ field: { onChange, ...restField } }) => (
                <Select data-testid="sendinvite-select-2">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </form>
      </Form>
    </DrawerRight>
  );
};

export default SendInvite;
