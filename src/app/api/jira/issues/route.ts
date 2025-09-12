import { NextRequest, NextResponse } from 'next/server';
import { getJiraHeaders, getJiraUrl } from '@/lib/jira';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate') || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0];
  const projectKey = searchParams.get('project');
  const jiraUrl = searchParams.get('jiraUrl');
  const email = searchParams.get('email');
  const apiToken = searchParams.get('apiToken');

  if (!projectKey) {
    return NextResponse.json({ error: 'Project key is required' }, { status: 400 });
  }

  if (!jiraUrl || !email || !apiToken) {
    return NextResponse.json({ error: 'CONFIG_REQUIRED' }, { status: 400 });
  }

  try {
    // 현재 사용자 정보 조회
    const userResponse = await fetch(getJiraUrl(jiraUrl, '/myself'), {
      headers: getJiraHeaders(email, apiToken),
    });
    
    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }
    
    const currentUser = await userResponse.json();
    const currentUserAccountId = currentUser.accountId;
    
    const jql = `project = "${projectKey}" AND assignee = "${currentUserAccountId}" AND created >= "${startDate}" AND created <= "${endDate}" ORDER BY created DESC`;
    
    const response = await fetch(getJiraUrl(jiraUrl, `/search?jql=${encodeURIComponent(jql)}&maxResults=100&fields=key,summary,status,created,resolutiondate,assignee,priority,issuetype,watches,comment`), {
      headers: getJiraHeaders(email, apiToken),
    });

    if (!response.ok) {
      throw new Error(`Issues fetch failed: ${response.status}`);
    }

    const data = await response.json();
    const issues = data.issues || [];

    // KPI 계산
    const totalIssues = issues.length;
    const resolvedIssues = issues.filter((issue: any) => 
      issue.fields.status.statusCategory.key === 'done'
    ).length;
    const resolutionRate = totalIssues > 0 ? `${Math.round((resolvedIssues / totalIssues) * 100)}%` : '0%';

    // 평균 해결 시간 계산
    const resolvedIssuesWithTime = issues.filter((issue: any) => 
      issue.fields.resolutiondate && issue.fields.created
    );
    
    let avgResolutionDays = 0;
    if (resolvedIssuesWithTime.length > 0) {
      const totalDays = resolvedIssuesWithTime.reduce((sum: number, issue: any) => {
        const created = new Date(issue.fields.created);
        const resolved = new Date(issue.fields.resolutiondate);
        const days = Math.ceil((resolved.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0);
      avgResolutionDays = Math.round(totalDays / resolvedIssuesWithTime.length);
    }

    // 이슈 목록 처리
    const processedIssues = issues.map((issue: any) => {
      const created = new Date(issue.fields.created);
      const now = new Date();
      const daysOld = Math.ceil((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        key: issue.key,
        summary: issue.fields.summary,
        status: issue.fields.status.name,
        statusCategory: issue.fields.status.statusCategory.key,
        created: issue.fields.created,
        resolutiondate: issue.fields.resolutiondate,
        assignee: issue.fields.assignee?.displayName || 'Unassigned',
        priority: issue.fields.priority?.name || 'None',
        issuetype: issue.fields.issuetype?.name || 'Unknown',
        watchCount: issue.fields.watches?.watchCount || 0,
        commentCount: issue.fields.comment?.total || 0,
        daysOld
      };
    });

    // Top 리스트 생성
    const topLists = {
      recent: processedIssues.slice(0, 5),
      oldest: processedIssues
        .filter((issue: any) => issue.statusCategory !== 'done')
        .sort((a: any, b: any) => b.daysOld - a.daysOld)
        .slice(0, 5),
      popular: processedIssues
        .sort((a: any, b: any) => b.watchCount - a.watchCount)
        .slice(0, 5),
      hot: processedIssues
        .sort((a: any, b: any) => b.commentCount - a.commentCount)
        .slice(0, 5)
    };

    return NextResponse.json({
      success: true,
      projectKey,
      kpi: {
        totalIssues,
        resolvedIssues,
        resolutionRate,
        avgResolutionDays
      },
      topLists,
      allIssues: processedIssues
    });

  } catch (error) {
    console.error('Failed to fetch issues:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch issues', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
