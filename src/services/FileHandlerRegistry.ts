import { FileParser } from '../interfaces/FileParser';
import { FileWriter } from '../interfaces/FileWriter';
import { CsvParserService } from './CsvParserService';
import { TsvParserService } from './TsvParserService';
import { CsvWriterService } from './CsvWriterService';
import { TsvWriterService } from './TsvWriterService';

type HandlerEntry = {
  parser: FileParser;
  writer: FileWriter;
};

export class FileHandlerRegistry {
  private static handlers: Record<string, HandlerEntry> = {};

  public static register(
    fileType: string,
    parser: FileParser,
    writer: FileWriter
  ): void {
    this.handlers[fileType] = { parser, writer };
  }

  public static getHandler(fileType: string) {
    const handler = this.handlers[fileType];
    if (!handler) {
      throw new Error('Unsupported file type');
    }
    return handler;
  }
}

 // Register handlers for known file types
FileHandlerRegistry.register('csv', new CsvParserService(), new CsvWriterService());
FileHandlerRegistry.register('tsv', new TsvParserService(), new TsvWriterService());
