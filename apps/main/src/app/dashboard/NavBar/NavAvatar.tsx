import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const NavAvatar: React.FC<Props> = ({ className }) => {
  const { getUserInitials } = useAuthUserDetail();
  const userInitials = getUserInitials();

  return (
    <div className={cn("w-auto", className)}>
      <Avatar>
        <AvatarFallback className="bg-white">{userInitials}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default NavAvatar;
