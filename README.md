# Chrome Built-in AI APIs Demo

A comprehensive demonstration of Chrome's experimental Built-in AI APIs using Astro and React. This project showcases the Translator, Summarizer, Prompt API (Language Model), Writer, Rewriter, and Language Detector APIs.

## 🚀 Features

- **Translator API**: Translate text between different languages
- **Summarizer API**: Generate summaries with different types, formats, and lengths
- **Prompt API (Language Model)**: Generate text responses using Gemini Nano
- **Writer API**: Create written content with specific tone, format, and length
- **Rewriter API**: Rewrite text with different tone, format, and length adjustments
- **Language Detector API**: Detect the language of input text with confidence scores

## 📋 Prerequisites

### Browser Requirements

- Chrome Canary, Dev, or Beta (version 138+ recommended)
- Desktop only (mobile not yet supported)

### Setup Chrome for Built-in AI APIs

1. **Join the Early Preview Program**
   - Visit [Chrome AI documentation](https://developer.chrome.com/docs/ai/get-started)
   - Sign up for the Early Preview Program (EPP)

2. **Enable Feature Flags**
   Navigate to `chrome://flags` and enable:
   - `#prompt-api-for-gemini-nano`
   - `#optimization-guide-on-device-model`
   - `#translation-api`
   - `#summarization-api`
   - `#writer-api`
   - `#rewriter-api`
   - `#language-detection-api`

3. **Update Gemini Nano Component**
   - Go to `chrome://components`
   - Find "Optimization Guide On Device Model"
   - Click "Check for update"
   - Restart Chrome after update

4. **Verify Setup**
   ```javascript
   // Open Chrome DevTools and run:
   const caps = await ai.languageModel.capabilities();
   console.log(caps.available); // Should return "readily"
   ```

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd chrome-ai-demo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in Chrome**
   Navigate to `http://localhost:4321` in your Chrome browser with the APIs enabled.

## 📁 Project Structure

```
src/
├── components/
│   ├── AIHub.tsx                 # Main component with API status and tabs
│   ├── TranslatorDemo.tsx        # Translation functionality
│   ├── SummarizerDemo.tsx        # Text summarization
│   ├── PromptDemo.tsx            # Prompt API / Language Model
│   ├── WriterDemo.tsx            # Content writing
│   ├── RewriterDemo.tsx          # Text rewriting
│   └── LanguageDetectorDemo.tsx  # Language detection
├── layouts/
│   └── Layout.astro              # Base layout component
├── pages/
│   └── index.astro               # Main page
└── types/
    └── chrome-ai.ts              # TypeScript definitions for Chrome AI APIs
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run format` - Format code with Prettier
- `npm run lint` - Lint code with ESLint

## 🌟 API Examples

### Translator API

```javascript
const translator = await ai.translator.create({
  sourceLanguage: "en",
  targetLanguage: "es",
});
const result = await translator.translate("Hello, world!");
console.log(result); // "¡Hola, mundo!"
```

### Summarizer API

```javascript
const summarizer = await ai.summarizer.create({
  type: "tl;dr",
  format: "plain-text",
  length: "short",
});
const summary = await summarizer.summarize(longText);
```

### Prompt API (Language Model)

```javascript
const model = await ai.languageModel.create();
const response = await model.prompt("Write a haiku about coding");
```

## 🚦 API Status Indicators

The application shows real-time status for each API:

- 🟢 **Ready**: API is available and ready to use
- 🟡 **Download Required**: API available after model download
- 🔴 **Not Available**: API not supported on this device
- ⚫ **Unsupported**: Browser doesn't support the API

## 🔧 Troubleshooting

### Common Issues

1. **APIs not available**
   - Ensure you're using Chrome 138+ desktop
   - Verify all required flags are enabled
   - Check that Gemini Nano component is updated

2. **Model download required**
   - First use of APIs may require model download
   - This happens automatically but may take time
   - Ensure stable internet connection

3. **Console errors**
   - Check Chrome DevTools for specific error messages
   - Verify feature flags are properly set
   - Try restarting Chrome after flag changes

### Debug Commands

```javascript
// Check language model availability
await ai.languageModel.capabilities();

// Check translator availability
await ai.translator.canTranslate({ sourceLanguage: "en", targetLanguage: "es" });

// Check summarizer capabilities
await ai.summarizer.capabilities();
```

## 🔮 Future Enhancements

- Add streaming support for all applicable APIs
- Implement error retry mechanisms
- Add more language pairs for translation
- Include example prompts library
- Add performance metrics dashboard
- Implement offline capability detection

## 📚 Documentation

- [Chrome Built-in AI Documentation](https://developer.chrome.com/docs/ai/)
- [Astro Documentation](https://docs.astro.build/)
- [React Documentation](https://reactjs.org/docs/)

## ⚠️ Important Notes

- These APIs are experimental and subject to change
- Currently only available in Chrome desktop browsers
- Requires specific Chrome flags and component updates
- Performance may vary based on device capabilities
- Not suitable for production use at this time

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Chrome AI APIs enabled
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Chrome AI team for developing these innovative APIs
- Astro team for the excellent framework
- React team for the component library
