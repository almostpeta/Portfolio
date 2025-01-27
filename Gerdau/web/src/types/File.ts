export interface File {
  name: string;
  url: string;
  type: "pdf" | "image" | "csv" | "docx" | "xlsx";
}
