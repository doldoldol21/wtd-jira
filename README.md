# WTD-Jira - What To Do in Jira

> Jira에서 뭐하게? 이제 KPI로 답하세요.

### **1. 프로젝트 소개**

사용자의 Jira API 키를 활용하여 기간별 이슈 데이터를 분석하고, 핵심 성과 지표(KPI)를 시각적으로 보여주는 대시보드 서비스입니다.

### **2. 주요 기능**

* **안전한 API 키 관리:** 사용자의 Jira API 키를 Supabase에 안전하게 저장합니다.
* **KPI 분석:** 이슈 해결률, 평균 해결 시간 등 주요 KPI를 계산합니다.
* **데이터 시각화:** 분석된 데이터를 다양한 차트 형태로 제공합니다.
* **AI 기반 통찰 (선택):** AI API를 사용하여 분석 결과에 대한 통찰을 제공합니다.

### **3. 기술 스택**

* **프런트엔드 & 백엔드:** Next.js
* **데이터베이스 & 인증:** Supabase
* **차트:** Recharts 또는 Chart.js
* **API:** Jira API, AI API (OpenAI, Gemini 등)

### **4. 설치 및 실행**

1.  **저장소 클론**

    ```bash
    git clone [저장소 URL]
    ```

2.  **의존성 설치**

    ```bash
    npm install
    # 또는
    yarn
    ```

3.  **환경 변수 설정**

    `.env.local` 파일을 생성하고 Supabase 변수를 설정합니다.

    ```bash
    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    ```

4.  **개발 서버 실행**

    ```bash
    npm run dev
    # 또는
    yarn dev
    ```