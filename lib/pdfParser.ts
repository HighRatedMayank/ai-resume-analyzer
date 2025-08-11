// import pdfParse from 'pdf-parse';
// import * as fs from 'fs';

// export async function extractTextFromPdf(filePath: string): Promise<string> {
//     const dataBuffer = fs.readFileSync(filePath);
//     const data = await pdfParse(dataBuffer);
//     return data.text;
// }

/**
 * Extract text from a PDF given a Buffer (from uploaded file)
 */
export async function extractTextFromBuffer(buffer: Buffer): Promise<string> {
  const pdfParse = (await import('pdf-parse')).default;
  const data = await pdfParse(buffer);
  return data.text;
}


// Example usage:
// extractTextFromPdf('path/to/your/document.pdf').then(text => {
//     console.log('Error extracting text:', error);
// });
