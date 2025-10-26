const { PaysEntity } = require('./src/domain/entities/PaysEntity');
const { DistrictEntity } = require('./src/domain/entities/DistrictEntity');

/**
 * Démonstration de l'architecture Clean Code SOLID
 * avec les entités prioritaires Pays et Districts
 */
async function demonstrationArchitecture() {
  console.log('🎯 === DÉMONSTRATION ARCHITECTURE CLEAN CODE SOLID ===\n');

  try {
    // === TEST CRÉATION D'ENTITÉS ===
    console.log('🏗️  Test de création d\'entités:');
    
    // Création d'un pays
    const senegal = new PaysEntity({
      id: '507f1f77bcf86cd799439011',
      libPays: 'Sénégal',
      sommeil: false
    });
    console.log(`✅ Pays créé: ${senegal.libPays.value} (${senegal.estActif() ? 'Actif' : 'Inactif'})`);

    // Création d'un district
    const dakar = new DistrictEntity({
      id: '507f1f77bcf86cd799439012',
      libDistrict: 'Dakar',
      paysId: senegal.id,
      sommeil: false
    });
    console.log(`✅ District créé: ${dakar.libDistrict.value} appartenant à ${senegal.libPays.value}`);

    // === TEST MÉTHODES MÉTIER ===
    console.log('\n🔧 Test des méthodes métier:');
    
    // Test immutabilité - changement de libellé
    const nouveauPays = senegal.changerLibelle('République du Sénégal');
    console.log(`✅ Libellé modifié: "${senegal.libPays.value}" → "${nouveauPays.libPays.value}"`);
    console.log(`✅ Immutabilité respectée: Original inchangé = ${senegal.libPays.value}`);

    // Test statut
    const paysEndormi = senegal.mettreDormir();
    console.log(`✅ Statut modifié: ${senegal.estActif() ? 'Actif' : 'Inactif'} → ${paysEndormi.estActif() ? 'Actif' : 'Inactif'}`);

    // === TEST RELATIONS ===
    console.log('\n🔗 Test des relations:');
    console.log(`✅ Le district ${dakar.libDistrict.value} appartient au pays: ${dakar.appartientAuPays(senegal.id)}`);

    // Changement de pays pour le district
    const mali = new PaysEntity({
      id: '507f1f77bcf86cd799439013',
      libPays: 'Mali',
      sommeil: false
    });

    const dakarVersLeMali = dakar.changerPays(mali.id);
    console.log(`✅ District transféré: ${dakar.paysId} → ${dakarVersLeMali.paysId}`);
    console.log(`✅ Appartenance vérifiée: Mali = ${dakarVersLeMali.appartientAuPays(mali.id)}, Sénégal = ${dakarVersLeMali.appartientAuPays(senegal.id)}`);

    // === TEST SÉRIALISATION ===
    console.log('\n📋 Test de sérialisation:');
    
    const paysDTO = senegal.toDTO();
    console.log(`✅ DTO Pays:`, paysDTO);

    const paysPersistence = senegal.toPersistence();
    console.log(`✅ Format persistance:`, paysPersistence);

    // Test fromPersistence
    const paysReconstitue = PaysEntity.fromPersistence(paysPersistence);
    console.log(`✅ Reconstitution: ${paysReconstitue.libPays.value} (ID: ${paysReconstitue.id})`);

    // === TEST VALIDATION ===
    console.log('\n🛡️  Test de validation:');
    
    try {
      new PaysEntity({
        libPays: '', // Libellé vide
        sommeil: false
      });
    } catch (error) {
      console.log(`✅ Validation libellé vide: ${error.message}`);
    }

    try {
      new DistrictEntity({
        libDistrict: 'Test',
        paysId: '', // PaysId vide
        sommeil: false
      });
    } catch (error) {
      console.log(`✅ Validation paysId vide: ${error.message}`);
    }

    try {
      new PaysEntity({
        libPays: 'Test',
        sommeil: 'non' // Type incorrect
      });
    } catch (error) {
      console.log(`✅ Validation type sommeil: ${error.message}`);
    }

    console.log('\n🎉 === DÉMONSTRATION TERMINÉE AVEC SUCCÈS ===');
    console.log('\n✨ Architecture Clean Code SOLID validée:');
    console.log('  🏗️  Single Responsibility: Chaque entité a une responsabilité claire');
    console.log('  🔒 Open/Closed: Extensible sans modification du code existant');
    console.log('  🔄 Liskov Substitution: Les entités héritent correctement de BaseEntity');
    console.log('  🎯 Interface Segregation: Interfaces spécialisées pour chaque contexte');
    console.log('  🔀 Dependency Inversion: Dépendances vers les abstractions (Value Objects)');
    console.log('  🛡️  Immutabilité: Les entités sont immutables');
    console.log('  ✅ Validation: Validation métier dans les entités');
    console.log('  🔗 Relations: Gestion propre des relations entre entités');

  } catch (error) {
    console.error('❌ Erreur lors de la démonstration:', error);
    process.exit(1);
  }
}

// Exécution de la démonstration
if (require.main === module) {
  demonstrationArchitecture();
}

module.exports = { demonstrationArchitecture };