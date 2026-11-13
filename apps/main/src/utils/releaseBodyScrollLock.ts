type ScrollLockDocument = {
  body?: {
    style: {
      overflow?: string;
      paddingRight?: string;
      position?: string;
      touchAction?: string;
      width?: string;
    };
  };
  documentElement?: {
    style: {
      overflow?: string;
    };
  };
};

export function releaseBodyScrollLock(
  doc: ScrollLockDocument | undefined = globalThis.document,
) {
  if (!doc?.body || !doc.documentElement) {
    return;
  }

  doc.body.style.overflow = "";
  doc.body.style.paddingRight = "";
  doc.body.style.position = "";
  doc.body.style.touchAction = "";
  doc.body.style.width = "";
  doc.documentElement.style.overflow = "";
}
