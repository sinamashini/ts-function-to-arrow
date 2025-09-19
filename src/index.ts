#!/usr/bin/env node
import { Project, SyntaxKind } from "ts-morph";
import { program } from "commander";
import inquirer from "inquirer";
import path from "path";

program
  .version("1.0.0")
  .description("Convert TypeScript function declarations to arrow functions")
  .option("-d, --dir <directory>", "Directory to process", "src")
  .parse(process.argv);

const options = program.opts();

async function main() {
  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: `Convert function declarations to arrow functions in '${options.dir}'?`,
      default: true
    }
  ]);

  if (!confirm) {
    console.log("Operation cancelled.");
    process.exit(0);
  }

  const project = new Project({
    tsConfigFilePath: path.resolve(process.cwd(), "tsconfig.json")
  });

  const sourceFiles = project.getSourceFiles([`${options.dir}/**/*.{ts,tsx}`]);

  if (sourceFiles.length === 0) {
    console.log(`No TypeScript files found in '${options.dir}'.`);
    process.exit(1);
  }

  console.log(
    `Processing ${sourceFiles.length} file(s) in '${options.dir}'...\n`
  );

  sourceFiles.forEach((sourceFile) => {
    console.log(`Processing file: ${sourceFile.getFilePath()}`);
    let modified = false;

    sourceFile.forEachChild((node) => {
      if (node.getKind() === SyntaxKind.FunctionDeclaration) {
        const fn = node.asKindOrThrow(SyntaxKind.FunctionDeclaration);
        const name = fn.getName();
        const params = fn
          .getParameters()
          .map((p) => p.getText())
          .join(", ");
        const body = fn.getBody()?.getText();
        const isAsync = fn.isAsync();
        const returnType = fn.getReturnTypeNode()?.getText();
        const modifiers = fn.getModifiers().map((m) => m.getText());

        if (!body) {
          console.log(
            `Skipping function (no body): ${fn.getText().substring(0, 50)}...`
          );
          return;
        }

        // Check if it's an export default function
        const hasExportDefault =
          (modifiers.includes("export") &&
            sourceFile
              .getExportDeclaration("default")
              ?.getModuleSpecifier()
              ?.getText()
              .includes(name || "default")) ||
          (fn.getModifiers().some((m) => m.getText() === "export") &&
            !name && // Anonymous default export
            sourceFile.getText().includes("export default function("));

        // Check for named export default pattern
        const isNamedDefaultExport =
          name &&
          modifiers.includes("export") &&
          sourceFile.getText().includes(`export default function ${name}`);

        if (!name && !hasExportDefault && !isNamedDefaultExport) {
          console.log(
            `Skipping anonymous function (not default export): ${fn
              .getText()
              .substring(0, 50)}...`
          );
          return;
        }

        if (name && body) {
          // Handle named functions (both regular and default exports)
          let arrowFn: string;

          if (hasExportDefault || isNamedDefaultExport) {
            // Export default function (named or anonymous)
            const returnTypeText = returnType ? `: ${returnType}` : "";
            arrowFn = `export default ${
              isAsync ? "async " : ""
            }(${params})${returnTypeText} => ${body}`;
            console.log(
              `Converting default export function ${
                name ? `'${name}'` : "(anonymous)"
              } to arrow function`
            );
          } else {
            // Regular named export function
            const exportPrefix = modifiers.includes("export") ? "export " : "";
            const returnTypeText = returnType ? `: ${returnType}` : "";
            arrowFn = `${exportPrefix}const ${name} = ${
              isAsync ? "async " : ""
            }(${params})${returnTypeText} => ${body}`;
            console.log(`Converting function '${name}' to arrow function`);
          }

          fn.replaceWithText(arrowFn);
          modified = true;
        } else if (body) {
          // Handle anonymous default export
          if (hasExportDefault) {
            const returnTypeText = returnType ? `: ${returnType}` : "";
            const arrowFn = `export default ${
              isAsync ? "async " : ""
            }(${params})${returnTypeText} => ${body}`;
            console.log(
              `Converting anonymous default export to arrow function`
            );
            fn.replaceWithText(arrowFn);
            modified = true;
          } else {
            console.log(
              `Skipping anonymous function (not default export): ${fn
                .getText()
                .substring(0, 50)}...`
            );
          }
        } else {
          console.log(
            `Skipping function (no name or body): ${fn
              .getText()
              .substring(0, 50)}...`
          );
        }
      }
    });

    if (modified) {
      sourceFile.saveSync();
      console.log(`File saved: ${sourceFile.getFilePath()}\n`);
    } else {
      console.log(`No changes made to: ${sourceFile.getFilePath()}\n`);
    }
  });

  project.saveSync();
  console.log("Conversion complete.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
