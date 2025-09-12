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

    const response = await fetch(getJiraUrl(jiraUrl, '/myself'), {
      headers: getJiraHeaders(email, apiToken),
    });

    if (!response.ok) {
      return NextResponse.json({ 
        success: false, 
        error: response.status === 401 
          ? 'INVALID_CREDENTIALS' 
          : `AUTH_FAILED_${response.status}` 
      });
    }

    const userData = await response.json();
    
    return NextResponse.json({ 
      success: true, 
      user: {
        accountId: userData.accountId,
        displayName: userData.displayName,
        emailAddress: userData.emailAddress
      }
    });

  } catch (error) {
    console.error('Jira auth failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'CONNECTION_ERROR' 
    });
  }
}
