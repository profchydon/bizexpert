export function shouldResetComboBoxQueryOnOpen(
  inputValue: string,
  selectedLabel: string,
) {
  return inputValue.length === 0 || inputValue === selectedLabel;
}
