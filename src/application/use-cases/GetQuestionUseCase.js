/**
 * Get Question Use Case
 * Cas d'usage pour récupérer une question par son code
 */

const BaseUseCase = require('./BaseUseCase');
const QuestionCode = require('../../domain/value-objects/QuestionCode');
const { ValidationError, NotFoundError } = require('../../shared/errors/DomainErrors');

class GetQuestionUseCase extends BaseUseCase {
  constructor(questionRepository) {
    super();
    this.questionRepository = questionRepository;
  }

  async execute(input) {
    try {
      this.validateInput(input);
      
      const { code } = input;

      // Valider le code avec le Value Object
      const questionCode = new QuestionCode(code);

      // Récupérer la question
      const question = await this.questionRepository.findByCode(questionCode.value);
      
      if (!question) {
        throw new NotFoundError('Question', code);
      }

      this.log('info', 'Question récupérée avec succès', { 
        questionCode: question.code, 
        questionId: question.id 
      });

      return question.toPlainObject();

    } catch (error) {
      this.handleError(error, { input });
    }
  }

  validateInput(input) {
    if (!input) {
      throw new ValidationError('Input requis');
    }

    const { code } = input;

    if (!code) {
      throw new ValidationError('Code de question requis', 'code');
    }

    return true;
  }
}

module.exports = GetQuestionUseCase;