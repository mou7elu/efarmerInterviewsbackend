const Region = require('../../../../models/Region');
const District = require('../../../../models/district');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');

class CreateRegionUseCase {
  async execute(data) {
    if (!data.Lib_region || data.Lib_region.trim() === '') {
      throw new ValidationError('Le libellé de la région est requis');
    }

    if (!data.Cod_region || data.Cod_region.trim() === '') {
      throw new ValidationError('Le code de la région est requis');
    }

    if (!data.DistrictId) {
      throw new ValidationError('Le district est requis');
    }

    const district = await District.findById(data.DistrictId);
    if (!district) {
      throw new NotFoundError(`District avec l'ID ${data.DistrictId} non trouvé`);
    }

    const existingRegion = await Region.findOne({ 
      Cod_region: data.Cod_region.trim()
    });

    if (existingRegion) {
      throw new ValidationError(`La région avec le code "${data.Cod_region}" existe déjà`);
    }

    const region = new Region({
      Lib_region: data.Lib_region.trim(),
      Cod_region: data.Cod_region.trim(),
      DistrictId: data.DistrictId,
      Coordonnee: data.Coordonnee || null,
      Sommeil: data.Sommeil || false
    });

    await region.save();
    return region.toDTO();
  }
}

class GetRegionUseCase {
  async execute(id) {
    const region = await Region.findById(id).populate('DistrictId');
    if (!region) {
      throw new NotFoundError(`Région avec l'ID ${id} non trouvé`);
    }
    return region.toDTO();
  }
}

class GetAllRegionsUseCase {
  async execute(filters = {}) {
    const { page = 1, limit = 10, actifSeulement = false, search = null, districtId = null } = filters;
    const query = {};

    if (actifSeulement) {
      query.Sommeil = false;
    }

    if (search) {
      query.$or = [
        { Lib_region: { $regex: search, $options: 'i' } },
        { Cod_region: { $regex: search, $options: 'i' } }
      ];
    }

    if (districtId) {
      query.DistrictId = districtId;
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Region.find(query).populate('DistrictId').sort({ Lib_region: 1 }).skip(skip).limit(limit),
      Region.countDocuments(query)
    ]);

    return {
      items: items.map(r => r.toDTO()),
      page,
      pages: Math.ceil(total / limit),
      total
    };
  }
}

class UpdateRegionUseCase {
  async execute(id, data) {
    const region = await Region.findById(id);
    if (!region) {
      throw new NotFoundError(`Région avec l'ID ${id} non trouvé`);
    }

    if (data.Cod_region && data.Cod_region !== region.Cod_region) {
      const existing = await Region.findOne({ 
        Cod_region: data.Cod_region,
        _id: { $ne: id }
      });
      if (existing) {
        throw new ValidationError(`Le code "${data.Cod_region}" existe déjà`);
      }
      region.Cod_region = data.Cod_region;
    }

    if (data.Lib_region) region.Lib_region = data.Lib_region.trim();
    if (data.DistrictId !== undefined) region.DistrictId = data.DistrictId;
    if (data.Coordonnee !== undefined) region.Coordonnee = data.Coordonnee;
    if (data.Sommeil !== undefined) region.Sommeil = data.Sommeil;

    await region.save();
    return region.toDTO();
  }
}

class DeleteRegionUseCase {
  async execute(id) {
    const Departement = require('../../../../models/Departement');
    const region = await Region.findById(id);
    if (!region) {
      throw new NotFoundError(`Région avec l'ID ${id} non trouvé`);
    }

    const departementsCount = await Departement.countDocuments({ RegionId: id });
    if (departementsCount > 0) {
      throw new ValidationError(
        `Impossible de supprimer la région "${region.Lib_region}". ` +
        `Elle contient ${departementsCount} département(s).`
      );
    }

    await region.deleteOne();
  }
}

module.exports = { 
  CreateRegionUseCase,
  GetRegionUseCase,
  GetAllRegionsUseCase,
  UpdateRegionUseCase,
  DeleteRegionUseCase
};
