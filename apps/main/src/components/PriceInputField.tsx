// import { FieldError, useController, useFormContext } from "react-hook-form";
// import { Input } from "./ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "./ui/select";
// import { FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

// interface PriceInputFieldProps {
//   name: string;
//   currencyName: string;
//   label: string | React.ReactNode;
//   className?: string;
//   error?: FieldError | undefined;
//   currencyError?: FieldError | undefined;
//   data?: any[];
// }

// const PriceInputField: React.FC<PriceInputFieldProps> = (props) => {
//   const { name, currencyName, label, className, error, currencyError, data } =
//     props;
//   const { control } = useFormContext();

//   const {
//     field: { value: priceValue, onChange: onPriceChange },
//   } = useController({ name, control });

//   const {
//     field: { value: currencyValue, onChange: onCurrencyChange },
//   } = useController({ name: currencyName, control });

//   return (
//     <FormItem className={className}>
//       <FormLabel>{label}</FormLabel>
//       <div className="flex items-center h-[44px] w-full rounded-md border border-gray-200 bg-white  py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300">
//         <Input
//           placeholder="Add purchase price"
//           type="number"
//           value={priceValue}
//           onChange={onPriceChange}
//           className="w-full border-x-0 rounded-tr-none rounded-br-none "
//         />
//         <Select
//           value={currencyValue}
//           onValueChange={onCurrencyChange}
//           defaultValue={currencyValue}
//         >
//           <SelectTrigger className="w-fit ">
//             <SelectValue placeholder="Currency" />
//           </SelectTrigger>
//           <SelectContent>
//             {data?.map((currency) => (
//               <SelectItem value={currency?.id}>{currency?.code}</SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
//       {error && (
//         <span className="text-xs font-medium text-error-500 dark:text-error-500">
//           {error?.message}
//         </span>
//       )}
//       {currencyError && (
//         <span className="text-xs font-medium text-error-500 dark:text-error-500">
//           {currencyError?.message}
//         </span>
//       )}
//     </FormItem>
//   );
// };

// export default PriceInputField;

// import { FieldError, useController, useFormContext } from "react-hook-form";
// import { Input } from "./ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "./ui/select";
// import { FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

// interface PriceInputFieldProps {
//   name: string;
//   currencyName: string;
//   label: string | React.ReactNode;
//   className?: string;
//   error?: FieldError | undefined;
//   currencyError?: FieldError | undefined;
//   data?: any[];
// }

// const PriceInputField: React.FC<PriceInputFieldProps> = (props) => {
//   const { name, currencyName, label, className, error, currencyError, data } =
//     props;
//   const { control } = useFormContext();

//   const {
//     field: { value: priceValue, onChange: onPriceChange },
//   } = useController({ name, control });

//   const {
//     field: { value: currencyValue, onChange: onCurrencyChange },
//   } = useController({ name: currencyName, control });

//   // const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   const value = parseFloat(e.target.value);
//   //   onPriceChange(!isNaN(value) && value >= 0 ? value : "");
//   // };

// const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   let value = e.target.value;

//   value = value.replace(/[^0-9.eE]/g, "");

//   if (/^[eE]/.test(value)) {
//     value = "";
//   }

//   value = value.replace(/(\..*?)\..*/g, "$1");

//   if (value.startsWith(".")) {
//     value = "0" + value;
//   }

//   if (/e/i.test(value)) {
//     value = "";
//   }

//   if (value.startsWith("-")) {
//     value = value.replace("-", "");
//   }

//   onPriceChange(value);
// };

//   return (
//     <FormItem className={className}>
//       <FormLabel>{label}</FormLabel>
//       <div className="flex items-center h-[44px] w-full rounded-md border border-gray-200 bg-white py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300">
//         <Input
//           placeholder="Add purchase price"
//           type="number"
//           value={priceValue}
//           onChange={handlePriceChange}
//           className="w-full border-x-0 rounded-tr-none rounded-br-none"
//         />
//         <Select
//           value={currencyValue}
//           onValueChange={onCurrencyChange}
//           defaultValue={currencyValue}
//         >
//           <SelectTrigger className="w-fit">
//             <SelectValue placeholder="Currency" />
//           </SelectTrigger>
//           <SelectContent>
//             {data?.map((currency) => (
//               <SelectItem key={currency?.id} value={currency?.id}>
//                 {currency?.code}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
//       {error && (
//         <span className="text-xs font-medium text-error-500 dark:text-error-500">
//           {error?.message}
//         </span>
//       )}
//       {currencyError && (
//         <span className="text-xs font-medium text-error-500 dark:text-error-500">
//           {currencyError?.message}
//         </span>
//       )}
//     </FormItem>
//   );
// };

// export default PriceInputField;

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { FormItem, FormLabel } from "./ui/form";
import { useEffect, useMemo, useRef } from "react";
import { FieldError, useController, useFormContext } from "react-hook-form";
import { Input } from "./ui/input";

interface PriceInputFieldProps {
  name: string;
  currencyName: string;
  label: string | React.ReactNode;
  className?: string;
  error?: FieldError | undefined;
  currencyError?: FieldError | undefined;
  data?: any[];
  defaultValues?: {
    price?: string | number;
    currency?: string | number;
  };
}

const PriceInputField: React.FC<PriceInputFieldProps> = ({
  name,
  currencyName,
  label,
  className,
  error,
  currencyError,
  data,
  defaultValues,
}) => {
  const { control, setValue } = useFormContext();

  const {
    field: { value: priceValue, onChange: onPriceChange },
  } = useController({ name, control });

  const {
    field: { value: currencyValue, onChange: onCurrencyChange },
  } = useController({ name: currencyName, control });

  const initialized = useRef(false);

  useEffect(() => {
    if (defaultValues && !initialized.current) {
      if (defaultValues.price !== undefined) {
        setValue(name, defaultValues.price);
      }
      if (defaultValues.currency !== undefined) {
        setValue(currencyName, defaultValues.currency);
      }
      initialized.current = true;
    }
  }, [defaultValues, name, currencyName, setValue]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    value = value.replace(/[^0-9.eE]/g, "");

    if (/^[eE]/.test(value)) {
      value = "";
    }

    value = value.replace(/(\..*?)\..*/g, "$1");

    if (value.startsWith(".")) {
      value = "0" + value;
    }

    if (/e/i.test(value)) {
      value = "";
    }

    if (value.startsWith("-")) {
      value = value.replace("-", "");
    }

    onPriceChange(value);
  };

  return (
    <FormItem className={className}>
      <FormLabel>{label}</FormLabel>
      <div className="flex items-center h-[44px] w-full rounded-md border border-gray-200 bg-white py-2 text-sm ring-offset-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950">
        <Input
          placeholder="Add purchase price"
          type="number"
          value={priceValue}
          onChange={handlePriceChange}
          className="w-full border-x-0 rounded-tr-none rounded-br-none"
          data-testid="priceinputfield-input"
        />
        <Select
          value={currencyValue}
          onValueChange={onCurrencyChange}
          defaultValue={currencyValue}
          data-testid="priceinputfield-select"
        >
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            {data?.map((currency) => (
              <SelectItem key={currency?.id} value={currency?.id}>
                {currency?.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && (
        <span className="text-xs font-medium text-error-500 dark:text-error-500">
          {error?.message}
        </span>
      )}
      {currencyError && (
        <span className="text-xs font-medium text-error-500 dark:text-error-500">
          {currencyError?.message}
        </span>
      )}
    </FormItem>
  );
};

export default PriceInputField;
