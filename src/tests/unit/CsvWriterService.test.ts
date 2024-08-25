import * as fs from 'fs';
import * as fastCsv from 'fast-csv';
import { CsvWriterService } from '../../services/CsvWriterService';

jest.mock('fs');
jest.mock('fast-csv');

describe('CsvWriterService', () => {
  let csvWriterService: CsvWriterService;
  let mockWriteStream: any;
  let mockCsvStream: any;

  beforeEach(() => {
    csvWriterService = new CsvWriterService();
    mockWriteStream = {
      on: jest.fn().mockReturnThis(),
      pipe: jest.fn().mockReturnThis(),
    };
    mockCsvStream = {
      write: jest.fn(),
      end: jest.fn(),
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn().mockReturnThis(),
    };
    (fs.createWriteStream as jest.Mock).mockReturnValue(mockWriteStream);
    (fastCsv.format as jest.Mock).mockReturnValue(mockCsvStream);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should write data to the specified file as CSV', async () => {
    const filePath = 'output.csv';
    const data = [
      ['Name', 'Age'],
      ['Alice', '30'],
      ['Bob', '25'],
    ];

    const promise = csvWriterService.write(filePath, data);

    // Simulate the 'end' event to resolve the promise
    const endCallback = mockWriteStream.on.mock.calls.find(
      (call: any[]) => call[0] === 'end'
    )?.[1];

    if (endCallback) {
      endCallback();
    } else {
      throw new Error('End event listener not found');
    }

    await expect(promise).resolves.toBeUndefined();

    expect(fs.createWriteStream).toHaveBeenCalledWith(filePath);
    expect(fastCsv.format).toHaveBeenCalledWith({
      headers: false,
      delimiter: ',',
    });
    expect(mockCsvStream.write).toHaveBeenCalledTimes(3);
    expect(mockCsvStream.write).toHaveBeenCalledWith('Name,Age');
    expect(mockCsvStream.write).toHaveBeenCalledWith('Alice,30');
    expect(mockCsvStream.write).toHaveBeenCalledWith('Bob,25');
    expect(mockCsvStream.end).toHaveBeenCalled();
  });

  it('should reject the promise if there is an error', async () => {
    const filePath = 'output.csv';
    const data = [
      ['Name', 'Age'],
      ['Alice', '30'],
    ];

    const promise = csvWriterService.write(filePath, data);

    // Simulate the 'error' event to reject the promise
    const errorCallback = mockWriteStream.on.mock.calls.find(
      (call: any[]) => call[0] === 'error'
    )?.[1];

    const error = new Error('Write error');

    if (errorCallback) {
      errorCallback(error);
    } else {
      throw new Error('Error event listener not found');
    }

    await expect(promise).rejects.toThrow('Write error');

    expect(fs.createWriteStream).toHaveBeenCalledWith(filePath);
    expect(fastCsv.format).toHaveBeenCalledWith({
      headers: false,
      delimiter: ',',
    });
    expect(mockCsvStream.end).toHaveBeenCalled();
  });
});
