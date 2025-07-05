// Types for Chrome Built-in AI APIs
// Based on the Chrome AI documentation and origin trial specifications

export interface ChromeAI {
  translator?: {
    create(_options: TranslatorOptions): Promise<Translator>;
    canTranslate(_options: TranslatorOptions): Promise<'readily' | 'after-download' | 'no'>;
  };
  summarizer?: {
    create(_options?: SummarizerOptions): Promise<Summarizer>;
    capabilities(): Promise<SummarizerCapabilities>;
  };
  languageModel?: {
    create(_options?: LanguageModelOptions): Promise<LanguageModel>;
    capabilities(): Promise<LanguageModelCapabilities>;
  };
  writer?: {
    create(_options?: WriterOptions): Promise<Writer>;
    capabilities(): Promise<WriterCapabilities>;
  };
  rewriter?: {
    create(_options?: RewriterOptions): Promise<Rewriter>;
    capabilities(): Promise<RewriterCapabilities>;
  };
  languageDetector?: {
    create(): Promise<LanguageDetector>;
    capabilities(): Promise<LanguageDetectorCapabilities>;
  };
}

export interface TranslatorOptions {
  sourceLanguage: string;
  targetLanguage: string;
}

export interface Translator {
  translate(text: string): Promise<string>;
  destroy(): void;
}

export interface SummarizerOptions {
  type?: 'tl;dr' | 'key-points' | 'teaser' | 'headline';
  format?: 'plain-text' | 'markdown';
  length?: 'short' | 'medium' | 'long';
}

export interface Summarizer {
  summarize(text: string): Promise<string>;
  destroy(): void;
}

export interface SummarizerCapabilities {
  available: 'readily' | 'after-download' | 'no';
  defaultType: string;
  defaultFormat: string;
  defaultLength: string;
}

export interface LanguageModelOptions {
  temperature?: number;
  topK?: number;
}

export interface LanguageModel {
  prompt(text: string): Promise<string>;
  promptStreaming(text: string): AsyncIterable<string>;
  destroy(): void;
}

export interface LanguageModelCapabilities {
  available: 'readily' | 'after-download' | 'no';
  defaultTemperature: number;
  defaultTopK: number;
  maxTopK: number;
}

export interface WriterOptions {
  tone?: 'formal' | 'neutral' | 'casual';
  format?: 'plain-text' | 'markdown';
  length?: 'short' | 'medium' | 'long';
}

export interface Writer {
  write(writingTask: string, context?: string): Promise<string>;
  writeStreaming(writingTask: string, context?: string): AsyncIterable<string>;
  destroy(): void;
}

export interface WriterCapabilities {
  available: 'readily' | 'after-download' | 'no';
}

export interface RewriterOptions {
  tone?: 'as-is' | 'more-formal' | 'more-casual';
  format?: 'as-is' | 'plain-text' | 'markdown';
  length?: 'as-is' | 'shorter' | 'longer';
}

export interface Rewriter {
  rewrite(text: string, context?: string): Promise<string>;
  rewriteStreaming(text: string, context?: string): AsyncIterable<string>;
  destroy(): void;
}

export interface RewriterCapabilities {
  available: 'readily' | 'after-download' | 'no';
}

export interface LanguageDetector {
  detect(text: string): Promise<LanguageDetectionResult[]>;
  destroy(): void;
}

export interface LanguageDetectionResult {
  detectedLanguage: string;
  confidence: number;
}

export interface LanguageDetectorCapabilities {
  available: 'readily' | 'after-download' | 'no';
}

// Global window interface extension
declare global {
  interface Window {
    ai?: ChromeAI;
  }
}

export type APIAvailability = 'readily' | 'after-download' | 'no' | 'unsupported';
