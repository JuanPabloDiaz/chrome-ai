import React, { useState, useCallback, useRef } from 'react';
import type { LanguageModel } from '../types/chrome-ai';

const PromptDemo: React.FC = () => {
  const [prompt, setPrompt] = useState(
    'Write a creative short story about a robot learning to paint.'
  );
  const [response, setResponse] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [topK, setTopK] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingResponse, setStreamingResponse] = useState('');

  const abortControllerRef = useRef<AbortController | null>(null);
  const languageModelRef = useRef<LanguageModel | null>(null);

  const generateResponse = useCallback(
    async (streaming = false) => {
      if (!prompt.trim()) {
        setError('Please enter a prompt');
        return;
      }

      setIsGenerating(true);
      setIsStreaming(streaming);
      setError(null);

      if (streaming) {
        setStreamingResponse('');
      } else {
        setResponse('');
      }

      try {
        if (!window.ai?.languageModel) {
          throw new Error('Language Model API not available');
        }

        // Check capabilities
        const capabilities = await window.ai.languageModel.capabilities();

        if (capabilities.available === 'no') {
          throw new Error('Language Model is not available on this device');
        }

        if (capabilities.available === 'after-download') {
          setError('Language model needs to be downloaded. This may take a moment...');
        }

        // Create language model instance
        const languageModel: LanguageModel = await window.ai.languageModel.create({
          temperature: Math.min(temperature, capabilities.maxTopK || 1),
          topK: Math.min(topK, capabilities.maxTopK || 8),
        });

        languageModelRef.current = languageModel;

        if (streaming) {
          // Streaming response
          let fullResponse = '';
          const stream = languageModel.promptStreaming(prompt);

          for await (const chunk of stream) {
            if (abortControllerRef.current?.signal.aborted) {
              break;
            }
            fullResponse += chunk;
            setStreamingResponse(fullResponse);
          }
        } else {
          // Single response
          const result = await languageModel.prompt(prompt);
          setResponse(result);
        }

        // Clean up
        languageModel.destroy();
        languageModelRef.current = null;
      } catch (err) {
        console.error('Prompt generation error:', err);
        setError(err instanceof Error ? err.message : 'Text generation failed');

        // Fallback suggestion
        if (!window.ai?.languageModel) {
          setError(
            'Chrome AI Language Model API not available. Make sure you have Chrome 138+ with the proper flags enabled.'
          );
        }
      } finally {
        setIsGenerating(false);
        setIsStreaming(false);
      }
    },
    [prompt, temperature, topK]
  );

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (languageModelRef.current) {
      languageModelRef.current.destroy();
      languageModelRef.current = null;
    }
    setIsGenerating(false);
    setIsStreaming(false);
  };

  const clearAll = () => {
    setPrompt('');
    setResponse('');
    setStreamingResponse('');
    setError(null);
  };

  const loadSamplePrompt = (samplePrompt: string) => {
    setPrompt(samplePrompt);
  };

  const samplePrompts = [
    'Write a creative short story about a robot learning to paint.',
    'Explain quantum computing in simple terms for a 10-year-old.',
    'Create a haiku about the beauty of morning coffee.',
    'Describe the ideal workspace for a software developer.',
    'Write a persuasive argument for learning a new programming language.',
    'Compose a recipe for a healthy breakfast smoothie.',
  ];

  const currentResponse = isStreaming ? streamingResponse : response;

  return (
    <div className="prompt-demo">
      <div className="demo-header">
        <h3>💬 Chrome AI Prompt API</h3>
        <p>Generate text responses using Chrome's built-in language model (Gemini Nano).</p>
      </div>

      <div className="prompt-container">
        <div className="options-panel">
          <div className="option-group">
            <label htmlFor="temperature">
              Temperature: {temperature}
              <span className="param-description">(creativity)</span>
            </label>
            <input
              id="temperature"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={e => setTemperature(parseFloat(e.target.value))}
            />
          </div>

          <div className="option-group">
            <label htmlFor="top-k">
              Top-K: {topK}
              <span className="param-description">(diversity)</span>
            </label>
            <input
              id="top-k"
              type="range"
              min="1"
              max="8"
              step="1"
              value={topK}
              onChange={e => setTopK(parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="samples-section">
          <label>Sample Prompts:</label>
          <div className="sample-grid">
            {samplePrompts.map((sample, index) => (
              <button
                key={index}
                onClick={() => loadSamplePrompt(sample)}
                className="sample-prompt"
                disabled={isGenerating}
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        <div className="input-section">
          <label htmlFor="prompt-input">Your Prompt:</label>
          <textarea
            id="prompt-input"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            rows={4}
            disabled={isGenerating}
          />
        </div>

        <div className="controls">
          <button
            onClick={() => generateResponse(false)}
            disabled={isGenerating || !prompt.trim()}
            className="generate-button"
          >
            {isGenerating && !isStreaming ? 'Generating...' : 'Generate Response'}
          </button>

          <button
            onClick={() => generateResponse(true)}
            disabled={isGenerating || !prompt.trim()}
            className="stream-button"
          >
            {isStreaming ? 'Streaming...' : 'Stream Response'}
          </button>

          {isGenerating && (
            <button onClick={stopGeneration} className="stop-button">
              Stop
            </button>
          )}

          <button onClick={clearAll} className="clear-button" disabled={isGenerating}>
            Clear
          </button>
        </div>

        {currentResponse && (
          <div className="output-section">
            <label>
              Response:
              {isStreaming && <span className="streaming-indicator">●</span>}
            </label>
            <div className="response-container">
              <pre className="response-text">{currentResponse}</pre>
            </div>
            <div className="response-stats">
              Characters: {currentResponse.length} | Words:{' '}
              {
                currentResponse
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
        .prompt-demo {
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

        .prompt-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .options-panel {
          display: flex;
          gap: 2rem;
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
          min-width: 200px;
        }

        .option-group label {
          font-weight: 500;
          color: #374151;
          font-size: 0.875rem;
        }

        .param-description {
          font-weight: normal;
          color: #6b7280;
          font-size: 0.75rem;
        }

        .option-group input[type="range"] {
          width: 100%;
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

        .sample-prompt {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          font-size: 0.875rem;
          text-align: left;
          line-height: 1.4;
        }

        .sample-prompt:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .input-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-section label {
          font-weight: 500;
          color: #374151;
        }

        .input-section textarea {
          resize: vertical;
          font-family: inherit;
          line-height: 1.5;
        }

        .controls {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .generate-button {
          background: #7c3aed;
          color: white;
          flex: 1;
          min-width: 150px;
        }

        .generate-button:hover:not(:disabled) {
          background: #6d28d9;
        }

        .stream-button {
          background: #0891b2;
          color: white;
          flex: 1;
          min-width: 150px;
        }

        .stream-button:hover:not(:disabled) {
          background: #0e7490;
        }

        .stop-button {
          background: #dc2626;
          color: white;
        }

        .stop-button:hover {
          background: #b91c1c;
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
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .streaming-indicator {
          color: #ef4444;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .response-container {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: #f9fafb;
          max-height: 400px;
          overflow-y: auto;
        }

        .response-text {
          margin: 0;
          padding: 1rem;
          font-family: inherit;
          font-size: 0.875rem;
          line-height: 1.6;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .response-stats {
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

export default PromptDemo;
