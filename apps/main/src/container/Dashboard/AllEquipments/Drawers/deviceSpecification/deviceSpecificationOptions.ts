interface DeviceSpecificationOption {
  label: string;
  value: string;
}

const KEYBOARD_OPTIONS: DeviceSpecificationOption[] = [
  { label: "English (US)", value: "English (US)" },
  { label: "English (UK)", value: "English (UK)" },
  { label: "French", value: "French" },
  { label: "German", value: "German" },
  { label: "Spanish", value: "Spanish" },
  { label: "Portuguese (Brazilian)", value: "Portuguese (Brazilian)" },
  { label: "Portuguese (European)", value: "Portuguese (European)" },
  {
    label: "Nordic (Swedish / Norwegian / Danish - often grouped)",
    value: "Nordic (Swedish / Norwegian / Danish - often grouped)",
  },
  { label: "Italian", value: "Italian" },
  { label: "Arabic", value: "Arabic" },
  { label: "Russian", value: "Russian" },
  { label: "Japanese", value: "Japanese" },
  { label: "Korean", value: "Korean" },
  { label: "Chinese (Simplified)", value: "Chinese (Simplified)" },
];

const POWER_ADAPTER_OPTIONS: DeviceSpecificationOption[] = [
  { label: "Type A - US, Canada, Japan", value: "Type A - US, Canada, Japan" },
  {
    label: "Type G - UK, Ireland, Nigeria, UAE, Singapore",
    value: "Type G - UK, Ireland, Nigeria, UAE, Singapore",
  },
  {
    label: "Type C - Europe, South America, much of Asia",
    value: "Type C - Europe, South America, much of Asia",
  },
  {
    label: "Type I - Australia, New Zealand, China",
    value: "Type I - Australia, New Zealand, China",
  },
  { label: "Type D / M - India", value: "Type D / M - India" },
  { label: "Type J - Switzerland", value: "Type J - Switzerland" },
];

export const DEVICE_SPEC_OPTIONS: DeviceSpecificationOption[] = [
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
  { label: "Warranty", value: "warranty" },
  { label: "Keyboard", value: "keyboard" },
  { label: "Power Adapter", value: "power_adapter" },
];

export const DEVICE_SPEC_VALUE_OPTIONS: Record<
  string,
  DeviceSpecificationOption[]
> = {
  keyboard: KEYBOARD_OPTIONS,
  power_adapter: POWER_ADAPTER_OPTIONS,
};
