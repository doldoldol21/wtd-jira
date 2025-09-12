export type Language = 'ko' | 'en';

type TranslationKeys = {
  [key: string]: string;
};

let currentLanguage: Language | null = null;

export const getLanguage = (): Language => {
  if (currentLanguage) return currentLanguage;
  
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('language') as Language;
    if (stored && ['ko', 'en'].includes(stored)) {
      currentLanguage = stored;
      return stored;
    }
    
    const browserLang = navigator.language || navigator.languages?.[0];
    currentLanguage = browserLang?.startsWith('ko') ? 'ko' : 'en';
    return currentLanguage;
  }
  
  return 'en';
};

export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
  }
};

export const translations: Record<Language, TranslationKeys> = {
  ko: {
    // 홈 페이지
    'home.title': 'Jira에서 뭐하게? 이제 KPI로 답하세요',
    'home.subtitle': 'Jira 이슈를 한눈에 파악하고 팀의 생산성을 극대화하세요',
    'home.jiraUrl': 'Jira 인스턴스 URL',
    'home.email': '이메일',
    'home.apiToken': 'API 토큰',
    'home.startDashboard': '대시보드 시작하기',
    'home.goToDashboard': '대시보드로 이동',
    'home.connecting': '연결 테스트 중...',
    'home.features.title': '주요 기능',
    'home.features.dashboard': '실시간 KPI 대시보드',
    'home.features.monitoring': '이슈 현황, 해결률, 평균 처리 시간 등 핵심 지표를 실시간으로 확인',
    'home.features.teamAnalysis': '팀 성과 분석',
    'home.features.teamAnalysisDesc': '개인별, 프로젝트별 성과를 시각화하여 팀 생산성 향상',
    'home.features.smartReport': '스마트 리포트',
    'home.features.smartReportDesc': 'AI 기반 인사이트와 개선 제안으로 더 나은 의사결정 지원',
    'home.setup.title': '시작하기',
    'home.setup.subtitle': 'Jira 인스턴스 정보를 입력하고 바로 시작하세요',
    'home.setup.jiraIntegration': 'Jira 연동 설정',
    'home.setup.apiTokenHelp': 'API 토큰 생성 방법 보기',
    'home.setup.securityNotice': '모든 정보는 브라우저에만 저장되며 서버로 전송되지 않습니다',
    'home.comingSoon': 'Coming Soon',
    
    // 대시보드
    'dashboard.title': 'Jira KPI 대시보드',
    'dashboard.filterSettings': '필터 설정',
    'dashboard.selectProject': '프로젝트 선택',
    'dashboard.sortByName': '이름순',
    'dashboard.sortByKey': '키순',
    'dashboard.dateRange': '기간 선택',
    'dashboard.thisMonth': '이번 달',
    'dashboard.lastMonth': '최근 한 달',
    'dashboard.customDate': '직접 설정',
    'dashboard.startDate': '시작일',
    'dashboard.endDate': '종료일',
    'dashboard.loadData': '조회',
    'dashboard.loading': '조회 중...',
    'dashboard.projectKpi': '프로젝트 KPI',
    
    // KPI
    'kpi.totalIssues': '총 이슈',
    'kpi.resolvedIssues': '해결된 이슈',
    'kpi.resolutionRate': '해결률',
    'kpi.avgResolutionTime': '평균 해결 시간',
    'kpi.days': '일',
    
    // 이슈 상태
    'status.done': '완료',
    'status.inProgress': '진행 중',
    'status.todo': '해야할일',
    'status.new': '새로운',
    'status.open': '열림',
    'issues.recentTop5': '최근 이슈 Top 5',
    'issues.oldestTop5': '오래된 미해결 이슈 Top 5',
    'issues.popularTop5': '인기 이슈 Top 5',
    'issues.hotTop5': '뜨거운 이슈 Top 5',
    'issues.daysAgo': '일 전',
    'issues.watchers': '명 관심',
    'issues.comments': '개 댓글',
    
    // 에러 메시지
    'error.configRequired': 'Jira 설정이 필요합니다.',
    'error.configInvalid': 'Jira 설정이 올바르지 않습니다.',
    'error.projectsFailed': '프로젝트 목록을 가져올 수 없습니다.',
    'error.dataFailed': '대시보드 데이터를 가져올 수 없습니다.',
    'error.connectionFailed': '연결 실패',
    'error.connectionError': '연결 테스트 중 오류가 발생했습니다.',
    
    // 액션
    'action.goHome': '홈으로 이동',
    'action.checkSettings': '설정을 확인해주세요',
    
    // API 에러 메시지
    'api.missingCredentials': 'Jira URL, 이메일, API 토큰을 모두 입력해주세요.',
    'api.invalidCredentials': '인증 정보가 올바르지 않습니다.',
    'api.connectionFailed': 'Jira 서버에 연결할 수 없습니다. URL을 확인해주세요.',
    'api.authFailed': '인증 실패',
    'api.configRequired': 'Jira 설정이 필요합니다.',
    'api.connectionError': '연결 테스트 중 오류가 발생했습니다.',
    
    // 테스트 페이지
    'test.title': 'Jira API 테스트',
    'test.dateRange': '날짜 범위 설정',
    'test.startDate': '시작일',
    'test.endDate': '종료일',
    'test.startDatePlaceholder': '시작일 선택',
    'test.endDatePlaceholder': '종료일 선택',
    'test.authTest': '인증 테스트',
    'test.projectList': '프로젝트 목록',
    'test.issueQuery': '이슈 조회',
    'test.testing': 'Testing...',
    'test.loading': 'Loading...',
    
    // UI 컴포넌트
    'ui.selectDate': '날짜 선택',
    'ui.korean': '한국어',
    'ui.english': 'EN',
    'ui.count': '개',
    
    // 차트
    'chart.statusDistribution': '상태별 이슈 분포',
    'chart.weeklyTrend': '주별 이슈 추이',
    'chart.priorityStatus': '우선순위별 현황',
    'chart.completed': '완료',
    'chart.inProgress': '진행중',
    'chart.todo': '해야할일',
    'chart.created': '생성',
    'chart.resolved': '해결',
    'chart.high': '높음',
    'chart.medium': '보통',
    'chart.low': '낮음',
    'chart.week': '주',
    'chart.month': '월',
    
    // 요약 리포트
    'report.title': '프로젝트 요약 리포트',
    'report.summary1': '{startDate}부터 {endDate}까지 {totalIssues}개의 이슈를 진행했으며 {completedIssues}개를 완료했습니다.',
    'report.summary2': '가장 집중했던 이슈는 "{mostFocused}"이며 많은 관심을 받은 이슈는 "{mostPopular}"입니다.',
    'report.summary3': '해결률은 {resolutionRate}%입니다.',
    'report.noData': '해당 없음',
    'report.lowCompletion': '완료율이 낮습니다. 진행중인 이슈들의 우선순위를 재검토해보세요.',
    'report.goodProgress': '양호한 진행률입니다. 조금만 더 집중하면 목표 달성이 가능합니다.',
    'report.excellentProgress': '훌륭한 진행률입니다! 이 속도를 유지해보세요.',
    'report.recommendations': '💡 추가 권장사항',
    'report.focusHighPriority': '우선순위가 높은 이슈부터 집중적으로 처리하여 완료율을 높여보세요.',
    'report.maintainPace': '현재 페이스를 유지하면서 새로운 도전 과제를 찾아보세요.',
  },
  en: {
    // Home page
    'home.title': 'What to do in Jira? Now answer with KPI',
    'home.subtitle': 'Monitor Jira issues at a glance and maximize team productivity',
    'home.jiraUrl': 'Jira Instance URL',
    'home.email': 'Email',
    'home.apiToken': 'API Token',
    'home.startDashboard': 'Start Dashboard',
    'home.goToDashboard': 'Go to Dashboard',
    'home.connecting': 'Testing connection...',
    'home.features.title': 'Key Features',
    'home.features.dashboard': 'Real-time KPI Dashboard',
    'home.features.monitoring': 'Monitor key metrics like issue status, resolution rate, and average processing time in real-time',
    'home.features.teamAnalysis': 'Team Performance Analysis',
    'home.features.teamAnalysisDesc': 'Visualize individual and project performance to improve team productivity',
    'home.features.smartReport': 'Smart Reports',
    'home.features.smartReportDesc': 'Support better decision-making with AI-powered insights and improvement suggestions',
    'home.setup.title': 'Get Started',
    'home.setup.subtitle': 'Enter your Jira instance information and start right away',
    'home.setup.jiraIntegration': 'Jira Integration Setup',
    'home.setup.apiTokenHelp': 'How to create API Token',
    'home.setup.securityNotice': 'All information is stored only in your browser and not sent to servers',
    'home.comingSoon': 'Coming Soon',
    
    // Dashboard
    'dashboard.title': 'Jira KPI Dashboard',
    'dashboard.filterSettings': 'Filter Settings',
    'dashboard.selectProject': 'Select Project',
    'dashboard.sortByName': 'Sort by Name',
    'dashboard.sortByKey': 'Sort by Key',
    'dashboard.dateRange': 'Date Range',
    'dashboard.thisMonth': 'This Month',
    'dashboard.lastMonth': 'Last Month',
    'dashboard.customDate': 'Custom Date',
    'dashboard.startDate': 'Start Date',
    'dashboard.endDate': 'End Date',
    'dashboard.loadData': 'Load Data',
    'dashboard.loading': 'Loading...',
    'dashboard.projectKpi': 'Project KPI',
    
    // KPI
    'kpi.totalIssues': 'Total Issues',
    'kpi.resolvedIssues': 'Resolved Issues',
    'kpi.resolutionRate': 'Resolution Rate',
    'kpi.avgResolutionTime': 'Avg Resolution Time',
    'kpi.days': 'days',
    
    // Issue Status
    'status.done': 'Done',
    'status.inProgress': 'In Progress',
    'status.todo': 'To Do',
    'status.new': 'New',
    'status.open': 'Open',
    
    // Issue Lists
    'issues.recentTop5': 'Recent Issues Top 5',
    'issues.oldestTop5': 'Oldest Unresolved Issues Top 5',
    'issues.popularTop5': 'Popular Issues Top 5',
    'issues.hotTop5': 'Hot Issues Top 5',
    'issues.daysAgo': 'days ago',
    'issues.watchers': 'watchers',
    'issues.comments': 'comments',
    
    // Error messages
    'error.configRequired': 'Jira configuration is required.',
    'error.configInvalid': 'Jira configuration is invalid.',
    'error.projectsFailed': 'Failed to fetch projects.',
    'error.dataFailed': 'Failed to fetch dashboard data.',
    'error.connectionFailed': 'Connection failed',
    'error.connectionError': 'An error occurred during connection test.',
    
    // Actions
    'action.goHome': 'Go Home',
    'action.checkSettings': 'Please check your settings',
    
    // API Error Messages
    'api.missingCredentials': 'Please enter Jira URL, email, and API token.',
    'api.invalidCredentials': 'Invalid credentials.',
    'api.connectionFailed': 'Cannot connect to Jira server. Please check the URL.',
    'api.authFailed': 'Authentication failed',
    'api.configRequired': 'Jira configuration is required.',
    'api.connectionError': 'An error occurred during connection test.',
    
    // Test Page
    'test.title': 'Jira API Test',
    'test.dateRange': 'Date Range Settings',
    'test.startDate': 'Start Date',
    'test.endDate': 'End Date',
    'test.startDatePlaceholder': 'Select start date',
    'test.endDatePlaceholder': 'Select end date',
    'test.authTest': 'Auth Test',
    'test.projectList': 'Project List',
    'test.issueQuery': 'Issue Query',
    'test.testing': 'Testing...',
    'test.loading': 'Loading...',
    
    // UI Components
    'ui.selectDate': 'Select Date',
    'ui.korean': '한국어',
    'ui.english': 'EN',
    'ui.count': '',
    
    // Charts
    'chart.statusDistribution': 'Issue Status Distribution',
    'chart.weeklyTrend': 'Weekly Issue Trend',
    'chart.priorityStatus': 'Priority Status',
    'chart.completed': 'Completed',
    'chart.inProgress': 'In Progress',
    'chart.todo': 'To Do',
    'chart.created': 'Created',
    'chart.resolved': 'Resolved',
    'chart.high': 'High',
    'chart.medium': 'Medium',
    'chart.low': 'Low',
    'chart.week': 'Week',
    'chart.month': 'Month',
    
    // Summary Report
    'report.title': 'Project Summary Report',
    'report.summary1': 'From {startDate} to {endDate}, processed {totalIssues} issues and completed {completedIssues}.',
    'report.summary2': 'The most focused issue was "{mostFocused}" and the most popular issue was "{mostPopular}".',
    'report.summary3': 'Resolution rate is {resolutionRate}%.',
    'report.noData': 'No data',
    'report.lowCompletion': 'Completion rate is low. Please review the priorities of ongoing issues.',
    'report.goodProgress': 'Good progress rate. Focus a bit more to achieve your goals.',
    'report.excellentProgress': 'Excellent progress rate! Keep up this pace.',
    'report.recommendations': '💡 Additional Recommendations',
    'report.focusHighPriority': 'Focus on high-priority issues first to improve completion rate.',
    'report.maintainPace': 'Maintain current pace while looking for new challenges.',
  }
};

export function t(key: string): string {
  const lang = getLanguage();
  return translations[lang][key] || key;
}
