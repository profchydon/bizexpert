import type { SpecSubtype } from "../types";

export const webcamSubtype: SpecSubtype = {
  id: "webcam",
  label: "Webcam",
  sections: [
    {
      id: "webcam",
      title: "Webcam",
      fields: [
        {
          id: "resolution",
          label: "Resolution",
          kind: "select",
          requiredForVendor: true,
          options: [
            { id: "720p", label: "720p" },
            { id: "1080p", label: "1080p" },
            { id: "1440p", label: "1440p" },
            { id: "4k", label: "4K" },
          ],
        },
        {
          id: "frame_rate",
          label: "Frame Rate",
          kind: "select",
          options: [
            { id: "30", label: "30 fps" },
            { id: "60", label: "60 fps" },
          ],
        },
        {
          id: "field_of_view",
          label: "Field of View",
          kind: "select",
          options: ["65", "78", "90", "95", "120"].map((v) => ({
            id: v,
            label: `${v}°`,
          })),
        },
        {
          id: "autofocus",
          label: "Autofocus",
          kind: "select",
          options: [
            { id: "fixed", label: "Fixed focus" },
            { id: "auto", label: "Autofocus" },
          ],
        },
        {
          id: "microphone_builtin",
          label: "Built-in Microphone",
          kind: "select",
          options: [
            { id: "none", label: "None" },
            { id: "mono", label: "Mono" },
            { id: "stereo", label: "Stereo" },
            { id: "nc", label: "Noise-cancelling" },
          ],
        },
        {
          id: "connection",
          label: "Connection",
          kind: "select",
          requiredForVendor: true,
          options: [
            { id: "usb_a", label: "USB-A" },
            { id: "usb_c", label: "USB-C" },
          ],
        },
        {
          id: "privacy_shutter",
          label: "Privacy Shutter",
          kind: "select",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
        },
      ],
    },
  ],
};
