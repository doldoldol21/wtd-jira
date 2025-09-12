import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { t } from "@/lib/i18n";

interface Issue {
  key: string;
  summary: string;
  status: string;
  created?: string;
  assignee?: string;
  priority?: string;
  watchers?: number;
  comments?: number;
}

interface IssueCardProps {
  title: string;
  issues: Issue[];
  getExtraInfo: (issue: Issue) => string;
}

// 상태 번역
const translateStatus = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('done') || statusLower.includes('resolved') || statusLower.includes('완료') || statusLower.includes('closed')) {
    return t('status.done');
  }
  if (statusLower.includes('progress') || statusLower.includes('진행') || statusLower.includes('개발') || statusLower.includes('development')) {
    return t('status.inProgress');
  }
  if (statusLower.includes('todo') || statusLower.includes('open') || statusLower.includes('해야') || statusLower.includes('새로') || statusLower.includes('new')) {
    return t('status.todo');
  }
  return status; // 매칭되지 않으면 원본 반환
};
// Jira 상태별 색상 반환
const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('done') || statusLower.includes('resolved') || statusLower.includes('완료') || statusLower.includes('closed')) {
    return 'border-kpi-green text-kpi-green bg-kpi-green-bg text-xs';
  }
  if (statusLower.includes('progress') || statusLower.includes('진행') || statusLower.includes('개발') || statusLower.includes('development')) {
    return 'border-kpi-blue text-kpi-blue bg-kpi-blue-bg text-xs';
  }
  if (statusLower.includes('todo') || statusLower.includes('open') || statusLower.includes('해야') || statusLower.includes('새로') || statusLower.includes('new')) {
    return 'border-muted text-muted-foreground bg-muted text-xs';
  }
  return 'border-stone-600 text-stone-100 bg-stone-700 text-xs';
};

export function IssueCard({ title, issues, getExtraInfo }: IssueCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {issues?.map((issue) => (
            <div key={issue.key} className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{issue.key}</p>
                  <a 
                    href={`https://riman-it.atlassian.net/browse/${issue.key}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
                <p className="text-muted-foreground break-words">{issue.summary}</p>
                <p className="text-muted-foreground">{getExtraInfo(issue)}</p>
              </div>
              <span className={`px-2 py-1 rounded border ${getStatusColor(issue.status)} flex-shrink-0`}>
                {translateStatus(issue.status)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
