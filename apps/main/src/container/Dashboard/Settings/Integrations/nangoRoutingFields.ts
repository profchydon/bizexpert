export type NangoRoutingField = {
  name: "project_key" | "board_id";
  label: string;
  placeholder: string;
  inputType?: "text" | "select";
};

const ROUTING_FIELDS: Record<string, NangoRoutingField[]> = {
  jira: [
    {
      name: "project_key",
      label: "Jira project key",
      placeholder: "IT",
    },
  ],
  clickup: [
    {
      name: "board_id",
      label: "ClickUp list id",
      placeholder: "list-id",
    },
  ],
  linear: [
    {
      name: "project_key",
      label: "Linear team id",
      placeholder: "team-id",
    },
  ],
  monday: [
    {
      name: "board_id",
      label: "Monday board id",
      placeholder: "board-id",
    },
  ],
  zendesk: [],
  "zoho-desk": [
    {
      name: "project_key",
      label: "Department",
      placeholder: "Select a department",
      inputType: "select",
    },
    {
      name: "board_id",
      label: "Default contact",
      placeholder: "Select a contact",
      inputType: "select",
    },
  ],
  freshservice: [],
};

export function nangoRoutingFieldsFor(slug: string): NangoRoutingField[] {
  return ROUTING_FIELDS[slug] ?? [];
}

export const DEFERRED_KNOWLEDGE_SLUGS = new Set([
  "notion",
  "confluence",
  "google-drive",
  "one-drive",
]);

export function knowledgeComingSoonCopy(slug: string): string | null {
  const deferred = new Set([...DEFERRED_KNOWLEDGE_SLUGS, "clickup"]);

  if (!deferred.has(slug)) {
    return null;
  }

  return "Connected — knowledge sync coming soon";
}

export function isHiddenOnKnowledgeTab(slug: string): boolean {
  return DEFERRED_KNOWLEDGE_SLUGS.has(slug);
}

export function isNangoIntegration(service?: string): boolean {
  return service === "nango";
}
