'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { getLanguage, setLanguage, Language, t } from '@/lib/i18n';

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<Language>('ko');

  useEffect(() => {
    setCurrentLang(getLanguage());
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLang: Language = currentLang === 'ko' ? 'en' : 'ko';
    setLanguage(newLang);
    setCurrentLang(newLang);
    window.location.reload(); // 간단한 새로고침으로 언어 변경 적용
  }, [currentLang]);

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50"
    >
      {currentLang === 'ko' ? t('ui.english') : t('ui.korean')}
    </Button>
  );
}
