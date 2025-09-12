import { NextRequest, NextResponse } from 'next/server';

interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    status: {
      name: string;
    };
    created: string;
    resolutiondate?: string;
    assignee?: {
      displayName: string;
    };
    priority?: {
      name: string;
    };
    watches?: {
      watchCount: number;
    };
    comment?: {
      total: number;
    };
  };
}

interface JiraSearchResponse {
  issues: JiraIssue[];
  total: number;
}

export async function POST(request: NextRequest) {
  try {
    const { jiraUrl, email, apiToken, projectKey, startDate, endDate } = await request.json();

    if (!jiraUrl || !email || !apiToken || !projectKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
    
    // JQL 쿼리 생성
    let jql = `project = "${projectKey}"`;
    
    if (startDate && endDate) {
      jql += ` AND created >= "${startDate}" AND created <= "${endDate}"`;
    }

    // 모든 이슈 조회
    const allIssuesUrl = `${jiraUrl}/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=1000&fields=summary,status,created,resolutiondate,assignee,priority,watches,comment`;
    
    const allIssuesResponse = await fetch(allIssuesUrl, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
      },
    });

    if (!allIssuesResponse.ok) {
      const errorData = await allIssuesResponse.json() as { errorMessages?: string[] };
      return NextResponse.json({ 
        error: 'Failed to fetch issues', 
        details: errorData.errorMessages?.[0] || 'Unknown error'
      }, { status: allIssuesResponse.status });
    }

    const allIssuesData = await allIssuesResponse.json() as JiraSearchResponse;
    const allIssues = allIssuesData.issues;

    // 해결된 이슈들
    const resolvedJql = `${jql} AND status in (Done, Resolved, Closed)`;
    const resolvedIssuesUrl = `${jiraUrl}/rest/api/3/search?jql=${encodeURIComponent(resolvedJql)}&maxResults=1000&fields=summary,status,created,resolutiondate,assignee`;
    
    const resolvedIssuesResponse = await fetch(resolvedIssuesUrl, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
      },
    });

    let resolvedIssues: JiraIssue[] = [];
    if (resolvedIssuesResponse.ok) {
      const resolvedIssuesData = await resolvedIssuesResponse.json() as JiraSearchResponse;
      resolvedIssues = resolvedIssuesData.issues;
    }

    // KPI 계산
    const totalIssues = allIssues.length;
    const resolvedCount = resolvedIssues.length;
    const resolutionRate = totalIssues > 0 ? Math.round((resolvedCount / totalIssues) * 100) : 0;

    // 평균 해결 시간 계산 (일 단위)
    let avgResolutionDays = 0;
    if (resolvedIssues.length > 0) {
      const resolutionTimes = resolvedIssues
        .filter(issue => issue.fields.resolutiondate)
        .map(issue => {
          const created = new Date(issue.fields.created);
          const resolved = new Date(issue.fields.resolutiondate!);
          return Math.ceil((resolved.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        });
      
      if (resolutionTimes.length > 0) {
        avgResolutionDays = Math.round(resolutionTimes.reduce((sum, time) => sum + time, 0) / resolutionTimes.length);
      }
    }

    // 이슈 목록들
    const recentIssues = [...allIssues]
      .sort((a, b) => new Date(b.fields.created).getTime() - new Date(a.fields.created).getTime())
      .slice(0, 5)
      .map(issue => ({
        key: issue.key,
        summary: issue.fields.summary,
        status: issue.fields.status.name,
        created: issue.fields.created,
        assignee: issue.fields.assignee?.displayName || 'Unassigned',
        priority: issue.fields.priority?.name || 'None'
      }));

    const oldestUnresolvedIssues = allIssues
      .filter(issue => !['Done', 'Resolved', 'Closed'].includes(issue.fields.status.name))
      .sort((a, b) => new Date(a.fields.created).getTime() - new Date(b.fields.created).getTime())
      .slice(0, 5)
      .map(issue => ({
        key: issue.key,
        summary: issue.fields.summary,
        status: issue.fields.status.name,
        created: issue.fields.created,
        assignee: issue.fields.assignee?.displayName || 'Unassigned',
        priority: issue.fields.priority?.name || 'None'
      }));

    const popularIssues = [...allIssues]
      .sort((a, b) => (b.fields.watches?.watchCount || 0) - (a.fields.watches?.watchCount || 0))
      .slice(0, 5)
      .map(issue => ({
        key: issue.key,
        summary: issue.fields.summary,
        status: issue.fields.status.name,
        created: issue.fields.created,
        assignee: issue.fields.assignee?.displayName || 'Unassigned',
        watchers: issue.fields.watches?.watchCount || 0
      }));

    const hotIssues = [...allIssues]
      .sort((a, b) => (b.fields.comment?.total || 0) - (a.fields.comment?.total || 0))
      .slice(0, 5)
      .map(issue => ({
        key: issue.key,
        summary: issue.fields.summary,
        status: issue.fields.status.name,
        created: issue.fields.created,
        assignee: issue.fields.assignee?.displayName || 'Unassigned',
        comments: issue.fields.comment?.total || 0
      }));

    return NextResponse.json({
      projectKey,
      kpi: {
        totalIssues,
        resolvedIssues: resolvedCount,
        resolutionRate,
        avgResolutionDays
      },
      issues: {
        recent: recentIssues,
        oldestUnresolved: oldestUnresolvedIssues,
        popular: popularIssues,
        hot: hotIssues
      }
    });

  } catch (error) {
    console.error('Error fetching Jira issues:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
