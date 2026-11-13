import React, { useEffect, useMemo, useState } from "react";
import DrawerRight from "@/components/DrawerRight";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CountryOption, DeliveryInfoForm } from "./types";
import { State } from "country-state-city";

interface EditDeliverySlideoutProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: DeliveryInfoForm;
  onSave: (data: DeliveryInfoForm, updateProfile: boolean) => void;
  isSaving: boolean;
  canEdit: boolean;
  countries: CountryOption[];
  defaultPhoneCountry?: string;
  showProfileUpdate?: boolean;
}

// Pattern: Presenter - focused on view state and UI interactions only.
const EditDeliverySlideout: React.FC<EditDeliverySlideoutProps> = ({
  isOpen,
  onOpenChange,
  initialData,
  onSave,
  isSaving,
  canEdit,
  countries,
  defaultPhoneCountry,
  showProfileUpdate = true,
}) => {
  const [phone, setPhone] = useState(initialData.phone);
  const [country, setCountry] = useState<string>(initialData.country);
  const [state, setState] = useState<string>(initialData.state || "");
  const [address, setAddress] = useState(initialData.address);
  const [landmark, setLandmark] = useState(initialData.landmark);
  const [updateProfile, setUpdateProfile] = useState(false);

  const stateOptions = useMemo(() => {
    if (!country) return [] as string[];
    const selectedCountry = countries.find((item) => item.id === country);
    const countryCode = selectedCountry?.countryCode;
    if (!countryCode) return [] as string[];

    return State.getStatesOfCountry(countryCode)
      .map((item) => item.name.trim())
      .filter((value) => value.length > 0)
      .sort((a, b) => a.localeCompare(b));
  }, [country, countries]);

  const normalizedStateOptions = useMemo(() => {
    if (!state || !stateOptions.length) return stateOptions;
    if (stateOptions.includes(state)) return stateOptions;
    return [state, ...stateOptions];
  }, [state, stateOptions]);

  const handleCountryChange = (key: string) => {
    setCountry(key);
    setState("");
  };

  useEffect(() => {
    if (isOpen) {
      setPhone(initialData.phone);
      setCountry(initialData.country);
      setState(initialData.state || "");
      setAddress(initialData.address);
      setLandmark(initialData.landmark);
      setUpdateProfile(false);
    }
  }, [isOpen, initialData]);

  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={() => onOpenChange(false)}
      onCancel={() => onOpenChange(false)}
      onSave={() => {
        onSave(
          {
            phone,
            country,
            state,
            address,
            landmark,
          },
          updateProfile,
        );
      }}
      saveText={isSaving ? "Saving..." : "Save changes"}
      isSaveButtonDisabled={isSaving || !canEdit}
      drawerTitle="Edit delivery information"
      drawerDescription="Update the delivery details for this order."
      enableOverlay
      width="680"
      data-testid="editdeliveryslideout-drawerright"
    >
      <div className="flex flex-col gap-5 pb-20">
        <div className="flex flex-col gap-1.5">
          <Label>Phone number</Label>
          <PhoneInput
            defaultCountry={defaultPhoneCountry as any}
            value={phone}
            onChange={(value) => {
              setPhone(String(value || ""));
            }}
            placeholder="Enter phone number"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Country</Label>
          <Select
            value={country}
            onValueChange={handleCountryChange}
            disabled
            data-testid="editdeliveryslideout-select"
          >
            <SelectTrigger disabled>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>State / Region</Label>
          {normalizedStateOptions.length > 0 ? (
            <Select
              value={state}
              onValueChange={setState}
              disabled={!country}
              data-testid="editdeliveryslideout-select-2"
            >
              <SelectTrigger disabled={!country}>
                <SelectValue
                  placeholder={
                    country ? "Select state / region" : "Select a country first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {normalizedStateOptions.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              placeholder={
                country ? "Enter state / region" : "Select a country first"
              }
              value={state}
              onChange={(event) => setState(event.target.value)}
              disabled={!country}
              data-testid="editdeliveryslideout-input"
            />
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-address">Address</Label>
          <Input
            id="edit-address"
            placeholder="e.g. 8/101 Nicholson St, Camp Hill"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            data-ph-mask
            data-testid="editdeliveryslideout-input-2"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-landmark">Nearest landmark</Label>
          <Textarea
            id="edit-landmark"
            placeholder="e.g. Opposite the main post office on King Street"
            rows={3}
            value={landmark}
            onChange={(event) => setLandmark(event.target.value)}
          />
        </div>

        {showProfileUpdate && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="update-profile"
                checked={updateProfile}
                onCheckedChange={(checked) =>
                  setUpdateProfile(Boolean(checked))
                }
                data-testid="editdeliveryslideout-checkbox"
              />
              <div>
                <Label htmlFor="update-profile" className="text-sm font-medium">
                  Also update my personal profile
                </Label>
                <p className="mt-1 text-xs text-gray-600">
                  Checking this will update your delivery address in your
                  personal profile as well.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DrawerRight>
  );
};

export default EditDeliverySlideout;
