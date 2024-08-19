import * as fs from 'fs';
import * as fastCsv from 'fast-csv';
import { FileWriter } from '../interfaces/FileWriter';

export class CsvWriterService implements FileWriter {
  async write(filePath: string, data: string[][]): Promise<void> {
    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(filePath);
      const csvStream = fastCsv.format({ headers: false, delimiter: ',' });

      csvStream.pipe(writeStream).on('end', resolve).on('error', reject);

      data.forEach((row) => csvStream.write(row.join(','))); // Convert array to CSV-formatted string
      csvStream.end();
    });
  }
}
