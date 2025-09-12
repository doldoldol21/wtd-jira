import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { t, getLanguage } from "@/lib/i18n";
import { TranslatedText } from './translated-text';

interface DashboardData {
  kpi: {
    totalIssues: number;
    resolvedIssues: number;
    resolutionRate: number;
    avgResolutionDays: number;
  };
  issues?: {
    recent?: Issue[];
    oldestUnresolved?: Issue[];
    popular?: Issue[];
    hot?: Issue[];
  };
}

interface Issue {
  key: string;
  summary: string;
  status: string;
  created?: string;
  assignee?: string;
  priority?: string;
  watchers?: number;
  comments?: number;
}

interface SummaryReportProps {
  dashboardData: DashboardData;
  startDate?: Date | null;
  endDate?: Date | null;
}

export function SummaryReport({ dashboardData, startDate, endDate }: SummaryReportProps) {
  const kpi = dashboardData?.kpi || {};
  const lang = getLanguage();
  const countUnit = lang === 'ko' ? '개' : '';
  
  // 날짜 포맷팅
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return new Date().toLocaleDateString();
    const lang = getLanguage();
    return date.toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', { 
      month: lang === 'ko' ? 'long' : 'short', 
      day: 'numeric' 
    });
  };
  
  // 완료율 계산
  const completionRate = kpi.totalIssues > 0 ? Math.round((kpi.resolvedIssues / kpi.totalIssues) * 100) : 0;
  
  // API에서 제공하는 issues 사용
  const hotIssue = dashboardData?.issues?.hot?.[0];
  const popularIssue = dashboardData?.issues?.popular?.[0];

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle><TranslatedText tKey={'report.title'} /></CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 요약 텍스트 */}
        <div className="p-4 rounded-lg">
          <div className="space-y-4 text-lg leading-relaxed">
            <p>
              {lang === 'ko' ? (
                <>
                  <span className="font-semibold">{formatDate(startDate)}</span>부터{' '}
                  <span className="font-semibold">{formatDate(endDate)}</span>까지{' '}
                  <span className="font-bold text-kpi-blue">{Number(kpi.totalIssues) || 0}{countUnit}</span>의 이슈를 진행했으며{' '}
                  <span className="font-bold text-kpi-green">{Number(kpi.resolvedIssues) || 0}{countUnit}</span>를 완료했습니다.
                </>
              ) : (
                <>
                  From <span className="font-semibold">{formatDate(startDate)}</span> to{' '}
                  <span className="font-semibold">{formatDate(endDate)}</span>, processed{' '}
                  <span className="font-bold text-kpi-blue">{Number(kpi.totalIssues) || 0}</span> issues and completed{' '}
                  <span className="font-bold text-kpi-green">{Number(kpi.resolvedIssues) || 0}</span>.
                </>
              )}
            </p>
            
            <p>
              {lang === 'ko' ? (
                <>
                  가장 집중했던 이슈는{' '}
                  <span className="font-semibold text-kpi-red">{hotIssue?.summary || t('report.noData')}</span>이며{' '}
                  많은 관심을 받은 이슈는{' '}
                  <span className="font-semibold text-kpi-purple">{popularIssue?.summary || t('report.noData')}</span>입니다.
                </>
              ) : (
                <>
                  The most focused issue was{' '}
                  <span className="font-semibold text-kpi-red">{hotIssue?.summary || t('report.noData')}</span> and{' '}
                  the most popular issue was{' '}
                  <span className="font-semibold text-kpi-purple">{popularIssue?.summary || t('report.noData')}</span>.
                </>
              )}
            </p>
            
            <p>
              {lang === 'ko' ? '해결률은' : 'Resolution rate is'}{' '}
              <span className="font-bold text-kpi-purple">{completionRate}%</span>{lang === 'ko' ? '입니다.' : '.'}
              {completionRate < 50 && (
                <span className="block mt-2 text-kpi-yellow">
                  <TranslatedText inline tKey={'report.lowCompletion'} fallback="Low completion rate. Need to focus on issue resolution." />
                </span>
              )}
              {completionRate >= 50 && completionRate < 80 && (
                <span className="block mt-2 text-kpi-blue">
                  <TranslatedText inline tKey={'report.goodProgress'} fallback="Good progress. Continue current pace." />
                </span>
              )}
              {completionRate >= 80 && (
                <span className="block mt-2 text-kpi-green">
                  <TranslatedText inline tKey={'report.excellentProgress'} fallback="Excellent progress! Team is performing very well." />
                </span>
              )}
            </p>
          </div>
        </div>

        {/* 추가 권장사항 (필요시) */}
        {(completionRate < 50 || completionRate >= 80) && (
          <div>
            <h3 className="text-lg font-semibold mb-3"><TranslatedText tKey={'report.recommendations'} /></h3>
            <div className="space-y-2 text-sm">
              {completionRate < 50 && (
                <div className="p-3 bg-kpi-yellow-bg border-l-4 border-kpi-yellow rounded">
                  <span className="text-kpi-yellow">
                    <TranslatedText tKey={'report.focusHighPriority'} fallback="Focus on high priority issues" />
                  </span>
                </div>
              )}
              {completionRate >= 80 && (
                <div className="p-3 bg-kpi-green-bg border-l-4 border-kpi-green rounded">
                  <span className="text-kpi-green">
                    <TranslatedText tKey={'report.maintainPace'} fallback="Maintain current pace" />
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
