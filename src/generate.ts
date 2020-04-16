import fs from "fs";
import path from "path";
import ts from "typescript";
import * as tjs from "typescript-json-schema";
import RefParser from "@apidevtools/json-schema-ref-parser";

import template from "./template";

/**
 * findCompilerOptions will find the compiler options for.
 *
 * @param fileName path to the file that we want to find the tsconfig.json for
 */
function findCompilerOptions(fileName: string) {
  // Find tsconfig file.
  const file = ts.findConfigFile(fileName, fs.existsSync);
  if (!file) {
    throw new Error(`tsconfig.json file not found for: ${fileName}`);
  }

  const text = fs.readFileSync(file).toString();
  const result = ts.parseConfigFileTextToJson(file, text);
  if (result.error) {
    throw result.error;
  }

  // Parse the JSON raw data into actual consumable compiler options.
  const config = ts.parseJsonConfigFileContent(
    result.config,
    ts.sys,
    path.dirname(file)
  );

  return config.options;
}

interface Options {
  /**
   * indent is the number of header characters to start each header with
   * (minimum 1).
   */
  indent: number;

  /**
   * fileName is the file that contains the typescript type that you want to
   * generate documentation for.
   */
  fileName: string;

  /**
   * symbolNames are the symbols in the file that you want to generate
   * documentation for.
   */
  symbolNames: string[];
}

interface Entry {
  symbolName: string;
  definition: tjs.Definition;
}

async function generate(options: Options) {
  const compilerOptions = findCompilerOptions(options.fileName);

  // Generate the program based on the input files.
  const program = tjs.getProgramFromFiles([options.fileName], compilerOptions);

  // Create the generator to generate the types.
  const generator = tjs.buildGenerator(program, { ignoreErrors: true });
  if (!generator) {
    throw new Error("could not create the generator");
  }

  // Get the schema for each symbol.
  const definitions: Entry[] = [];
  for (const symbolName of options.symbolNames) {
    // Get the JSON schema for the selected symbol.
    let schema = generator.getSchemaForSymbol(symbolName, true);

    // Dereference the references from this.
    let definition = await RefParser.dereference(
      schema as RefParser.JSONSchema
    );

    // Put the reference into a list.
    definitions.push({ symbolName, definition: definition as tjs.Definition });
  }

  // Setup the render context.
  const context = {
    // Provide the definitions.
    definitions,
    // Provide the default indent level for headings.
    indent: "#".repeat(options.indent),
  };

  // Render the template with the provided context.
  return template.render(context);
}

export default generate;
