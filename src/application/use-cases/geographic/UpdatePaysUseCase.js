const Pays = require('../../../../models/Pays');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const { ValidationError } = require('../../../shared/errors/ValidationError');

/**
 * Use Case: Mettre à jour un pays
 */
class UpdatePaysUseCase {
  /**
   * Exécute le use case
   * @param {string} id - ID du pays à mettre à jour
   * @param {Object} data - Nouvelles données
   * @returns {Promise<Object>} Le pays mis à jour
   */
  async execute(id, data) {
    // Trouver le pays
    const pays = await Pays.findById(id);

    if (!pays) {
      throw new NotFoundError(`Pays avec l'ID ${id} non trouvé`);
    }

    // Validation si le nom change
    if (data.Lib_pays && data.Lib_pays.trim() !== pays.Lib_pays) {
      const existingPays = await Pays.findOne({ 
        Lib_pays: { $regex: new RegExp(`^${data.Lib_pays.trim()}$`, 'i') },
        _id: { $ne: id }
      });

      if (existingPays) {
        throw new ValidationError(`Le pays "${data.Lib_pays}" existe déjà`);
      }

      pays.Lib_pays = data.Lib_pays.trim();
    }

    // Mise à jour des autres champs
    if (data.Coordonnee !== undefined) {
      pays.Coordonnee = data.Coordonnee;
    }

    if (data.Indicatif !== undefined) {
      pays.Indicatif = data.Indicatif;
    }

    if (data.Sommeil !== undefined) {
      pays.Sommeil = data.Sommeil;
    }

    await pays.save();

    return pays.toDTO();
  }
}

module.exports = { UpdatePaysUseCase };
