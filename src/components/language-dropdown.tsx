'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { getLanguage, setLanguage, type Language } from '@/lib/i18n';

export function LanguageDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>('en');

  // 컴포넌트 마운트 시 현재 언어 가져오기
  useEffect(() => {
    setCurrentLang(getLanguage());
  }, []);

  const languages = [
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const handleLanguageChange = (langCode: Language) => {
    console.log('언어 변경:', langCode);
    setLanguage(langCode);
    setCurrentLang(langCode);
    setIsOpen(false);
    console.log('변경 후 언어:', getLanguage());
    window.location.reload(); // 새로고침으로 언어 적용
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors"
      >
        <Globe size={16} />
        <span className="text-sm">
          {languages.find(lang => lang.code === currentLang)?.flag}
        </span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 bg-popover border rounded-md shadow-lg z-20 min-w-[120px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code as Language)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors first:rounded-t-md last:rounded-b-md ${
                  currentLang === lang.code ? 'bg-muted' : ''
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
