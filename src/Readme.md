# Algebraic Expression Evaluator

This TypeScript Node.js application reads algebraic expressions from an input file (CSV or TSV), evaluates them, and writes the results to an output file. The application is designed with flexibility in mind, allowing easy configuration and extension to support additional file formats.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- npm (comes with Node.js)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/algebraic-expression-evaluator.git
   cd algebraic-expression-evaluator

   ```

2. **Install dependancies:**

   ```bash
   npm install

   ```

3. ### Build the project

   ```bash
   npm run build

   ```

4. ### Run the project

   ```bash
   npm start
   ```

## Usage

### Configuration

- The configuration file (config.json) specifies the input and output file paths and the file type (CSV or TSV).

```
{
  "files": [
    {
      "inputFilePath": "resources/input.csv",
      "outputFilePath": "resources/output.csv",
      "fileType": "csv"
    },
    {
      "inputFilePath": "resources/input.tsv",
      "outputFilePath": "resources/output.tsv",
      "fileType": "tsv"
    }
  ]
}
```

## Extending for new file formats

- To support new file formats, implement the FileReader and FileWriter interfaces, then register the new services in the FileHandlerRegistry.

```
FileHandlerRegistry.register(
  'json',
  new JsonReaderService(),
  new JsonWriterService()
);
```
