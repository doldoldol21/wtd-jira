'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { DatePicker } from '@/components/ui/date-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IssueCard } from '@/components/issue-card';
import { DashboardCharts } from '@/components/dashboard-charts';
import { SummaryReport } from '@/components/summary-report';
import { PageLayout } from '@/components/page-layout';
import { getJiraConfig, removeJiraConfig } from '@/lib/jira-config';
import { t } from '@/lib/i18n';
import { TranslatedText } from '@/components/translated-text';

interface Project {
  key: string;
  name: string;
  id: string;
}

interface DatePreset {
  label: string;
  startDate: Date;
  endDate: Date;
}

export default function Dashboard() {
  const router = useRouter();
  const [jiraConfig, setJiraConfig] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isConfigValid, setIsConfigValid] = useState(false);

  // Jira 설정 확인 및 로드
  useEffect(() => {
    const config = getJiraConfig();
    
    if (!config) {
      toast.error(t('error.configRequired'), {
        duration: Infinity,
        action: {
          label: t('action.goHome'),
          onClick: () => router.push('/')
        }
      });
      return;
    }

    setJiraConfig(config);
    setIsConfigValid(true);
  }, [router]);
  const [projectSort, setProjectSort] = useState<string>('name');
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const [selectedPreset, setSelectedPreset] = useState<string>(t('dashboard.thisMonth'));
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [datePresets, setDatePresets] = useState<DatePreset[]>([]);

  // 클라이언트에서만 날짜 초기화
  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const presets: DatePreset[] = [
      { label: t('dashboard.thisMonth'), startDate: firstDayOfMonth, endDate: today },
      { label: t('dashboard.lastMonth'), startDate: lastMonth, endDate: lastMonthEnd },
    ];

    setDatePresets(presets);
    setStartDate(firstDayOfMonth);
    setEndDate(today);
  }, []);

  // 스크롤 위치에 따른 화살표 표시 업데이트
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // 프로젝트 선택
  const handleProjectSelect = (projectKey: string) => {
    setSelectedProject(projectKey);
  };

  // 프로젝트 정렬
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      switch (projectSort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'key':
          return a.key.localeCompare(b.key);
        default:
          return 0;
      }
    });
  }, [projects, projectSort]);

  // 프로젝트 목록 조회
  useEffect(() => {
    const fetchProjects = async () => {
      if (!jiraConfig) return;
      
      setProjectsLoading(true);
      try {
        const params = new URLSearchParams({
          jiraUrl: jiraConfig.jiraUrl,
          email: jiraConfig.email,
          apiToken: jiraConfig.apiToken
        });
        
        const response = await fetch(`/api/jira/projects?${params}`);
        const data = await response.json();
        
        if (data.success) {
          setProjects(data.projects);
          setShowRightArrow(data.projects.length > 3);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        toast.error(t('error.projectsFailed'), {
          duration: Infinity,
          action: {
            label: t('action.goHome'),
            onClick: () => router.push('/')
          }
        });
      } finally {
        setProjectsLoading(false);
      }
    };
    
    fetchProjects();
  }, [jiraConfig, router]);

  // 날짜 프리셋 선택
  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    if (preset !== t('dashboard.customDate')) {
      const presetData = datePresets.find(p => p.label === preset);
      if (presetData) {
        setStartDate(presetData.startDate);
        setEndDate(presetData.endDate);
      }
    }
  };

  // 대시보드 데이터 조회
  const fetchDashboardData = useCallback(async () => {
    if (!selectedProject || !startDate || !endDate || !jiraConfig) return;

    setLoading(true);
    try {
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      const params = new URLSearchParams({
        project: selectedProject,
        startDate: startDateStr,
        endDate: endDateStr,
        jiraUrl: jiraConfig.jiraUrl,
        email: jiraConfig.email,
        apiToken: jiraConfig.apiToken
      });
      
      const response = await fetch(`/api/jira/issues?${params}`);
      const data = await response.json();

      if (data.success) {
        setDashboardData(data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error(t('error.dataFailed'));
    }
    setLoading(false);
  }, [selectedProject, startDate, endDate, jiraConfig]);

  return (
    <PageLayout>
      {!isConfigValid && (
        <div className="fixed inset-0 bg-black/20 z-40" />
      )}
      
      {/* Enhanced Dashboard Container */}
      <div 
        className={`max-w-7xl mx-auto p-6 relative ${!isConfigValid ? 'pointer-events-none' : ''}`}
        style={!isConfigValid ? { filter: 'blur(4px)', opacity: 0.6 } : {}}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-kpi-blue/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-kpi-green/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-kpi-purple/3 rounded-full blur-2xl"></div>
        </div>

        {/* Enhanced Header */}
        <div className="text-center mb-12 relative">
          <TranslatedText tKey="dashboard.title" as="h1" className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent" fallback="Jira KPI Dashboard" />
          <div className="w-32 h-1 bg-gradient-to-r from-kpi-blue via-kpi-green to-kpi-purple mx-auto rounded-full"></div>
        </div>

        {/* Enhanced Filter Section */}
        <div className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm p-8 rounded-2xl border-0 shadow-xl mb-8 relative overflow-hidden">
          {/* Filter section decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-kpi-blue via-kpi-green to-kpi-purple opacity-50"></div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-kpi-blue/10 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-kpi-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <TranslatedText tKey="dashboard.filterSettings" as="h2" className="text-xl font-semibold" fallback="Filter Settings" />
          </div>

        {/* Enhanced Project Selection */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <label className="font-semibold text-lg"><TranslatedText tKey={'dashboard.selectProject'} /></label>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setProjectSort('name')}
                variant={projectSort === 'name' ? 'default' : 'outline'}
                size="sm"
              >
                <TranslatedText tKey={'dashboard.sortByName'} fallback="Sort by Name" inline />
              </Button>
              <Button
                onClick={() => setProjectSort('key')}
                variant={projectSort === 'key' ? 'default' : 'outline'}
                size="sm"
              >
                <TranslatedText tKey={'dashboard.sortByKey'} fallback="Sort by Key" inline />
              </Button>
            </div>
          </div>
          <div className="relative group">
            <div
              className="flex space-x-4 overflow-x-auto pb-2 custom-scrollbar"
              onScroll={handleScroll}
            >
              {projectsLoading ? (
                // 스켈레톤 로딩
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex-shrink-0 p-4 rounded-lg border min-w-[200px]">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div>
                        <Skeleton className="h-4 w-16 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // 실제 프로젝트 리스트
                sortedProjects.map(project => (
                  <Card
                    key={project.key}
                    onClick={() => handleProjectSelect(project.key)}
                    className={`py-0 flex-shrink-0 cursor-pointer transition-all min-w-[200px] hover:shadow-md ${selectedProject === project.key
                      ? 'bg-primary border-primary shadow-lg'
                      : 'hover:bg-accent/50 border-border/50'
                      }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-secondary-foreground">
                          <span className="font-bold">
                            {project.key.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className={`text-sm font-medium truncate ${selectedProject === project.key
                      ? 'text-primary-foreground'
                      : ''}`}>{project.key}</CardTitle>
                          <p className={`text-sm opacity-70 truncate ${selectedProject === project.key
                      ? 'text-primary-foreground'
                      : ''}`}>{project.name}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* 스크롤 가이드 화살표 */}
            {projects.length > 3 && (
              <>
                {showLeftArrow && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-card to-transparent w-8 h-full flex items-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="">←</span>
                  </div>
                )}
                {showRightArrow && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-card to-transparent w-8 h-full flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="">→</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Enhanced Date & Action Section */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 bg-gradient-to-r from-muted/30 to-muted/10 p-6 rounded-xl">
          {/* Enhanced Date Selection */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <label className="font-semibold text-lg"><TranslatedText tKey={'dashboard.dateRange'} /></label>
            </div>
            <div className="space-y-4">
              {/* Enhanced Period Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={() => handlePresetChange(t('dashboard.thisMonth'))}
                  variant={selectedPreset === t('dashboard.thisMonth') ? 'default' : 'outline'}
                  size="sm"
                >
                  <TranslatedText tKey={'dashboard.thisMonth'} fallback="This Month" inline />
                </Button>
                <Button
                  onClick={() => handlePresetChange(t('dashboard.lastMonth'))}
                  variant={selectedPreset === t('dashboard.lastMonth') ? 'default' : 'outline'}
                  size="sm"
                >
                  <TranslatedText tKey={'dashboard.lastMonth'} fallback="Last Month" inline />
                </Button>
                <Button
                  onClick={() => handlePresetChange(t('dashboard.customDate'))}
                  variant={selectedPreset === t('dashboard.customDate') ? 'default' : 'outline'}
                  size="sm"
                >
                  <TranslatedText tKey={'dashboard.customDate'} fallback="Custom Date" inline />
                </Button>
              </div>

              {/* 직접 설정 시 날짜 선택 */}
              {selectedPreset === t('dashboard.customDate') && startDate && endDate && (
                <div className="flex items-center gap-2 flex-wrap">
                  <DatePicker
                    date={startDate}
                    onDateChange={(date) => date && setStartDate(date)}
                    placeholder={t('dashboard.startDate')}
                  />
                  <span className="">~</span>
                  <DatePicker
                    date={endDate}
                    onDateChange={(date) => date && setEndDate(date)}
                    placeholder={t('dashboard.endDate')}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Action Button */}
          <div className="flex justify-center sm:justify-end">
            <Button
              onClick={fetchDashboardData}
              disabled={!selectedProject || loading}
              className="min-w-[100px]"
            >
              {loading ? (
                <TranslatedText tKey="dashboard.loading" fallback="Loading..." inline />
              ) : (
                <TranslatedText tKey="dashboard.loadData" fallback="Load Data" inline />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 대시보드 데이터 표시 */}
      {loading ? (
        <div>
          <Skeleton className="h-6 w-48 mb-4" />
          
          {/* KPI 카드 스켈레톤 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-card p-6 rounded-lg border">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>

          {/* 이슈 목록 스켈레톤 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-card p-6 rounded-lg border">
                <Skeleton className="h-5 w-32 mb-4" />
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, issueIndex) => (
                    <div key={issueIndex} className="flex justify-between items-start">
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-6 w-16 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : dashboardData ? (
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-kpi-blue to-kpi-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">{dashboardData.projectKey}</span>
            </div>
            <h2 className="text-2xl font-bold">
              {dashboardData.projectKey} <TranslatedText tKey={'dashboard.projectKpi'} fallback="Project KPI" />
            </h2>
          </div>

          {/* Enhanced KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-kpi-blue/10 to-kpi-blue/5 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-kpi-blue to-kpi-blue/60"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-kpi-blue flex items-center gap-2">
                  <div className="w-2 h-2 bg-kpi-blue rounded-full"></div>
                  <TranslatedText tKey={'kpi.totalIssues'} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-kpi-blue">{dashboardData.kpi.totalIssues}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-kpi-green/10 to-kpi-green/5 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-kpi-green to-kpi-green/60"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-kpi-green flex items-center gap-2">
                  <div className="w-2 h-2 bg-kpi-green rounded-full"></div>
                  <TranslatedText tKey={'kpi.resolvedIssues'} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-kpi-green">{dashboardData.kpi.resolvedIssues}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-kpi-purple/10 to-kpi-purple/5 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-kpi-purple to-kpi-purple/60"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-kpi-purple flex items-center gap-2">
                  <div className="w-2 h-2 bg-kpi-purple rounded-full"></div>
                  <TranslatedText tKey={'kpi.resolutionRate'} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-kpi-purple">{dashboardData.kpi.resolutionRate}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-kpi-orange/10 to-kpi-orange/5 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-kpi-orange to-kpi-orange/60"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-kpi-orange flex items-center gap-2">
                  <div className="w-2 h-2 bg-kpi-orange rounded-full"></div>
                  <TranslatedText tKey={'kpi.avgResolutionTime'} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-kpi-orange">{dashboardData.kpi.avgResolutionDays}<span className="text-lg ml-1"><TranslatedText tKey={'kpi.days'} /></span></p>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Issue Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <IssueCard
              title={t('issues.recentTop5')}
              issues={dashboardData.topLists?.recent}
              getExtraInfo={(issue) => new Date(issue.created!).toLocaleDateString()}
            />
            
            <IssueCard
              title={t('issues.oldestTop5')}
              issues={dashboardData.topLists?.oldest}
              getExtraInfo={(issue) => `${issue.daysOld}${t('issues.daysAgo')}`}
            />
            
            <IssueCard
              title={t('issues.popularTop5')}
              issues={dashboardData.topLists?.popular}
              getExtraInfo={(issue) => `👀 ${issue.watchCount} ${t('issues.watchers')}`}
            />
            
            <IssueCard
              title={t('issues.hotTop5')}
              issues={dashboardData.topLists?.hot}
              getExtraInfo={(issue) => `💬 ${issue.commentCount} ${t('issues.comments')}`}
            />
          </div>

          {/* 차트 섹션 */}
          <DashboardCharts dashboardData={dashboardData} />

          {/* 요약 리포트 섹션 */}
          <SummaryReport dashboardData={dashboardData} startDate={startDate} endDate={endDate} />
        </div>
      ) : null}
      </div>
    </PageLayout>
  );
}
