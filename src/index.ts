import { FileHandlerRegistry } from './services/FileHandlerRegistry';
import { MathExpressionProcessorService } from './services/MathExpressionProcessorService';
import { FileWriter } from './interfaces/FileWriter';
import { FileParser } from './interfaces/FileParser';
import { loadConfig, extractValuesFromHeader } from './utils';

class AlegebraicFileEvaluator {
  private parser: FileParser;
  private writer: FileWriter;

  constructor(parser: FileParser, writer: FileWriter) {
    this.parser = parser;
    this.writer = writer;
  }

  private extractValuesFromHeader(header: string[]): Record<string, number> {
    const variables = 'ABCDEFGHIJK'.split('');
    return header.reduce((acc, value, index) => {
      if (variables[index]) {
        acc[variables[index]] = Number(value);
      }
      return acc;
    }, {} as Record<string, number>);
  }

  public async process(
    inputFilePath: string,
    outputFilePath: string,
    fileType: string
  ): Promise<void> {
    const handler = FileHandlerRegistry.getHandler(fileType);
    const data = await handler.parser.parse(inputFilePath);
    const header = data[0];
    const values = extractValuesFromHeader(header);
    const evaluator = new MathExpressionProcessorService(values);
    const evaluatedData = data.map((row: string[]) =>
      row.map((cell: string) => evaluator.evaluateExpression(cell).toString())
    );
    await handler.writer.write(outputFilePath, evaluatedData);
  }
}

(async () => {
  try {
    const configs = await loadConfig();
    for (const config of configs) {
      const { inputFilePath, outputFilePath, fileType } = config;
      const app = new AlegebraicFileEvaluator(
        FileHandlerRegistry.getHandler(fileType).parser,
        FileHandlerRegistry.getHandler(fileType).writer
      );

      await app.process(inputFilePath, outputFilePath, fileType);
    }
  } catch (error) {
    console.error('Error loading configuration:', error);
  }
})();
