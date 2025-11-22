# Migrations Database

Ce dossier contient les scripts de migration pour la base de données MongoDB de l'application eFarmer.

## Scripts Disponibles

### migrate-user-schema.js

Script de migration pour le modèle User. Met à jour tous les documents User existants pour s'assurer qu'ils ont les nouveaux champs requis.

**Modifications apportées :**
- Génération de `code_ut` unique (4 caractères)
- Ajout des champs : Nom_ut, Pren_ut, Tel, Genre, Sommeil, ResponsableId, Photo, isGodMode
- Migration des anciens champs vers les nouveaux

**Usage :**

```powershell
# Méthode 1 : Directement avec Node.js
node backend/migrations/migrate-user-schema.js

# Méthode 2 : Avec le script PowerShell (recommandé)
.\migrate-user-model.ps1
```

**Prérequis :**
- Node.js installé
- MongoDB en cours d'exécution
- Variables d'environnement configurées (fichier .env avec MONGODB_URI)

**Ce que fait le script :**
1. Se connecte à MongoDB
2. Récupère tous les utilisateurs
3. Pour chaque utilisateur :
   - Génère un `code_ut` unique si manquant
   - Ajoute les champs manquants avec valeurs par défaut
   - Migre les anciens champs (name, phone, isActive)
4. Affiche un rapport détaillé
5. Effectue une vérification post-migration

**Résultat attendu :**
```
🚀 Démarrage de la migration des utilisateurs...

✅ Connecté à MongoDB

📊 5 utilisateur(s) trouvé(s)

  📝 Génération code_ut pour user1@example.com: A1B2
  🔄 Migration name -> Nom_ut/Pren_ut pour user1@example.com
✅ Utilisateur mis à jour: user1@example.com

...

============================================================
📊 RÉSUMÉ DE LA MIGRATION
============================================================
Total d'utilisateurs   : 5
Utilisateurs mis à jour: 5
Erreurs                : 0
============================================================

✅ Migration terminée avec succès!

🔍 Vérification post-migration...
✅ Tous les utilisateurs ont un code_ut

✅ Connexion MongoDB fermée

🎉 Migration terminée!
```

## Bonnes Pratiques

### Avant d'exécuter une migration

1. **Créer un backup de la base de données**
   ```powershell
   mongodump --db efarmer --out ./backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')
   ```

2. **Vérifier les variables d'environnement**
   ```powershell
   Get-Content .env | Select-String MONGODB_URI
   ```

3. **Tester sur un environnement de développement d'abord**

### Après l'exécution d'une migration

1. **Vérifier les logs** - Lire attentivement le rapport de migration
2. **Tester l'application** - S'assurer que tout fonctionne correctement
3. **Vérifier les données** - Contrôler quelques documents dans MongoDB

### En cas d'erreur

1. **Consulter les logs** du script de migration
2. **Vérifier la connexion** à MongoDB
3. **Restaurer le backup** si nécessaire :
   ```powershell
   mongorestore backup_20241122_143000
   ```

## Structure d'une Migration

Chaque script de migration doit :
1. Se connecter à MongoDB
2. Effectuer les modifications
3. Gérer les erreurs proprement
4. Afficher un rapport détaillé
5. Fermer la connexion proprement
6. Retourner un code de sortie approprié

**Template de base :**

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

async function migrateData() {
  try {
    // Connexion
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Migration
    // ...

    // Rapport
    console.log('✅ Migration terminée');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

if (require.main === module) {
  migrateData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Échec:', error);
      process.exit(1);
    });
}

module.exports = { migrateData };
```

## Commandes Utiles

### Vérifier l'état de la base de données

```javascript
// Dans mongosh
use efarmer

// Compter les utilisateurs
db.users.count()

// Vérifier les utilisateurs sans code_ut
db.users.find({ code_ut: { $exists: false } }).count()

// Lister quelques utilisateurs
db.users.find().limit(5).pretty()

// Vérifier l'unicité des codes
db.users.aggregate([
  { $group: { _id: "$code_ut", count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } }
])
```

### Créer un nouveau script de migration

```powershell
# Créer un nouveau fichier
New-Item -Path "backend/migrations/migrate-new-feature.js" -ItemType File

# Copier le template
# Adapter le template ci-dessus pour votre cas d'usage
```

## Documentation

Pour plus d'informations, consultez :
- `USER_MODEL_MIGRATION.md` - Guide complet de migration du modèle User
- `USER_MODIFICATIONS_SUMMARY.md` - Résumé des modifications

## Support

En cas de problème :
1. Consulter les logs du script
2. Vérifier la documentation
3. Tester les commandes MongoDB ci-dessus
4. Restaurer le backup si nécessaire

---

**Important** : Toujours créer un backup avant d'exécuter une migration en production !
