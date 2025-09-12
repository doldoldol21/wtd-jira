'use client';

import { useState, useEffect } from 'react';
import { t } from '@/lib/i18n';

interface TranslatedTextProps {
  tKey: string;
  fallback?: string;
  className?: string;
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'label';
  inline?: boolean; // Button 내부에서 사용할 때
}

export function TranslatedText({ 
  tKey, 
  fallback, 
  className = '', 
  as: Component = 'span',
  inline = false
}: TranslatedTextProps) {
  // 브라우저 언어 감지해서 초기값 설정
  const getInitialText = () => {
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language || navigator.languages?.[0];
      if (browserLang?.startsWith('ko')) {
        return t(tKey); // 한국어 사용자면 바로 한국어 번역
      }
    }
    return fallback || tKey; // 영어 사용자면 fallback
  };

  const [text, setText] = useState(getInitialText());
  
  useEffect(() => {
    // 클라이언트에서만 번역 적용
    setText(t(tKey));
  }, [tKey]);
  
  // Button 내부에서는 Fragment로 렌더링
  if (inline) {
    return <>{text}</>;
  }
  
  return (
    <Component className={className}>
      {text}
    </Component>
  );
}
