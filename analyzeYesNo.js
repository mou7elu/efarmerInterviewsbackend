/**
 * Script pour analyser spécifiquement les patterns Oui/Non
 */

require('dotenv').config();
const mammoth = require('mammoth');
const path = require('path');

const DOCX_FILE = path.join(__dirname, 'Questionnaire_IEEA.docx');

async function analyzeYesNoPatterns() {
  try {
    console.log('📥 Lecture du fichier Word...');
    const { value: text } = await mammoth.extractRawText({ path: DOCX_FILE });
    
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    
    console.log('\n🔍 RECHERCHE DE PATTERNS OUI/NON:');
    
    const patterns = [
      /oui\s*\/\s*non/gi,
      /oui\s*,\s*non/gi,
      /oui\s+non/gi,
      /^oui$/gi,
      /^non$/gi,
      /masculin\s*\/\s*féminin/gi,
      /homme\s*\/\s*femme/gi
    ];
    
    let foundCount = 0;
    
    for (let i = 0; i < lines.length && foundCount < 30; i++) {
      const line = lines[i];
      
      for (const pattern of patterns) {
        if (pattern.test(line)) {
          console.log(`${foundCount + 1}. "${line}"`);
          
          // Regarder les lignes précédentes pour trouver la question
          for (let j = Math.max(0, i - 3); j < i; j++) {
            const prevLine = lines[j];
            if (/\?$/.test(prevLine) || 
                /^(Quel|Combien|Avez|Êtes|Quelle|Comment|Où|Sexe|Genre)/i.test(prevLine)) {
              console.log(`   Question: "${prevLine}"`);
              break;
            }
          }
          
          foundCount++;
          break;
        }
      }
    }
    
    console.log(`\n📊 Total trouvé: ${foundCount} patterns Oui/Non`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

analyzeYesNoPatterns();