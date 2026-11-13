type ReadXlsxFile = (file: File | Buffer) => Promise<any[][]>;

declare module "read-excel-file" {
  const readXlsxFile: ReadXlsxFile;
  export default readXlsxFile;
}
