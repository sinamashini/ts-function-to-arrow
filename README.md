# ts-function-to-arrow

[![npm version](https://badge.fury.io/js/ts-function-to-arrow.svg)](https://badge.fury.io/js/ts-function-to-arrow)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/sinamashini/ts-function-to-arrow.svg)](https://github.com/sinamashini/ts-function-to-arrow/stargazers)

A CLI tool to convert TypeScript function declarations to arrow functions, inspired by a simple `ts-morph` script. Easily transform your codebase from traditional function declarations to modern arrow functions while preserving exports, types, and async behavior.

## ✨ Features

- 🔄 Converts regular named functions to `const` arrow functions
- 📦 Handles `export default` functions (both named and anonymous, with proper separation for named ones)
- ✅ Preserves async functions, parameters, return types, and modifiers
- 📁 Processes entire directories (defaults to `src`)
- 👀 `--dry-run` mode for safe previews without saving changes
- 🔍 `-v, --verbose` for detailed processing logs
- ❓ Interactive confirmation prompt before conversion
- 📊 Summary stats: converted functions, skipped ones, and files processed
- 🌈 Colored console output for better readability
- 🔧 Powered by `ts-morph` for precise TypeScript parsing

## 🚀 Installation

```bash
npm install -g ts-function-to-arrow
```

## 📖 Usage

```bash
ts-function-to-arrow [options]
```

## Options

| Option                  | Description                          | Default |
| ----------------------- | ------------------------------------ | ------- |
| `-d, --dir <directory>` | Directory to process                 | `src`   |
| `--dry-run`             | Preview changes without saving files | -       |
| `-v, --verbose`         | Show detailed processing information | -       |
| `-h, --help`            | Show help message                    | -       |
| `-V, --version`         | Output the version number            | -       |

## Example

```bash
# Process src directory (default) with confirmation
ts-function-to-arrow

# Preview changes in lib directory
ts-function-to-arrow -d lib --dry-run

# Full conversion with verbose details
ts-function-to-arrow -d src -v
```

### The tool will:

1. Prompt you to confirm the conversion (unless in dry-run)
2. Scan all `.ts` and `.tsx` files in the specified directory
3. Log processing details (verbose mode shows skips and conversions)
4. Preview or apply changes (replaces functions with arrow equivalents)
5. Display a summary of results and save files (if not dry-run)

## 🎯 Examples

## Before & After

### Named Export Function:

```typescript
// Before
export function greet(name: string): string {
  return `Hello, ${name}!`;
}

// After
export const greet = (name: string): string => {
  return `Hello, ${name}!`;
};
```

### Default Export (Named):

```typescript
// Before
export default function createUser(data: User): User {
  return { ...data, id: generateId() };
}

// After
const createUser = (data: User): User => {
  return { ...data, id: generateId() };
};
export default createUser;
```

### Default Export (Anonymous):

```typescript
// Before
export default function () {
  console.log("Hello World");
}

// After
export default () => {
  console.log("Hello World");
};
```

### Async Function:

```typescript
// Before
export async function fetchData(): Promise<Data> {
  const response = await fetch("/api/data");
  return response.json();
}

// After
export const fetchData = async (): Promise<Data> => {
  const response = await fetch("/api/data");
  return response.json();
};
```

### Skipped Cases (Verbose Output):

- Functions without bodies
- Anonymous non-default exports

## 📋 Prerequisites

- Node.js >= 18.0.0
- A `tsconfig.json` file in the project root (used by `ts-morph`)
- TypeScript (`.ts`) or TSX (`.tsx`) files in the target directory

## 🛠 Development

### Setup

```bash
git clone https://github.com/sinamashini/ts-function-to-arrow.git
cd ts-function-to-arrow
npm install
npm run build
```

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the CLI locally (auto-builds)
- `npm run dev` - Run with ts-node for development
- `npm test` - Run tests (extend as needed!)

### Testing Locally

```bash
npm link

# In another project directory with tsconfig.json and src/ files
npm link ts-function-to-arrow
ts-function-to-arrow --dry-run -v
npm unlink ts-function-to-arrow
```

## 🤝 Contributing

### Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [ts-morph](https://ts-morph.com/) for TypeScript parsing (inspired by the original conversion script)
- CLI powered by [Commander.js](https://github.com/tj/commander.js) and [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)
- Colored output via [Chalk](https://github.com/chalk/chalk)

# ⭐ If you found this useful, please give it a star! ⭐
