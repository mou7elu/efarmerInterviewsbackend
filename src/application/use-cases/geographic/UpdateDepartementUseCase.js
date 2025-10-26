const BaseUseCase = require('../BaseUseCase');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const Departement = require('../../../../models/Departement');

/**
 * Use Case pour mettre à jour un département
 */
class UpdateDepartementUseCase extends BaseUseCase {
  constructor() {
    super();
  }

  /**
   * Exécute la mise à jour d'un département
   * @param {string} id - ID du département
   * @param {Object} updateData - Données de mise à jour
   * @returns {Promise<Object>}
   */
  async execute(id, updateData) {
    if (!id) {
      throw new ValidationError('L\'ID du département est requis');
    }

    this.validateUpdateData(updateData);

    // Vérifier que le département existe
    const existingDepartement = await Departement.findById(id);
    if (!existingDepartement) {
      throw new NotFoundError('Département non trouvé');
    }

    // Transformer les données pour correspondre au modèle
    const updateFields = {};
    if (updateData.Lib_Departement || updateData.libDepartement) {
      updateFields.Lib_Departement = updateData.Lib_Departement || updateData.libDepartement;
    }
    if (updateData.Sommeil !== undefined || updateData.sommeil !== undefined) {
      updateFields.Sommeil = updateData.Sommeil !== undefined ? updateData.Sommeil : updateData.sommeil;
    }
    if (updateData.RegionId || updateData.regionId) {
      updateFields.RegionId = updateData.RegionId || updateData.regionId;
    }

    // Vérifier l'unicité du libellé si modifié
    if (updateFields.Lib_Departement && updateFields.Lib_Departement !== existingDepartement.Lib_Departement) {
      const duplicateDepartement = await Departement.findOne({ 
        Lib_Departement: updateFields.Lib_Departement,
        _id: { $ne: id }
      });
      if (duplicateDepartement) {
        throw new ValidationError('Un département avec ce libellé existe déjà');
      }
    }

    const updatedDepartement = await Departement.findByIdAndUpdate(
      id, 
      updateFields, 
      { new: true, runValidators: true }
    ).populate('RegionId').lean();

    return {
      _id: updatedDepartement._id,
      Lib_Departement: updatedDepartement.Lib_Departement,
      Sommeil: updatedDepartement.Sommeil,
      RegionId: updatedDepartement.RegionId,
      createdAt: updatedDepartement.createdAt,
      updatedAt: updatedDepartement.updatedAt
    };
  }

  validateUpdateData(data) {
    if (!data || Object.keys(data).length === 0) {
      throw new ValidationError('Les données de mise à jour sont requises');
    }

    const libDepartement = data.Lib_Departement || data.libDepartement;
    if (libDepartement !== undefined && (!libDepartement || libDepartement.trim() === '')) {
      throw new ValidationError('Le libellé du département ne peut pas être vide');
    }

    if (libDepartement && libDepartement.length > 100) {
      throw new ValidationError('Le libellé du département ne peut pas dépasser 100 caractères');
    }
  }
}

module.exports = { UpdateDepartementUseCase };