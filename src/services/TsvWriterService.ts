import * as fs from 'fs';
import * as fastCsv from 'fast-csv';
import { FileWriter } from '../interfaces/FileWriter';
import logger from '../logger';

export class TsvWriterService implements FileWriter {
  async write(filePath: string, data: string[][]): Promise<void> {
    logger.info(`Writing data to TSV file: ${filePath}`);
    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(filePath);
      const tsvStream = fastCsv.format({ headers: false, delimiter: '\t' });

      tsvStream
        .pipe(writeStream)
        .on('finish', () => {
          logger.info(`Finished writing TSV file: ${filePath}`);
          resolve();
        })
        .on('error', (error) => {
          logger.error(`Error writing TSV file: ${filePath}`, error);
          reject(error);
        });

      data.forEach((row) => {
        logger.debug(`Writing row: ${row}`);
        tsvStream.write(row.join(','));
      }); // Convert array to TSV-formatted string
      tsvStream.end();
    });
  }
}
