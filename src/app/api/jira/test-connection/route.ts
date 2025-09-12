import { NextRequest, NextResponse } from 'next/server';
import { getJiraHeaders, getJiraUrl } from '@/lib/jira';

export async function POST(request: NextRequest) {
  try {
    const { jiraUrl, email, apiToken } = await request.json();

    if (!jiraUrl || !email || !apiToken) {
      return NextResponse.json({ 
        success: false, 
        error: 'MISSING_CREDENTIALS'
      });
    }

    // Jira 연결 테스트
    const response = await fetch(getJiraUrl(jiraUrl, '/myself'), {
      headers: getJiraHeaders(email, apiToken),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        success: false, 
        error: response.status === 401 
          ? 'INVALID_CREDENTIALS' 
          : `CONNECTION_FAILED_${response.status}` 
      });
    }

    const userData = await response.json();
    
    return NextResponse.json({ 
      success: true, 
      user: userData.displayName 
    });

  } catch (error) {
    console.error('Jira connection test failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'CONNECTION_ERROR' 
    });
  }
}
