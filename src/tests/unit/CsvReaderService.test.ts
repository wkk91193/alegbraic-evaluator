import * as fs from 'fs';
import * as fastCsv from 'fast-csv';
import { CsvReaderService } from '../../services/CsvReaderService';

jest.mock('fs');
jest.mock('fast-csv');

describe('CsvReaderService', () => {
  let csvReaderService: CsvReaderService;

  beforeEach(() => {
    csvReaderService = new CsvReaderService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should read a CSV file and return its content as a 2D array', async () => {
    const mockData = [
      ['header1', 'header2'],
      ['value1', 'value2'],
    ];

    // Mock the fastCsv pipeline to simulate reading the CSV file
    const mockStream = {
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn(),
    };

    (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);

    (fastCsv.parse as jest.Mock).mockReturnValue(mockStream);

    mockStream.on.mockImplementation((event: string, callback: Function) => {
      if (event === 'data') {
        callback(mockData[0]);
        callback(mockData[1]);
      }
      if (event === 'end') {
        callback();
      }
      return mockStream;
    });

    const result = await csvReaderService.read('mockFilepath.csv');

    expect(result).toEqual(mockData);
    expect(fs.createReadStream).toHaveBeenCalledWith('mockFilepath.csv');
    expect(fastCsv.parse).toHaveBeenCalledWith({
      headers: false,
      delimiter: ',',
    });
    expect(mockStream.pipe).toHaveBeenCalled();
  });

  it('should reject if an error occurs while reading the CSV file', async () => {
    const mockStream = {
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn(),
    };

    (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);
    (fastCsv.parse as jest.Mock).mockReturnValue(mockStream);

    const mockError = new Error('Test Error');
    mockStream.on.mockImplementation((event: string, callback: Function) => {
      if (event === 'error') {
        callback(mockError);
      }
      return mockStream;
    });

    await expect(csvReaderService.read('mockFilepath.csv')).rejects.toThrow(
      'Test Error'
    );
    expect(fs.createReadStream).toHaveBeenCalledWith('mockFilepath.csv');
    expect(fastCsv.parse).toHaveBeenCalledWith({
      headers: false,
      delimiter: ',',
    });
    expect(mockStream.pipe).toHaveBeenCalled();
  });
});
