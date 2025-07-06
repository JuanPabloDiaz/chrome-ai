import React, { useState, useCallback } from 'react';
import type { Translator } from '../types/chrome-ai';

const TranslatorDemo: React.FC = () => {
  const [sourceText, setSourceText] = useState('Hello, how are you today?');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
  ];

  const translateText = useCallback(async () => {
    if (!sourceText.trim()) {
      setError('Please enter some text to translate');
      return;
    }

    setIsTranslating(true);
    setError(null);
    setTranslatedText('');

    try {
      if (!window.ai?.translator) {
        throw new Error('Translator API not available');
      }

      // Check if translation is possible
      const canTranslate = await window.ai.translator.canTranslate({
        sourceLanguage,
        targetLanguage,
      });

      if (canTranslate === 'no') {
        throw new Error(`Translation from ${sourceLanguage} to ${targetLanguage} is not supported`);
      }

      if (canTranslate === 'after-download') {
        setError('Translation model needs to be downloaded. This may take a moment...');
      }

      // Create translator instance
      const translator: Translator = await window.ai.translator.create({
        sourceLanguage,
        targetLanguage,
      });

      // Perform translation
      const result = await translator.translate(sourceText);
      setTranslatedText(result);

      // Clean up
      translator.destroy();
    } catch (err) {
      console.error('Translation error:', err);
      setError(err instanceof Error ? err.message : 'Translation failed');

      // Fallback suggestion
      if (!window.ai?.translator) {
        setError(
          'Chrome AI Translator API not available. Make sure you have Chrome 138+ with the proper flags enabled.'
        );
      }
    } finally {
      setIsTranslating(false);
    }
  }, [sourceText, sourceLanguage, targetLanguage]);

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const clearAll = () => {
    setSourceText('');
    setTranslatedText('');
    setError(null);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2 text-[var(--color-text-primary)]">🌍 Chrome AI Translator</h3>
        <p className="text-[var(--color-text-secondary)]">Translate text between languages using Chrome's built-in AI translation.</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-2 min-w-[150px]">
            <label htmlFor="source-lang" className="font-medium text-[var(--color-text-primary)]">From:</label>
            <select
              id="source-lang"
              value={sourceLanguage}
              onChange={e => setSourceLanguage(e.target.value)}
              className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-2 text-[var(--color-text-primary)]"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button 
            className="bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-lg p-2 px-4 text-xl hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors mt-6"
            onClick={swapLanguages} 
            title="Swap languages"
          >
            ⇄
          </button>

          <div className="flex flex-col gap-2 min-w-[150px]">
            <label htmlFor="target-lang" className="font-medium text-[var(--color-text-primary)]">To:</label>
            <select
              id="target-lang"
              value={targetLanguage}
              onChange={e => setTargetLanguage(e.target.value)}
              className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-2 text-[var(--color-text-primary)]"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="source-text" className="font-medium text-[var(--color-text-primary)]">Source Text:</label>
            <textarea
              id="source-text"
              value={sourceText}
              onChange={e => setSourceText(e.target.value)}
              placeholder="Enter text to translate..."
              rows={6}
              className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-3 text-[var(--color-text-primary)] resize-y min-h-[120px] focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="translated-text" className="font-medium text-[var(--color-text-primary)]">Translation:</label>
            <textarea
              id="translated-text"
              value={translatedText}
              readOnly
              placeholder="Translation will appear here..."
              rows={6}
              className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-3 text-[var(--color-text-primary)] resize-y min-h-[120px] opacity-90"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={translateText}
            disabled={isTranslating || !sourceText.trim()}
            className={`flex-1 min-w-[150px] bg-[var(--color-accent)] text-white py-2 px-4 rounded-lg font-medium transition-colors ${isTranslating || !sourceText.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--color-accent-hover)]'}`}
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>

          <button 
            onClick={clearAll} 
            className="bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] py-2 px-4 rounded-lg font-medium hover:bg-[var(--color-bg-hover)] transition-colors"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
            <strong className="font-bold text-red-300">Error:</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslatorDemo;
