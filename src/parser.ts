import fs from "fs";

import generate from "./generate";

async function parser(fileName: string) {
  // Read the file (if it exists).
  const content = fs.existsSync(fileName)
    ? fs.readFileSync(fileName).toString()
    : "";

  // Split on every line.
  const lines = content.split("\n");

  // Begin iterating over the lines and collect the output.
  const output: string[] = [];
  let isInBlock = false;
  for (const line of lines) {
    if (isInBlock) {
      if (line.startsWith("<!-- END tstdoc")) {
        // Mark that we are now done processing the block.
        isInBlock = false;
      }
    } else if (line.startsWith("<!-- START tstdoc:generate")) {
      // Get the parameters of the invocation.
      const parts = line.split(
        // ( <typeFileName> , <symbolName> , <indent> )
        /\([\s]*(.*)[\s]*,[\s]*(.*)[\s]*,[\s]*(\d+)[\s]*\)/
      );

      if (parts.length < 4) {
        // This is an invalid invocation.
        throw new Error(`${line} has an invalid syntax, ${parts}`);
      }

      // Mark that we are now processing a block.
      isInBlock = true;
      output.push(line);
      output.push(
        "<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN tstdoc TO UPDATE -->"
      );

      // Grab the fileName of the Typescript file.
      const typeFileName = parts[1];

      // Grab the name of the symbol to handle.
      const symbolName = parts[2];

      // Parse the indent as a number.
      const indent = parseInt(parts[3], 10);

      // Generate the documentation based on the type name.
      const documentation = await generate({
        fileName: typeFileName,
        symbolNames: [symbolName],
        indent,
      });

      // Add this documentation to the output.
      output.push(documentation);
    }

    // If we aren't in a block, then add the line to the output. This enables us
    // to update existing documentation.
    if (!isInBlock) {
      output.push(line);
    }
  }

  // Write the file out once we've generated all the output.
  fs.writeFileSync(fileName, output.join("\n"));

  // eslint-disable-next-line no-console
  console.log(`Finished processing ${fileName}`);
}

export default parser;
