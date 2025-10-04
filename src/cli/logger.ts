import chalk from "chalk";

export class Logger {
  static info(message: string): void {
    console.log(chalk.blue(message));
  }

  static success(message: string): void {
    console.log(chalk.green(message));
  }

  static warn(message: string): void {
    console.log(chalk.yellow(message));
  }

  static error(message: string): void {
    console.log(chalk.red(message));
  }

  static gray(message: string): void {
    console.log(chalk.gray(message));
  }

  static bold(message: string): void {
    console.log(chalk.bold(message));
  }
}
