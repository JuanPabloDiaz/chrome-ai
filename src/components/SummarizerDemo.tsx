import React, { useState, useCallback } from 'react';
import type { Summarizer } from '../types/chrome-ai';

const SummarizerDemo: React.FC = () => {
  const [inputText, setInputText] =
    useState(`Artificial Intelligence (AI) has transformed numerous industries and aspects of daily life. From healthcare to transportation, AI technologies are revolutionizing how we work, communicate, and solve complex problems. Machine learning algorithms can now process vast amounts of data to identify patterns and make predictions with remarkable accuracy. 

In healthcare, AI assists in medical diagnosis, drug discovery, and personalized treatment plans. Autonomous vehicles use AI for navigation and safety systems. Natural language processing enables chatbots and virtual assistants to understand and respond to human queries.

However, the rapid advancement of AI also raises important ethical considerations. Questions about privacy, bias in algorithms, job displacement, and the responsible development of AI systems are at the forefront of current discussions. As AI continues to evolve, it's crucial to balance innovation with ethical responsibility to ensure that these technologies benefit society as a whole.

The future of AI holds immense potential, from solving climate change to advancing scientific research. As we move forward, collaboration between technologists, policymakers, and society will be essential to harness AI's power responsibly.`);

  const [summary, setSummary] = useState('');
  const [summaryType, setSummaryType] = useState<'tl;dr' | 'key-points' | 'teaser' | 'headline'>(
    'tl;dr'
  );
  const [summaryFormat, setSummaryFormat] = useState<'plain-text' | 'markdown'>('plain-text');
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summarizeText = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to summarize');
      return;
    }

    setIsSummarizing(true);
    setError(null);
    setSummary('');

    try {
      if (!window.ai?.summarizer) {
        throw new Error('Summarizer API not available');
      }

      // Check capabilities
      const capabilities = await window.ai.summarizer.capabilities();

      if (capabilities.available === 'no') {
        throw new Error('Summarizer is not available on this device');
      }

      if (capabilities.available === 'after-download') {
        setError('Summarizer model needs to be downloaded. This may take a moment...');
      }

      // Create summarizer instance
      const summarizer: Summarizer = await window.ai.summarizer.create({
        type: summaryType,
        format: summaryFormat,
        length: summaryLength,
      });

      // Perform summarization
      const result = await summarizer.summarize(inputText);
      setSummary(result);

      // Clean up
      summarizer.destroy();
    } catch (err) {
      console.error('Summarization error:', err);
      setError(err instanceof Error ? err.message : 'Summarization failed');

      // Fallback suggestion
      if (!window.ai?.summarizer) {
        setError(
          'Chrome AI Summarizer API not available. Make sure you have Chrome 138+ with the proper flags enabled.'
        );
      }
    } finally {
      setIsSummarizing(false);
    }
  }, [inputText, summaryType, summaryFormat, summaryLength]);

  const clearAll = () => {
    setInputText('');
    setSummary('');
    setError(null);
  };

  const loadSampleText = () => {
    setInputText(`The concept of artificial general intelligence (AGI) represents a theoretical form of AI that would possess the ability to understand, learn, and apply intelligence across a wide range of tasks at a level equal to or beyond human cognitive abilities. Unlike narrow AI systems that excel at specific tasks, AGI would demonstrate flexibility and adaptability similar to human intelligence.

Current AI systems, while impressive in their specialized domains, are considered narrow AI. They can perform specific tasks like image recognition, language translation, or game playing with superhuman accuracy, but they cannot transfer their knowledge to unrelated domains without extensive retraining.

The development of AGI presents both tremendous opportunities and significant challenges. On the positive side, AGI could accelerate scientific discovery, solve complex global problems, and augment human capabilities in unprecedented ways. It could lead to breakthroughs in medicine, climate science, and space exploration.

However, the path to AGI is fraught with technical, ethical, and safety considerations. Researchers are working on alignment problems to ensure that AGI systems remain beneficial and controllable. The timeline for achieving AGI remains uncertain, with expert predictions ranging from decades to potentially much longer.

The pursuit of AGI continues to drive innovation in machine learning, neuroscience, and cognitive science, pushing the boundaries of what's possible in artificial intelligence.`);
  };

  return (
    <div className="summarizer-demo">
      <div className="demo-header">
        <h3>📄 Chrome AI Summarizer</h3>
        <p>Generate concise summaries of long text using Chrome's built-in AI summarization.</p>
      </div>

      <div className="summarizer-container">
        <div className="options-panel">
          <div className="option-group">
            <label htmlFor="summary-type">Summary Type:</label>
            <select
              id="summary-type"
              value={summaryType}
              onChange={e => setSummaryType(e.target.value as typeof summaryType)}
            >
              <option value="tl;dr">TL;DR</option>
              <option value="key-points">Key Points</option>
              <option value="teaser">Teaser</option>
              <option value="headline">Headline</option>
            </select>
          </div>

          <div className="option-group">
            <label htmlFor="summary-format">Format:</label>
            <select
              id="summary-format"
              value={summaryFormat}
              onChange={e => setSummaryFormat(e.target.value as typeof summaryFormat)}
            >
              <option value="plain-text">Plain Text</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>

          <div className="option-group">
            <label htmlFor="summary-length">Length:</label>
            <select
              id="summary-length"
              value={summaryLength}
              onChange={e => setSummaryLength(e.target.value as typeof summaryLength)}
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>
        </div>

        <div className="text-areas">
          <div className="input-section">
            <div className="input-header">
              <label htmlFor="input-text">Input Text:</label>
              <button onClick={loadSampleText} className="sample-button">
                Load Sample
              </button>
            </div>
            <textarea
              id="input-text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Enter text to summarize..."
              rows={12}
            />
            <div className="text-stats">
              Characters: {inputText.length} | Words:{' '}
              {
                inputText
                  .trim()
                  .split(/\s+/)
                  .filter(w => w.length > 0).length
              }
            </div>
          </div>

          <div className="output-section">
            <label htmlFor="summary-text">Summary:</label>
            <textarea
              id="summary-text"
              value={summary}
              readOnly
              placeholder="Summary will appear here..."
              rows={12}
            />
            {summary && (
              <div className="text-stats">
                Characters: {summary.length} | Words:{' '}
                {
                  summary
                    .trim()
                    .split(/\s+/)
                    .filter(w => w.length > 0).length
                }
              </div>
            )}
          </div>
        </div>

        <div className="controls">
          <button
            onClick={summarizeText}
            disabled={isSummarizing || !inputText.trim()}
            className="summarize-button"
          >
            {isSummarizing ? 'Summarizing...' : 'Generate Summary'}
          </button>

          <button onClick={clearAll} className="clear-button">
            Clear All
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
        .summarizer-demo {
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

        .summarizer-container {
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
          min-width: 140px;
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

        .text-areas {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .text-areas {
            grid-template-columns: 1fr;
          }
          
          .options-panel {
            flex-direction: column;
          }
          
          .option-group {
            min-width: auto;
          }
        }

        .input-section,
        .output-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .input-header label {
          font-weight: 500;
          color: #374151;
        }

        .sample-button {
          background: #6b7280;
          color: white;
          font-size: 0.75rem;
          padding: 0.25rem 0.75rem;
        }

        .sample-button:hover {
          background: #4b5563;
        }

        .output-section label {
          font-weight: 500;
          color: #374151;
        }

        .input-section textarea,
        .output-section textarea {
          resize: vertical;
          min-height: 200px;
          font-family: inherit;
          line-height: 1.5;
        }

        .output-section textarea {
          background: #f9fafb;
        }

        .text-stats {
          font-size: 0.75rem;
          color: #6b7280;
          text-align: right;
        }

        .controls {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .summarize-button {
          background: #059669;
          color: white;
          flex: 1;
          min-width: 180px;
        }

        .summarize-button:hover:not(:disabled) {
          background: #047857;
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

export default SummarizerDemo;
