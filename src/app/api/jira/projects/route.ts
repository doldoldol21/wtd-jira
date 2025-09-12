import { NextRequest, NextResponse } from 'next/server';

interface JiraProject {
  id: string;
  key: string;
  name: string;
}

interface JiraProjectsResponse {
  values: JiraProject[];
}

export async function POST(request: NextRequest) {
  try {
    const { jiraUrl, email, apiToken } = await request.json();

    if (!jiraUrl || !email || !apiToken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
    
    const response = await fetch(`${jiraUrl}/rest/api/3/project/search`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json() as { errorMessages?: string[] };
      return NextResponse.json({ 
        error: 'Failed to fetch projects', 
        details: errorData.errorMessages?.[0] || 'Unknown error'
      }, { status: response.status });
    }

    const data = await response.json() as JiraProjectsResponse;
    return NextResponse.json({ projects: data.values });

  } catch (error) {
    console.error('Error fetching Jira projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
