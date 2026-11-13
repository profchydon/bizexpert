import { Button } from "@/components/ui/button";

function CustomRequestSuccess({ onClose }: Readonly<{ onClose: () => void }>) {
  return (
    <div className="flex w-full flex-col rounded-xl bg-white p-6 shadow-xl">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Request submitted
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Your custom device request has been received. Our team will reach out
          shortly.
        </p>
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={onClose} data-testid="customrequestsuccess-button">
          Done
        </Button>
      </div>
    </div>
  );
}

export { CustomRequestSuccess };
