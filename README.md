# eFarmer Interviews - Backend API

API Node.js/Express pour la gestion des producteurs, parcelles et questionnaires agricoles.

## 📚 Documentation des Questions

### Guides Complets

- **[QUESTION_TYPES_EXAMPLES.md](./QUESTION_TYPES_EXAMPLES.md)** - Guide complet avec exemples détaillés
  - Description de chaque type de question
  - Exemples concrets d'utilisation
  - Cas d'usage réels
  - Tableau comparatif
  - Bonnes pratiques

- **[QUESTION_TYPES_QUICK_REF.md](./QUESTION_TYPES_QUICK_REF.md)** - Référence rapide (cheat sheet)
  - Résumé 1 page
  - Validation rapide
  - Exemples minimaux
  - Erreurs courantes

- **[QUESTION_SNIPPETS.md](./QUESTION_SNIPPETS.md)** - Templates réutilisables
  - Snippets copy-paste
  - Exemples prêts à l'emploi
  - Fonctions utilitaires

## 📝 Types de Questions

Le système supporte **6 types de questions**:

| Type | Description | UI | Options? |
|------|-------------|-----|----------|
| `text` | Texte libre | TextField | ❌ |
| `number` | Nombre avec unité | NumberField | ❌ |
| `date` | Sélecteur de date | DatePicker | ❌ |
| `boolean` | Oui/Non | Radio buttons | ❌ |
| `single_choice` | Un seul choix | **Dropdown list** | ✅ |
| `multi_choice` | Plusieurs choix | **Checkboxes** | ✅ |

### Exemples Rapides

```javascript
// Text
{ type: "text", options: [] }

// Number avec unité
{ type: "number", unite: "hectares", options: [] }

// Date
{ type: "date", options: [] }

// Boolean
{ type: "boolean", options: [] }

// Single Choice (Dropdown)
{ 
  type: "single_choice",
  options: [
    { valeur: "M", libelle: "Masculin", goto: null },
    { valeur: "F", libelle: "Féminin", goto: null }
  ]
}

// Multi Choice (Checkboxes)
{ 
  type: "multi_choice",
  options: [
    { valeur: "riz", libelle: "Riz" },
    { valeur: "mais", libelle: "Maïs" }
  ]
}
```

## 🔀 Logique Goto

Les options de `single_choice` et `multi_choice` peuvent avoir un champ `goto` pour créer des sauts conditionnels:

```javascript
{
  code: "Q10",
  type: "single_choice",
  options: [
    { valeur: "oui", libelle: "Oui, propriétaire" },
    { valeur: "non", libelle: "Non", goto: "Q15" }  // Saute à Q15
  ]
}
```

**Documentation mobile**: Voir `mobile_app/QUESTIONNAIRE_GOTO_LOGIC.md`

## 🗂️ Structure des Modèles

### Question
```javascript
{
  code: String,           // Ex: "Q27"
  texte: String,          // Texte de la question
  type: String,           // Type de question (voir ci-dessus)
  obligatoire: Boolean,   // Requis?
  unite: String,          // Ex: "FCFA", "hectares" (optionnel)
  automatique: Boolean,   // Calculé automatiquement?
  options: [Option],      // Tableau d'options (si applicable)
  sectionId: ObjectId,    // Référence à Section
  voletId: ObjectId,      // Référence à Volet
  referenceTable: String, // Table de référence (optionnel)
  referenceField: String  // Champ de la table (optionnel)
}
```

### Option
```javascript
{
  valeur: String,   // Valeur stockée (ex: "M")
  libelle: String,  // Texte affiché (ex: "Masculin")
  goto: String      // Code de question cible (optionnel)
}
```

## 🚀 API Endpoints

### Questions
```
GET    /api/questions              - Liste toutes les questions
GET    /api/questions/:id          - Détails d'une question
POST   /api/questions              - Créer une question
PUT    /api/questions/:id          - Modifier une question
DELETE /api/questions/:id          - Supprimer une question
```

### Questionnaires
```
GET    /api/questionnaires         - Liste des questionnaires
GET    /api/questionnaires/:id     - Détails d'un questionnaire
POST   /api/questionnaires         - Créer un questionnaire
PUT    /api/questionnaires/:id     - Modifier un questionnaire
```

### Réponses (Interviews)
```
GET    /api/interviews             - Liste des réponses
GET    /api/interviews/:id         - Détails d'une réponse
POST   /api/interviews             - Créer une réponse
PUT    /api/interviews/:id         - Modifier une réponse
```

## 🔧 Développement

### Installation
```bash
npm install
```

### Configuration
Créer un fichier `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/efarmer
PORT=5001
JWT_SECRET=your_secret_key
```

### Démarrage
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

### Tests
```bash
npm test
```

## 📦 Dépendances Principales

- **Express** - Framework web
- **Mongoose** - ODM MongoDB
- **JWT** - Authentification
- **Bcrypt** - Hachage des mots de passe
- **Cors** - Cross-Origin Resource Sharing

## 🏗️ Architecture

```
backend/
├── models/              # Modèles Mongoose
│   ├── Question.js
│   ├── Option.js
│   ├── Questionnaire.js
│   ├── Reponse.js
│   └── ...
├── controllers/         # Logique métier
├── routes/             # Routes Express
├── middleware/         # Middlewares
├── config/             # Configuration
└── src/                # Architecture DDD
    ├── domain/
    ├── infrastructure/
    └── shared/
```

## 📖 Documentation Supplémentaire

- **Architecture**: Voir `ARCHITECTURE_COMPLETE.md`
- **API Endpoints**: Voir `endpoints.json`
- **Migration**: Voir fichiers `MIGRATION-*.md`

## 🔗 Liens Utiles

- [Documentation Frontend](../frontend/README.md)
- [Documentation Mobile](../mobile_app/README.md)
- [Résumé des Améliorations](../SUMMARY_IMPROVEMENTS.md)

---

**Version**: 1.1.0
**Node.js**: >= 14.x
**MongoDB**: >= 4.4
