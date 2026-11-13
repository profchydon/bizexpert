import { file_image, file_jpeg, file_pdf, file_png } from "@/assets/icons";

export const getFileIcon = (url: string = ""): string => {
  const cleaned = url?.split("?")?.[0];
  const parts = cleaned?.split("/");
  const filename = parts?.[parts?.length - 1];
  const extension = filename?.split(".")?.pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      return file_pdf;
    case "png":
      return file_png;
    case "jpg":
      return file_jpeg;
    case "jpeg":
      return file_jpeg;
    default:
      return file_image;
  }
};
