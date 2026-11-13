export interface SpecTypeOption {
  label: string;
  value: string;
}

export const specTypeOptions: SpecTypeOption[] = [
  { label: "Condition", value: "condition" },
  { label: "Processor", value: "processor" },
  { label: "RAM", value: "ram" },
  { label: "Storage", value: "storage" },
  { label: "Graphics", value: "graphics" },
  { label: "Display", value: "display" },
  { label: "Screen Size", value: "screen-size" },
  { label: "Resolution", value: "resolution" },
  { label: "Refresh Rate", value: "refresh-rate" },
  { label: "Panel Type", value: "panel-type" },
  { label: "Brightness", value: "brightness" },
  { label: "Aspect Ratio", value: "aspect-ratio" },
  { label: "Battery", value: "battery" },
  { label: "Operating System", value: "os" },
  { label: "Camera", value: "camera" },
  { label: "Cellular / Network", value: "network" },
  { label: "SIM", value: "sim" },
  { label: "Connectivity", value: "connectivity" },
  { label: "Ports", value: "ports" },
  { label: "Wi-Fi Standard", value: "wifi-standard" },
  { label: "Throughput", value: "throughput" },
  { label: "PoE", value: "poe" },
  { label: "Rack Units", value: "rack-units" },
  { label: "Audio Output", value: "audio-output" },
  { label: "Driver Size", value: "driver-size" },
  { label: "Microphone", value: "microphone" },
  { label: "Power Delivery", value: "power-delivery" },
  { label: "Max Displays", value: "max-displays" },
  { label: "Capacity", value: "capacity" },
  { label: "Output Power", value: "output-power" },
  { label: "Battery Type", value: "battery-type" },
  { label: "Outlets", value: "outlets" },
  { label: "Runtime", value: "runtime" },
  { label: "Authentication", value: "authentication" },
  { label: "Compatibility", value: "compatibility" },
  { label: "DPI", value: "dpi" },
  { label: "Switch Type", value: "switch-type" },
  { label: "Layout", value: "layout" },
  { label: "Material", value: "material" },
  { label: "Weight", value: "weight" },
  { label: "Dimensions", value: "dimensions" },
  { label: "Colour", value: "colour" },
  { label: "Keyboard", value: "keyboard" },
  { label: "Power Adapter", value: "power_adapter" },
  { label: "Warranty", value: "warranty" },
];

export const addableSpecTypeOptions: SpecTypeOption[] = specTypeOptions.filter(
  (option) => option.value !== "condition",
);

export function specTypeLabel(type: string): string {
  const known = specTypeOptions.find((option) => option.value === type);
  if (known) return known.label;
  if (!type) return "";
  return type.charAt(0).toUpperCase() + type.slice(1);
}
