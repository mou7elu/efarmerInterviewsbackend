/**
 * Navigate Questionnaire Use Case
 * Cas d'usage pour naviguer dans le questionnaire avec la logique de saut
 */

const BaseUseCase = require('./BaseUseCase');
const QuestionCode = require('../../domain/value-objects/QuestionCode');
const { ValidationError, NotFoundError } = require('../../shared/errors/DomainErrors');

class NavigateQuestionnaireUseCase extends BaseUseCase {
  constructor(questionRepository, questionnaireService) {
    super();
    this.questionRepository = questionRepository;
    this.questionnaireService = questionnaireService;
  }

  async execute(input) {
    try {
      this.validateInput(input);
      
      const { currentQuestionCode, response, allResponses = {} } = input;

      // Valider le code avec le Value Object
      const questionCode = new QuestionCode(currentQuestionCode);

      // Récupérer la question actuelle
      const currentQuestion = await this.questionRepository.findByCode(questionCode.value);
      if (!currentQuestion) {
        throw new NotFoundError('Question', currentQuestionCode);
      }

      // Calculer la prochaine question avec la logique de saut
      const nextQuestion = await this.questionnaireService.getNextQuestion(
        currentQuestion, 
        response
      );

      // Calculer le pourcentage de progression
      const progress = await this.questionnaireService.calculateProgress(
        nextQuestion ? nextQuestion.code : currentQuestionCode,
        { ...allResponses, [currentQuestionCode]: response }
      );

      const result = {
        currentQuestion: currentQuestion.toPlainObject(),
        nextQuestion: nextQuestion ? nextQuestion.toPlainObject() : null,
        progress,
        isLastQuestion: !nextQuestion,
        response
      };

      this.log('info', 'Navigation calculée avec succès', { 
        from: currentQuestionCode,
        to: nextQuestion ? nextQuestion.code : 'FIN',
        progress: `${progress}%`
      });

      return result;

    } catch (error) {
      this.handleError(error, { input: { ...input, allResponses: 'REDACTED' } });
    }
  }

  validateInput(input) {
    if (!input) {
      throw new ValidationError('Input requis');
    }

    const { currentQuestionCode } = input;

    if (!currentQuestionCode) {
      throw new ValidationError('Code de question actuelle requis', 'currentQuestionCode');
    }

    return true;
  }
}

module.exports = NavigateQuestionnaireUseCase;