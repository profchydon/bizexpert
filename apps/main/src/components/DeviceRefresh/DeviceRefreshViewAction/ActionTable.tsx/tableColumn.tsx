import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { SafeImage } from "@/components/SafeImage";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ViewTableActionsColumnProps = {
  handleActionClick: (item: Record<string, string>) => void;
  showStorageDuration?: boolean;
};

const ViewTableActionsColumn = ({
  handleActionClick,
  showStorageDuration = true,
}: ViewTableActionsColumnProps): readonly ColumnDef<Record<string, any>>[] => {
  const columns: ColumnDef<Record<string, any>>[] = [
    {
      header: "Equipment",
      accessorKey: "title",
      cell: ({ row }) => {
        return (
          <div className="flex flex-row items-center gap-x-3 sm:gap-x-1">
            <div className="rounded-full w-[40px] flex flex-col justify-center items-center h-[40px] bg-gray-100">
              <SafeImage
                src={row?.original?.image_url}
                alt={row?.original?.title}
                className="w-full object-fill rounded-full"
                width={40}
                height={40}
              />
            </div>
            <div className="flex flex-col flex-1">
              <p
                className="text-gray-900 font-medium text-sm w-[30ch] truncate"
                title={row?.original?.title}
              >
                {row?.original?.title}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Collection start date",
      accessorKey: "collectionDate",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <p className="text-gray-600 text-sm">
              {!row?.original?.collectionDate ? (
                <Badge variant="red">Not available</Badge>
              ) : (
                dayjs(row?.original?.collectionDate).format("MMM DD, YYYY")
              )}
            </p>
          </div>
        );
      },
    },
    // ...(showStorageDuration
    //   ? [
    //       {
    //         header: "Storage duration",
    //         accessorKey: "storageDuration",
    //         // @ts-ignore
    //         cell: ({ row }) => {
    //           const duration = row?.original?.storageDuration;
    //           const durationNumber = Number(duration);

    //           return (
    //             <div className="flex flex-col">
    //               <p className="text-gray-900 text-sm">
    //                 {duration &&
    //                 !isNaN(durationNumber) &&
    //                 durationNumber > 0 ? (
    //                   `${durationNumber} ${durationNumber > 1 ? "months" : "month"}`
    //                 ) : (
    //                   <Badge variant="red">Not available</Badge>
    //                 )}
    //               </p>
    //             </div>
    //           );
    //         },
    //       },
    //     ]
    //   : []),
    {
      header: "Replacement Items",
      accessorKey: "items",
      cell: ({ row }) => {
        return (
          <div className="flex">
            {Object.hasOwn(row?.original, "items") &&
            row?.original?.items?.length > 0 ? (
              row?.original?.items?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="text-xs flex items-center sm:w-[276px] gap-x-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={item?.image || item?.image_url || ""}
                      alt="asset_image"
                    />
                    <AvatarFallback className="text-gray-600 bg-gray-100">
                      {item?.asset?.name?.[0] || item?.title || ""}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-gray-900 font-medium">
                    {item?.title} {item?.asset?.name}{" "}
                    {item?.specification?.properties?.condition}{" "}
                    {item?.specification?.properties?.memory}{" "}
                    {item?.specification?.properties?.processor}{" "}
                    {item?.specification?.properties?.storage}
                  </span>
                </div>
              ))
            ) : (
              <Badge variant="red">Not available</Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "action",
      cell: ({ row }) => {
        return handleActionClick(row?.original);
      },
    },
  ];

  return columns;
};

export default ViewTableActionsColumn;

// import { ColumnDef } from "@tanstack/react-table";
// import dayjs from "dayjs";
// import Image from "next/image";
// import { roundedImage_placeholder } from "@/assets/images";
// import ReactCountryFlag from "react-country-flag";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// const ViewTableActionsColumn = (
//   action: (item: Record<string, string>) => void,
// ): readonly ColumnDef<Record<string, any>>[] => {
//   const columns: ColumnDef<Record<string, any>>[] = [
//     {
//       header: "Equipment",
//       accessorKey: "title",
//       cell: ({ row }) => {
//         return (
//           <div className="flex flex-row items-center gap-x-3 sm:gap-x-1">
//             <div className="rounded-full w-[40px] flex flex-col justify-center items-center h-[40px] bg-gray-100">
//               <Image
//                 src={row?.original?.image_url || roundedImage_placeholder}
//                 alt={row?.original?.title}
//                 className="w-full object-fill rounded-full"
//                 width={40}
//                 height={40}
//               />
//             </div>
//             <div className="flex flex-col flex-1">
//               <p
//                 className="text-gray-900 font-medium text-sm w-[30ch] truncate"
//                 title={row?.original?.title}
//               >
//                 {row?.original?.title}
//               </p>
//             </div>
//           </div>
//         );
//       },
//     },
//     {
//       header: "Collection start date",
//       accessorKey: "collectionDate",
//       cell: ({ row }) => {
//         return (
//           <div className="flex flex-col">
//             <p className="text-gray-600 text-sm">
//               {!row?.original?.collectionDate ? (
//                 <Badge variant="red">Not available</Badge>
//               ) : (
//                 dayjs(row?.original?.collectionDate).format("MMM DD, YYYY")
//               )}
//             </p>
//           </div>
//         );
//       },
//     },
//     {
//       header: "Storage duration",
//       accessorKey: "storageDuration",
//       cell: ({ row }) => {
//         return (
//           <div className="flex flex-col">
//             <p className="text-gray-900 text-sm">
//               {row?.original?.storageDuration &&
//               Number(row?.original?.storageDuration) > 1 ? (
//                 `${row?.original?.storageDuration} months`
//               ) : row?.original?.storageDuration &&
//                 Number(row?.original?.storageDuration) < 2 ? (
//                 `${row?.original?.storageDuration} month`
//               ) : (
//                 <Badge variant="red">Not available</Badge>
//               )}
//             </p>
//           </div>
//         );
//       },
//     },
//     {
//       header: "Replacement Items",
//       accessorKey: "items",
//       cell: ({ row }) => {
//         return (
//           <div className="flex">
//             {Object.hasOwn(row?.original, "items") &&
//             row?.original?.items?.length > 0 ? (
//               row?.original?.items?.map((item: any, index: number) => (
//                 <div
//                   key={index}
//                   className="text-xs flex items-center sm:w-[276px] gap-x-3"
//                 >
//                   <Avatar className="h-8 w-8">
//                     <AvatarImage
//                       src={item?.image || item?.image_url || ""}
//                       alt="asset_image"
//                     />
//                     <AvatarFallback className="text-gray-600 bg-gray-100">
//                       {item?.asset?.name?.[0] || item?.title || ""}
//                     </AvatarFallback>
//                   </Avatar>
//                   <span className="text-gray-900 font-medium">
//                     {item?.title} {item?.asset?.name}{" "}
//                     {item?.specification?.properties?.condition}{" "}
//                     {item?.specification?.properties?.memory}{" "}
//                     {item?.specification?.properties?.processor}{" "}
//                     {item?.specification?.properties?.storage}
//                   </span>
//                 </div>
//               ))
//             ) : (
//               <Badge variant="red">Not available</Badge>
//             )}
//           </div>
//         );
//       },
//     },

//     {
//       id: "action",
//       cell: ({ row }) => {
//         return action(row?.original);
//       },
//     },
//   ];
//   return columns;
// };

// export default ViewTableActionsColumn;
