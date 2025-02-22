export async function translateText(text, sourceLang = 'en', targetLang = 'hi') {
  try {
    const encodedText = encodeURIComponent(text);
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${sourceLang}|${targetLang}`;
    const response = await fetch(url);
    const data = await response.json();
    const translatedText = data.responseData.translatedText;

    // If the API returns a warning message, use the original text
    if (translatedText.includes("MYMEMORY WARNING")) {
      return text;
    }

    return translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // fallback to original text if translation fails
  }
}
