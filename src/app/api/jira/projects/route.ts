import { NextRequest, NextResponse } from 'next/server';
import { getJiraHeaders, getJiraUrl } from '@/lib/jira';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jiraUrl = searchParams.get('jiraUrl');
  const email = searchParams.get('email');
  const apiToken = searchParams.get('apiToken');

  if (!jiraUrl || !email || !apiToken) {
    return NextResponse.json({ error: 'CONFIG_REQUIRED' }, { status: 400 });
  }

  try {
    const response = await fetch(getJiraUrl(jiraUrl, '/project'), {
      headers: getJiraHeaders(email, apiToken),
    });

    if (!response.ok) {
      throw new Error(`Projects fetch failed: ${response.status}`);
    }

    const projects = await response.json();

    return NextResponse.json({
      success: true,
      projects: projects.map((p: any) => ({
        key: p.key,
        name: p.name,
        id: p.id,
        projectTypeKey: p.projectTypeKey
      }))
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to fetch projects', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
