import { officeEmployeeAvatarClass } from "./officeEmployeeAvatarClasses";

interface Props {
  initials: string;
}

export function OfficeEmployeeAvatar({ initials }: Props) {
  return (
    <span className={officeEmployeeAvatarClass} aria-hidden>
      {initials}
    </span>
  );
}
