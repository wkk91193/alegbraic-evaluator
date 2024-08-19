import * as fs from 'fs';
import * as fastCsv from 'fast-csv';
import { FileWriter } from '../interfaces/FileWriter';

export class TsvWriterService implements FileWriter {
  async write(filePath: string, data: string[][]): Promise<void> {
    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(filePath);
      const tsvStream = fastCsv.format({ headers: false, delimiter: '\t' });

      tsvStream.pipe(writeStream).on('end', resolve).on('error', reject);

      data.forEach((row) => tsvStream.write(row));
      tsvStream.end();
    });
  }
}
