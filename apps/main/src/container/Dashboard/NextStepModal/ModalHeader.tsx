import { CloseButton } from "@/components/base/buttons/close-button";

interface ModalHeaderProps {
  onSkip: () => void;
}

export function ModalHeader({ onSkip }: ModalHeaderProps) {
  return (
    <div className="flex items-start justify-between border-b border-secondary px-6 py-5">
      <div>
        <h2 className="text-lg font-bold text-primary">
          Add your employees to get started
        </h2>
        <p className="mt-1 text-sm text-tertiary">
          Choose how you&apos;d like to bring your team into Rayda.
        </p>
      </div>
      <CloseButton size="sm" onPress={onSkip} />
    </div>
  );
}
