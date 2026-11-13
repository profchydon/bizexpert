import type { SpecSchemaEntry } from "../types";
import { dockSubtype } from "./dock";
import { headsetSubtype } from "./headset";
import { keyboardSubtype } from "./keyboard";
import { mouseSubtype } from "./mouse";
import { webcamSubtype } from "./webcam";

export const peripheralSchema: SpecSchemaEntry = {
  assetTypeId: "peripheral",
  label: "Peripheral",
  subtypeField: {
    id: "peripheral_subtype",
    label: "Peripheral Type",
    options: [
      { id: "mouse", label: "Mouse" },
      { id: "keyboard", label: "Keyboard" },
      { id: "headset", label: "Headset / Headphones" },
      { id: "webcam", label: "Webcam" },
      { id: "dock", label: "Docking Station / Hub" },
    ],
  },
  subtypes: [
    mouseSubtype,
    keyboardSubtype,
    headsetSubtype,
    webcamSubtype,
    dockSubtype,
  ],
};
