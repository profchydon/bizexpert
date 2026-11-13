import { empty_apikey_image } from "@/assets/images";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Image from "next/image";
import React, { FC } from "react";

interface Props {
  handleGenerate: () => void;
  isLoading: boolean;
}
const TestApiKeysEmptyInstance: FC<Props> = ({ handleGenerate, isLoading }) => {
  return (
    <Card className="p-4 flex flex-col items-center justify-center w-full">
      <div className="max-w-[22rem] flex flex-col items-center justify-center text-center gap-y-6">
        <Image src={empty_apikey_image} alt="live_key_empty_instance" />
        <div className="flex flex-col gap-y-2">
          <p className="text-xl font-semibold text-gray-900">
            No test API keys
          </p>
          <p className="text-base text-gray-600">
            Please generate your Test API keys to enable seamless integration
            with our services.
          </p>
        </div>
        <Button
          className="text-sm font-semibold flex flex-row gap-x-3 items-center"
          disabled={isLoading}
          onClick={handleGenerate}
          data-testid="testapikeysemptyinstance-button"
        >
          <Plus className="text-white" />
          Generate API keys
        </Button>
      </div>
    </Card>
  );
};

export default TestApiKeysEmptyInstance;
