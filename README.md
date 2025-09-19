# ts-function-to-arrow

[![npm version](https://badge.fury.io/js/ts-function-to-arrow.svg)](https://badge.fury.io/js/ts-function-to-arrow)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/sinamashini/ts-function-to-arrow.svg)](https://github.com/sinamashini/ts-function-to-arrow/stargazers)

A CLI tool to convert TypeScript function declarations to arrow functions in a specified directory.

## ✨ Features

- 🔄 Converts regular named functions to `const` arrow functions
- 📦 Handles `export default` functions (both named and anonymous)
- ✅ Preserves async functions, parameters, and return types
- 📁 Processes entire directories (defaults to `src`)
- ❓ Interactive confirmation prompt before conversion
- 📊 Verbose output showing all changes made
- 🔧 TypeScript-powered with `ts-morph` for accurate parsing

## 🚀 Installation

```bash
npm install -g ts-function-to-arrow
```

# 📖 Usage

```bash
ts-function-to-arrow --dir <directory>
```

## Options

`--dir <directory>:` Directory to process (defaults to `src`)

## Example

```bash
# Process src directory (default)
ts-function-to-arrow

# Process specific directory

ts-function-to-arrow --dir lib
```

### The tool will:

1. Prompt you to confirm the conversion
2. Process all .ts and .tsx files in the specified directory
3. Display verbose output for each file and function processed
4. Save the modified files

# 🎯 Examples

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
export default (data: User): User => {
  return { ...data, id: generateId() };
};
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

# 📋 Prerequisites

- A `tsconfig.json` file must exist in the project root
- The directory must contain TypeScript (`.ts`) or TSX (`.tsx`) files

# 🛠 Development

### Setup

```bash
git clone https://github.com/sinamashini/ts-function-to-arrow.git
cd ts-function-to-arrow
npm install
npm run build
```

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the CLI locally
- `npm test` - Run tests (add your own!)

### Testing Locally

```bash
npm link

# In another project directory

ts-function-to-arrow --dir src
npm unlink ts-function-to-arrow
```

# 🤝 Contributing

### Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

# 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

# 🙏 Acknowledgments

- Built with [ts-morph](https://ts-morph.com/) for TypeScript parsing
- CLI powered by [Commander.js](https://github.com/tj/commander.js) and [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)

# ⭐ If you found this useful, please give it a star! ⭐
