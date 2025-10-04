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
      `  ${require("chalk").green("✅ Converted functions:")} ${
        this.stats.converted
      }`
    );
    console.log(
      `  ${require("chalk").yellow("⏭️  Skipped functions:")} ${
        this.stats.skipped
      }`
    );
    console.log(
      `  ${require("chalk").blue("📁 Files processed:")} ${
        this.stats.filesProcessed
      }`
    );

    if (dryRun) {
      console.log(
        require("chalk").yellow(
          "\n👀 Dry run complete - no files were modified"
        )
      );
    } else {
      console.log(require("chalk").green("\n🎉 Conversion complete!"));
    }
  }
}
