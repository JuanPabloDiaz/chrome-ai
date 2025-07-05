# Guía Rápida de Uso - Chrome Built-in AI APIs

## 🚀 Inicio Rápido

### 1. Configuración de Chrome

Para usar las APIs de Chrome, necesitas:

```bash
# 1. Chrome Canary/Dev/Beta (v138+)
# 2. Habilitar flags en chrome://flags:
#    - #prompt-api-for-gemini-nano
#    - #optimization-guide-on-device-model
# 3. Actualizar componente en chrome://components
```

### 2. Verificar Disponibilidad

```javascript
// En Chrome DevTools
const caps = await ai.languageModel.capabilities();
console.log(caps.available); // "readily" = listo para usar
```

### 3. Ejecutar el Proyecto

```bash
npm install
npm run dev
# Abrir http://localhost:4321 en Chrome
```

## 🛠️ APIs Disponibles

### Translator API

```javascript
const translator = await ai.translator.create({
  sourceLanguage: "en",
  targetLanguage: "es",
});
const result = await translator.translate("Hello world");
```

### Summarizer API

```javascript
const summarizer = await ai.summarizer.create({
  type: "tl;dr",
  length: "short",
});
const summary = await summarizer.summarize(longText);
```

### Prompt API

```javascript
const model = await ai.languageModel.create();
const response = await model.prompt("Escribe un haiku sobre programación");
```

### Writer API

```javascript
const writer = await ai.writer.create({
  tone: "formal",
  length: "medium",
});
const content = await writer.write("Redacta un email profesional");
```

### Rewriter API

```javascript
const rewriter = await ai.rewriter.create({
  tone: "more-casual",
});
const newText = await rewriter.rewrite("El texto a reescribir");
```

### Language Detector API

```javascript
const detector = await ai.languageDetector.create();
const results = await detector.detect("Hello, bonjour, hola");
```

## 🔧 Solución de Problemas

### Error: API no disponible

- Verificar Chrome v138+
- Habilitar todos los flags necesarios
- Reiniciar Chrome después de cambios

### Error: Modelo necesita descarga

- Conexión a internet estable
- Esperar descarga automática
- Puede tardar varios minutos

### Error: No funciona en móvil

- Las APIs solo funcionan en Chrome desktop
- No hay soporte móvil aún

## 📱 Interfaz de Usuario

El proyecto incluye:

- **Estado de APIs**: Indicadores en tiempo real
- **Pestañas**: Una por cada API
- **Ejemplos**: Texto de muestra para probar
- **Configuración**: Parámetros ajustables
- **Errores**: Mensajes claros de debugging

## 🌟 Características

- ✅ Detección automática de APIs
- ✅ Indicadores de estado visuales
- ✅ Fallbacks para navegadores no compatibles
- ✅ Interfaz responsive y accesible
- ✅ TypeScript para seguridad de tipos
- ✅ Manejo robusto de errores

## 📚 Recursos

- [Documentación Chrome AI](https://developer.chrome.com/docs/ai/)
- [Early Preview Program](https://developer.chrome.com/docs/ai/get-started)
- [Repositorio GitHub](https://github.com/chrome-ai-demo)
