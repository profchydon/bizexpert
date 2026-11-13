import { accountsDetailPageShellClass } from "./accountsDetailHeaderClasses";

export function SubsidiaryDetailLoading() {
  return (
    <div className={accountsDetailPageShellClass} aria-busy>
      <div className="h-24 animate-pulse rounded-xl border border-gray-200 bg-white" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-96 animate-pulse rounded-xl border border-gray-200 bg-white lg:col-span-1" />
        <div className="h-96 animate-pulse rounded-xl border border-gray-200 bg-white lg:col-span-2" />
      </div>
    </div>
  );
}
