"use client";

import { Globe01, Loading02 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cn } from "@/lib/utils";
import type { SwitcherScope } from "./accountSwitcherScopes";
import { flagByCode } from "./flagByCode";

interface Props {
  scopes: SwitcherScope[];
  onSelectScope: (id: string) => void;
  switchingScopeId?: string | null;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
}

export function WorkspaceSwitcherSection({
  scopes,
  onSelectScope,
  switchingScopeId = null,
  hasMore,
  onLoadMore,
  isLoadingMore,
}: Props) {
  const isSwitchingWorkspace = switchingScopeId !== null;

  return (
    <div className="border-t border-secondary bg-primary">
      <div className="max-h-72 overflow-y-auto">
        <p className="sticky top-0 z-10 bg-primary px-4 pt-2 pb-1 text-xs font-semibold text-brand-secondary">
          Switch workspace
        </p>
        <ul className="py-1" aria-busy={isSwitchingWorkspace}>
          {scopes.map((scope) => {
            const Flag = flagByCode(scope.countryCode);
            const isSwitchingScope = switchingScopeId === scope.id;
            const trailingIndicator = (() => {
              if (isSwitchingScope) {
                return (
                  <Loading02 className="ml-2 size-4 shrink-0 animate-spin text-brand-secondary" />
                );
              }
              if (scope.active) {
                return (
                  <span className="ml-2 flex size-4 shrink-0 items-center justify-center rounded-full bg-brand-solid">
                    <span className="size-1.5 rounded-full bg-white" />
                  </span>
                );
              }
              return (
                <span className="ml-2 size-4 shrink-0 rounded-full ring-1 ring-secondary ring-inset" />
              );
            })();

            return (
              <li key={scope.id}>
                <button
                  type="button"
                  disabled={isSwitchingWorkspace}
                  aria-busy={isSwitchingScope}
                  className={cn(
                    "flex w-full items-center gap-2 px-4 py-2 text-left outline-hidden transition duration-100 hover:bg-primary_hover disabled:cursor-wait disabled:opacity-70",
                    scope.active && "bg-primary_hover",
                  )}
                  onClick={() => onSelectScope(scope.id)}
                >
                  {Flag ? (
                    <Flag className="size-6 shrink-0 rounded-full object-cover" />
                  ) : (
                    <Globe01 className="size-6 shrink-0 text-fg-quaternary" />
                  )}
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="truncate text-sm font-semibold text-secondary">
                      {scope.label}
                    </span>
                    {scope.kind === "global" ? (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-brand-50 px-1.5 py-0.5 text-xs font-medium text-brand-secondary ring-1 ring-brand-200 ring-inset">
                        Primary
                      </span>
                    ) : null}
                  </span>
                  {trailingIndicator}
                </button>
              </li>
            );
          })}
        </ul>
        {hasMore ? (
          <div className="border-t border-secondary px-3 py-2">
            <Button
              type="button"
              size="sm"
              color="link-color"
              className="w-full justify-center"
              isLoading={isLoadingMore}
              showTextWhileLoading
              onPress={onLoadMore}
              data-testid="workspaceswitchersection-button"
            >
              See more
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
