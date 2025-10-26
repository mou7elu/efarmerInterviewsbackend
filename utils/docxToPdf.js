const mammoth = require('mammoth');
const puppeteer = require('puppeteer');
const fs = require('fs');

// Convertit un fichier DOCX en PDF sans LibreOffice
async function convertDocxToPdf(docxPath, pdfPath) {
  // 1. Convertir DOCX en HTML
  const { value: html } = await mammoth.convertToHtml({ path: docxPath });

  // 2. Générer le PDF à partir du HTML
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ path: pdfPath, format: 'A4' });
  await browser.close();
}

module.exports = { convertDocxToPdf };
