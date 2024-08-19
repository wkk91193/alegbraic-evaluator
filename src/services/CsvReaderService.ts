import * as fs from 'fs';
import * as fastCsv from 'fast-csv';
import { FileReader } from '../interfaces/FileReader';

export class CsvReaderService implements FileReader {
  read(filepath: string): Promise<string[][]> {
    return new Promise((resolve, reject) => {
      const rows: string[][] = [];
      fs.createReadStream(filepath)
        .pipe(fastCsv.parse({ headers: false, delimiter: ',' }))
        .on('data', (row: string[]) => rows.push(row))
        .on('end', () => resolve(rows))
        .on('error', reject);
    });
  }
}
