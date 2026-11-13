import { emptycard_state } from "@/assets/images";
// import { Button } from "@/components/ui/button";
import Image from "next/image";

const EmptyInstance = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-6 w-auto">
      <Image
        src={emptycard_state}
        width={152}
        height={118}
        alt="credit_image"
      />
      <div className="w-auto text-center">
        <h4 className="text-gray-900 text-base font-semibold">
          No credit available
        </h4>
        <p className="text-gray-600 text-sm mt-[4px]">
          Credit is only available for subscribed users
        </p>
      </div>
      {/* <Button data-testid="emptyinstance-button">Subscribe</Button> */}
    </div>
  );
};

export default EmptyInstance;
