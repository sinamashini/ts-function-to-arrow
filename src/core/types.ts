export interface ConversionStats {
  converted: number;
  skipped: number;
  filesProcessed: number;
}

export interface ConversionOptions {
  directory: string;
  dryRun: boolean;
  verbose: boolean;
}

export interface FunctionConversionResult {
  arrowFunctionText: string;
  conversionType: "regular" | "named-default" | "anonymous-default";
}
