import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/Custom/FormField";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { setupSchema } from "./validation";
import { ArrowRight } from "lucide-react";
import { blue_check } from "@/assets/icons";
import Image from "next/image";

interface Props {
  onContinue: () => void;
  isConnected: boolean;
  isLoading: boolean;
  onProceedToConfigure: () => void;
}

const Setup: React.FC<Props> = ({
  onContinue,
  isConnected,
  isLoading,
  onProceedToConfigure,
}) => {
  const form = useForm<z.infer<typeof setupSchema>>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      authorize: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof setupSchema>) => {
    onContinue();
  };

  return (
    <div>
      <div className="font-medium text-sm flex items-center gap-x-2">
        {!isConnected ? (
          <div>
            <p>Connect Your Google Account</p>
            <span className="block text-[#a90000] text-xs mt-1">
              This connection MUST be activated using the Google Workspace admin
              account.
            </span>
          </div>
        ) : (
          <div className="font-medium text-sm flex items-center gap-x-2">
            Google account connected successfully
            <Image
              src={blue_check}
              alt="Success Check"
              width={15}
              height={16}
            />
          </div>
        )}
      </div>

      <Separator className="my-3" />

      {!isConnected ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full lg:min-w-[27rem]"
          >
            <div className="flex flex-col gap-5 mt-8 ">
              <FormField
                control={form.control}
                name="authorize"
                label=""
                render={({ field }) => (
                  <div className="flex gap-x-2">
                    <Checkbox
                      checked={field.value}
                      id="authorize"
                      onCheckedChange={field.onChange}
                      data-testid="setup-checkbox"
                    />
                    <div>
                      <Label
                        htmlFor="authorize"
                        className="text-sm flex flex-col gap-y-1"
                      >
                        <span>Authorize</span>
                        <span className="text-gray-600 font-normal">
                          Allow Rayda to access employee data on Google
                          Workspace on your behalf.
                        </span>
                      </Label>
                    </div>
                  </div>
                )}
              />
            </div>
            <Button
              variant="primary"
              className="w-full mt-6"
              type="submit"
              disabled={!form.formState.isValid || isLoading}
              data-testid="setup-button"
            >
              Connect
            </Button>
          </form>
        </Form>
      ) : (
        <Button
          variant="primary"
          className="w-full mt-6"
          onClick={onProceedToConfigure}
          data-testid="setup-button-2"
        >
          Proceed to Configure
          <ArrowRight className="pl-2" />
        </Button>
      )}
    </div>
  );
};
export default Setup;

// interface Props {
//   onContinue: () => void;
// }

// const Setup: React.FC<Props> = ({ onContinue }) => {

//   const form = useForm<z.infer<typeof setupFormSchema>>({
//     resolver: zodResolver(setupFormSchema),
//     defaultValues: {
//       admin_email: "",
//       client_id: "",
//       client_secret: "",
//       frequency: "",
//       domain: "",
//       notification_email: "",
//       authorize: false,
//     },
//   });

//   const onSubmit = async (data: z.infer<typeof setupFormSchema>) => {
//     onContinue();
//   };

//   return (
//     <div>
//         <div className="font-medium text-sm flex items-center gap-x-2">
//              OAuth Redirect URI: c20b8310f28b4c97b300f0b365a <Copy />
//         </div>

//       <Separator className="my-3" />

//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="w-full lg:min-w-[27rem]"
//         >
//           <div className="flex flex-col gap-5 mt-8">
//             <FormField
//               control={form.control}
//               name="admin_email"
//               label="Google Admin Email *"
//               render={({ field }) => (
//                 <Input
//                   {...field}
//                   placeholder="Google Admin Email *"
//                   className="w-full"
//                   type="email"
//                 />
//               )}
//             />

//               <FormField
//               control={form.control}
//               name="client_id"
//               label="Google Client ID *"
//               render={({ field }) => (
//                 <Input
//                   {...field}
//                   placeholder="Google Client ID *"
//                   className="w-full"
//                 />
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="client_secret"
//               label="Google Client Secret *"
//               render={({ field }) => (
//                 <Input
//                   {...field}
//                   placeholder="Google Client Secret *"
//                   className="w-full"
//                 />
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="frequency"
//               label="Sync Frequency *"
//               render={({ field: { onChange, value, ...restField } }) => (
//                 <Select
//                   {...restField}
//                   onValueChange={(value) => {
//                     onChange(value);
//                   }}
//                   defaultValue={value}
//                   value={value}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Sync Frequency *" />
//                   </SelectTrigger>

//                   <SelectContent>
//                     {["Contract", "Part_Time", "Full_Time", "Others"].map(
//                       (value) => (
//                         <SelectItem value={value} key={value}>
//                           {removeUserscore(value)}
//                         </SelectItem>
//                       ),
//                     )}
//                   </SelectContent>
//                 </Select>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="domain"
//               label="Google Workspace Domain *"
//               render={({ field }) => (
//                 <Input
//                   {...field}
//                   placeholder="Google Workspace Domain *"
//                   className="w-full"
//                 />
//               )}
//             />

//            <FormField
//               control={form.control}
//               name="notification_email"
//               label="Notification Email *"
//               render={({ field }) => (
//                 <Input
//                   {...field}
//                   placeholder="Notification Email *"
//                   className="w-full"
//                   type="email"
//                 />
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="authorize"
//               label=""
//               render={({ field }) => (
//                 <div className="flex gap-x-2">
//                   <Checkbox
//                     checked={field.value}
//                     id="authorize"
//                     onCheckedChange={field.onChange}
//                   />
//                   <div>
//                     <Label
//                       htmlFor="authorize"
//                       className="text-sm flex flex-col gap-y-1"
//                     >
//                       <span>Authorize</span>
//                       <span className="text-gray-600 font-normal">
//                         Allow Rayda to access employee data on Google Workspace
//                         on your behalf.
//                       </span>
//                     </Label>
//                   </div>
//                 </div>
//               )}
//             />
//           </div>

//           <Button
//             variant="primary"
//             className="w-full mt-6"
//             type="submit"
//             disabled={!form.formState.isValid}
//           >
//             Connect
//           </Button>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default Setup;
