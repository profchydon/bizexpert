import Link from "next/link";
import { ChevronRight, Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import routes from "@/routes";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  onCreateKit?: () => void;
  actions?: React.ReactNode;
}

const KitPageHeader = ({
  title,
  description,
  breadcrumbs,
  onCreateKit,
  actions,
}: Props) => {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold leading-8 text-gray-900">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
        {onCreateKit ? (
          <Button
            className="h-10 gap-2 rounded-lg px-3.5 text-sm font-semibold"
            onClick={onCreateKit}
            data-testid="kitpageheader-button"
          >
            <Plus className="size-4" /> Create Kit
          </Button>
        ) : (
          actions
        )}
      </div>

      <div className="h-px bg-gray-200" />

      <nav className="flex flex-wrap items-center gap-2">
        <Link href={routes.DASHBOARD} className="rounded p-1 text-gray-500">
          <Home className="size-4" />
        </Link>
        {breadcrumbs.map((item) => (
          <span key={item.label} className="flex items-center gap-2">
            <ChevronRight className="size-3 text-gray-500" />
            {item.href ? (
              <Link
                href={item.href}
                className="px-2 py-1 text-sm text-gray-600"
              >
                {item.label}
              </Link>
            ) : (
              <span className="px-2 py-1 text-sm font-semibold text-primary-600">
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </div>
  );
};

export default KitPageHeader;
