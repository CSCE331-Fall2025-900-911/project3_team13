/**
 * Translation service for dynamically translating item names and descriptions
 * via the backend translation endpoint.
 */
interface TranslationCache {
  [key: string]: string;
}

const translationCache: { [language: string]: TranslationCache } = {};

// Backend translation endpoint
const BACKEND_API = 'http://localhost:3000/api/translate';

// rate limiting parameters
const RATE_LIMIT_DELAY = 200;
let lastRequestTime = 0;

/**
 * Calls backend translation to translate given text to target language.
 * 
 * @param text - The text to translate
 * @param targetLanguage - The target language code (e.g., 'en', 'es', 'fr')
 * @returns The translated text, or the original text if translation fails
 */
export async function translateText(text: string, targetLanguage: string): Promise<string> {
  // If the target is English, return the original text (assumed to be in English)
  if (targetLanguage === 'en') {
    return text;
  }

  // Initialize cache for this language if needed
  if (!translationCache[targetLanguage]) {
    translationCache[targetLanguage] = {};
  }

  // Check cache first
  if (translationCache[targetLanguage][text]) {
    return translationCache[targetLanguage][text];
  }

  // Apply rate limiting
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();

  try {
    const response = await fetch(BACKEND_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        targetLanguage: targetLanguage,
      }),
    });

    if (!response.ok) {
      console.warn(`Translation API error: ${response.status}`);
      return text;
    }

    const data = await response.json();
    console.log('Translation response:', data);
    
    const translatedText = data.translatedText || text;

    // Cache the result
    translationCache[targetLanguage][text] = translatedText;

    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text if translation fails
    return text;
  }
}

/**
 * Translate multiple texts with sequential requests to respect rate limits.
 * 
 * @param texts - Array of texts to translate
 * @param targetLanguage - The target language code
 * @returns Promise resolving to array of translated texts
 */
export async function translateMultiple(
  texts: string[],
  targetLanguage: string
): Promise<string[]> {
  const results: string[] = [];
  for (const text of texts) {
    results.push(await translateText(text, targetLanguage));
  }
  return results;
}

/**
 * Clear the translation cache (useful for testing or memory management)
 */
export function clearCache(): void {
  Object.keys(translationCache).forEach(key => {
    translationCache[key] = {};
  });
}
