import React, { useState, useCallback } from 'react';
import type { Rewriter } from '../types/chrome-ai';

const RewriterDemo: React.FC = () => {
  const [inputText, setInputText] = useState(
    'The meeting was very productive and we discussed many important topics.'
  );
  const [output, setOutput] = useState('');
  const [tone, setTone] = useState<'as-is' | 'more-formal' | 'more-casual'>('as-is');
  const [format, setFormat] = useState<'as-is' | 'plain-text' | 'markdown'>('as-is');
  const [length, setLength] = useState<'as-is' | 'shorter' | 'longer'>('as-is');
  const [context, setContext] = useState('');
  const [isRewriting, setIsRewriting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rewriteText = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to rewrite');
      return;
    }

    setIsRewriting(true);
    setError(null);
    setOutput('');

    try {
      if (!window.ai?.rewriter) {
        throw new Error('Rewriter API not available');
      }

      const capabilities = await window.ai.rewriter.capabilities();

      if (capabilities.available === 'no') {
        throw new Error('Rewriter is not available on this device');
      }

      if (capabilities.available === 'after-download') {
        setError('Rewriter model needs to be downloaded. This may take a moment...');
      }

      const rewriter: Rewriter = await window.ai.rewriter.create({
        tone,
        format,
        length,
      });

      const result = await rewriter.rewrite(inputText, context || undefined);
      setOutput(result);

      rewriter.destroy();
    } catch (err) {
      console.error('Rewriting error:', err);
      setError(err instanceof Error ? err.message : 'Text rewriting failed');

      if (!window.ai?.rewriter) {
        setError(
          'Chrome AI Rewriter API not available. Make sure you have Chrome 138+ with the proper flags enabled.'
        );
      }
    } finally {
      setIsRewriting(false);
    }
  }, [inputText, context, tone, format, length]);

  const clearAll = () => {
    setInputText('');
    setOutput('');
    setContext('');
    setError(null);
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937', fontSize: '1.5rem' }}>
          🔄 Chrome AI Rewriter
        </h3>
        <p style={{ margin: 0, color: '#6b7280' }}>
          Rewrite text with different tone, format, and length using Chrome's built-in AI rewriter.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            flexWrap: 'wrap',
            padding: '1rem',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '120px' }}
          >
            <label style={{ fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>Tone:</label>
            <select
              value={tone}
              onChange={e => setTone(e.target.value as typeof tone)}
              style={{ fontSize: '0.875rem', padding: '0.5rem' }}
            >
              <option value="as-is">As-is</option>
              <option value="more-formal">More Formal</option>
              <option value="more-casual">More Casual</option>
            </select>
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '120px' }}
          >
            <label style={{ fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>
              Format:
            </label>
            <select
              value={format}
              onChange={e => setFormat(e.target.value as typeof format)}
              style={{ fontSize: '0.875rem', padding: '0.5rem' }}
            >
              <option value="as-is">As-is</option>
              <option value="plain-text">Plain Text</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '120px' }}
          >
            <label style={{ fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>
              Length:
            </label>
            <select
              value={length}
              onChange={e => setLength(e.target.value as typeof length)}
              style={{ fontSize: '0.875rem', padding: '0.5rem' }}
            >
              <option value="as-is">As-is</option>
              <option value="shorter">Shorter</option>
              <option value="longer">Longer</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 500, color: '#374151' }}>Original Text:</label>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Enter text to rewrite..."
            rows={4}
            style={{ resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }}
            disabled={isRewriting}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 500, color: '#374151' }}>Context (Optional):</label>
          <textarea
            value={context}
            onChange={e => setContext(e.target.value)}
            placeholder="Provide context for the rewrite..."
            rows={2}
            style={{ resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }}
            disabled={isRewriting}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={rewriteText}
            disabled={isRewriting || !inputText.trim()}
            style={{
              background: '#dc2626',
              color: 'white',
              flex: 1,
              minWidth: '150px',
              cursor: isRewriting || !inputText.trim() ? 'not-allowed' : 'pointer',
              opacity: isRewriting || !inputText.trim() ? 0.6 : 1,
            }}
          >
            {isRewriting ? 'Rewriting...' : 'Rewrite Text'}
          </button>

          <button
            onClick={clearAll}
            disabled={isRewriting}
            style={{
              background: '#6b7280',
              color: 'white',
              cursor: isRewriting ? 'not-allowed' : 'pointer',
              opacity: isRewriting ? 0.6 : 1,
            }}
          >
            Clear All
          </button>
        </div>

        {output && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 500, color: '#374151' }}>Rewritten Text:</label>
            <div
              style={{ border: '1px solid #d1d5db', borderRadius: '8px', background: '#f9fafb' }}
            >
              <pre
                style={{
                  margin: 0,
                  padding: '1rem',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                }}
              >
                {output}
              </pre>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'right' }}>
              Characters: {output.length} | Words:{' '}
              {
                output
                  .trim()
                  .split(/\s+/)
                  .filter(w => w.length > 0).length
              }
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

export default RewriterDemo;
