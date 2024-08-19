export interface FileWriter {
  write(filePath: string, data: string[][]): Promise<void>;
}
