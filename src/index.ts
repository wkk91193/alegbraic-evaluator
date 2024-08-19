import { FileHandlerRegistry } from './services/FileHandlerRegistry';
import { MathExpressionProcessorService } from './services/MathExpressionProcessorService';
import { loadConfig, extractValuesFromHeader } from './utils';

class AlegebraicFileEvaluator {
  public async process(
    inputFilePath: string,
    outputFilePath: string,
    fileType: string
  ): Promise<void> {
    const handler = FileHandlerRegistry.getHandler(fileType);
    const data = await handler.parser.read(inputFilePath);
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
      const app = new AlegebraicFileEvaluator();
      await app.process(inputFilePath, outputFilePath, fileType);
    }
  } catch (error) {
    console.error('Error:', error);
  }
})();
