export type CancelIntent =
  | { type: "order" }
  | { type: "sub-orders"; employeeIds: string[] }
  | { type: "item"; itemId: string; employeeId: string };

export type OpenCancelInput =
  CancelIntent | { suborderIds: string[] } | undefined;
