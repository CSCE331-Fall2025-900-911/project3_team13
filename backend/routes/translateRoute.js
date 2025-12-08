const express = require('express');
const router = express.Router();

// Translation cache to avoid repeated API calls
const translationCache = {};

// POST /api/translate
router.post('/', async (req, res) => {
  const { text, targetLanguage } = req.body;

  // Validate input
  if (!text || !targetLanguage) {
    return res.status(400).json({ error: 'Missing text or targetLanguage' });
  }

  // English returns original text
  if (targetLanguage === 'en') {
    return res.json({ translatedText: text });
  }

  // Check cache
  const cacheKey = `${targetLanguage}|${text}`;
  if (translationCache[cacheKey]) {
    return res.json({ translatedText: translationCache[cacheKey] });
  }

  try {
    // Language code mapping
    const languageMap = {
      'es': 'es',
      'fr': 'fr',
      'de': 'de',
      'it': 'it',
    };

    const targetCode = languageMap[targetLanguage] || targetLanguage;

    // Call MyMemory Translation API
    const params = new URLSearchParams({
      q: text,
      langpair: `en|${targetCode}`,
    });

    const response = await fetch(`https://api.mymemory.translated.net/get?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`Translation API error: ${response.status}`);
      return res.json({ translatedText: text });
    }

    const data = await response.json();
    const translatedText = data.responseData?.translatedText || text;

    // Cache the result
    translationCache[cacheKey] = translatedText;

    res.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    res.json({ translatedText: text });
  }
});

module.exports = router;
