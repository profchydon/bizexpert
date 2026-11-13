import {
  AmexIcon,
  DiscoverIcon,
  MastercardIcon,
  VisaIcon,
} from "@/components/foundations/payment-icons";

const SCHEMES = [
  { id: "visa", Icon: VisaIcon },
  { id: "mastercard", Icon: MastercardIcon },
  { id: "amex", Icon: AmexIcon },
  { id: "discover", Icon: DiscoverIcon },
];

export function CardSchemeRow() {
  return (
    <span className="flex items-center gap-1">
      <span className="sr-only">
        Visa, Mastercard, American Express and Discover accepted
      </span>
      {SCHEMES.map(({ id, Icon }) => (
        <Icon key={id} className="h-5 w-7 shrink-0" aria-hidden="true" />
      ))}
    </span>
  );
}
