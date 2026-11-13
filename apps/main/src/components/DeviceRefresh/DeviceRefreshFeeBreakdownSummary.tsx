// import { Card, CardContent } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { HelpCircle } from "lucide-react";
// import { FC } from "react";
// import { Offboard_asset } from "@/types/offboarding";

// interface OrderItem {
//   id: string;
//   name: string;
//   price: number;
//   tooltip?: string;
// }

// interface Props {
//   data?: Offboard_asset[];
//   feeData: Record<string, any>;
// }

// const DeviceRefreshFeeBreakdownSummary: FC<Props> = ({ data, feeData }) => {
//   const renderFeeSection = (
//     type: "onboarding" | "offboarding",
//     label: string
//   ) => {
//     const feeEntries = Object.entries(feeData?.[type] || {}).filter(
//       ([key]) => key !== "fee_summary"
//     );

//     return feeEntries.map(([assigneeId, assignedFeeData]) => {
//       const standardFee = assignedFeeData?.fees?.plan?.amount || 0;
//       const additionalFees = assignedFeeData?.fees?.additional_fee || {};
//       const totalFee = assignedFeeData?.fees?.total_fee || 0;

//       const additionalFeeItems: OrderItem[] = Object.entries(additionalFees)
//         .filter(([_, value]) => Number(value) > 0)
//         .map(([key, value]) => ({
//           id: key,
//           name: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
//           price: parseFloat(value as string),
//           tooltip: `Additional ${key.replace(/_/g, " ")}`,
//         }));

//       const items: OrderItem[] = [
//         {
//           id: `${type}-standard`,
//           name: `Standard ${type} fee`,
//           price: parseFloat(standardFee),
//           tooltip: `Standard fee for processing ${type} requests`,
//         },
//         ...additionalFeeItems,
//       ];

//       return (
//         <div key={`${type}-${assigneeId}`} className="space-y-6">
//           <div className="flex justify-between items-center text-xl text-gray-900">
//             <span className="font-medium capitalize">{label}</span>
//             <span className="font-medium">{items.length}</span>
//           </div>

//           <div className="space-y-4">
//             {items.map((item) => (
//               <div key={item.id} className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <span className="text-gray-700">{item.name}</span>
//                   {item.tooltip && (
//                     <TooltipProvider>
//                       <Tooltip>
//                         <TooltipTrigger>
//                           <HelpCircle className="h-5 w-5 text-gray-400" />
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p>{item.tooltip}</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>
//                   )}
//                 </div>
//                 <span className="text-gray-900">${item.price.toFixed(2)}</span>
//               </div>
//             ))}
//           </div>

//           <Separator className="my-4" />

//           <div className="flex justify-between items-center text-2xl font-semibold text-gray-900">
//             <span>Total</span>
//             <span>${Number(totalFee).toFixed(2)}</span>
//           </div>
//         </div>
//       );
//     });
//   };

//   const grandTotal = feeData?.fee_summary?.total_fee || 0;

//   return (
//     <Card className="w-full bg-gray-50 border-0">
//       <CardContent className="space-y-10 p-8">
//         {renderFeeSection("onboarding", "Onboarding")}
//         {renderFeeSection("offboarding", "Offboarding")}

//         <Separator className="my-4" />

//         <div className="flex justify-between items-center text-2xl font-bold text-gray-900">
//           <span>Grand Total</span>
//           <span>${grandTotal.toFixed(2)}</span>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default DeviceRefreshFeeBreakdownSummary;

// import { Card, CardContent } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { HelpCircle } from "lucide-react";
// import { FC } from "react";
// import { Offboard_asset } from "@/types/offboarding";

// interface OrderItem {
//   id: string;
//   name: string;
//   price: number;
//   tooltip?: string;
// }

// interface Props {
//   data?: Offboard_asset[];
//   feeData: Record<string, any>;
//   currencySymbol?: string;
// }

// const DeviceRefreshFeeBreakdownSummary: FC<Props> = ({
//   data,
//   feeData,
//   currencySymbol = "$",
// }) => {
//   const formatMoney = (value: number) =>
//     `${currencySymbol}${Number(value).toLocaleString(undefined, {
//       minimumFractionDigits: 2,
//     })}`;

//   const renderFeeSection = (
//     type: "onboarding" | "offboarding",
//     label: string
//   ) => {
//     const feeEntries = Object.entries(feeData?.[type] || {}).filter(
//       ([key]) => key !== "fee_summary"
//     );

//     return feeEntries.map(([assigneeId, assignedFeeData]) => {
//       const standardFee = Number(assignedFeeData?.fees?.plan?.amount || 0);
//       const additionalFees = assignedFeeData?.fees?.additional_fee || {};
//       const totalFee = Number(assignedFeeData?.fees?.total_fee || 0);

//       const additionalFeeItems: OrderItem[] = Object.entries(additionalFees)
//         .filter(([_, value]) => Number(value) > 0)
//         .map(([key, value]) => ({
//           id: key,
//           name: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
//           price: parseFloat(value as string),
//           tooltip: `Additional ${key.replace(/_/g, " ")}`,
//         }));

//       const items: OrderItem[] = [
//         {
//           id: `${type}-standard`,
//           name: `Standard ${type} fee`,
//           price: standardFee,
//           tooltip: `Standard fee for processing ${type} requests`,
//         },
//         ...additionalFeeItems,
//       ];

//       return (
//         <div key={`${type}-${assigneeId}`} className="space-y-4 text-sm text-gray-700">
//           {items.map((item) => (
//             <div key={item.id} className="flex justify-between items-start">
//               <div className="flex items-center gap-1">
//                 <span>{item.name}</span>
//                 {item.tooltip && (
//                   <TooltipProvider>
//                     <Tooltip>
//                       <TooltipTrigger asChild>
//                         <HelpCircle className="h-4 w-4 text-gray-400" />
//                       </TooltipTrigger>
//                       <TooltipContent>
//                         <p>{item.tooltip}</p>
//                       </TooltipContent>
//                     </Tooltip>
//                   </TooltipProvider>
//                 )}
//               </div>
//               <span className="text-right text-gray-900">
//                 {formatMoney(item.price)}
//               </span>
//             </div>
//           ))}

//           {/* <Separator />

//           <div className="flex justify-between text-base font-medium text-gray-900">
//             <span>Total {label} Fee</span>
//             <span>{formatMoney(totalFee)}</span>
//           </div> */}
//         </div>
//       );
//     });
//   };

//   const calculateTotalFee = (type: "onboarding" | "offboarding") => {
//     const entries = Object.entries(feeData?.[type] || {}).filter(
//       ([key]) => key !== "fee_summary"
//     );

//     return entries.reduce((acc, [, val]) => {
//       const fee = Number(val?.fees?.total_fee || 0);
//       return acc + fee;
//     }, 0);
//   };

//   const onboardingTotal = calculateTotalFee("onboarding");
//   const offboardingTotal = calculateTotalFee("offboarding");
//   const grandTotal = onboardingTotal + offboardingTotal;

//   const itemCount = data?.length || 0;
//   const purchasePrice = Number(feeData?.fee_summary?.total_purchase_price || 0);

//   return (
//     <Card className="w-full bg-white border-none shadow-none">
//       <CardContent className="space-y-6 p-6">
//         <div className="space-y-4 text-sm text-gray-700">
//           <div className="flex justify-between">
//             <span>Items</span>
//             <span>{itemCount}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Price</span>
//             <span>{formatMoney(purchasePrice)}</span>
//           </div>
//         </div>

//         {renderFeeSection("onboarding", "Onboarding")}
//         {renderFeeSection("offboarding", "Offboarding")}

//         {/* <Separator /> */}

//         <div className="flex justify-between text-lg font-semibold text-gray-900">
//           <span>Total</span>
//           <span>{formatMoney(grandTotal)}</span>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default DeviceRefreshFeeBreakdownSummary;

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { FC } from "react";
import { Offboard_asset } from "@/types/offboarding";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  tooltip?: string;
}

interface Props {
  data?: Offboard_asset[];
  feeData: Record<string, any>;
  currencySymbol?: string;
}

const UNASSIGNED_ORDER_SUMMARY_KEY = "unassigned";

const formatMoney = (value: number, symbol = "$") =>
  `${symbol}${Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
  })}`;

const DeviceRefreshFeeBreakdownSummary: FC<Props> = ({
  data,
  feeData,
  currencySymbol = "$",
}) => {
  const assigneeId = data?.[0]?.assignee?.id ?? UNASSIGNED_ORDER_SUMMARY_KEY;

  const assignedFeeData = {
    onboarding: feeData?.onboarding?.[assigneeId],
    offboarding: feeData?.offboarding?.[assigneeId],
  };

  const buildFeeItems = (
    type: "onboarding" | "offboarding",
    feeData: any,
  ): { items: OrderItem[]; total: number; price: number } => {
    const standardFee = Number(feeData?.fees?.plan?.amount || 0);
    const additionalFees = feeData?.fees?.additional_fee || {};
    const totalFee = Number(feeData?.fees?.total_fee || 0);
    const priceAmount = Number(feeData?.fees?.purchase_price || 0);

    const additionalFeeItems: OrderItem[] = Object.entries(additionalFees)
      .filter(([_, value]) => Number(value) > 0)
      .map(([key, value]) => ({
        id: key,
        name: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        price: parseFloat(value as string),
        tooltip: `Additional ${key.replace(/_/g, " ")}`,
      }));

    const items: OrderItem[] = [
      {
        id: `${type}-standard`,
        name: `Standard ${type} fee`,
        price: standardFee,
        tooltip: `Standard fee for processing ${type} requests`,
      },
      ...additionalFeeItems,
    ];

    return { items, total: totalFee, price: priceAmount };
  };

  const onboarding = assignedFeeData.onboarding
    ? buildFeeItems("onboarding", assignedFeeData.onboarding)
    : null;

  const offboarding = assignedFeeData.offboarding
    ? buildFeeItems("offboarding", assignedFeeData.offboarding)
    : null;

  const grandTotal = (onboarding?.total || 0) + (offboarding?.total || 0);
  const itemCount = data?.length || 0;
  const purchasePrice = (onboarding?.price || 0) + (offboarding?.price || 0);

  return (
    <Card className="w-full bg-white border-none shadow-none">
      <CardContent className="space-y-6 p-6">
        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>Items</span>
            <span>{itemCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Price</span>
            <span>{formatMoney(purchasePrice, currencySymbol)}</span>
          </div>
        </div>

        {[onboarding, offboarding].map(
          (feeSection, index) =>
            feeSection && (
              <div key={index} className="space-y-4 text-sm text-gray-700">
                {feeSection.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start"
                  >
                    <div className="flex items-center gap-1">
                      <span>{item.name}</span>
                      {item.tooltip && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{item.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <span className="text-right text-gray-900">
                      {formatMoney(item.price, currencySymbol)}
                    </span>
                  </div>
                ))}
              </div>
            ),
        )}

        <div className="flex justify-between text-lg font-semibold text-gray-900">
          <span>Total</span>
          <span>{formatMoney(grandTotal, currencySymbol)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceRefreshFeeBreakdownSummary;
