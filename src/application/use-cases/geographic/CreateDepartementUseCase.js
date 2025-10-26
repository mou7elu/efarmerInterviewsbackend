const BaseUseCase = require('../BaseUseCase');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const Departement = require('../../../../models/Departement');

/**
 * Use Case pour créer un département
 */
class CreateDepartementUseCase extends BaseUseCase {
  constructor() {
    super();
  }

  /**
   * Exécute la création d'un département
   * @param {Object} departementData - Données du département
   * @returns {Promise<Object>}
   */
  async execute(departementData) {
    // Validation des données d'entrée
    this.validateInput(departementData);

    // Vérifier si le département existe déjà
    const existingDepartement = await Departement.findOne({ 
      Lib_Departement: departementData.Lib_Departement || departementData.libDepartement 
    });
    if (existingDepartement) {
      throw new ValidationError('Un département avec ce libellé existe déjà');
    }

    // Transformer les données pour correspondre au modèle
    const departementToCreate = {
      Lib_Departement: departementData.Lib_Departement || departementData.libDepartement,
      Sommeil: departementData.Sommeil || departementData.sommeil || false,
      RegionId: departementData.RegionId || departementData.regionId
    };

    // Créer le département
    const departement = await Departement.create(departementToCreate);

    return {
      _id: departement._id,
      Lib_Departement: departement.Lib_Departement,
      Sommeil: departement.Sommeil,
      RegionId: departement.RegionId,
      createdAt: departement.createdAt,
      updatedAt: departement.updatedAt
    };
  }

  /**
   * Valide les données d'entrée
   * @param {Object} data - Données à valider
   */
  validateInput(data) {
    if (!data) {
      throw new ValidationError('Les données du département sont requises');
    }

    const libDepartement = data.Lib_Departement || data.libDepartement;
    if (!libDepartement || libDepartement.trim() === '') {
      throw new ValidationError('Le libellé du département est requis');
    }

    if (libDepartement.length > 100) {
      throw new ValidationError('Le libellé du département ne peut pas dépasser 100 caractères');
    }

    if (!data.RegionId && !data.regionId) {
      throw new ValidationError('La région est requise');
    }
  }
}

module.exports = { CreateDepartementUseCase };