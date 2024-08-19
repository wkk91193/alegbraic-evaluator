import { MathExpressionProcessorService } from '../../services/MathExpressionProcessorService';

describe('MathExpressionProcessorService', () => {
  let processor: MathExpressionProcessorService;

  beforeEach(() => {
    const variables = {
      A: 7,
      B: 10,
      C: 36,
      D: 5,
      E: 9,
      F: 0,
      G: 1,
      H: 4,
      I: 17,
      J: 12,
      K: 22,
    };

    processor = new MathExpressionProcessorService(variables);
  });

  describe('Happy path - evaluateExpression', () => {
    test('should correctly evaluate simple expressions', () => {
      expect(processor.evaluateExpression('A + B')).toBe(17);
      expect(processor.evaluateExpression('C - D')).toBe(31);
    });

    test('should correctly evaluate complex expressions', () => {
      expect(processor.evaluateExpression('A * B + C')).toBe(106);
      expect(processor.evaluateExpression('K / G')).toBe(22);
    });
  });

  describe('Sad path - evaluateExpression', () => {
    test('should throw an error for undefined variables', () => {
      expect(() => processor.evaluateExpression('A + X')).toThrowError(
        'Error evaluating expression : Error: undefined variable: X'
      );
    });

    test('should throw an error for invalid expressions', () => {
      expect(() => processor.evaluateExpression('A +')).toThrowError(
        'Error evaluating expression : Error: unexpected TEOF: EOF'
      );
    });
  });
});
