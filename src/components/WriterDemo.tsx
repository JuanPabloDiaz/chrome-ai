import React, { useState, useCallback } from 'react';
import type { Writer } from '../types/chrome-ai';

const WriterDemo: React.FC = () => {
  const [writingTask, setWritingTask] = useState(
    'Write a professional email requesting a meeting with a potential client.'
  );
  const [context, setContext] = useState('');
  const [output, setOutput] = useState('');
  const [tone, setTone] = useState<'formal' | 'neutral' | 'casual'>('neutral');
  const [format, setFormat] = useState<'plain-text' | 'markdown'>('plain-text');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [isWriting, setIsWriting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = useCallback(async () => {
    if (!writingTask.trim()) {
      setError('Please enter a writing task');
      return;
    }

    setIsWriting(true);
    setError(null);
    setOutput('');

    try {
      if (!window.ai?.writer) {
        throw new Error('Writer API not available');
      }

      const capabilities = await window.ai.writer.capabilities();

      if (capabilities.available === 'no') {
        throw new Error('Writer is not available on this device');
      }

      if (capabilities.available === 'after-download') {
        setError('Writer model needs to be downloaded. This may take a moment...');
      }

      const writer: Writer = await window.ai.writer.create({
        tone,
        format,
        length,
      });

      const result = await writer.write(writingTask, context || undefined);
      setOutput(result);

      writer.destroy();
    } catch (err) {
      console.error('Writing error:', err);
      setError(err instanceof Error ? err.message : 'Content generation failed');

      if (!window.ai?.writer) {
        setError(
          'Chrome AI Writer API not available. Make sure you have Chrome 138+ with the proper flags enabled.'
        );
      }
    } finally {
      setIsWriting(false);
    }
  }, [writingTask, context, tone, format, length]);

  const clearAll = () => {
    setWritingTask('');
    setContext('');
    setOutput('');
    setError(null);
  };

  const loadSampleTask = (task: string) => {
    setWritingTask(task);
  };

  const sampleTasks = [
    'Write a professional email requesting a meeting with a potential client.',
    'Create a blog post introduction about sustainable living.',
    'Draft a thank you note for a job interview.',
    'Write a product description for a wireless headphone.',
    'Compose a social media post announcing a new product launch.',
    'Create a press release for a company milestone.',
  ];

  return (
    <div className="writer-demo">
      <div className="demo-header">
        <h3>✍️ Chrome AI Writer</h3>
        <p>
          Generate written content with specific tone, format, and length using Chrome's built-in AI
          writer.
        </p>
      </div>

      <div className="writer-container">
        <div className="options-panel">
          <div className="option-group">
            <label htmlFor="tone-select">Tone:</label>
            <select
              id="tone-select"
              value={tone}
              onChange={e => setTone(e.target.value as typeof tone)}
            >
              <option value="formal">Formal</option>
              <option value="neutral">Neutral</option>
              <option value="casual">Casual</option>
            </select>
          </div>

          <div className="option-group">
            <label htmlFor="format-select">Format:</label>
            <select
              id="format-select"
              value={format}
              onChange={e => setFormat(e.target.value as typeof format)}
            >
              <option value="plain-text">Plain Text</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>

          <div className="option-group">
            <label htmlFor="length-select">Length:</label>
            <select
              id="length-select"
              value={length}
              onChange={e => setLength(e.target.value as typeof length)}
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>
        </div>

        <div className="samples-section">
          <label>Sample Writing Tasks:</label>
          <div className="sample-grid">
            {sampleTasks.map((task, index) => (
              <button
                key={index}
                onClick={() => loadSampleTask(task)}
                className="sample-task"
                disabled={isWriting}
              >
                {task}
              </button>
            ))}
          </div>
        </div>

        <div className="input-section">
          <label htmlFor="writing-task">Writing Task:</label>
          <textarea
            id="writing-task"
            value={writingTask}
            onChange={e => setWritingTask(e.target.value)}
            placeholder="Describe what you want to write..."
            rows={3}
            disabled={isWriting}
          />
        </div>

        <div className="context-section">
          <label htmlFor="context-input">Context (Optional):</label>
          <textarea
            id="context-input"
            value={context}
            onChange={e => setContext(e.target.value)}
            placeholder="Provide additional context or background information..."
            rows={2}
            disabled={isWriting}
          />
        </div>

        <div className="controls">
          <button
            onClick={generateContent}
            disabled={isWriting || !writingTask.trim()}
            className="write-button"
          >
            {isWriting ? 'Writing...' : 'Generate Content'}
          </button>

          <button onClick={clearAll} className="clear-button" disabled={isWriting}>
            Clear All
          </button>
        </div>

        {output && (
          <div className="output-section">
            <label>Generated Content:</label>
            <div className="output-container">
              <pre className="output-text">{output}</pre>
            </div>
            <div className="output-stats">
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
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .writer-demo {
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

        .writer-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .options-panel {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .option-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 120px;
        }

        .option-group label {
          font-weight: 500;
          color: #374151;
          font-size: 0.875rem;
        }

        .option-group select {
          font-size: 0.875rem;
          padding: 0.5rem;
        }

        .samples-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .samples-section label {
          font-weight: 500;
          color: #374151;
        }

        .sample-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 0.5rem;
        }

        .sample-task {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          font-size: 0.875rem;
          text-align: left;
          line-height: 1.4;
        }

        .sample-task:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .input-section,
        .context-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-section label,
        .context-section label {
          font-weight: 500;
          color: #374151;
        }

        .input-section textarea,
        .context-section textarea {
          resize: vertical;
          font-family: inherit;
          line-height: 1.5;
        }

        .controls {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .write-button {
          background: #059669;
          color: white;
          flex: 1;
          min-width: 160px;
        }

        .write-button:hover:not(:disabled) {
          background: #047857;
        }

        .clear-button {
          background: #6b7280;
          color: white;
        }

        .clear-button:hover:not(:disabled) {
          background: #4b5563;
        }

        .output-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .output-section label {
          font-weight: 500;
          color: #374151;
        }

        .output-container {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: #f9fafb;
          max-height: 400px;
          overflow-y: auto;
        }

        .output-text {
          margin: 0;
          padding: 1rem;
          font-family: inherit;
          font-size: 0.875rem;
          line-height: 1.6;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .output-stats {
          font-size: 0.75rem;
          color: #6b7280;
          text-align: right;
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

        @media (max-width: 768px) {
          .options-panel {
            flex-direction: column;
          }
          
          .option-group {
            min-width: auto;
          }
          
          .sample-grid {
            grid-template-columns: 1fr;
          }
        }
      `,
        }}
      />
    </div>
  );
};

export default WriterDemo;
