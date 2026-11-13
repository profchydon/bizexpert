"use client";

import React from "react";
import ReactCountryFlag from "react-country-flag";
import { SquarePen } from "lucide-react";
import PageState from "@/components/PageState";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SignatureRequiredToggle from "@/components/Offboarding/OrderSummary/SignatureRequiredToggle";
import EditDeliverySlideout from "./EditDeliverySlideout";
import ConfirmDeliveryDialog from "./ConfirmDeliveryDialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";
import { home_icon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import useVerificationData from "./hooks/useVerificationData";
import useVerificationActions from "./hooks/useVerificationActions";
import { isPickupContext } from "./verificationInfo";

interface Props {
  companyId?: string;
  token: string;
}

const EmployeeVerification: React.FC<Props> = ({ token, companyId }) => {
  const {
    resolvedCompanyId,
    isLoading,
    isError,
    refetch,
    countryOptions,
    verificationData,
    termsAccepted,
    setTermsAccepted,
    isEditOpen,
    setIsEditOpen,
    isConfirmOpen,
    setIsConfirmOpen,
    setShowSavedBanner,
    displayCountry,
    setDisplayCountry,
    displayCountryCode,
    setDisplayCountryCode,
    recipientName,
    phoneNumber,
    setPhoneNumber,
    emailAddress,
    employeeType,
    streetAddress,
    setStreetAddress,
    apartmentSuite,
    setApartmentSuite,
    city,
    state,
    setState,
    zipCode,
    deliveryNotes,
    setDeliveryNotes,
    signatureRequired,
    setSignatureRequired,
    fullAddress,
    equipmentItems,
    selectedCountryId,
    canEditDelivery,
  } = useVerificationData({ token, companyId });

  const { handleSave, handleConfirm, isUpdating, isConfirming } =
    useVerificationActions({
      resolvedCompanyId,
      token,
      deliveryNotes,
      signatureRequired,
      recipientName,
      phoneNumber,
      streetAddress,
      apartmentSuite,
      city,
      state,
      zipCode,
      setShowSavedBanner,
      setIsConfirmOpen,
      refetch,
    });

  const isPickup = isPickupContext(verificationData);
  const contextLabel = isPickup ? "pickup" : "delivery";

  return (
    <div className="flex flex-col py-8">
      <div className="mb-6 flex items-start justify-between gap-4 border-b order-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Order summary
          </h1>
          <p className="text-gray-600">
            View the details of your order and confirm your {contextLabel}{" "}
            information
          </p>
        </div>
        <Button
          disabled={!termsAccepted}
          onClick={() => setIsConfirmOpen(true)}
          data-testid="verification-button"
        >
          Confirm Details
        </Button>
      </div>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/employee">
              <Image src={home_icon} alt="home_icon" width={20} height={20} />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {["...", "Order Summary"].map((breadcrumb) => {
            const isBreadcrumbElement = React.isValidElement<{
              className?: string;
            }>(breadcrumb);
            const breadcrumbNode = isBreadcrumbElement
              ? React.cloneElement(breadcrumb, {
                  className: cn(
                    "text-gray-700 font-semibold text-sm",
                    breadcrumb.props.className,
                  ),
                })
              : breadcrumb;

            return (
              <React.Fragment key={String(breadcrumb)}>
                <BreadcrumbItem>
                  {isBreadcrumbElement ? (
                    <BreadcrumbLink asChild>{breadcrumbNode}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbLink className="text-gray-700 font-semibold text-sm">
                      {breadcrumbNode}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                <BreadcrumbSeparator className="last:hidden" />
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <PageState isError={isError} isLoading={isLoading}>
        <div className="mt-6 space-y-5">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <Button
                variant="outline"
                className="w-full"
                disabled={!canEditDelivery}
                onClick={() => {
                  if (!canEditDelivery) return;
                  setIsEditOpen(true);
                }}
                data-testid="verification-button-2"
              >
                <SquarePen className="mr-2 h-4 w-4" />
                Edit {contextLabel} information
              </Button>

              <Card className="rounded-2xl p-6">
                <CardHeader className="p-0">
                  <CardTitle className="text-xl font-medium leading-8 text-gray-900 sm:text-2xl">
                    {isPickup ? "Pickup address" : "Delivery address"}
                  </CardTitle>
                  <CardDescription className="text-sm leading-5 text-gray-600">
                    Shared with our logistics partners.
                  </CardDescription>
                </CardHeader>
                <Separator className="my-4" />
                <CardContent className="grid grid-cols-2 gap-4 p-0">
                  <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <div className="flex items-center gap-2 text-base font-medium text-gray-700">
                      <ReactCountryFlag
                        countryCode={displayCountryCode}
                        svg
                        className="h-6 w-6 rounded-full overflow-hidden"
                      />
                      <span>
                        {state ? `${state}, ` : ""}
                        {displayCountry}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-base font-medium text-gray-700">
                      {fullAddress || "N/A"}
                    </p>
                  </div>
                  <Separator className="col-span-2" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-base font-medium text-gray-700">
                      {recipientName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email address</p>
                    <p className="text-base font-medium text-gray-700">
                      {emailAddress || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Employee Type</p>
                    <p className="text-base font-medium text-gray-700">
                      {employeeType || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-base font-medium text-gray-700">
                      {phoneNumber || "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl p-6">
                <CardHeader className="p-0">
                  <CardTitle className="text-xl font-medium leading-8 text-gray-900 sm:text-2xl">
                    Equipment
                  </CardTitle>
                  <CardDescription className="text-sm leading-5 text-gray-600">
                    All the equipment for this order
                  </CardDescription>
                </CardHeader>
                <Separator className="my-4" />
                <CardContent className="p-0">
                  {equipmentItems.map((item, idx) => (
                    <div key={item.id}>
                      <div className="flex items-center gap-3">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded bg-gray-100 text-[10px] text-gray-400">
                            IMG
                          </div>
                        )}
                        <div className="text-sm text-gray-700">
                          {item.name}{" "}
                          {item.quantity > 1 ? `x${item.quantity}` : ""}
                        </div>
                      </div>
                      {idx < equipmentItems.length - 1 && (
                        <Separator className="my-4" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="verify-terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) =>
                      setTermsAccepted(Boolean(checked))
                    }
                    data-testid="verification-checkbox"
                  />
                  <div>
                    <Label
                      htmlFor="verify-terms"
                      className="text-sm font-medium"
                    >
                      Terms and Conditions
                    </Label>
                    <p className="text-sm text-gray-600">
                      I acknowledge my responsibility for providing the correct
                      address. I also understand that incorrect information can
                      impact the delivery or recovery process.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="space-y-2">
                <Label htmlFor="delivery-note" className="font-medium text-sm">
                  Special instructions or notes (Optional)
                </Label>
                <Textarea
                  id="delivery-note"
                  placeholder={
                    'E.g Call when nearby," "Leave at front desk,"  "Building access code: 1234'
                  }
                  rows={5}
                  value={deliveryNotes}
                  onChange={(event) => setDeliveryNotes(event.target.value)}
                />
              </div>

              <div
                className={
                  verificationData?.can_toggle_signature
                    ? ""
                    : "pointer-events-none opacity-60"
                }
              >
                <SignatureRequiredToggle
                  isSignatureRequired={signatureRequired}
                  setIsSignatureRequired={setSignatureRequired}
                  isAutoEnabled
                />
              </div>
              <Button
                className="w-full"
                disabled={!termsAccepted}
                onClick={() => setIsConfirmOpen(true)}
                data-testid="verification-button-3"
              >
                Confirm Details
              </Button>
            </div>
          </div>
        </div>
      </PageState>

      <EditDeliverySlideout
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        showProfileUpdate={!isPickup}
        countries={countryOptions}
        initialData={{
          phone: phoneNumber,
          country: selectedCountryId,
          state,
          address: streetAddress,
          landmark: apartmentSuite,
        }}
        defaultPhoneCountry={displayCountryCode}
        isSaving={isUpdating}
        canEdit={canEditDelivery}
        onSave={async (data, updatePersonalProfile) => {
          const selectedCountry = countryOptions.find(
            (item) => item.id === data.country,
          );
          const selectedCountryCode =
            selectedCountry?.countryCode || displayCountryCode;
          const stateLabel = data.state.trim();
          const updatedPhone = data.phone.trim();
          const countryName = selectedCountry?.label || displayCountry;
          const countryCode = selectedCountryCode;

          setPhoneNumber(updatedPhone);
          setStreetAddress(data.address);
          setApartmentSuite(data.landmark);
          setState(stateLabel);
          setDisplayCountry(countryName);
          setDisplayCountryCode(countryCode);

          await handleSave(
            {
              phoneNumber: updatedPhone,
              country: countryName,
              countryCode,
              streetAddress: data.address,
              apartmentSuite: data.landmark,
              state: stateLabel,
            },
            updatePersonalProfile,
          );

          setIsEditOpen(false);
        }}
      />

      <ConfirmDeliveryDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={() => {
          setIsConfirmOpen(false);
          handleConfirm();
        }}
        isConfirming={isConfirming}
        termsAccepted={termsAccepted}
        phoneNumber={phoneNumber}
        fullAddress={fullAddress}
        displayCountry={displayCountry}
        deliveryNotes={deliveryNotes}
        apartmentSuite={apartmentSuite}
        signatureRequired={signatureRequired}
      />
    </div>
  );
};

export default EmployeeVerification;
