import * as fs from 'fs';
import * as fastCsv from 'fast-csv';
import { FileWriter } from '../interfaces/FileWriter';
import logger from '../logger';

export class CsvWriterService implements FileWriter {
  async write(filePath: string, data: string[][]): Promise<void> {
    logger.info(`Writing data to CSV file: ${filePath}`);
    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(filePath);
      const csvStream = fastCsv.format({ headers: false, delimiter: ',' });

      csvStream
        .pipe(writeStream)
        .on('finish', () => {
          logger.info(`Finished writing CSV file: ${filePath}`);
          resolve();
        })
        .on('error', (error) => {
          logger.error(`Error writing CSV file: ${filePath}`, error);
          reject(error);
        });

      data.forEach((row) => {
        logger.debug(`Writing row: ${row}`);
        csvStream.write(row.join(','));
      }); // Convert array to CSV-formatted string
      csvStream.end();
    });
  }
}
