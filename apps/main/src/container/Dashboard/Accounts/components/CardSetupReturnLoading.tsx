import Loader from "@/components/Loader";

export function CardSetupReturnLoading({
  message = "Confirming card capture…",
}: {
  message?: string;
}) {
  return (
    <div
      className="grid w-full place-content-center py-20"
      aria-busy
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <Loader />
        <p className="text-sm font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
}
