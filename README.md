# Chrome Built-in AI APIs Demo

A comprehensive demonstration of Chrome's experimental Built-in AI APIs using Astro and React. This project showcases the Translator, Summarizer, Prompt API (Language Model), Writer, Rewriter, and Language Detector APIs.

## 🚀 Quick Start

**Just want to test the APIs locally? Follow these 4 simple steps:**

1. **Download Chrome Canary/Dev/Beta** (version 138+)
2. **Enable flags**: Go to `chrome://flags`, search for "ai", enable all AI-related flags
3. **Download model**: Go to `chrome://components`, update "Optimization Guide On Device Model"
4. **Test it**: Clone this repo, run `npm install && npm run dev`, open `http://localhost:4321`

**No registration required for localhost testing!**

---

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

### Setup Chrome for [Built-in AI APIs](https://developer.chrome.com/docs/ai/built-in-apis)

#### Option 1: Local Development (Recommended for Testing)

**No registration required!** For testing on `localhost`, simply enable Chrome flags:

1. **Enable Feature Flags**

   Navigate to `chrome://flags` and enable these flags:
   - `#prompt-api-for-gemini-nano` → **Enabled**
   - `#optimization-guide-on-device-model` → **Enabled**
   - `#translation-api` → **Enabled**
   - `#summarization-api` → **Enabled**
   - `#writer-api` → **Enabled**
   - `#rewriter-api` → **Enabled**
   - `#language-detection-api` → **Enabled**

2. **Restart Chrome**

   Click "Relaunch" button that appears at the bottom of the flags page

3. **Download Gemini Nano Model**
   - Go to `chrome://components`
   - Find "Optimization Guide On Device Model"
   - Click "Check for update"
   - Wait for download to complete (may take several minutes)
   - Restart Chrome again

4. **Verify Setup**

   Open Chrome DevTools Console and run:

   ```javascript
   // Check if Language Model is available
   await ai.languageModel.capabilities();
   // Should return: { available: "readily" }

   // Test basic functionality
   const session = await ai.languageModel.create();
   await session.prompt("Hello!");
   ```

#### Option 2: Web Deployment (For Production)

**Registration required** for deploying to a public domain:

1. **Complete Local Setup First** (follow Option 1 above)

2. **Join Early Preview Program (EPP)**
   - Visit: [Chrome AI Early Preview Program](https://developer.chrome.com/docs/ai/join-epp)
   - Sign up with your Google account
   - Wait for approval (may take a few days)

3. **Register for Origin Trial** (if deploying to web)
   - Visit: [Chrome Origin Trials](https://developer.chrome.com/origintrials)
   - Find active AI API trials
   - Register your domain (e.g., `https://yourdomain.com`)
   - Get your origin trial token
   - Add token to your website's `<head>`:

   ```html
   <meta http-equiv="origin-trial" content="YOUR_TOKEN_HERE" />
   ```

#### Important Notes

- **Hardware Requirements**:
  - Desktop only (Windows 10+, macOS 13+, or Linux)
  - At least 22GB free storage
  - GPU with >4GB VRAM
  - Unmetered internet connection
- **Chrome Version**: 138+ (Canary, Dev, or Beta recommended)
- **APIs Work on localhost**: No registration needed for local development

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
- `npm run format:check` - Check if code is properly formatted
- `npm run lint` - Lint code with ESLint
- `npm run lint:fix` - Auto-fix linting issues
- `npm run typecheck` - Run TypeScript type checking
- `npm run check-all` - Run all quality checks (typecheck + lint + format check)
- `npm run clean` - Clean install (remove node_modules and reinstall)

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

### Registration & Setup Issues

1. **"I don't know how to register"**
   - **For localhost testing**: No registration needed! Just enable Chrome flags (see Option 1 above)
   - **For web deployment**: You need EPP + Origin Trial registration (see Option 2 above)

2. **"Optimization Guide On Device Model" missing from chrome://components**
   - **Most common issue**: The Gemini Nano model isn't available for download yet
   - **Solutions to try**:
     - Go to `chrome://flags/#optimization-guide-on-device-model`
     - Try setting to "Enabled BypassPerfRequirement" if available
     - Try Chrome Dev or Beta instead of Canary
     - Wait for gradual rollout (may take days/weeks)
   - **Why this happens**: Google is rolling out the model gradually by region and hardware

3. **AI object is undefined (`typeof ai === 'undefined'`)**
   - **Root cause**: Missing Gemini Nano model (see issue #2 above)
   - **Quick test**: Run `navigator.ml?.createSession?.()` in console
     - If this works but `ai` is undefined, it's a model availability issue
   - **Hardware requirements**: 22GB+ storage, 4GB+ GPU VRAM, unmetered connection

4. **Early Preview Program (EPP) Access**
   - Visit: https://developer.chrome.com/docs/ai/join-epp
   - Sign in with Google account
   - Fill out the application form
   - Wait for approval email (usually 1-3 business days)

5. **Origin Trial Registration Steps**
   - Go to: https://developer.chrome.com/origintrials
   - Search for "Built-in AI" or "Gemini Nano" trials
   - Click "Register" on the active trial
   - Enter your website domain (e.g., `https://mysite.com`)
   - Copy the generated token
   - Add to your HTML: `<meta http-equiv="origin-trial" content="TOKEN_HERE">`

### Common Technical Issues

1. **APIs not available**
   - Ensure you're using Chrome 138+ desktop
   - Verify all required flags are enabled at `chrome://flags`
   - Check that Gemini Nano component is updated at `chrome://components`
   - Restart Chrome completely after flag changes

2. **Model download required**
   - First use of APIs may require model download
   - This happens automatically but may take time (several minutes)
   - Ensure stable internet connection and sufficient storage (22GB+)
   - Check download progress at `chrome://components`

3. **Console errors**
   - Check Chrome DevTools for specific error messages
   - Verify feature flags are properly set
   - Try restarting Chrome after flag changes
   - Clear Chrome cache and restart

4. **Hardware requirements not met**
   - Desktop only: Windows 10+, macOS 13+, or Linux
   - Minimum 22GB free storage space
   - GPU with more than 4GB VRAM
   - Unmetered internet connection (not cellular/mobile data)

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
