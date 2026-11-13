"use client";

import Image from "next/image";
import { docs_icon_primary } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
  isLoading: boolean;
}

const TermsAndConditionsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAgree,
  isLoading,
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
      data-testid="termsandconditionsmodal-dialog"
    >
      <DialogContent
        className="flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl flex-col gap-0 overflow-hidden p-0"
        showCloseButton={false}
      >
        <DialogHeader className="shrink-0 space-y-0 border-b border-gray-200 px-5 py-5 text-left sm:px-6">
          <Image src={docs_icon_primary} alt="" className="size-10" />
          <DialogTitle className="mt-4 text-lg font-semibold text-gray-900">
            Terms and conditions
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-gray-600">
            Please agree to the terms and conditions to continue
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto px-5 py-5 sm:px-6">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Introduction
            </h3>
            <div className="space-y-3 text-sm leading-6 text-gray-600">
              <p>
                At Rayda, accessible from www.rayda.co, one of our main
                priorities is the privacy of our visitors. This Privacy Policy
                document contains types of information that is collected and
                recorded by Rayda and how we use it.
              </p>
              <p>
                If you have additional questions or require more information
                about our Privacy Policy, do not hesitate to contact us.
              </p>
              <p>
                This Privacy Policy applies only to our online activities and is
                valid for visitors to our website with regards to the
                information that they shared and/or collect in Rayda. This
                policy is not applicable to any information collected offline or
                via channels other than this website. Our Privacy Policy was
                created with the help of the Free Privacy Policy Generator.
              </p>
            </div>
          </section>

          <section className="mt-6 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Consent</h3>
            <p className="text-sm leading-6 text-gray-600">
              By using our website, you hereby consent to our Privacy Policy and
              agree to its terms.
            </p>
          </section>
        </div>

        <div className="shrink-0 border-t border-gray-200 px-5 py-4 sm:px-6">
          <Button
            className="w-full"
            onClick={onAgree}
            isLoading={isLoading}
            data-testid="termsandconditionsmodal-button"
          >
            Agree
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TermsAndConditionsModal;
