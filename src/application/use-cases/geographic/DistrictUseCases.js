const District = require('../../../../models/district');
const Pays = require('../../../../models/Pays');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');

class CreateDistrictUseCase {
  async execute(data) {
    if (!data.Lib_district || data.Lib_district.trim() === '') {
      throw new ValidationError('Le libellé du district est requis');
    }

    if (!data.Cod_district || data.Cod_district.trim() === '') {
      throw new ValidationError('Le code du district est requis');
    }

    if (!data.PaysId) {
      throw new ValidationError('Le pays est requis');
    }

    // Vérifier que le pays existe
    const pays = await Pays.findById(data.PaysId);
    if (!pays) {
      throw new NotFoundError(`Pays avec l'ID ${data.PaysId} non trouvé`);
    }

    // Vérifier si le district existe déjà
    const existingDistrict = await District.findOne({ 
      Cod_district: data.Cod_district.trim()
    });

    if (existingDistrict) {
      throw new ValidationError(`Le district avec le code "${data.Cod_district}" existe déjà`);
    }

    const district = new District({
      Lib_district: data.Lib_district.trim(),
      Cod_district: data.Cod_district.trim(),
      PaysId: data.PaysId,
      Sommeil: data.Sommeil || false
    });

    await district.save();
    return district.toDTO();
  }
}

class GetDistrictUseCase {
  async execute(id) {
    const district = await District.findById(id).populate('PaysId');
    if (!district) {
      throw new NotFoundError(`District avec l'ID ${id} non trouvé`);
    }
    return district.toDTO();
  }
}

class GetAllDistrictsUseCase {
  async execute(filters = {}) {
    const { page = 1, limit = 10, actifSeulement = false, search = null, paysId = null } = filters;
    const query = {};

    if (actifSeulement) {
      query.Sommeil = false;
    }

    if (search) {
      query.$or = [
        { Lib_district: { $regex: search, $options: 'i' } },
        { Cod_district: { $regex: search, $options: 'i' } }
      ];
    }

    if (paysId) {
      query.PaysId = paysId;
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      District.find(query).populate('PaysId').sort({ Lib_district: 1 }).skip(skip).limit(limit),
      District.countDocuments(query)
    ]);

    return {
      items: items.map(d => d.toDTO()),
      page,
      pages: Math.ceil(total / limit),
      total
    };
  }
}

class UpdateDistrictUseCase {
  async execute(id, data) {
    const district = await District.findById(id);
    if (!district) {
      throw new NotFoundError(`District avec l'ID ${id} non trouvé`);
    }

    if (data.Cod_district && data.Cod_district !== district.Cod_district) {
      const existing = await District.findOne({ 
        Cod_district: data.Cod_district,
        _id: { $ne: id }
      });
      if (existing) {
        throw new ValidationError(`Le code "${data.Cod_district}" existe déjà`);
      }
      district.Cod_district = data.Cod_district;
    }

    if (data.Lib_district) district.Lib_district = data.Lib_district.trim();
    if (data.PaysId !== undefined) district.PaysId = data.PaysId;
    if (data.Sommeil !== undefined) district.Sommeil = data.Sommeil;

    await district.save();
    return district.toDTO();
  }
}

class DeleteDistrictUseCase {
  async execute(id) {
    const Region = require('../../../../models/Region');
    const district = await District.findById(id);
    if (!district) {
      throw new NotFoundError(`District avec l'ID ${id} non trouvé`);
    }

    const regionsCount = await Region.countDocuments({ DistrictId: id });
    if (regionsCount > 0) {
      throw new ValidationError(
        `Impossible de supprimer le district "${district.Lib_district}". ` +
        `Il contient ${regionsCount} région(s).`
      );
    }

    await district.deleteOne();
  }
}

module.exports = { 
  CreateDistrictUseCase,
  GetDistrictUseCase,
  GetAllDistrictsUseCase,
  UpdateDistrictUseCase,
  DeleteDistrictUseCase
};
