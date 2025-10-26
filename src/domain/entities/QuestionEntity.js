/**
 * Question Entity - Domain Layer
 * Représente une question du questionnaire dans le domaine métier
 */

const BaseEntity = require('./BaseEntity');
const { ValidationError } = require('../../shared/errors/DomainErrors');

class QuestionEntity extends BaseEntity {
  constructor({
    id,
    code,
    texte,
    type,
    obligatoire = false,
    unite = null,
    automatique = false,
    options = [],
    sectionId,
    voletId,
    referenceTable = null,
    referenceField = null,
    createdAt,
    updatedAt
  }) {
    super(id);
    
    this._code = code;
    this._texte = texte;
    this._type = type;
    this._obligatoire = obligatoire;
    this._unite = unite;
    this._automatique = automatique;
    this._options = options || [];
    this._sectionId = sectionId;
    this._voletId = voletId;
    this._referenceTable = referenceTable;
    this._referenceField = referenceField;
    
    if (createdAt) this._createdAt = createdAt;
    if (updatedAt) this._updatedAt = updatedAt;
    
    this.validate();
  }

  // Types de questions autorisés
  static get TYPES() {
    return {
      TEXT: 'text',
      NUMBER: 'number', 
      DATE: 'date',
      SINGLE_CHOICE: 'single_choice',
      MULTI_CHOICE: 'multi_choice',
      BOOLEAN: 'boolean'
    };
  }

  // Tables de référence autorisées
  static get REFERENCE_TABLES() {
    return [
      'District', 'Region', 'Departement', 'Souspref', 
      'Village', 'Pays', 'Nationalite', 'NiveauScolaire', 
      'Piece', 'Producteur', 'Parcelle'
    ];
  }

  // Getters
  get code() { return this._code; }
  get texte() { return this._texte; }
  get type() { return this._type; }
  get obligatoire() { return this._obligatoire; }
  get unite() { return this._unite; }
  get automatique() { return this._automatique; }
  get options() { return [...this._options]; } // Copie défensive
  get sectionId() { return this._sectionId; }
  get voletId() { return this._voletId; }
  get referenceTable() { return this._referenceTable; }
  get referenceField() { return this._referenceField; }

  // Méthodes métier
  updateTexte(nouveauTexte) {
    if (!nouveauTexte || nouveauTexte.trim().length === 0) {
      throw new ValidationError('Le texte de la question ne peut pas être vide');
    }
    this._texte = nouveauTexte.trim();
    this.updateTimestamp();
  }

  makeObligatoire() {
    this._obligatoire = true;
    this.updateTimestamp();
  }

  makeOptionnelle() {
    this._obligatoire = false;
    this.updateTimestamp();
  }

  setUnite(unite) {
    this._unite = unite;
    this.updateTimestamp();
  }

  addOption(option) {
    if (!option || !option.libelle) {
      throw new ValidationError('Une option doit avoir un libellé');
    }
    
    // Vérifier que l'option n'existe pas déjà
    const existsAlready = this._options.some(opt => opt.libelle === option.libelle);
    if (existsAlready) {
      throw new ValidationError('Cette option existe déjà');
    }
    
    this._options.push(option);
    this.updateTimestamp();
  }

  removeOption(optionLibelle) {
    const index = this._options.findIndex(opt => opt.libelle === optionLibelle);
    if (index > -1) {
      this._options.splice(index, 1);
      this.updateTimestamp();
    }
  }

  setReferenceTable(table, field) {
    if (table && !QuestionEntity.REFERENCE_TABLES.includes(table)) {
      throw new ValidationError(`Table de référence non autorisée: ${table}`);
    }
    
    this._referenceTable = table;
    this._referenceField = field;
    this.updateTimestamp();
  }

  hasOptions() {
    return this._options.length > 0;
  }

  hasGotoLogic() {
    return this._options.some(option => option.goto);
  }

  isReferenceQuestion() {
    return !!this._referenceTable;
  }

  // Validation
  validate() {
    super.validate();
    
    if (!this._code) {
      throw new ValidationError('Code de question est obligatoire');
    }
    
    if (!this._texte || this._texte.trim().length === 0) {
      throw new ValidationError('Texte de question est obligatoire');
    }
    
    if (!this._type || !Object.values(QuestionEntity.TYPES).includes(this._type)) {
      throw new ValidationError('Type de question invalide');
    }
    
    if (!this._sectionId) {
      throw new ValidationError('ID de section est obligatoire');
    }
    
    if (!this._voletId) {
      throw new ValidationError('ID de volet est obligatoire');
    }

    // Validation des options pour les questions à choix
    if ((this._type === QuestionEntity.TYPES.SINGLE_CHOICE || 
         this._type === QuestionEntity.TYPES.MULTI_CHOICE) && 
        this._options.length === 0) {
      throw new ValidationError('Les questions à choix doivent avoir au moins une option');
    }
  }

  // Conversion vers objet simple
  toPlainObject() {
    return {
      ...super.toPlainObject(),
      code: this._code,
      texte: this._texte,
      type: this._type,
      obligatoire: this._obligatoire,
      unite: this._unite,
      automatique: this._automatique,
      options: this._options,
      sectionId: this._sectionId,
      voletId: this._voletId,
      referenceTable: this._referenceTable,
      referenceField: this._referenceField,
      hasOptions: this.hasOptions(),
      hasGotoLogic: this.hasGotoLogic(),
      isReferenceQuestion: this.isReferenceQuestion()
    };
  }
}

module.exports = QuestionEntity;