export type Answers = Record<string, string | string[]>;

export type QuestionOption = {
  value: string;
  label: string;
};

export type QuestionDefinition = {
  key: string;
  question: string;
  options: readonly QuestionOption[];
  multiSelect: boolean;
  exclusiveOptions?: readonly string[];
  kind?: "count";
};
