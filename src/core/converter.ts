import { Project, SourceFile, SyntaxKind, FunctionDeclaration } from "ts-morph";
import {
  ConversionOptions,
  ConversionStats,
  FunctionConversionResult
} from "./types";
import { ConversionTracker } from "./stats";
import chalk from "chalk";
import path from "path";

export class FunctionConverter {
  private project: Project;
  private tracker: ConversionTracker;
  private options: ConversionOptions;

  constructor(options: ConversionOptions) {
    this.options = options;
    this.tracker = new ConversionTracker();
    this.project = new Project({
      tsConfigFilePath: path.resolve(process.cwd(), "tsconfig.json")
    });
  }

  convert(): ConversionStats {
    const sourceFiles = this.project.getSourceFiles([
      `${this.options.directory}/**/*.{ts,tsx}`
    ]);

    if (sourceFiles.length === 0) {
      console.log(
        chalk.red(`No TypeScript files found in '${this.options.directory}'.`)
      );
      process.exit(1);
    }

    console.log(
      chalk.green(
        `Processing ${sourceFiles.length} file(s) in '${this.options.directory}'...\n`
      )
    );

    sourceFiles.forEach((sourceFile) => {
      this.processFile(sourceFile);
    });

    if (!this.options.dryRun) {
      this.project.saveSync();
    }

    return this.tracker.getStats();
  }

  private processFile(sourceFile: SourceFile): void {
    this.tracker.incrementFilesProcessed();
    const filePath = sourceFile.getFilePath();
    console.log(
      chalk.cyan(`Processing: ${path.relative(process.cwd(), filePath)}`)
    );

    let modified = false;

    sourceFile.forEachChild((node) => {
      if (node.getKind() === SyntaxKind.FunctionDeclaration) {
        const result = this.convertFunction(node as FunctionDeclaration);
        if (result) {
          if (this.options.dryRun) {
            this.logDryRun(result.arrowFunctionText);
          } else {
            node.replaceWithText(result.arrowFunctionText);
            modified = true;
          }
          this.tracker.incrementConverted();
        } else {
          this.tracker.incrementSkipped();
        }
      }
    });

    if (!this.options.dryRun) {
      if (modified) {
        sourceFile.saveSync();
        console.log(chalk.green(`  💾 File saved\n`));
      } else {
        console.log(chalk.gray(`  📄 No changes made\n`));
      }
    } else {
      console.log(chalk.yellow(`  👀 Dry run - no files saved\n`));
    }
  }

  private convertFunction(
    fn: FunctionDeclaration
  ): FunctionConversionResult | null {
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
      if (this.options.verbose) {
        console.log(
          chalk.gray(
            `  ⏭️  Skipping function (no body): ${fn
              .getText()
              .substring(0, 50)}...`
          )
        );
      }
      return null;
    }

    const isExported = modifiers.includes("export");
    const hasDefaultModifier = modifiers.includes("default");
    const isDefaultExport = isExported && hasDefaultModifier;

    if (!name && !isDefaultExport) {
      if (this.options.verbose) {
        console.log(
          chalk.gray(
            `  ⏭️  Skipping anonymous function (not default export): ${fn
              .getText()
              .substring(0, 50)}...`
          )
        );
      }
      return null;
    }

    let arrowFn: string;
    let conversionType: FunctionConversionResult["conversionType"];

    if (isDefaultExport) {
      const returnTypeText = returnType ? `: ${returnType}` : "";
      if (name) {
        arrowFn = `const ${name} = ${
          isAsync ? "async " : ""
        }(${params})${returnTypeText} => ${body};\nexport default ${name};`;
        conversionType = "named-default";
        console.log(
          chalk.green(
            `  ✅ Converting named default export '${name}' to arrow function`
          )
        );
      } else {
        arrowFn = `export default ${
          isAsync ? "async " : ""
        }(${params})${returnTypeText} => ${body}`;
        conversionType = "anonymous-default";
        console.log(
          chalk.green(
            `  ✅ Converting anonymous default export to inline arrow function`
          )
        );
      }
    } else if (name) {
      const exportPrefix = isExported ? "export " : "";
      const returnTypeText = returnType ? `: ${returnType}` : "";
      arrowFn = `${exportPrefix}const ${name} = ${
        isAsync ? "async " : ""
      }(${params})${returnTypeText} => ${body}`;
      conversionType = "regular";
      console.log(
        chalk.green(`  ✅ Converting function '${name}' to arrow function`)
      );
    } else {
      return null;
    }

    return { arrowFunctionText: arrowFn, conversionType };
  }

  private logDryRun(arrowFn: string): void {
    console.log(
      chalk.yellow(
        `  👀 Would replace with: ${arrowFn.substring(0, 80)}${
          arrowFn.length > 80 ? "..." : ""
        }`
      )
    );
  }
}
