#!/usr/bin/env node
import { program } from "commander";
import inquirer from "inquirer";
import { ConversionOptions } from "./core/types";
import { FunctionConverter } from "./core/converter";
import { printHelp, printHelpToConsole, printOptions } from "./cli/help";
import { Logger } from "./cli/logger";
import chalk from "chalk";

// Setup CLI
program
  .version("1.1.0", "-V, --version")
  .description(
    chalk.bold("Convert TypeScript function declarations to arrow functions")
  )
  .option("-d, --dir <directory>", "Directory to process", "src")
  .option("--dry-run", "Preview changes without saving files")
  .option("-v, --verbose", "Show detailed processing information")
  .action(() => {
    if (process.argv.length === 2) {
      printHelpToConsole();
      process.exit(0);
    }
  });

// Add help text for commander's built-in help
program.addHelpText("after", printHelp);

program
  .command("help")
  .description("Show this help message")
  .action(() => {
    printHelpToConsole();
    process.exit(0);
  });

program.helpOption("-h, --help", "Show this help message");

program.on("command:*", () => {
  Logger.error(`\n❌ Unknown command: ${program.args.join(" ")}`);
  Logger.gray("\nSee --help for available options.\n");
  process.exit(1);
});

// CRITICAL: Parse args BEFORE accessing opts()
program.parse(process.argv);
const options = program.opts();

const cliOptions: ConversionOptions = {
  directory: options.dir,
  dryRun: !!options.dryRun,
  verbose: !!options.verbose
};

const main = async (): Promise<void> => {
  if (program.args.includes("help") || options.help) {
    printHelpToConsole();
    return;
  }

  if (cliOptions.verbose) {
    printOptions(cliOptions);
  }

  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: chalk.yellow(
        `Convert function declarations to arrow functions in '${cliOptions.directory}'?`
      ),
      default: true
    }
  ]);

  if (!confirm) {
    Logger.gray("Operation cancelled.");
    process.exit(0);
  }

  try {
    const converter = new FunctionConverter(cliOptions);
    const stats = converter.convert();

    // Print summary (you'll need to fix the stats tracking in converter)
    console.log(chalk.bold("\n📊 Conversion Summary:"));
    console.log(
      `  ${chalk.green("✅ Converted functions:")} ${stats.converted}`
    );
    console.log(`  ${chalk.yellow("⏭️  Skipped functions:")} ${stats.skipped}`);
    console.log(
      `  ${chalk.blue("📁 Files processed:")} ${stats.filesProcessed}`
    );

    if (cliOptions.dryRun) {
      console.log(
        chalk.yellow("\n👀 Dry run complete - no files were modified")
      );
    } else {
      console.log(chalk.green("\n🎉 Conversion complete!"));
    }
  } catch (err: any) {
    Logger.error(`Error: ${err.message}`);
    if (cliOptions.verbose) {
      console.error(chalk.gray(err.stack));
    }
    process.exit(1);
  }
};

main();
