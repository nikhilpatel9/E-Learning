// utils/pdfDownloader.js
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export const downloadPDF = async (url) => {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    
    const tempDir = 'temp_pdfs';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    const filename = `pdf-${Date.now()}.pdf`;
    const filePath = path.join(tempDir, filename);
    
    fs.writeFileSync(filePath, response.data);
    return filePath;
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Failed to download PDF');
  }
};