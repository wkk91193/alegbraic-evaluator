import { FileHandlerRegistry } from '../../services/FileHandlerRegistry';
import { CsvReaderService } from '../../services/CsvReaderService';
import { CsvWriterService } from '../../services/CsvWriterService';
import { TsvReaderService } from '../../services/TsvReaderService';
import { TsvWriterService } from '../../services/TsvWriterService';
import { FileReader } from '../../interfaces/FileReader';
import { FileWriter } from '../../interfaces/FileWriter';

describe('FileHandlerRegistry', () => {
  class MockReaderService implements FileReader {
    read = jest.fn();
  }

  class MockWriterService implements FileWriter {
    write = jest.fn();
  }

  beforeEach(() => {
    // Clear the handlers before each test to ensure no state leakage between tests.
    (FileHandlerRegistry as any).handlers = {};
  });

  test('should register and retrieve handler for a supported file type', () => {
    const csvReader = new CsvReaderService();
    const csvWriter = new CsvWriterService();

    FileHandlerRegistry.register('csv', csvReader, csvWriter);

    const handler = FileHandlerRegistry.getHandler('csv');

    expect(handler.parser).toBeInstanceOf(CsvReaderService);
    expect(handler.writer).toBeInstanceOf(CsvWriterService);
  });

  test('should throw an error when retrieving an unsupported file type', () => {
    expect(() => FileHandlerRegistry.getHandler('unsupported')).toThrow(
      'Unsupported file type'
    );
  });

  test('should overwrite handler when registering the same file type again', () => {
    const csvReader = new CsvReaderService();
    const csvWriter = new CsvWriterService();
    const tsvReader = new TsvReaderService();
    const tsvWriter = new TsvWriterService();

    FileHandlerRegistry.register('csv', csvReader, csvWriter);
    FileHandlerRegistry.register('csv', tsvReader, tsvWriter); // Overwrite with TSV services

    const handler = FileHandlerRegistry.getHandler('csv');

    expect(handler.parser).toBeInstanceOf(TsvReaderService);
    expect(handler.writer).toBeInstanceOf(TsvWriterService);
  });

  test('should register and retrieve a custom handler', () => {
    const customReader = new MockReaderService();
    const customWriter = new MockWriterService();

    FileHandlerRegistry.register('custom', customReader, customWriter);

    const handler = FileHandlerRegistry.getHandler('custom');

    expect(handler.parser).toBeInstanceOf(MockReaderService);
    expect(handler.writer).toBeInstanceOf(MockWriterService);
  });
});
