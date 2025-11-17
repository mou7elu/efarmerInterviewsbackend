const Village = require('../../../../models/Village');
const Zonedenombre = require('../../../../models/Zonedenombre');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');

class CreateVillageUseCase {
  async execute(data) {
    if (!data.Lib_village || data.Lib_village.trim() === '') {
      throw new ValidationError('Le libellé du village est requis');
    }

    if (!data.ZonedenombreId) {
      throw new ValidationError('La zone de dénombrement est requise');
    }

    const zone = await Zonedenombre.findById(data.ZonedenombreId);
    if (!zone) {
      throw new NotFoundError(`Zone de dénombrement avec l'ID ${data.ZonedenombreId} non trouvée`);
    }

    const village = new Village({
      Lib_village: data.Lib_village.trim(),
      ZonedenombreId: data.ZonedenombreId,
      Coordonnee: data.Coordonnee || null
    });

    await village.save();
    return village.toDTO();
  }
}

class GetVillageUseCase {
  async execute(id) {
    const village = await Village.findById(id).populate('ZonedenombreId');
    if (!village) {
      throw new NotFoundError(`Village avec l'ID ${id} non trouvé`);
    }
    return village.toDTO();
  }
}

class GetAllVillagesUseCase {
  async execute(filters = {}) {
    const { page = 1, limit = 10, search = null, zonedenombreId = null } = filters;
    const query = {};

    if (search) {
      query.Lib_village = { $regex: search, $options: 'i' };
    }

    if (zonedenombreId) {
      query.ZonedenombreId = zonedenombreId;
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Village.find(query).populate('ZonedenombreId').sort({ Lib_village: 1 }).skip(skip).limit(limit),
      Village.countDocuments(query)
    ]);

    return {
      items: items.map(v => v.toDTO()),
      page,
      pages: Math.ceil(total / limit),
      total
    };
  }
}

class UpdateVillageUseCase {
  async execute(id, data) {
    const village = await Village.findById(id);
    if (!village) {
      throw new NotFoundError(`Village avec l'ID ${id} non trouvé`);
    }

    if (data.Lib_village) village.Lib_village = data.Lib_village.trim();
    if (data.ZonedenombreId !== undefined) village.ZonedenombreId = data.ZonedenombreId;
    if (data.Coordonnee !== undefined) village.Coordonnee = data.Coordonnee;

    await village.save();
    return village.toDTO();
  }
}

class DeleteVillageUseCase {
  async execute(id) {
    const Localite = require('../../../../models/Localite');
    const village = await Village.findById(id);
    if (!village) {
      throw new NotFoundError(`Village avec l'ID ${id} non trouvé`);
    }

    const localitesCount = await Localite.countDocuments({ VillageId: id });
    if (localitesCount > 0) {
      throw new ValidationError(
        `Impossible de supprimer le village "${village.Lib_village}". ` +
        `Il contient ${localitesCount} localité(s).`
      );
    }

    await village.deleteOne();
  }
}

module.exports = { 
  CreateVillageUseCase,
  GetVillageUseCase,
  GetAllVillagesUseCase,
  UpdateVillageUseCase,
  DeleteVillageUseCase
};
