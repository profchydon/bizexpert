import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { companyProfileFormSchema } from "./validation";
import { company_profile_stepper } from "@/assets/icons";
import Image from "next/image";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store";
import { setOnboardingData } from "@/store/slices/onboardingSlice";
import { ICompany, IUser } from "@/types/auth";
import { useUpdateCompanyMutation } from "@/api/baseQueries/authFlowApi/updateCompany";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import FormField from "@/components/Custom/FormField";

interface Props {
  onContinue: () => void;
}

const CompanyProfile: React.FC<Props> = ({ onContinue }) => {
  const dispatch = useAppDispatch();
  const { user, company } = useAppSelector(
    (state) => state.persistedReducers.onboarding,
  );
  const router = useRouter();
  const form = useForm<z.infer<typeof companyProfileFormSchema>>({
    resolver: zodResolver(companyProfileFormSchema),
  });

  const [updateCompany, updateCompanyProps] = useUpdateCompanyMutation();

  const onSubmit = async (data: z.infer<typeof companyProfileFormSchema>) => {
    const companyData = {
      name: data.business_name,
      email: data.email,
      size: data.employee_size,
      industry: "-",
      country: "Nigeria",
      state: "Lagos",
      latitude: "0",
      longitude: "0",
      billing_currency: "NGN",
      address: "-",
      stage: "Company Information",
    } as any;

    await updateCompany({
      companyId: company?.id!,
      company: companyData,
    })
      .unwrap()
      .then((res) => {
        displaySuccessMessage("Company profile created");
        dispatch(
          setOnboardingData({
            user: {
              ...user,
              stage: "Company Information",
            } as IUser,
            company: {
              ...company,
              ...companyData,
            } as ICompany,
          }),
        );
        onContinue();
      })
      .catch(showApiError);
  };

  return (
    <div className="lg:grid px-10 sm:px-24 lg:px-0 place-content-center h-screen">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full lg:min-w-[27rem]"
        >
          <div className="flex-col flex gap-y-2 mb-6">
            <div className="lg:text-3xl text-2xl font-semibold text-gray-900">
              Company Profile
            </div>
            <span className="text-gray-600 text-base">
              Please fill in your company profile details
            </span>
          </div>

          <Image
            src={company_profile_stepper}
            alt="stepper_indicator_icon"
            className="mt-8"
            width={432}
            height={32}
          />

          <div className="flex flex-col gap-5 mt-8">
            <FormField
              control={form.control}
              label="Business name"
              name="business_name"
              render={({ field }) => (
                <Input
                  placeholder="Enter business name"
                  {...field}
                  data-testid="companyprofile-input"
                />
              )}
            />

            <FormField
              control={form.control}
              name="email"
              label="Business email"
              render={({ field }) => (
                <Input
                  placeholder="Enter business email"
                  {...field}
                  data-testid="companyprofile-input-2"
                />
              )}
            />

            <FormField
              control={form.control}
              name="employee_size"
              label="Employee size"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  data-testid="companyprofile-select"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee size" />
                  </SelectTrigger>

                  <SelectContent>
                    {["2 -10", "11-50", "51-100", "101-250"].map((value) => (
                      <SelectItem value={value} key={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <Button
            variant="primary"
            className="w-full mt-6"
            disabled={!form?.formState?.isValid || updateCompanyProps.isLoading}
            data-testid="companyprofile-button"
          >
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CompanyProfile;
