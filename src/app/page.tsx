"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Zap, BarChart3, Users, Target, TrendingUp, Clock, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { PageLayout } from '@/components/page-layout';
import { saveJiraConfig, hasValidJiraConfig } from '@/lib/jira-config';
import { t } from '@/lib/i18n';
import { TranslatedText } from '@/components/translated-text';

export default function HomePage() {
  const [jiraUrl, setJiraUrl] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasExistingConfig, setHasExistingConfig] = useState(false);
  const router = useRouter();

  // 기존 설정 확인
  useEffect(() => {
    setHasExistingConfig(hasValidJiraConfig());
  }, []);

  const handleStart = useCallback(async () => {
    if (!jiraUrl || !apiToken || !email) return;

    setLoading(true);
    try {
      // Jira 연결 테스트
      const response = await fetch('/api/jira/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jiraUrl, email, apiToken })
      });

      const data = await response.json();

      if (data.success) {
        // 설정 저장하고 대시보드로 이동
        saveJiraConfig({ jiraUrl, apiToken, email });
        router.push('/dashboard');
      } else {
        // API 에러 코드를 번역된 메시지로 변환
        let errorMessage = t('action.checkSettings');
        if (data.error === 'MISSING_CREDENTIALS') {
          errorMessage = t('api.missingCredentials');
        } else if (data.error === 'INVALID_CREDENTIALS') {
          errorMessage = t('api.invalidCredentials');
        } else if (data.error === 'CONNECTION_ERROR') {
          errorMessage = t('api.connectionFailed');
        } else if (data.error?.startsWith('CONNECTION_FAILED_')) {
          errorMessage = t('api.connectionFailed');
        }
        toast.error(`${t('error.connectionFailed')}: ${errorMessage}`);
      }
    } catch (error) {
      toast.error(t('api.connectionError'));
    }
    setLoading(false);
  }, [jiraUrl, apiToken, email, router]);

  const isFormValid = jiraUrl && apiToken && email && !loading;

  return (
    <PageLayout>
      <div className="min-h-screen">
          {/* Enhanced Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/50 to-background py-20">
            {/* Animated background elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-kpi-blue/5 via-transparent to-kpi-green/5 animate-pulse"></div>
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-kpi-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-kpi-orange/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>
            <div className="container mx-auto px-4 text-center">
              <div className="animate-fade-in-up">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  <TranslatedText tKey={'home.title'} fallback="What to do in Jira? Now answer with KPI" />
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                  <TranslatedText tKey={'home.subtitle'} fallback="Understand Jira issues at a glance and maximize your team's productivity" />
                </p>
              </div>

              {/* Enhanced Floating Icons */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Primary floating icons */}
                <div className="floating-icon absolute top-20 left-10 text-kpi-blue/30">
                  <BarChart3 size={40} />
                </div>
                <div className="floating-icon absolute top-32 right-20 text-kpi-green/30" style={{ animationDelay: '1s' }}>
                  <Users size={35} />
                </div>
                <div className="floating-icon absolute bottom-32 left-20 text-kpi-purple/30" style={{ animationDelay: '2s' }}>
                  <Target size={45} />
                </div>
                <div className="floating-icon absolute bottom-20 right-10 text-kpi-orange/30" style={{ animationDelay: '0.5s' }}>
                  <Zap size={38} />
                </div>
                
                {/* Additional floating icons */}
                <div className="floating-icon absolute top-1/3 left-1/4 text-primary/15" style={{ animationDelay: '1.5s' }}>
                  <TrendingUp size={32} />
                </div>
                <div className="floating-icon absolute top-1/2 right-1/3 text-primary/15" style={{ animationDelay: '3s' }}>
                  <Clock size={28} />
                </div>
                <div className="floating-icon absolute bottom-1/3 left-1/3 text-primary/15" style={{ animationDelay: '2.5s' }}>
                  <CheckCircle size={30} />
                </div>
                <div className="floating-icon absolute top-2/3 right-1/4 text-primary/15" style={{ animationDelay: '4s' }}>
                  <Activity size={26} />
                </div>
                <div className="floating-icon absolute top-1/4 right-1/2 text-primary/10" style={{ animationDelay: '3.5s' }}>
                  <AlertCircle size={24} />
                </div>
                
                {/* Floating particles */}
                <div className="absolute top-16 left-1/2 w-2 h-2 bg-kpi-blue/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/3 right-16 w-1 h-1 bg-kpi-green/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-1/4 left-16 w-3 h-3 bg-kpi-purple/15 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-16 right-1/3 w-1.5 h-1.5 bg-kpi-orange/25 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
              </div>
            </div>
          </section>

          {/* Enhanced Features Section */}
          <section className="py-16 bg-muted/30 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-kpi-blue via-kpi-green to-kpi-purple opacity-30"></div>
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-kpi-blue/5 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-kpi-green/5 rounded-full blur-2xl"></div>
            </div>
            
            <div className="container mx-auto px-4 relative">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  <TranslatedText tKey={'home.features.title'} fallback="Key Features" />
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-kpi-blue to-kpi-green mx-auto rounded-full"></div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="mx-auto mb-4 w-16 h-16 bg-kpi-blue/10 rounded-2xl flex items-center justify-center">
                      <BarChart3 className="text-kpi-blue" size={32} />
                    </div>
                    <CardTitle className="text-lg"><TranslatedText tKey={"home.features.dashboard"} /></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      <TranslatedText tKey={"home.features.monitoring"} fallback="Real-time monitoring and analysis of Jira issues" />
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm relative overflow-hidden">
                  <div className="coming-soon-badge bg-gradient-to-r from-kpi-orange to-kpi-purple text-white">
                    <TranslatedText tKey={'home.comingSoon'} fallback="Coming Soon" />
                  </div>
                  <CardHeader className="pb-4">
                    <div className="mx-auto mb-4 w-16 h-16 bg-kpi-green/10 rounded-2xl flex items-center justify-center">
                      <Users className="text-kpi-green" size={32} />
                    </div>
                    <CardTitle className="text-lg text-muted-foreground"><TranslatedText tKey={"home.features.teamAnalysis"} /></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      <TranslatedText tKey={"home.features.teamAnalysisDesc"} />
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm relative overflow-hidden">
                  <div className="coming-soon-badge bg-gradient-to-r from-kpi-purple to-kpi-blue text-white">
                    <TranslatedText tKey={'home.comingSoon'} fallback="Coming Soon" />
                  </div>
                  <CardHeader className="pb-4">
                    <div className="mx-auto mb-4 w-16 h-16 bg-kpi-purple/10 rounded-2xl flex items-center justify-center">
                      <Target className="text-kpi-purple" size={32} />
                    </div>
                    <CardTitle className="text-lg text-muted-foreground"><TranslatedText tKey={'home.features.smartReport'} /></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      <TranslatedText tKey={"home.features.smartReportDesc"} />
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Enhanced Setup Section */}
          <section className="py-16 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-kpi-blue/5 to-kpi-green/5 rounded-full blur-3xl"></div>
            </div>
            
            <div className="container mx-auto px-4 max-w-2xl relative">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4"><TranslatedText tKey={'home.setup.title'} /></h2>
                <p className="text-muted-foreground text-lg">
                  <TranslatedText tKey={'home.setup.subtitle'} />
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-kpi-blue to-kpi-green mx-auto rounded-full mt-4"></div>
              </div>

              <Card className="border-0 shadow-2xl bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-kpi-blue/20 to-kpi-green/20 rounded-2xl flex items-center justify-center">
                    <Zap className="text-kpi-blue" size={32} />
                  </div>
                  <CardTitle className="text-xl">
                    <TranslatedText tKey={'home.setup.jiraIntegration'} />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2"><TranslatedText tKey={"home.jiraUrl"} /></label>
                    <Input
                      placeholder="https://your-domain.atlassian.net"
                      value={jiraUrl}
                      onChange={(e) => setJiraUrl(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2"><TranslatedText tKey={"home.email"} /></label>
                    <Input
                      placeholder="your-email@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2"><TranslatedText tKey={"home.apiToken"} /></label>
                    <Input
                      type="password"
                      placeholder="Jira API Token"
                      value={apiToken}
                      onChange={(e) => setApiToken(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" className="text-primary hover:underline">
                        <TranslatedText tKey={"home.setup.apiTokenHelp"} />
                      </a>
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      <TranslatedText tKey={"home.setup.securityNotice"} fallback="모든 정보는 브라우저에만 저장되며 서버로 전송되지 않습니다" />
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleStart}
                      disabled={!isFormValid}
                      className="flex-1"
                      size="lg"
                    >
                      {loading ? (
                        <TranslatedText tKey="home.connecting" fallback="Connecting..." inline />
                      ) : (
                        <TranslatedText tKey="home.startDashboard" fallback="Start Dashboard" inline />
                      )}
                      {!loading && <ArrowRight className="ml-2" size={20} />}
                    </Button>

                    {hasExistingConfig && (
                      <Button
                        onClick={() => router.push('/dashboard')}
                        variant="outline"
                        size="lg"
                        className="flex-shrink-0"
                      >
                        <TranslatedText tKey="home.goToDashboard" fallback="Go to Dashboard" inline />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
      </div>
    </PageLayout>
  );
}
