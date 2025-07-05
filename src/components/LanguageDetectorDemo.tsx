import React, { useState, useCallback } from 'react';
import type { LanguageDetector, LanguageDetectionResult } from '../types/chrome-ai';

const LanguageDetectorDemo: React.FC = () => {
  const [inputText, setInputText] = useState(
    'Hello, how are you? Bonjour, comment allez-vous? Hola, ¿cómo estás?'
  );
  const [results, setResults] = useState<LanguageDetectionResult[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectLanguage = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setIsDetecting(true);
    setError(null);
    setResults([]);

    try {
      if (!window.ai?.languageDetector) {
        throw new Error('Language Detector API not available');
      }

      const capabilities = await window.ai.languageDetector.capabilities();

      if (capabilities.available === 'no') {
        throw new Error('Language Detector is not available on this device');
      }

      if (capabilities.available === 'after-download') {
        setError('Language detection model needs to be downloaded. This may take a moment...');
      }

      const detector: LanguageDetector = await window.ai.languageDetector.create();
      const detectionResults = await detector.detect(inputText);
      setResults(detectionResults);

      detector.destroy();
    } catch (err) {
      console.error('Language detection error:', err);
      setError(err instanceof Error ? err.message : 'Language detection failed');

      if (!window.ai?.languageDetector) {
        setError(
          'Chrome AI Language Detector API not available. Make sure you have Chrome 138+ with the proper flags enabled.'
        );
      }
    } finally {
      setIsDetecting(false);
    }
  }, [inputText]);

  const clearAll = () => {
    setInputText('');
    setResults([]);
    setError(null);
  };

  const loadSampleText = (text: string) => {
    setInputText(text);
  };

  const sampleTexts = [
    'Hello, how are you? I hope you have a great day!',
    "Bonjour, comment allez-vous? J'espère que vous passez une bonne journée!",
    'Hola, ¿cómo estás? ¡Espero que tengas un buen día!',
    'Guten Tag, wie geht es Ihnen? Ich hoffe, Sie haben einen schönen Tag!',
    'こんにちは、元気ですか？素晴らしい一日をお過ごしください！',
    'Привет, как дела? Надеюсь, у тебя отличный день!',
  ];

  const getLanguageName = (code: string): string => {
    const languages: Record<string, string> = {
      en: 'English',
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      it: 'Italian',
      pt: 'Portuguese',
      ru: 'Russian',
      ja: 'Japanese',
      ko: 'Korean',
      zh: 'Chinese',
      ar: 'Arabic',
      hi: 'Hindi',
      nl: 'Dutch',
      sv: 'Swedish',
      da: 'Danish',
      no: 'Norwegian',
      fi: 'Finnish',
      pl: 'Polish',
      tr: 'Turkish',
      he: 'Hebrew',
    };
    return languages[code] || code.toUpperCase();
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return '#10b981'; // green
    if (confidence >= 0.6) return '#f59e0b'; // yellow
    if (confidence >= 0.4) return '#ef4444'; // red
    return '#6b7280'; // gray
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h3
          style={{
            margin: '0 0 0.5rem 0',
            color: '#1f2937',
            fontSize: '1.5rem',
          }}
        >
          🌐 Chrome AI Language Detector
        </h3>
        <p style={{ margin: 0, color: '#6b7280' }}>
          Detect the language of text using Chrome's built-in AI language detection.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ fontWeight: 500, color: '#374151' }}>Sample Texts:</label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '0.5rem',
            }}
          >
            {sampleTexts.map((text, index) => (
              <button
                key={index}
                onClick={() => loadSampleText(text)}
                disabled={isDetecting}
                style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  lineHeight: 1.4,
                  cursor: isDetecting ? 'not-allowed' : 'pointer',
                  opacity: isDetecting ? 0.6 : 1,
                }}
              >
                {text}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 500, color: '#374151' }}>Text to Analyze:</label>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Enter text to detect language..."
            rows={4}
            style={{
              resize: 'vertical',
              fontFamily: 'inherit',
              lineHeight: 1.5,
            }}
            disabled={isDetecting}
          />
          <div
            style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              textAlign: 'right',
            }}
          >
            Characters: {inputText.length} | Words:{' '}
            {
              inputText
                .trim()
                .split(/\s+/)
                .filter(w => w.length > 0).length
            }
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={detectLanguage}
            disabled={isDetecting || !inputText.trim()}
            style={{
              background: '#2563eb',
              color: 'white',
              flex: 1,
              minWidth: '150px',
              cursor: isDetecting || !inputText.trim() ? 'not-allowed' : 'pointer',
              opacity: isDetecting || !inputText.trim() ? 0.6 : 1,
            }}
          >
            {isDetecting ? 'Detecting...' : 'Detect Language'}
          </button>

          <button
            onClick={clearAll}
            disabled={isDetecting}
            style={{
              background: '#6b7280',
              color: 'white',
              cursor: isDetecting ? 'not-allowed' : 'pointer',
              opacity: isDetecting ? 0.6 : 1,
            }}
          >
            Clear
          </button>
        </div>

        {results.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 500, color: '#374151' }}>Detection Results:</label>
            <div
              style={{
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                background: '#f9fafb',
                padding: '1rem',
              }}
            >
              {results.map((result, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    marginBottom: index < results.length - 1 ? '0.5rem' : 0,
                    background: 'white',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 500, color: '#1f2937' }}>
                      {getLanguageName(result.detectedLanguage)}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Code: {result.detectedLanguage}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: getConfidenceColor(result.confidence),
                      }}
                    ></div>
                    <span
                      style={{
                        fontWeight: 500,
                        color: getConfidenceColor(result.confidence),
                        fontSize: '0.875rem',
                      }}
                    >
                      {Math.round(result.confidence * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontStyle: 'italic',
              }}
            >
              Confidence levels: Green (80%+), Yellow (60-79%), Red (40-59%), Gray (&lt;40%)
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '1rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
            }}
          >
            <strong style={{ color: '#991b1b' }}>Error:</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageDetectorDemo;
