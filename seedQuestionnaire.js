/**
 * Script : seedQuestionnaire.js (version améliorée)
 * Objectif : Importer automatiquement toutes les questions + options + sauts depuis le fichier Word
 * Auteur : ChatGPT + mou7 mystic
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const {
  Questionnaire,
  Volet,
  Section,
  Question
} = require('./models');

// ======== ⚙️ CONFIGURATION ========
require('dotenv').config();
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/efarmer_interviews';
const DOCX_FILE = path.join(__dirname, 'Questionnaire_IEEA.docx');

// ======== 🧩 OUTILS ========

// Nettoyer le texte
const clean = txt => (txt || '').replace(/\s+/g, ' ').trim();

// Détecter le type d'une question
function detectType(questionText, optionsDetected = []) {
  const lower = questionText.toLowerCase();
  if (lower.includes('date')) return 'date';
  if (lower.includes('combien') || lower.includes('nombre') || lower.includes('superficie')) return 'number';
  if (lower.includes('oui') && lower.includes('non')) return 'boolean';
  if (lower.includes('choix multiple')) return 'multi_choice';
  if (lower.includes('choix unique') || optionsDetected.length > 0) return 'single_choice';
  return 'text';
}

// Fonction pour extraire toutes les références de saut du document
function extractGotoReferences(content) {
  const references = new Set();
  const gotoPattern = /Q\.(\d+)/g;
  
  let match;
  while ((match = gotoPattern.exec(content)) !== null) {
    references.add(parseInt(match[1]));
  }
  
  return references;
}

// Extraire les options (Oui/Non, listes numérotées, tirets…)
function extractOptions(lines, startIndex) {
  const options = [];
  let i = startIndex;
  const optionRegex = /^(\d+\.|-|•)\s*(.+)$/; // exemple : "1. Villa", "- Oui", "• Non"
  
  while (i < lines.length) {
    const line = clean(lines[i]);
    let optionFound = false;

    // Vérifier si c'est "Oui" ou "Non" sur des lignes séparées
    if (line.toLowerCase() === 'oui') {
      options.push({
        valeur: 'OUI',
        libelle: 'Oui',
      });
      // Vérifier si la ligne suivante est "Non"
      if (i + 1 < lines.length && clean(lines[i + 1]).toLowerCase() === 'non') {
        options.push({
          valeur: 'NON',
          libelle: 'Non',
        });
        i += 2; // Sauter les deux lignes
      } else {
        i++;
      }
      optionFound = true;
    }
    else if (line.toLowerCase() === 'non' && options.length === 0) {
      // Si on trouve "Non" en premier
      options.push({
        valeur: 'NON',
        libelle: 'Non',
      });
      i++;
      optionFound = true;
    }
    // Patterns spéciaux pour les options courantes
    else if (/^(Masculin|Féminin)$/i.test(line)) {
      options.push({
        valeur: line.toUpperCase(),
        libelle: clean(line),
      });
      i++;
      optionFound = true;
    }
    // Options avec séparateurs
    else if (/oui\s*\/\s*non/i.test(line) || /masculin\s*\/\s*féminin/i.test(line)) {
      const parts = line.split(/[\/,]/).map(p => clean(p));
      for (const part of parts) {
        if (part) {
          options.push({
            valeur: part.toUpperCase().replace(/\s+/g, '_'),
            libelle: clean(part),
          });
        }
      }
      i++;
      optionFound = true;
    }

    // Si pas de pattern spécial, utiliser la logique normale
    if (!optionFound) {
      if (optionRegex.test(line)) {
        const [, , libelle] = line.match(optionRegex);
        options.push({
          valeur: libelle.toUpperCase().replace(/\s+/g, '_'),
          libelle: clean(libelle),
        });
        i++;
      } else if (/^si q\.\d+/i.test(line)) {
        // condition / saut logique trouvé - stocker temporairement
        // Regex flexible pour gérer différents formats de saut
        let match = line.match(/^si\s+(q\.(\d+))\s*=\s*["""]([^"""]+)["""],?\s*alle[rz]\s+à\s+(q\.(\d+))/i);
        
        // Si pas de match, essayer une version plus permissive
        if (!match) {
          match = line.match(/^si\s+(q\.(\d+))\s*=\s*(.+?),?\s*alle[rz]\s+à\s+(q\.(\d+))/i);
        }
        
        if (match && options.length > 0) {
          const sourceQ = match[2];
          let condition = match[3].trim();
          // Nettoyer tous types de guillemets y compris Unicode
          condition = condition.replace(/^[\u201C\u201D\u2018\u2019""'"'„"'«»"'"]+|[\u201C\u201D\u2018\u2019""'"'„"'«»"'"]+$/g, '');
          const targetQ = match[match.length - 1]; // Dernière capture
          
          // Trouver l'option correspondante et ajouter le goto
          const matchingOption = options.find(opt => 
            opt.libelle.toLowerCase().includes(condition.toLowerCase()) ||
            opt.valeur.toLowerCase().includes(condition.toLowerCase().replace(/\s+/g, '_'))
          );
          
          if (matchingOption) {
            matchingOption.goto = `Q${targetQ.padStart(3, '0')}`;
          }
        }
        i++;
      } else {
        break;
      }
    }
  }

  return { options, nextIndex: i };
}

// Extraire les volets et sections
function parseDocument(content) {
  const lines = content.split('\n').map(l => clean(l)).filter(Boolean);
  const volets = [];
  let currentVolet = null;
  let currentSection = null;
  let questionCounter = 1; // Compteur séquentiel pour Q001, Q002, etc.
  
  // Mapping pour les références de saut (Q.16 du Word -> Q016 de notre système)
  const wordToSystemMapping = new Map();
  
  // Analyser d'abord toutes les références de saut pour identifier les numéros du Word
  const gotoReferences = extractGotoReferences(content);
  console.log(`🔗 ${gotoReferences.size} références de saut détectées dans le document`);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // --- Détection du Volet
    if (/^VOLET\s+\d+/i.test(line)) {
      if (currentVolet) volets.push(currentVolet);
      currentVolet = { titre: line, sections: [] };
      continue;
    }

    // --- Détection Section
    if (/^(INFORMATION|SITUATION|COMPOSITION|CONDITIONS|INFRASTRUCTURE|ACCÈS|ASPECTS|SITUATION ÉCONOMIQUE|EXPLOITATION|MAIN-D’ŒUVRE)/i.test(line)) {
      if (currentSection && currentVolet) currentVolet.sections.push(currentSection);
      currentSection = { titre: line, questions: [] };
      continue;
    }

    // --- Détection Question principale
    if (
      /\?$/.test(line) ||
      /^(Quel|Combien|Avez|Êtes|Quelle|Appartenez|Parmi|Dans|Nom|Prénom|Sexe|Date|Numéro|Lieu|Pays)/i.test(line)
    ) {
      const qText = clean(line);
      let { options, nextIndex } = extractOptions(lines, i + 1);
      const qType = detectType(qText, options);
      
      // Générer un code séquentiel Q001, Q002, etc.
      const systemCode = 'Q' + questionCounter.toString().padStart(3, '0');
      
      // Si cette question est référencée dans les sauts, créer le mapping
      if (gotoReferences.has(questionCounter)) {
        wordToSystemMapping.set(questionCounter, systemCode);
      }
      
      questionCounter++;

      currentSection?.questions.push({
        code: systemCode,
        texte: qText,
        type: qType,
        obligatoire: qText.includes('*'),
        options,
        wordReference: questionCounter - 1 // Référence au numéro du Word pour debug
      });

      i = nextIndex - 1; // sauter les lignes d'options déjà traitées
    }
  }

  if (currentSection && currentVolet) currentVolet.sections.push(currentSection);
  if (currentVolet) volets.push(currentVolet);
  return volets;
}

// ======== 🚀 MAIN ========

async function seed() {
  try {
    console.log('📥 Lecture du fichier Word...');
    const { value: text } = await mammoth.extractRawText({ path: DOCX_FILE });

    console.log('🧠 Analyse du contenu...');
    const volets = parseDocument(text);
    console.log(`✅ ${volets.length} volets détectés.`);

    await mongoose.connect(MONGO_URI);
    console.log('🗄️ Connecté à MongoDB');

    // Nettoyer les données existantes
    console.log('🧹 Nettoyage des données existantes...');
    await Question.deleteMany({});
    await Section.deleteMany({});
    await Volet.deleteMany({});
    await Questionnaire.deleteMany({});
    console.log('✅ Données nettoyées');

    const questionnaire = await Questionnaire.create({
      titre: 'Questionnaire IEEA',
      version: '2024-11-26',
      description: 'Questionnaire d\'identification des exploitants et exploitations d\'anacarde'
    });

    // Map pour stocker les correspondances code -> _id
    const questionsMap = new Map();

    for (const [vIndex, volet] of volets.entries()) {
      const voletDoc = await Volet.create({
        titre: volet.titre,
        ordre: vIndex + 1,
        questionnaireId: questionnaire._id
      });

      for (const [sIndex, section] of volet.sections.entries()) {
        const sectionDoc = await Section.create({
          titre: section.titre,
          ordre: sIndex + 1,
          voletId: voletDoc._id
        });

        for (const question of section.questions) {
          const questionDoc = await Question.create({
            code: question.code,
            texte: question.texte,
            type: question.type,
            obligatoire: question.obligatoire,
            options: question.options,
            sectionId: sectionDoc._id,
            voletId: voletDoc._id
          });
          
          // Stocker pour le post-processing des liens goto
          questionsMap.set(question.code, questionDoc._id);
        }
      }
    }

    console.log('🔗 Post-processing des liens goto...');
    await processGotoLinks(questionsMap);

    console.log('🎉 Importation complète du questionnaire réussie !');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Erreur lors de l’import :', err);
    mongoose.disconnect();
  }
}

// ======== 🔗 POST-PROCESSING DES LIENS GOTO ========

async function processGotoLinks(questionsMap) {
  try {
    let linksProcessed = 0;
    
    console.log(`🔍 Recherche des questions avec goto... (${questionsMap.size} questions dans la map)`);
    
    // Récupérer toutes les questions avec des options ayant des goto
    const questionsWithGoto = await Question.find({
      'options.goto': { $regex: /^Q\d+$/ }
    });

    console.log(` Questions trouvées avec critère MongoDB: ${questionsWithGoto.length}`);

    for (const question of questionsWithGoto) {
      let updated = false;
      
      for (const option of question.options) {
        if (option.goto && option.goto.startsWith('Q')) {
          // Trouver l'_id correspondant au code cible
          const targetId = questionsMap.get(option.goto);
          
          if (targetId) {
            option.gotoQuestionId = targetId;
            option.goto = targetId; // Remplacer le code par l'_id
            updated = true;
            linksProcessed++;
          } else {
            console.warn(`⚠️ Question cible non trouvée: ${option.goto}`);
          }
        }
      }
      
      if (updated) {
        await question.save();
      }
    }
    
    console.log(`✅ ${linksProcessed} liens goto traités avec succès`);
    
  } catch (error) {
    console.error('❌ Erreur lors du post-processing des liens goto:', error);
  }
}

seed();
