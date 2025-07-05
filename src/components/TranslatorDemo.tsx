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
    <div className="translator-demo">
      <div className="demo-header">
        <h3>🌍 Chrome AI Translator</h3>
        <p>Translate text between languages using Chrome's built-in AI translation.</p>
      </div>

      <div className="translation-container">
        <div className="language-selector">
          <div className="language-select">
            <label htmlFor="source-lang">From:</label>
            <select
              id="source-lang"
              value={sourceLanguage}
              onChange={e => setSourceLanguage(e.target.value)}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button className="swap-button" onClick={swapLanguages} title="Swap languages">
            ⇄
          </button>

          <div className="language-select">
            <label htmlFor="target-lang">To:</label>
            <select
              id="target-lang"
              value={targetLanguage}
              onChange={e => setTargetLanguage(e.target.value)}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-areas">
          <div className="input-section">
            <label htmlFor="source-text">Source Text:</label>
            <textarea
              id="source-text"
              value={sourceText}
              onChange={e => setSourceText(e.target.value)}
              placeholder="Enter text to translate..."
              rows={6}
            />
          </div>

          <div className="output-section">
            <label htmlFor="translated-text">Translation:</label>
            <textarea
              id="translated-text"
              value={translatedText}
              readOnly
              placeholder="Translation will appear here..."
              rows={6}
            />
          </div>
        </div>

        <div className="controls">
          <button
            onClick={translateText}
            disabled={isTranslating || !sourceText.trim()}
            className="translate-button"
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>

          <button onClick={clearAll} className="clear-button">
            Clear
          </button>
        </div>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .translator-demo {
          width: 100%;
        }

        .demo-header {
          margin-bottom: 2rem;
        }

        .demo-header h3 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
          font-size: 1.5rem;
        }

        .demo-header p {
          margin: 0;
          color: #6b7280;
        }

        .translation-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .language-selector {
          display: flex;
          align-items: end;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .language-select {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 150px;
        }

        .language-select label {
          font-weight: 500;
          color: #374151;
        }

        .swap-button {
          background: #f3f4f6;
          color: #6b7280;
          border: 1px solid #d1d5db;
          padding: 0.5rem 1rem;
          font-size: 1.2rem;
          margin-top: 1.5rem;
        }

        .swap-button:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .text-areas {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .text-areas {
            grid-template-columns: 1fr;
          }
          
          .language-selector {
            flex-direction: column;
            align-items: stretch;
          }
          
          .language-select {
            min-width: auto;
          }
        }

        .input-section,
        .output-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-section label,
        .output-section label {
          font-weight: 500;
          color: #374151;
        }

        .input-section textarea,
        .output-section textarea {
          resize: vertical;
          min-height: 120px;
        }

        .output-section textarea {
          background: #f9fafb;
        }

        .controls {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .translate-button {
          background: #2563eb;
          color: white;
          flex: 1;
          min-width: 150px;
        }

        .translate-button:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .clear-button {
          background: #6b7280;
          color: white;
        }

        .clear-button:hover {
          background: #4b5563;
        }

        .error-message {
          padding: 1rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
        }

        .error-message strong {
          color: #991b1b;
        }
      `,
        }}
      />
    </div>
  );
};

export default TranslatorDemo;
