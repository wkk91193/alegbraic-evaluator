import * as fs from 'fs';
import * as fastCsv from 'fast-csv';
import { FileReader } from '../interfaces/FileReader';
import logger from '../logger';

export class CsvReaderService implements FileReader {
  read(filepath: string): Promise<string[][]> {
    return new Promise((resolve, reject) => {
      const rows: string[][] = [];
      fs.createReadStream(filepath)
        .pipe(fastCsv.parse({ headers: false, delimiter: ',' }))
        .on('data', (row: string[]) => {
          logger.debug('Row read:', row);
          rows.push(row);
        })
        .on('end', () => {
          logger.info('Finished reading CSV file.');
          resolve(rows);
        })
        .on('error',(error) =>{
          logger.error('Error reading CSV file:', error);
          reject(error);
        });
    });
  }
}
