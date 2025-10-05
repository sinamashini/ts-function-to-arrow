import chalk from "chalk";
import { ConversionStats } from "./types";

export class ConversionTracker {
  private stats: ConversionStats = {
    converted: 0,
    skipped: 0,
    filesProcessed: 0
  };

  incrementConverted(): void {
    this.stats.converted++;
  }

  incrementSkipped(): void {
    this.stats.skipped++;
  }

  incrementFilesProcessed(): void {
    this.stats.filesProcessed++;
  }

  getStats(): ConversionStats {
    return { ...this.stats };
  }

  printSummary(dryRun: boolean): void {
    console.log("\n📊 Conversion Summary:");
    console.log(
      `  ${chalk.green("✅ Converted functions:")} ${this.stats.converted}`
    );
    console.log(
      `  ${chalk.yellow("⏭️  Skipped functions:")} ${this.stats.skipped}`
    );
    console.log(
      `  ${chalk.blue("📁 Files processed:")} ${this.stats.filesProcessed}`
    );

    if (dryRun) {
      console.log(
        chalk.yellow("\n👀 Dry run complete - no files were modified")
      );
    } else {
      console.log(chalk.green("\n🎉 Conversion complete!"));
    }
  }
}
