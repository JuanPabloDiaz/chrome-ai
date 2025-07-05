import React, { useState, useEffect } from 'react';
import type { APIAvailability } from '../types/chrome-ai';
import TranslatorDemo from './TranslatorDemo.tsx';
import SummarizerDemo from './SummarizerDemo.tsx';
import PromptDemo from './PromptDemo.tsx';
import WriterDemo from './WriterDemo.tsx';
import RewriterDemo from './RewriterDemo.tsx';
import LanguageDetectorDemo from './LanguageDetectorDemo.tsx';

interface APIStatus {
  translator: APIAvailability;
  summarizer: APIAvailability;
  languageModel: APIAvailability;
  writer: APIAvailability;
  rewriter: APIAvailability;
  languageDetector: APIAvailability;
}

const AIHub: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<APIStatus>({
    translator: 'unsupported',
    summarizer: 'unsupported',
    languageModel: 'unsupported',
    writer: 'unsupported',
    rewriter: 'unsupported',
    languageDetector: 'unsupported',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('translator');

  useEffect(() => {
    checkAPIAvailability();
  }, []);

  const checkAPIAvailability = async () => {
    setIsLoading(true);
    const newStatus: APIStatus = {
      translator: 'unsupported',
      summarizer: 'unsupported',
      languageModel: 'unsupported',
      writer: 'unsupported',
      rewriter: 'unsupported',
      languageDetector: 'unsupported',
    };

    try {
      // Check if window.ai exists
      if (typeof window !== 'undefined' && window.ai) {
        // Check Translator API
        if (window.ai.translator) {
          try {
            const canTranslate = await window.ai.translator.canTranslate({
              sourceLanguage: 'en',
              targetLanguage: 'es',
            });
            newStatus.translator = canTranslate;
          } catch (error) {
            console.warn('Translator API check failed:', error);
          }
        }

        // Check Summarizer API
        if (window.ai.summarizer) {
          try {
            const capabilities = await window.ai.summarizer.capabilities();
            newStatus.summarizer = capabilities.available;
          } catch (error) {
            console.warn('Summarizer API check failed:', error);
          }
        }

        // Check Language Model API (Prompt API)
        if (window.ai.languageModel) {
          try {
            const capabilities = await window.ai.languageModel.capabilities();
            newStatus.languageModel = capabilities.available;
          } catch (error) {
            console.warn('Language Model API check failed:', error);
          }
        }

        // Check Writer API
        if (window.ai.writer) {
          try {
            const capabilities = await window.ai.writer.capabilities();
            newStatus.writer = capabilities.available;
          } catch (error) {
            console.warn('Writer API check failed:', error);
          }
        }

        // Check Rewriter API
        if (window.ai.rewriter) {
          try {
            const capabilities = await window.ai.rewriter.capabilities();
            newStatus.rewriter = capabilities.available;
          } catch (error) {
            console.warn('Rewriter API check failed:', error);
          }
        }

        // Check Language Detector API
        if (window.ai.languageDetector) {
          try {
            const capabilities = await window.ai.languageDetector.capabilities();
            newStatus.languageDetector = capabilities.available;
          } catch (error) {
            console.warn('Language Detector API check failed:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error checking API availability:', error);
    }

    setApiStatus(newStatus);
    setIsLoading(false);
  };

  const getStatusColor = (status: APIAvailability) => {
    switch (status) {
      case 'readily':
        return '#10b981'; // green
      case 'after-download':
        return '#f59e0b'; // yellow
      case 'no':
        return '#ef4444'; // red
      case 'unsupported':
        return '#6b7280'; // gray
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: APIAvailability) => {
    switch (status) {
      case 'readily':
        return 'Ready';
      case 'after-download':
        return 'Download Required';
      case 'no':
        return 'Not Available';
      case 'unsupported':
        return 'Unsupported';
      default:
        return 'Unknown';
    }
  };

  const tabs = [
    { id: 'translator', label: 'Translator', status: apiStatus.translator },
    { id: 'summarizer', label: 'Summarizer', status: apiStatus.summarizer },
    { id: 'prompt', label: 'Prompt API', status: apiStatus.languageModel },
    { id: 'writer', label: 'Writer', status: apiStatus.writer },
    { id: 'rewriter', label: 'Rewriter', status: apiStatus.rewriter },
    { id: 'detector', label: 'Language Detector', status: apiStatus.languageDetector },
  ];

  if (isLoading) {
    return (
      <div className="ai-hub">
        <div className="card">
          <div className="loading">
            <div className="spinner"></div>
            <p>Checking API availability...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-hub">
      <div className="card">
        <div className="api-status">
          <h2>API Status</h2>
          <div className="status-grid">
            {tabs.map(tab => (
              <div key={tab.id} className="status-item">
                <div
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(tab.status) }}
                ></div>
                <span className="status-label">{tab.label}</span>
                <span className="status-text">{getStatusText(tab.status)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="tabs">
          <div className="tab-list">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''} ${tab.status === 'unsupported' ? 'disabled' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                disabled={tab.status === 'unsupported'}
              >
                {tab.label}
                <div
                  className="tab-status"
                  style={{ backgroundColor: getStatusColor(tab.status) }}
                ></div>
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === 'translator' && <TranslatorDemo />}
            {activeTab === 'summarizer' && <SummarizerDemo />}
            {activeTab === 'prompt' && <PromptDemo />}
            {activeTab === 'writer' && <WriterDemo />}
            {activeTab === 'rewriter' && <RewriterDemo />}
            {activeTab === 'detector' && <LanguageDetectorDemo />}
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .ai-hub {
          width: 100%;
        }

        .loading {
          text-align: center;
          padding: 2rem;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #2563eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .api-status {
          margin-bottom: 2rem;
        }

        .api-status h2 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.75rem;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .status-label {
          font-weight: 500;
          color: #374151;
        }

        .status-text {
          margin-left: auto;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .tabs {
          border-top: 1px solid #e5e7eb;
          padding-top: 2rem;
        }

        .tab-list {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 2rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #f9fafb;
          color: #6b7280;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-weight: 500;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .tab:hover:not(.disabled) {
          background: #f3f4f6;
          color: #374151;
        }

        .tab.active {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }

        .tab.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .tab-status {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .tab-content {
          min-height: 400px;
        }
      `,
        }}
      />
    </div>
  );
};

export default AIHub;
