import { useState, useEffect } from 'react';
import { translateText } from '../translate/translate';

function useTranslatedData(fetchUrl, targetLang = 'es') {
  const [data, setData] = useState(null);
  const [translatedData, setTranslatedData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDataAndTranslate() {
      try {
        // Fetch the original data
        const response = await fetch(fetchUrl);
        const jsonData = await response.json();
        setData(jsonData);
        
        // Assuming jsonData is text, or adjust if it's a more complex object
        const translation = await translateText(jsonData, 'en', targetLang);
        setTranslatedData(translation);
      } catch (err) {
        setError(err);
      }
    }
    fetchDataAndTranslate();
  }, [fetchUrl, targetLang]);

  return { data, translatedData, error };
}

export default useTranslatedData;
