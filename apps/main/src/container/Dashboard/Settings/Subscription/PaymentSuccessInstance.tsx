"use client";

import { CheckCircle } from "@untitledui/icons";
import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { useGetUserProfileQuery } from "@/api/baseQueries/userApi/getUserProfile";
import { useAppDispatch } from "@/store";
import { encryptAuthData } from "@/utils/encryption/encryptAuthData";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { setEncryptAuth } from "@/store/slices/authSlice";

interface Props {
  onClose: () => void;
  onProceed: () => void;
  isOpen: boolean;
  planName?: string;
  renewsOn?: string;
}

const PaymentSuccessInstanceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onProceed,
  planName,
  renewsOn,
}) => {
  const dispatch = useAppDispatch();
  const {
    getAuthToken,
    getUserDetails,
    getCompanyDetails,
    getEntityMemberships,
  } = useAuthUserDetail();
  const { data: profileInfoRes } = useGetUserProfileQuery(undefined, {
    skip: !isOpen,
  });
  const profileData = profileInfoRes?.data;

  const proceed = () => {
    dispatch(
      setEncryptAuth(
        encryptAuthData({
          auth_token: getAuthToken(),
          user: profileData?.user ?? getUserDetails(),
          company: profileData?.company ?? getCompanyDetails(),
          entities: profileData?.entities ?? getEntityMemberships(),
        }),
      ),
    );
    onProceed();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay
      isOpen
      onOpenChange={(open) => !open && onClose()}
      className="z-[1003]"
    >
      <Modal className="z-[1003] max-w-lg">
        <Dialog data-testid="paymentsuccessinstance-dialog">
          <div className="flex w-full flex-col rounded-2xl bg-primary p-6 shadow-xl">
            <FeaturedIcon
              icon={CheckCircle}
              size="md"
              color="success"
              theme="light"
            />
            <h3 className="mt-4 text-md font-semibold text-primary">
              {planName ? `You are on ${planName}` : "Payment successful"}
            </h3>
            <p className="mt-1 text-sm text-tertiary">
              {renewsOn
                ? `Your payment went through. Your next bill is on ${renewsOn}.`
                : "Your payment went through and your subscription is active."}
            </p>
            <div className="mt-6">
              <Button
                color="primary"
                size="md"
                className="w-full"
                onClick={proceed}
                data-testid="paymentsuccessinstance-button"
              >
                Done
              </Button>
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};

export default PaymentSuccessInstanceModal;
