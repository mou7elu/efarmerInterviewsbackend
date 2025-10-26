const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const fs = require('fs');
const path = require('path');

// Remplit le template DOCX avec les données de l'entretien
async function fillDocxTemplate(templatePath, outputPath, interviewData) {
  const content = fs.readFileSync(templatePath, 'binary');
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

  // Adapter les données selon le template
  doc.setData(interviewData);

  try {
    doc.render();
  } catch (error) {
    throw new Error('Erreur lors du rendu du template DOCX: ' + error.message);
  }

  const buf = doc.getZip().generate({ type: 'nodebuffer' });
  fs.writeFileSync(outputPath, buf);
}

module.exports = { fillDocxTemplate };
