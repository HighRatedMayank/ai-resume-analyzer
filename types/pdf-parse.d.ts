declare module 'pdf-parse' {
  interface PDFParseData {
    text: string;
    // Add other properties as needed
  }
  function pdfParse(buffer: Buffer): Promise<PDFParseData>;
  export = pdfParse;
  export default pdfParse;
}