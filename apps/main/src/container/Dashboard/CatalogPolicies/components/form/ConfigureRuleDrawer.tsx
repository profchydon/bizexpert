"use client";

import { useEffect, useState } from "react";
import Drawer from "react-modern-drawer";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { CatalogRule } from "../../types";
import {
  childRuleToDraft,
  composeChildRule,
  createChildRuleDraft,
  type ChildRuleDraft,
} from "../../utilsChildRule";
import { ResizableDrawerHandle } from "../overlays/ResizableDrawerHandle";
import { ChildRuleEditorModal } from "./ChildRuleEditorModal";
import { ChildRuleViewDialog } from "./ChildRuleViewDialog";
import { ConfigureRuleDrawerPagination } from "./ConfigureRuleDrawerPagination";
import {
  ConfigureRuleDrawerHeader,
  ConfigureRuleEmptyState,
  SubRuleCard,
} from "./ConfigureRuleDrawerParts";
import { useResizableDrawer } from "./useResizableDrawer";
import type { RulePagination } from "../../types";

const MIN_WIDTH = 360;
const MAX_WIDTH = 720;
const DEFAULT_WIDTH = 400;

export function ConfigureRuleDrawer({
  open,
  parent,
  childRules,
  seedKitIds = [],
  isSavingChild = false,
  pagination,
  onClose,
  onSaveChild,
  onRemoveChild,
}: {
  open: boolean;
  parent: CatalogRule | null;
  childRules: CatalogRule[];
  seedKitIds?: string[];
  isSavingChild?: boolean;
  pagination?: RulePagination;
  onClose: () => void;
  onSaveChild: (
    rule: CatalogRule,
    options?: { acknowledgeDisplacement?: boolean },
  ) => Promise<void> | void;
  onRemoveChild: (ruleId: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [editorDraft, setEditorDraft] = useState<ChildRuleDraft | null>(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [viewingRule, setViewingRule] = useState<CatalogRule | null>(null);
  const { width, isResizing, startResize } = useResizableDrawer({
    minWidth: MIN_WIDTH,
    maxWidth: MAX_WIDTH,
    defaultWidth: DEFAULT_WIDTH,
  });
  const seededTotal = seedKitIds.length;

  useEffect(() => setMounted(true), []);

  function openAddRuleModal() {
    if (!parent) return;
    const seedKitId = seedKitIds.find(
      (kitId) => !childRules.some((rule) => rule.kitIds.includes(kitId)),
    );
    setIsEditingDraft(false);
    setEditorDraft({
      ...createChildRuleDraft(`rule-${Date.now()}`, parent),
      kitIds: seedKitId ? [seedKitId] : [],
    });
  }

  async function saveDraft(
    draft: ChildRuleDraft,
    options?: { acknowledgeDisplacement?: boolean },
  ) {
    if (!parent) return;
    const existingRule = childRules.find((rule) => rule.id === draft.id);
    const nextRule = composeChildRule(parent, draft, new Date().toISOString());
    await onSaveChild(
      existingRule
        ? {
            ...nextRule,
            backendRuleId: existingRule.backendRuleId,
            createdAt: existingRule.createdAt,
          }
        : nextRule,
      options,
    );
    setEditorDraft(null);
  }

  function editRule(rule: CatalogRule) {
    if (!parent) return;
    setIsEditingDraft(true);
    setEditorDraft(childRuleToDraft(rule, parent));
  }

  if (!mounted) return null;
  if (!parent) return null;

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        direction="right"
        enableOverlay
        lockBackgroundScroll
        duration={isResizing ? 0 : 200}
        size={width}
        zIndex={1012}
        overlayOpacity={0.35}
        overlayColor="#344054"
        className="border-l border-gray-200 bg-white shadow-2xl"
      >
        <div className="relative flex h-full flex-col">
          <ResizableDrawerHandle
            resizing={isResizing}
            onPointerDown={startResize}
          />

          <ConfigureRuleDrawerHeader
            parent={parent}
            seededTotal={seededTotal}
            savedCount={childRules.length}
            onClose={onClose}
          />

          <div className="h-px w-full bg-gray-200" />

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-6 py-6">
            {childRules.length === 0 ? (
              <ConfigureRuleEmptyState onAdd={openAddRuleModal} />
            ) : (
              childRules.map((rule, index) => (
                <SubRuleCard
                  key={rule.id}
                  index={index}
                  rule={rule}
                  onView={() => setViewingRule(rule)}
                  onEdit={() => editRule(rule)}
                  onRemove={() => onRemoveChild(rule.id)}
                />
              ))
            )}

            {childRules.length > 0 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit gap-2 rounded-lg bg-white text-sm font-semibold"
                onClick={openAddRuleModal}
                data-testid="configureruledrawer-button"
              >
                <Plus className="h-4 w-4" />
                Add sub policy
              </Button>
            ) : null}
          </div>

          <footer className="flex items-center gap-3 border-t border-gray-200 bg-white px-6 py-4">
            <ConfigureRuleDrawerPagination pagination={pagination} />
            <Button
              type="button"
              className="ml-auto h-10 rounded-lg px-4 text-sm font-semibold"
              onClick={onClose}
              data-testid="configureruledrawer-button-2"
            >
              Done
            </Button>
          </footer>
        </div>
      </Drawer>
      {editorDraft ? (
        <ChildRuleEditorModal
          open
          parent={parent}
          initialDraft={editorDraft}
          onClose={() => setEditorDraft(null)}
          onSave={saveDraft}
          isEditing={isEditingDraft}
          isSaving={isSavingChild}
        />
      ) : null}
      {viewingRule ? (
        <ChildRuleViewDialog
          parent={parent}
          rule={viewingRule}
          onClose={() => setViewingRule(null)}
        />
      ) : null}
    </>
  );
}
