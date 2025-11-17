const Departement = require('../../../../models/Departement');
const Region = require('../../../../models/Region');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');

class CreateDepartementUseCase {
  async execute(data) {
    if (!data.Lib_Departement || data.Lib_Departement.trim() === '') {
      throw new ValidationError('Le libellé du département est requis');
    }

    if (!data.Cod_departement || data.Cod_departement.trim() === '') {
      throw new ValidationError('Le code du département est requis');
    }

    if (!data.RegionId) {
      throw new ValidationError('La région est requise');
    }

    const region = await Region.findById(data.RegionId);
    if (!region) {
      throw new NotFoundError(`Région avec l'ID ${data.RegionId} non trouvée`);
    }

    const existingDept = await Departement.findOne({ 
      Cod_departement: data.Cod_departement.trim()
    });

    if (existingDept) {
      throw new ValidationError(`Le département avec le code "${data.Cod_departement}" existe déjà`);
    }

    const departement = new Departement({
      Lib_Departement: data.Lib_Departement.trim(),
      Cod_departement: data.Cod_departement.trim(),
      RegionId: data.RegionId
    });

    await departement.save();
    return departement.toDTO();
  }
}

class GetDepartementUseCase {
  async execute(id) {
    const departement = await Departement.findById(id).populate('RegionId');
    if (!departement) {
      throw new NotFoundError(`Département avec l'ID ${id} non trouvé`);
    }
    return departement.toDTO();
  }
}

class GetAllDepartementsUseCase {
  async execute(filters = {}) {
    const { page = 1, limit = 10, search = null, regionId = null } = filters;
    const query = {};

    if (search) {
      query.$or = [
        { Lib_Departement: { $regex: search, $options: 'i' } },
        { Cod_departement: { $regex: search, $options: 'i' } }
      ];
    }

    if (regionId) {
      query.RegionId = regionId;
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Departement.find(query).populate('RegionId').sort({ Lib_Departement: 1 }).skip(skip).limit(limit),
      Departement.countDocuments(query)
    ]);

    return {
      items: items.map(d => d.toDTO()),
      page,
      pages: Math.ceil(total / limit),
      total
    };
  }
}

class UpdateDepartementUseCase {
  async execute(id, data) {
    const departement = await Departement.findById(id);
    if (!departement) {
      throw new NotFoundError(`Département avec l'ID ${id} non trouvé`);
    }

    if (data.Cod_departement && data.Cod_departement !== departement.Cod_departement) {
      const existing = await Departement.findOne({ 
        Cod_departement: data.Cod_departement,
        _id: { $ne: id }
      });
      if (existing) {
        throw new ValidationError(`Le code "${data.Cod_departement}" existe déjà`);
      }
      departement.Cod_departement = data.Cod_departement;
    }

    if (data.Lib_Departement) departement.Lib_Departement = data.Lib_Departement.trim();
    if (data.RegionId !== undefined) departement.RegionId = data.RegionId;

    await departement.save();
    return departement.toDTO();
  }
}

class DeleteDepartementUseCase {
  async execute(id) {
    const Souspref = require('../../../../models/Souspref');
    const departement = await Departement.findById(id);
    if (!departement) {
      throw new NotFoundError(`Département avec l'ID ${id} non trouvé`);
    }

    const sousprefsCount = await Souspref.countDocuments({ DepartementId: id });
    if (sousprefsCount > 0) {
      throw new ValidationError(
        `Impossible de supprimer le département "${departement.Lib_Departement}". ` +
        `Il contient ${sousprefsCount} sous-préfecture(s).`
      );
    }

    await departement.deleteOne();
  }
}

module.exports = { 
  CreateDepartementUseCase,
  GetDepartementUseCase,
  GetAllDepartementsUseCase,
  UpdateDepartementUseCase,
  DeleteDepartementUseCase
};
