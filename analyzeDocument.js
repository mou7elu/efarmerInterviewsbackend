/**
 * Script d'analyse du format des codes dans le fichier Word
 */

require('dotenv').config();
const mammoth = require('mammoth');
const path = require('path');

const DOCX_FILE = path.join(__dirname, 'Questionnaire_IEEA.docx');

async function analyzeDocument() {
  try {
    console.log('📥 Lecture du fichier Word...');
    const { value: text } = await mammoth.extractRawText({ path: DOCX_FILE });
    
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    
    console.log('\n🔍 ANALYSE DES PATTERNS DE CODES:');
    console.log('Recherche de lignes contenant Q suivi de chiffres...\n');
    
    // Chercher différents patterns possibles
    const patterns = [
      /Q\.\d+/g,           // Q.1, Q.2, etc.
      /Q\d+/g,             // Q1, Q2, etc.
      /Q\s+\d+/g,          // Q 1, Q 2, etc.
      /Q\s*:\s*\d+/g,      // Q: 1, Q:2, etc.
      /\bQ\s*[-\.]\s*\d+/g // Q-1, Q.1, etc.
    ];
    
    patterns.forEach((pattern, index) => {
      const matches = text.match(pattern);
      if (matches) {
        console.log(`Pattern ${index + 1} (${pattern}): ${matches.length} occurrences`);
        console.log('Exemples:', matches.slice(0, 5).join(', '));
        console.log('');
      }
    });
    
    console.log('📝 EXEMPLES DE LIGNES AVEC POSSIBLES CODES:');
    let count = 0;
    for (let i = 0; i < lines.length && count < 20; i++) {
      const line = lines[i];
      if (/Q/i.test(line) && /\d/.test(line)) {
        console.log(`${count + 1}. "${line}"`);
        count++;
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

analyzeDocument();