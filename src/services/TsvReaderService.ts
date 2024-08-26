import * as fs from 'fs';
import * as fastCsv from 'fast-csv';
import { FileReader } from '../interfaces/FileReader';
import logger from '../logger';

export class TsvReaderService implements FileReader {
  async read(filePath: string): Promise<string[][]> {
    logger.info(`Reading data from TSV file: ${filePath}`);

    return new Promise((resolve, reject) => {
      const rows: string[][] = [];
      fs.createReadStream(filePath)
        .pipe(fastCsv.parse({ headers: false, delimiter: '\t' }))
        .on('data', (row: string[]) => {
          logger.debug('Row read:', row);
          rows.push(row);
        })
        .on('end', () => {
          logger.info('Finished reading TSV file.');
          resolve(rows);
        })
        .on('error', (error) => {
          logger.error('Error reading TSV file:', error);
          reject(error);
        });
    });
  }
}
