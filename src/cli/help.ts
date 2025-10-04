import chalk from "chalk";
import { ConversionOptions } from "../core/types";

export const printHelp = (): string => {
  return `
${chalk.bold("📝 Convert TypeScript function declarations to arrow functions")}

${chalk.cyan("Usage:")}
  ${chalk.white("ts-to-arrow")} [options]

${chalk.cyan("Options:")}
  ${chalk.white("-d, --dir <directory>")}  ${chalk.gray(
    "Directory to process (default: src)"
  )}
  ${chalk.white("--dry-run")}             ${chalk.gray(
    "Preview changes without saving files"
  )}
  ${chalk.white("-v, --verbose")}         ${chalk.gray(
    "Show detailed processing information"
  )}
  ${chalk.white("-h, --help")}            ${chalk.gray(
    "Show this help message"
  )}
  ${chalk.white("-V, --version")}         ${chalk.gray(
    "Output the version number"
  )}

${chalk.cyan("Examples:")}
  ${chalk.white("ts-to-arrow")}                           ${chalk.gray(
    "# Process src/ directory"
  )}
  ${chalk.white("ts-to-arrow -d lib")}                    ${chalk.gray(
    "# Process lib/ directory"
  )}
  ${chalk.white("ts-to-arrow --dry-run")}                 ${chalk.gray(
    "# Preview changes"
  )}
  ${chalk.white("ts-to-arrow -d src --dry-run -v")}       ${chalk.gray(
    "# Dry run with verbose output"
  )}

${chalk.gray(
  "Requirements: Node.js >= 18.0.0 and tsconfig.json in project root"
)}
  `.trim();
};

export const printOptions = (options: ConversionOptions): void => {
  console.log(chalk.blue(`Processing directory: ${options.directory}`));
  console.log(
    chalk.blue(`Dry run mode: ${options.dryRun ? "enabled" : "disabled"}`)
  );
  console.log("");
};

// Separate function for console output
export const printHelpToConsole = (): void => {
  console.log(printHelp());
};
