export interface JiraConfig {
  jiraUrl: string;
  email: string;
  apiToken: string;
}

export function getJiraAuth(email: string, apiToken: string) {
  return Buffer.from(`${email}:${apiToken}`).toString('base64');
}

export function getJiraHeaders(email: string, apiToken: string) {
  return {
    'Authorization': `Basic ${getJiraAuth(email, apiToken)}`,
    'Accept': 'application/json',
  };
}

export function getJiraUrl(baseUrl: string, endpoint: string) {
  return `${baseUrl}/rest/api/3${endpoint}`;
}
