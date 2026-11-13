import React from "react";
import ReactTagsInput from "react-tagsinput";
interface Props {
  values: string[];
  setValues: (value: string[]) => void;
  placeholder?: string;
}
const TagsInput: React.FC<Props> = ({
  values,
  setValues,
  placeholder = "Add employees",
}) => {
  return (
    <ReactTagsInput
      value={values}
      onChange={(values) => setValues(values)}
      className="bg-white rounded-lg border border-gray-200 px-2 p-1"
      inputProps={{
        className:
          "react-tagsinput-input text-gray-700 placeholder:w-[400px] w-[150px] mb-0",
        placeholder,
      }}
      tagProps={{
        className:
          "react-tagsinput-tag bg-white text-gray-700 border border-gray-300 rounded-md text-gray-900 text-sm font-medium mt-[5px]",
        classNameRemove: "react-tagsinput-remove text-gray-400",
      }}
    />
  );
};

export default TagsInput;
