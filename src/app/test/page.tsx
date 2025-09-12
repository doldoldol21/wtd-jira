'use client';

import { useState } from 'react';
import { DatePicker } from '@/components/ui/date-picker';
import { t } from '@/lib/i18n';

export default function TestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const [startDate, setStartDate] = useState<Date>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<Date>(today);

  const testJiraAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/jira-test');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to test API' });
    }
    setLoading(false);
  };

  const testJiraIssues = async () => {
    setLoading(true);
    try {
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      const response = await fetch(`/api/jira-issues?startDate=${startDateStr}&endDate=${endDateStr}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to fetch issues' });
    }
    setLoading(false);
  };

  const testJiraProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/jira-projects');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to fetch projects' });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">{t('test.title')}</h2>
      
      <div className="mb-6 p-4 bg-card rounded border">
        <h3 className="text-lg font-semibold mb-4">{t('test.dateRange')}</h3>
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('test.startDate')}</label>
            <DatePicker 
              date={startDate}
              onDateChange={(date) => date && setStartDate(date)}
              placeholder={t('test.startDatePlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('test.endDate')}</label>
            <DatePicker 
              date={endDate}
              onDateChange={(date) => date && setEndDate(date)}
              placeholder={t('test.endDatePlaceholder')}
            />
          </div>
        </div>
      </div>

      <div className="space-x-4 mb-6">
        <button 
          onClick={testJiraAPI}
          disabled={loading}
          className="bg-blue-600  px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? t('test.testing') : t('test.authTest')}
        </button>

        <button 
          onClick={testJiraProjects}
          disabled={loading}
          className="bg-purple-600  px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? t('test.loading') : t('test.projectList')}
        </button>

        <button 
          onClick={testJiraIssues}
          disabled={loading}
          className="bg-green-600  px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? t('test.loading') : t('test.issueQuery')}
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-card rounded border">
          <pre className="text-sm overflow-auto max-h-96 text-foreground">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
