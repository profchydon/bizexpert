import React from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TrackOrderFormValues } from "./validation";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

interface SearchBarProps {
  form: UseFormReturn<TrackOrderFormValues>;
  onSubmit: (values: TrackOrderFormValues) => void;
  isLoading?: boolean;
}

export const OrderSearchBar: React.FC<SearchBarProps> = ({
  form,
  onSubmit,
  isLoading = false,
}) => {
  return (
    <Card className="p-4 sm:p-6">
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 w-full">
              <FormField
                control={form.control}
                name="orderId"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <FormControl>
                      <div>
                        <span className="flex flex-row gap-x-1 items-center text-sm pb-2 font-medium">
                          Order number
                          <HelpCircle className="w-4 h-4" />
                        </span>

                        <Input
                          placeholder="e.g., ITQC4000275988"
                          disabled={isLoading}
                          autoFocus
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          data-testid="ordersearchbar-input"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="sm:pt-0">
                <Button
                  type="submit"
                  disabled={isLoading || !form.formState.isValid}
                  className="flex flex-row gap-x-2 w-full sm:w-auto"
                  data-testid="ordersearchbar-button"
                >
                  <Search className="text-gray-300 w-5 h-5" />
                  {isLoading ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
