export function customerDeleteTitle(): string {
  return "Delete customer";
}

export function customerDeleteDescription(name: string): string {
  return `This will remove ${name} from your customer list. Past sales stay on record.`;
}
