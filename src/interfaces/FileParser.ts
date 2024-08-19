export interface FileParser {
  parse(filepath: string): Promise<string[][]>;
}
