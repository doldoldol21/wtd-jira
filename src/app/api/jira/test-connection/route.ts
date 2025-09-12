import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { jiraUrl, email, apiToken } = await request.json();

    if (!jiraUrl || !email || !apiToken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
    
    const response = await fetch(`${jiraUrl}/rest/api/3/myself`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication failed' 
      }, { status: response.status });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error testing Jira connection:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Connection failed' 
    }, { status: 500 });
  }
}
