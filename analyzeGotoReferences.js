/**
 * Script pour analyser spécifiquement les références Q.16, Q.34, etc.
 */

require('dotenv').config();
const mammoth = require('mammoth');
const path = require('path');

const DOCX_FILE = path.join(__dirname, 'Questionnaire_IEEA.docx');

async function analyzeGotoReferences() {
  try {
    console.log('📥 Lecture du fichier Word...');
    const { value: text } = await mammoth.extractRawText({ path: DOCX_FILE });
    
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    
    console.log('\n🔍 RECHERCHE DES RÉFÉRENCES DE SAUT (Q.X):');
    
    const gotoPattern = /Si\s+Q\.(\d+)\s*=\s*["""]?([^"""]+?)["""]?,?\s*aller\s+à\s+Q\.(\d+)/gi;
    
    let foundReferences = new Set();
    let gotoCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Chercher les patterns de saut
      let match;
      while ((match = gotoPattern.exec(line)) !== null) {
        const sourceQ = match[1];
        const condition = match[2].trim();
        const targetQ = match[3];
        
        foundReferences.add(`Q.${sourceQ}`);
        foundReferences.add(`Q.${targetQ}`);
        
        console.log(`${++gotoCount}. Si Q.${sourceQ} = "${condition}" → aller à Q.${targetQ}`);
        
        // Regarder les lignes précédentes pour trouver la question Q.16
        for (let j = Math.max(0, i - 5); j < i; j++) {
          const prevLine = lines[j];
          if (/\?$/.test(prevLine) || 
              /^(Quel|Combien|Avez|Êtes|Quelle|Comment|Où)/i.test(prevLine)) {
            console.log(`   Question probable: "${prevLine}"`);
            break;
          }
        }
        console.log('');
      }
    }
    
    console.log('\n📊 RÉSUMÉ:');
    console.log(`   ${gotoCount} références de saut trouvées`);
    console.log(`   ${foundReferences.size} questions référencées`);
    
    console.log('\n📝 TOUTES LES QUESTIONS RÉFÉRENCÉES:');
    const sortedRefs = Array.from(foundReferences).sort((a, b) => {
      const numA = parseInt(a.split('.')[1]);
      const numB = parseInt(b.split('.')[1]);
      return numA - numB;
    });
    
    sortedRefs.forEach(ref => console.log(`   ${ref}`));
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

analyzeGotoReferences();