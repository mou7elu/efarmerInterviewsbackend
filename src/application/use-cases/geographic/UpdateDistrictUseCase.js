const BaseUseCase = require('../BaseUseCase');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const District = require('../../../../models/district');

/**
 * Use Case pour mettre à jour un district
 */
class UpdateDistrictUseCase extends BaseUseCase {
  constructor() {
    super();
  }

  /**
   * Exécute la mise à jour d'un district
   * @param {string} id - ID du district
   * @param {Object} updateData - Données de mise à jour
   * @returns {Promise<Object>}
   */
  async execute(id, updateData) {
    if (!id) {
      throw new ValidationError('L\'ID du district est requis');
    }

    this.validateUpdateData(updateData);

    // Vérifier que le district existe
    const existingDistrict = await District.findById(id);
    if (!existingDistrict) {
      throw new NotFoundError('District non trouvé');
    }

    // Transformer les données pour correspondre au modèle
    const updateFields = {};
    if (updateData.Lib_district || updateData.libDistrict) {
      updateFields.Lib_district = updateData.Lib_district || updateData.libDistrict;
    }
    if (updateData.Sommeil !== undefined || updateData.sommeil !== undefined) {
      updateFields.Sommeil = updateData.Sommeil !== undefined ? updateData.Sommeil : updateData.sommeil;
    }
    if (updateData.PaysId || updateData.paysId) {
      updateFields.PaysId = updateData.PaysId || updateData.paysId;
    }

    // Vérifier l'unicité du libellé si modifié
    if (updateFields.Lib_district && updateFields.Lib_district !== existingDistrict.Lib_district) {
      const duplicateDistrict = await District.findOne({ 
        Lib_district: updateFields.Lib_district,
        _id: { $ne: id }
      });
      if (duplicateDistrict) {
        throw new ValidationError('Un district avec ce libellé existe déjà');
      }
    }

    const updatedDistrict = await District.findByIdAndUpdate(
      id, 
      updateFields, 
      { new: true, runValidators: true }
    ).populate('PaysId').lean();

    return {
      _id: updatedDistrict._id,
      Lib_district: updatedDistrict.Lib_district,
      Sommeil: updatedDistrict.Sommeil,
      PaysId: updatedDistrict.PaysId,
      createdAt: updatedDistrict.createdAt,
      updatedAt: updatedDistrict.updatedAt
    };
  }

  validateUpdateData(data) {
    if (!data || Object.keys(data).length === 0) {
      throw new ValidationError('Les données de mise à jour sont requises');
    }

    const libDistrict = data.Lib_district || data.libDistrict;
    if (libDistrict !== undefined && (!libDistrict || libDistrict.trim() === '')) {
      throw new ValidationError('Le libellé du district ne peut pas être vide');
    }

    if (libDistrict && libDistrict.length > 100) {
      throw new ValidationError('Le libellé du district ne peut pas dépasser 100 caractères');
    }
  }
}

module.exports = { UpdateDistrictUseCase };