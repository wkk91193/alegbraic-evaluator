import { FileReader } from '../interfaces/FileReader';
import { FileWriter } from '../interfaces/FileWriter';
import { CsvReaderService } from './CsvReaderService';
import { TsvReaderService } from './TsvReaderService';
import { CsvWriterService } from './CsvWriterService';
import { TsvWriterService } from './TsvWriterService';

interface HandlerEntry {
  parser: FileReader;
  writer: FileWriter;
}

export class FileHandlerRegistry {
  private static handlers: Record<string, HandlerEntry> = {};

  public static register(
    fileType: string,
    parser: FileReader,
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
FileHandlerRegistry.register(
  'csv',
  new CsvReaderService(),
  new CsvWriterService()
);
FileHandlerRegistry.register(
  'tsv',
  new TsvReaderService(),
  new TsvWriterService()
);
