import React from "react";
import Image from "next/image";
import FileUploader from "./FileUploader";
import { convertToKBOrMB } from "@/utils/convertToKBOrMB";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  cloud_upload_gray,
  progressbar_primary_600,
  roundedImage_placeholder,
} from "@/assets/images";

interface Props {
  setImages: (
    value: React.SetStateAction<File[] | string[] | undefined | any>,
  ) => void;
  images: File[] | string[];
  showImageList?: boolean;
  title?: string;
  description?: string;
  acceptFileType?: any;
  acceptanceText?: string;
  height?: string;
  showUpload?: boolean;
  maxFileSize?: number;
}

const FormFileAttachment: React.FC<Props> = ({
  setImages,
  images,
  showImageList = true,
  title,
  description,
  acceptFileType,
  acceptanceText = "PNG or JPG",
  height,
  showUpload = false,
  maxFileSize,
}) => {
  const handleDrop = (acceptedFiles: File[]) => {
    // setImages(acceptedFiles);
    const validFiles = maxFileSize
      ? acceptedFiles.filter((file) => file.size <= maxFileSize)
      : acceptedFiles;

    setImages(validFiles);
  };

  const acceptedTypes = acceptFileType || {
    "image/jpeg": [],
    "image/png": [],
  };

  const renderUploader = !showUpload
    ? !images || images.length < 1
    : Boolean(images);

  return (
    <>
      <div className="py-2">
        {(title || description) && (
          <div className="flex flex-col gap-y-1 pb-3">
            {title && <span className="text-sm font-medium">{title}</span>}
            {description && (
              <span className="text-gray-600 text-sm">{description}</span>
            )}
          </div>
        )}

        {renderUploader && (
          <FileUploader
            height={height || "4.625rem"}
            accept={acceptedTypes}
            onDrop={handleDrop}
            onFileDialogCancel={() => null}
            acceptanceText={acceptanceText}
            emptyState={cloud_upload_gray}
            emptyStateSize={{ width: 40, height: 40 }}
            hideOnDropValue
          />
        )}
      </div>

      {showImageList && images && images.length > 0 && (
        <div className="space-y-3">
          {images.map((image, index) => {
            const name = typeof image === "string" ? image : image.name;
            const size =
              typeof image === "string"
                ? "Image URL"
                : convertToKBOrMB(image.size);

            return (
              <div
                key={index}
                className="p-4 border gap-x-3 border-primary-600 rounded-xl cursor-pointer flex flex-row items-start"
                onClick={() => {
                  setImages((prev: any) =>
                    Array.isArray(prev)
                      ? prev.filter((item) =>
                          typeof item === "string"
                            ? item !== image
                            : item.name !== name,
                        )
                      : prev,
                  );
                }}
              >
                <Image
                  src={roundedImage_placeholder}
                  width={32}
                  height={32}
                  alt="rounded placeholder"
                />
                <div className="flex-1 flex flex-col">
                  <div className="flex flex-row items-start justify-between">
                    <div className="space-y-1">
                      <div
                        className="text-sm text-gray-700 font-medium truncate w-[35ch]"
                        title={name}
                      >
                        {name}
                      </div>
                      <div className="text-gray-600 text-sm">{size}</div>
                    </div>
                    <Cross2Icon className="size-4" aria-hidden="true" />
                  </div>
                  <div className="flex flex-row items-center gap-3 justify-between box-content">
                    <Image
                      src={progressbar_primary_600}
                      alt="progress bar"
                      height={8}
                      className="w-[92%]"
                    />
                    <p>100%</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default FormFileAttachment;

// import React from "react";
// import Image from "next/image";
// import FileUploader from "./FileUploader";
// import { convertToKBOrMB } from "@/utils/convertToKBOrMB";
// import { Cross2Icon } from "@radix-ui/react-icons";
// import {
//   cloud_upload_gray,
//   progressbar_primary_600,
//   roundedImage_placeholder,
// } from "@/assets/images";

// interface Props {
//   setImages: (
//     value: React.SetStateAction<File[] | string[] | undefined | any>,
//   ) => void;
//   images: File[] | string[];
//   showImageList?: boolean;
//   title?: string;
//   description?: string;
//   acceptFileType?: any;
//   acceptanceText?: string;
//   height?: string;
//   showUpload?: boolean;
// }

// const FormFileAttachment: React.FC<Props> = ({
//   setImages,
//   images,
//   showImageList = true,
//   title,
//   description,
//   acceptFileType,
//   acceptanceText = "PNG or JPG ",
//   height,
//   showUpload = false,
// }) => {
//   return (
//     <>
//       <div className="py-2">
//         <div className="flex flex-col gap-y-1 pb-3">
//           <span className="text-sm font-medium">{title}</span>
//           <span className="text-gray-600 text-sm empty:hidden">
//             {description}
//           </span>
//         </div>

//         {!showUpload && (!images || images?.length < 1) && (
//           <FileUploader
//             height={height || "4.625rem"}
//             accept={
//               !acceptFileType
//                 ? {
//                     "image/jpeg": [],
//                     "image/png": [],
//                   }
//                 : acceptFileType
//             }
//             onDrop={(acceptedFiles) => {
//               const acceptfiles = [];
//               setImages([acceptedFiles]);
//             }}
//             onFileDialogCancel={() => null}
//             acceptanceText={acceptanceText}
//             emptyState={cloud_upload_gray}
//             emptyStateSize={{ width: 40, height: 40 }}
//             hideOnDropValue={true}
//           />
//         )}
//         {showUpload && Boolean(images) && (
//           <FileUploader
//             height={height || "4.625rem"}
//             accept={
//               !acceptFileType
//                 ? {
//                     "image/jpeg": [],
//                     "image/png": [],
//                   }
//                 : acceptFileType
//             }
//             onDrop={(acceptedFiles) => {
//               const acceptfiles = [];
//               setImages(acceptedFiles);
//             }}
//             onFileDialogCancel={() => null}
//             acceptanceText={acceptanceText}
//             emptyState={cloud_upload_gray}
//             emptyStateSize={{ width: 40, height: 40 }}
//             hideOnDropValue={true}
//           />
//         )}
//       </div>

//       {showImageList && images && (
//         <div className="space-y-3">
//           {images?.map((image, index) => (
//             // eslint-disable-next-line react/jsx-key
//             <div
//               key={index}
//               className="p-4 border gap-x-3 border-primary-600 rounded-xl cursor-pointer flex flex-row items-start"
//               onClick={() => {
//                 setImages((prev: any) =>
//                   Array.isArray(prev)
//                     ? prev?.filter((item) =>
//                         typeof item === "string"
//                           ? item !== image
//                           : item.name !== (image as File).name,
//                       )
//                     : prev,
//                 );
//               }}
//             >
//               <Image
//                 src={roundedImage_placeholder}
//                 width={32}
//                 height={32}
//                 alt="roundedImage_placeholder"
//               />
//               <div className="flex-1 flex flex-col">
//                 <div className="flex flex-row items-start justify-between">
//                   <div className="space-y-1">
//                     <div
//                       className="text-sm text-gray-700 font-medium truncate w-[35ch]"
//                       title={typeof image === "string" ? image : image?.name}
//                     >
//                       {typeof image === "string" ? image : image?.name}
//                     </div>
//                     <div className="text-gray-600 text-sm">
//                       {typeof image !== "string"
//                         ? convertToKBOrMB((image as File)?.size)
//                         : "Image URL"}
//                     </div>
//                   </div>
//                   <Cross2Icon className="size-4" aria-hidden="true" />
//                 </div>
//                 <div className="flex flex-row items-center gap-3 justify-between box-content">
//                   <Image
//                     src={progressbar_primary_600}
//                     alt="progressbar_image"
//                     height={8}
//                     className="w-[92%]"
//                   />
//                   <p>100%</p>
//                 </div>
//               </div>

//               {/*  */}
//             </div>
//           ))}
//         </div>
//       )}
//     </>
//   );
// };

// export default FormFileAttachment;
