import type { SpecSection } from "../types";

export const keyboardLanguageOptions = [
  { id: "en_us", label: "English (US)" },
  { id: "en_uk", label: "English (UK)" },
  { id: "fr", label: "French" },
  { id: "de", label: "German" },
  { id: "es", label: "Spanish" },
  { id: "pt_br", label: "Portuguese (Brazil)" },
  { id: "pt_eu", label: "Portuguese (EU)" },
  { id: "nordic", label: "Nordic" },
  { id: "it", label: "Italian" },
  { id: "ar", label: "Arabic" },
  { id: "ru", label: "Russian" },
  { id: "ja", label: "Japanese" },
  { id: "ko", label: "Korean" },
  { id: "zh", label: "Chinese" },
];

export const laptopInputPhysicalSection: SpecSection = {
  id: "input_physical",
  title: "Input, Physical & OS",
  fields: [
    {
      id: "keyboard_language",
      label: "Keyboard Language",
      kind: "combobox",
      requiredForVendor: true,
      allowOther: true,
      options: keyboardLanguageOptions,
    },
    {
      id: "keyboard_layout",
      label: "Keyboard Layout",
      kind: "select",
      options: [
        { id: "ansi", label: "ANSI" },
        { id: "iso", label: "ISO" },
        { id: "jis", label: "JIS" },
      ],
    },
    {
      id: "keyboard_backlight",
      label: "Keyboard Backlight",
      kind: "select",
      options: [
        { id: "none", label: "None" },
        { id: "single", label: "Single colour" },
        { id: "rgb", label: "RGB" },
      ],
    },
    {
      id: "fingerprint_reader",
      label: "Fingerprint Reader",
      kind: "select",
      options: [
        { id: "yes", label: "Yes" },
        { id: "no", label: "No" },
      ],
    },
    {
      id: "face_recognition",
      label: "Face Recognition",
      kind: "select",
      options: [
        { id: "windows_hello", label: "Yes (Windows Hello)" },
        { id: "face_id", label: "Yes (Face ID)" },
        { id: "no", label: "No" },
      ],
    },
    {
      id: "weight_kg",
      label: "Weight",
      unit: "kg",
      kind: "number",
      placeholder: "e.g. 1.4",
      numberMin: 0,
      requiredForVendor: true,
    },
    {
      id: "build_material",
      label: "Build Material",
      kind: "combobox",
      allowOther: true,
      options: [
        { id: "aluminium", label: "Aluminium" },
        { id: "magnesium", label: "Magnesium Alloy" },
        { id: "polycarbonate", label: "Polycarbonate" },
        { id: "carbon_fibre", label: "Carbon Fibre" },
      ],
    },
    {
      id: "operating_system",
      label: "Operating System",
      kind: "select",
      requiredForVendor: true,
      options: [
        { id: "win11_home", label: "Windows 11 Home" },
        { id: "win11_pro", label: "Windows 11 Pro" },
        { id: "macos", label: "macOS" },
        { id: "chromeos", label: "ChromeOS" },
        { id: "linux", label: "Linux" },
        { id: "none", label: "No OS (Bare Metal)" },
      ],
    },
    {
      id: "os_version",
      label: "OS Version",
      kind: "text",
      placeholder: "e.g. Windows 11 Pro 23H2",
    },
    {
      id: "webcam_resolution",
      label: "Webcam Resolution",
      kind: "select",
      options: [
        { id: "none", label: "None" },
        { id: "720p", label: "720p" },
        { id: "1080p", label: "1080p" },
        { id: "1440p", label: "1440p" },
        { id: "4k", label: "4K" },
      ],
    },
  ],
};
