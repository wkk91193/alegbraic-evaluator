import { FileHandlerRegistry } from './services/FileHandlerRegistry';
import { MathExpressionProcessorService } from './services/MathExpressionProcessorService';
import { loadConfig, extractValuesFromHeader } from './utils';
import logger from './logger';

class AlegebraicFileEvaluator {
  public async process(
    inputFilePath: string,
    outputFilePath: string,
    fileType: string
  ): Promise<void> {
    const handler = FileHandlerRegistry.getHandler(fileType);
    const data = await handler.parser.read(inputFilePath);
    logger.info(`File read successfully: ${inputFilePath}`);
    const header = data[0];
    const values = extractValuesFromHeader(header);
    logger.info('Expressions evaluated successfully.');
    const evaluator = new MathExpressionProcessorService(values);
    const evaluatedData = data.map((row: string[]) =>
      row.map((cell: string) => evaluator.evaluateExpression(cell).toString())
    );
    await handler.writer.write(outputFilePath, evaluatedData);
    logger.info(`File written successfully: ${outputFilePath}`);
  }
}

(async () => {
  try {
    logger.info('Loading configuration...');
    const configs = await loadConfig();
    logger.info('Configuration loaded successfully.');
    for (const config of configs) {
      const { inputFilePath, outputFilePath, fileType } = config;
      const app = new AlegebraicFileEvaluator();
      await app.process(inputFilePath, outputFilePath, fileType);
    }
  } catch (error) {
    logger.error('An error occurred during processing:', error);
  }
})();
