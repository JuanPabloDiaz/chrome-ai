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
        return 'bg-emerald-500 dark:bg-emerald-600';
      case 'after-download':
        return 'bg-amber-500 dark:bg-amber-600';
      case 'no':
        return 'bg-red-500 dark:bg-red-600';
      case 'unsupported':
      default:
        return 'bg-gray-400 dark:bg-gray-600';
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
      <div className="w-full">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-10 h-10 border-4 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full animate-spin mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Checking API availability...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-[var(--color-text-primary)]">API Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {tabs.map(tab => (
            <div key={tab.id} className="flex items-center gap-3 p-3 bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border)]">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(tab.status)}`}></div>
              <span className="font-medium text-[var(--color-text-primary)]">{tab.label}</span>
              <span className="ml-auto text-sm text-[var(--color-text-secondary)]">{getStatusText(tab.status)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] pt-8">
        <div className="flex overflow-x-auto gap-1 pb-4 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all
                ${activeTab === tab.id ? 
                  'bg-[var(--color-accent)] text-white' : 
                  'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-accent)]'}
                ${tab.status === 'unsupported' ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={() => setActiveTab(tab.id)}
              disabled={tab.status === 'unsupported'}
            >
              {tab.label}
              <div className={`w-2 h-2 rounded-full ${getStatusColor(tab.status)}`}></div>
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'translator' && <TranslatorDemo />}
          {activeTab === 'summarizer' && <SummarizerDemo />}
          {activeTab === 'prompt' && <PromptDemo />}
          {activeTab === 'writer' && <WriterDemo />}
          {activeTab === 'rewriter' && <RewriterDemo />}
          {activeTab === 'detector' && <LanguageDetectorDemo />}
        </div>
      </div>
    </div>
  );
};

export default AIHub;
