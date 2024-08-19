import { extractValuesFromHeader, loadConfig } from '../../utils';
import * as fs from 'fs';

describe('extractValuesFromHeader', () => {
  describe('Happy path - extractValuesFromHeader()', () => {
    test('should correctly map header values to variables', () => {
      const header = [
        '7',
        '10',
        '36',
        '5',
        '9',
        '0',
        '1',
        '4',
        '17',
        '12',
        '22',
      ];
      const result = extractValuesFromHeader(header);

      expect(result).toEqual({
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
      });
    });
  });

  describe('Sad path - extractValuesFromHeader()', () => {
    test('should handle an incomplete header gracefully', () => {
      const header = ['7', '10', '36'];
      const result = extractValuesFromHeader(header);

      expect(result).toEqual({
        A: 7,
        B: 10,
        C: 36,
      });
    });
  });
});

describe('loadConfig', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Happy path - loadConfig()', () => {
    test('should correctly load a valid configuration', async () => {
      const mockConfig = {
        files: [
          {
            inputFilePath: '../../resources/input.csv',
            outputFilePath: '../../resources/output.csv',
            fileType: 'csv',
          },
        ],
      };

      jest
        .spyOn(fs.promises, 'readFile')
        .mockResolvedValue(JSON.stringify(mockConfig));

      const config = await loadConfig();
      expect(config).toEqual([
        {
          inputFilePath: '../../resources/input.csv',
          outputFilePath: '../../resources/output.csv',
          fileType: 'csv',
        },
      ]);
    });

    describe('Sad path - loadConfig()', () => {
      test('should throw an error if the configuration file is missing fields', async () => {
        const mockConfig = {
          files: [
            {
              inputFilePath: '../../resources/input.csv',
            },
          ],
        };

        jest
          .spyOn(fs.promises, 'readFile')
          .mockResolvedValue(JSON.stringify(mockConfig));

        await expect(loadConfig()).rejects.toThrowError(
          'Invalid configuration file'
        );
      });

      test('should throw an error if the configuration file does not exist', async () => {
        jest
          .spyOn(fs.promises, 'readFile')
          .mockRejectedValue(new Error('ENOENT: no such file or directory'));

        await expect(loadConfig()).rejects.toThrowError(
          'Error loading configuration: Error: ENOENT: no such file or directory'
        );
      });
    });
  });
});
