const Pays = require('../../../../models/Pays');
const { ValidationError } = require('../../../shared/errors/ValidationError');

/**
 * Use Case: Créer un nouveau pays
 */
class CreatePaysUseCase {
  /**
   * Exécute le use case
   * @param {Object} data - Données du pays à créer
   * @returns {Promise<Object>} Le pays créé
   */
  async execute(data) {
    // Validation des données
    if (!data.Lib_pays || data.Lib_pays.trim() === '') {
      throw new ValidationError('Le libellé du pays est requis');
    }

    // Vérifier si le pays existe déjà
    const existingPays = await Pays.findOne({ 
      Lib_pays: { $regex: new RegExp(`^${data.Lib_pays.trim()}$`, 'i') } 
    });

    if (existingPays) {
      throw new ValidationError(`Le pays "${data.Lib_pays}" existe déjà`);
    }

    // Créer le pays
    const pays = new Pays({
      Lib_pays: data.Lib_pays.trim(),
      Coordonnee: data.Coordonnee || null,
      Indicatif: data.Indicatif || null,
      Sommeil: data.Sommeil || false
    });

    await pays.save();

    return pays.toDTO();
  }
}

module.exports = { CreatePaysUseCase };
