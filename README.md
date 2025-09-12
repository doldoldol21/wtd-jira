# WTD-Jira - What To Do in Jira

> Jira에서 뭐하게? 이제 KPI로 답하세요.

## 프로젝트 소개

**클라이언트 사이드 전용** Jira 대시보드로, 사용자의 Jira API를 직접 연결하여 실시간 KPI 분석과 시각화를 제공합니다. 
**서버 없이** 브라우저에서만 동작하며, 모든 데이터는 로컬에 안전하게 저장됩니다.

## 현재 구현된 기능

### 보안 우선 설계
- **서버리스 아키텍처**: 모든 데이터는 브라우저 localStorage에만 저장
- **직접 API 연결**: Jira API를 클라이언트에서 직접 호출
- **데이터 프라이버시**: 서버로 전송되는 정보 없음

### 실시간 KPI 대시보드
- **핵심 지표**: 총 이슈 수, 해결된 이슈 수, 해결률, 평균 해결 시간
- **프로젝트 선택**: 다중 프로젝트 지원 및 실시간 전환
- **기간 설정**: 이번 달, 지난 달, 커스텀 기간 선택
- **이슈 목록**: 최근/오래된/인기/핫 이슈 Top 5

### 모던 UI/UX
- **다크/라이트 테마**: 자동 시스템 테마 감지
- **반응형 디자인**: 모바일/태블릿/데스크톱 최적화
- **애니메이션**: Floating icons, 호버 효과, 부드러운 전환
- **Glass Morphism**: 현대적인 블러 효과와 그라데이션

### 국제화 (i18n)
- **다국어 지원**: 한국어/영어 완전 지원
- **언어 전환**: 실시간 언어 변경 및 localStorage 저장
- **로컬라이제이션**: 날짜, 숫자 형식 자동 변환

### 데이터 시각화
- **KPI 카드**: 브랜드 컬러 기반 시각적 표현
- **상태별 분류**: 이슈 상태에 따른 색상 구분
- **인터랙티브**: 호버 효과 및 실시간 업데이트

## 향후 계획

### AI 기반 분석
- **GPT/Claude 연동**: 프로젝트 성과 분석 및 개선 제안
- **자동 리포트**: AI가 생성하는 주간/월간 성과 보고서
- **예측 분석**: 이슈 해결 시간 예측 및 병목 지점 분석

### 고급 분석
- **Google Analytics**: 사용자 행동 분석 및 기능 사용률 추적
- **성과 트렌드**: 시간별 성과 변화 차트
- **팀 분석**: 담당자별 성과 비교 및 워크로드 분석

### 확장 기능
- **백엔드 서버**: 선택적 서버 모드로 고급 기능 제공
- **데이터 내보내기**: PDF/Excel 리포트 생성
- **알림 시스템**: 목표 달성/이슈 급증 시 알림
- **커스텀 KPI**: 사용자 정의 지표 생성

### 통합 기능
- **Slack/Teams 연동**: 성과 리포트 자동 공유
- **Jira 플러그인**: Jira 내부에서 직접 사용 가능한 앱
- **API 제공**: 다른 도구와의 연동을 위한 REST API

## 기술 스택

### 현재 구현
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State**: localStorage, React Hooks
- **Charts**: Recharts (준비됨)
- **i18n**: 커스텀 번역 시스템
- **Icons**: Lucide React

### 계획된 기술
- **Backend**: Next.js API Routes (선택적)
- **Database**: Supabase/PostgreSQL (선택적)
- **AI**: OpenAI GPT, Anthropic Claude
- **Analytics**: Google Analytics 4
- **Deployment**: Vercel, Docker

## 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/wtd-jira.git
cd wtd-jira
```

### 2. 의존성 설치
```bash
yarn install
# 또는
npm install
```

### 3. 개발 서버 실행
```bash
yarn dev
# 또는
npm run dev
```

### 4. 프로덕션 빌드
```bash
yarn build
yarn start
# 또는
npm run build
npm start
```

## Jira 설정

### API Token 생성
1. [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens) 접속
2. "Create API token" 클릭
3. 토큰 이름 입력 후 생성
4. 생성된 토큰을 안전하게 보관

### 필요한 정보
- **Jira URL**: `https://your-domain.atlassian.net`
- **Email**: Jira 계정 이메일
- **API Token**: 위에서 생성한 토큰

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # 대시보드 페이지
│   ├── globals.css        # 글로벌 스타일
│   └── page.tsx          # 메인 페이지
├── components/            # React 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   ├── language-switcher.tsx
│   ├── page-layout.tsx
│   └── summary-report.tsx
└── lib/                  # 유틸리티 함수
    ├── i18n.ts          # 국제화 시스템
    ├── jira.ts          # Jira API 클라이언트
    └── jira-config.ts   # 설정 관리
```

## 디자인 시스템

### 브랜드 컬러
- **KPI Blue**: `oklch(0.6 0.15 240)` - 총 이슈
- **KPI Green**: `oklch(0.6 0.15 140)` - 해결된 이슈  
- **KPI Purple**: `oklch(0.6 0.15 280)` - 해결률
- **KPI Orange**: `oklch(0.6 0.15 30)` - 평균 시간

### 테마
- **Light Mode**: 부드러운 그레이 톤
- **Dark Mode**: 자동 전환 지원
- **Glass Effect**: 블러와 투명도 활용

## 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 감사의 말

- [shadcn/ui](https://ui.shadcn.com/) - 아름다운 UI 컴포넌트
- [Lucide](https://lucide.dev/) - 깔끔한 아이콘 세트
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 CSS 프레임워크
- [Next.js](https://nextjs.org/) - 강력한 React 프레임워크

---

**Made with ❤️ for better Jira experience**
