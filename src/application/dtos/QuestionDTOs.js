/**
 * Question DTOs
 * Objets de transfert de données pour les questions
 */

class CreateQuestionDTO {
  constructor({ code, texte, type, obligatoire, unite, automatique, options, sectionId, voletId, referenceTable, referenceField }) {
    this.code = code;
    this.texte = texte;
    this.type = type;
    this.obligatoire = obligatoire;
    this.unite = unite;
    this.automatique = automatique;
    this.options = options;
    this.sectionId = sectionId;
    this.voletId = voletId;
    this.referenceTable = referenceTable;
    this.referenceField = referenceField;
  }

  static fromRequest(req) {
    return new CreateQuestionDTO({
      code: req.body.code,
      texte: req.body.texte,
      type: req.body.type,
      obligatoire: req.body.obligatoire,
      unite: req.body.unite,
      automatique: req.body.automatique,
      options: req.body.options,
      sectionId: req.body.sectionId,
      voletId: req.body.voletId,
      referenceTable: req.body.referenceTable,
      referenceField: req.body.referenceField
    });
  }
}

class UpdateQuestionDTO {
  constructor({ texte, type, obligatoire, unite, automatique, options, referenceTable, referenceField }) {
    this.texte = texte;
    this.type = type;
    this.obligatoire = obligatoire;
    this.unite = unite;
    this.automatique = automatique;
    this.options = options;
    this.referenceTable = referenceTable;
    this.referenceField = referenceField;
  }

  static fromRequest(req) {
    return new UpdateQuestionDTO({
      texte: req.body.texte,
      type: req.body.type,
      obligatoire: req.body.obligatoire,
      unite: req.body.unite,
      automatique: req.body.automatique,
      options: req.body.options,
      referenceTable: req.body.referenceTable,
      referenceField: req.body.referenceField
    });
  }
}

class QuestionResponseDTO {
  constructor({ 
    id, code, texte, type, obligatoire, unite, automatique, options, 
    sectionId, voletId, referenceTable, referenceField, 
    hasOptions, hasGotoLogic, isReferenceQuestion, createdAt, updatedAt 
  }) {
    this.id = id;
    this.code = code;
    this.texte = texte;
    this.type = type;
    this.obligatoire = obligatoire;
    this.unite = unite;
    this.automatique = automatique;
    this.options = options;
    this.sectionId = sectionId;
    this.voletId = voletId;
    this.referenceTable = referenceTable;
    this.referenceField = referenceField;
    this.hasOptions = hasOptions;
    this.hasGotoLogic = hasGotoLogic;
    this.isReferenceQuestion = isReferenceQuestion;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromEntity(questionEntity) {
    const plainObject = questionEntity.toPlainObject();
    return new QuestionResponseDTO(plainObject);
  }

  static fromEntityArray(questionEntities) {
    return questionEntities.map(entity => QuestionResponseDTO.fromEntity(entity));
  }
}

class NavigationRequestDTO {
  constructor({ currentQuestionCode, response, allResponses }) {
    this.currentQuestionCode = currentQuestionCode;
    this.response = response;
    this.allResponses = allResponses;
  }

  static fromRequest(req) {
    return new NavigationRequestDTO({
      currentQuestionCode: req.body.currentQuestionCode,
      response: req.body.response,
      allResponses: req.body.allResponses
    });
  }
}

class NavigationResponseDTO {
  constructor({ currentQuestion, nextQuestion, progress, isLastQuestion, response }) {
    this.currentQuestion = currentQuestion;
    this.nextQuestion = nextQuestion;
    this.progress = progress;
    this.isLastQuestion = isLastQuestion;
    this.response = response;
  }

  static fromUseCaseResult(result) {
    return new NavigationResponseDTO(result);
  }
}

class QuestionSearchDTO {
  constructor({ text, type, section, volet, obligatoire, referenceTable, page, limit }) {
    this.text = text;
    this.type = type;
    this.section = section;
    this.volet = volet;
    this.obligatoire = obligatoire;
    this.referenceTable = referenceTable;
    this.page = page || 1;
    this.limit = limit || 10;
  }

  static fromQuery(query) {
    return new QuestionSearchDTO({
      text: query.text,
      type: query.type,
      section: query.section,
      volet: query.volet,
      obligatoire: query.obligatoire === 'true',
      referenceTable: query.referenceTable,
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 10
    });
  }

  getOffset() {
    return (this.page - 1) * this.limit;
  }
}

module.exports = {
  CreateQuestionDTO,
  UpdateQuestionDTO,
  QuestionResponseDTO,
  NavigationRequestDTO,
  NavigationResponseDTO,
  QuestionSearchDTO
};