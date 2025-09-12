import { JiraConfig } from './jira';

const STORAGE_KEY = 'jira-config';

export function saveJiraConfig(config: JiraConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function getJiraConfig(): JiraConfig | null {
  try {
    const configStr = localStorage.getItem(STORAGE_KEY);
    if (!configStr) return null;
    
    const config = JSON.parse(configStr);
    if (!config.jiraUrl || !config.email || !config.apiToken) {
      return null;
    }
    
    return config;
  } catch (error) {
    console.error('Failed to parse Jira config:', error);
    removeJiraConfig();
    return null;
  }
}

export function removeJiraConfig(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasValidJiraConfig(): boolean {
  return getJiraConfig() !== null;
}
