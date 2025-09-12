'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TestResponse {
  success?: boolean;
  error?: string;
  projects?: Array<{ key: string; name: string }>;
}

export default function TestPage() {
  const [jiraUrl, setJiraUrl] = useState('');
  const [email, setEmail] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [result, setResult] = useState<string>('');

  const testConnection = async () => {
    try {
      const response = await fetch('/api/jira/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jiraUrl, email, apiToken }),
      });
      const data: TestResponse = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch {
      setResult('Connection test failed');
    }
  };

  const testProjects = async () => {
    try {
      const response = await fetch('/api/jira/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jiraUrl, email, apiToken }),
      });
      const data: TestResponse = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch {
      setResult('Projects test failed');
    }
  };

  const testIssues = async () => {
    try {
      const response = await fetch('/api/jira/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          jiraUrl, 
          email, 
          apiToken, 
          projectKey: 'TEST',
          startDate: '2024-01-01',
          endDate: '2024-12-31'
        }),
      });
      const data: TestResponse = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch {
      setResult('Issues test failed');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Jira API Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Jira URL"
            value={jiraUrl}
            onChange={(e) => setJiraUrl(e.target.value)}
          />
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="API Token"
            type="password"
            value={apiToken}
            onChange={(e) => setApiToken(e.target.value)}
          />
          
          <div className="flex gap-2">
            <Button onClick={testConnection}>Test Connection</Button>
            <Button onClick={testProjects}>Test Projects</Button>
            <Button onClick={testIssues}>Test Issues</Button>
          </div>
          
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
            {result}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
