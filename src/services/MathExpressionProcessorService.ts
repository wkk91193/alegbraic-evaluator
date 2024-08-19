import { Parser } from 'expr-eval';
import { ExpressionEvaluator } from '../interfaces/ExpressionEvaluator';

export class MathExpressionProcessorService implements ExpressionEvaluator {
  private values: Record<string, number>;

  constructor(values: Record<string, number>) {
    this.values = values;
  }

  public evaluateExpression(expression: string): number {
    // Replace variables with corresponding values
    const replacedExpression = expression.replace(/[A-K]/g, (match) => {
      if (this.values[match] === undefined) {
        throw new Error(`undefined variable: ${match}`);
      }
      return this.values[match].toString();
    });
    try {
      const parser = new Parser();
      return parser.parse(replacedExpression).evaluate();
    } catch (error) {
      throw new Error(`Error evaluating expression : ${error}`);
    }
  }
}
