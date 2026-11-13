import Link from "next/link";

import { cn } from "@/lib/utils";

import type { NavItem } from "./NavItems.data";
import { isChildActive } from "./NavItems.data";

export function NavSubmenu({
  item,
  pathname,
  onSelect,
}: {
  item: NavItem;
  pathname: string;
  onSelect: () => void;
}) {
  if (!item.children?.length) return null;

  return (
    <div className="absolute left-0 right-0 top-[72px] z-[101] border-t border-gray-800 bg-gray-950">
      <div className="page-px">
        <div className="w-full">
          <ul className="flex h-12 items-center justify-center gap-1">
            {item.children.map((child) => (
              <li key={child.id}>
                <Link
                  href={child.link}
                  onClick={onSelect}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-100 ease-linear",
                    isChildActive(pathname, child)
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  )}
                >
                  {child.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
