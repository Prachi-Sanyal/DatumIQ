/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum AgentId {
  PLANNER = "planner",
  VALIDATION = "validation",
  SECURITY = "security",
  ANALYSIS = "analysis",
  VISUALIZATION = "visualization",
  RECOMMENDATION = "recommendation",
  REPORT = "report",
}

export enum AgentStatus {
  IDLE = "idle",
  RUNNING = "running",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface ColumnProfile {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "unknown";
  sampleValues: string[];
  isPii: boolean;
  hasNulls: boolean;
  anomaliesCount: number;
}

export interface DatasetMetadata {
  id: string;
  fileName: string;
  fileSize: string;
  rowsCount: number;
  columnsCount: number;
  columns: ColumnProfile[];
  piiChecked: boolean;
  validationPassed: boolean;
}

export interface AgentStep {
  agentId: AgentId;
  name: string;
  status: AgentStatus;
  message: string;
  timestamp: string;
  durationMs?: number;
  logs?: string[];
  output?: any;
}

export interface AnalysisResults {
  summary: {
    revenue: { value: string; change: string; trend: "up" | "down" };
    profit: { value: string; change: string; trend: "up" | "down" };
    growth: { value: string; change: string; trend: "up" | "down" };
    activeCustomers: { value: string; change: string; trend: "up" | "down" };
  };
  charts: {
    revenueTrend: Array<{ date: string; value: number }>;
    revenueSegment: Array<{ name: string; value: number; color: string }>;
    revenueRegion: Array<{ region: string; value: number }>;
    discountVolume: Array<{ discount: number; volume: number; margin: number }>;
    cohortRetention: Array<{ cohort: string; week1: number; week2: number; week3: number; week4: number; week5: number; week6: number; week7: number; week8: number; week9: number; week10: number; week11: number; week12: number }>;
    forecast: Array<{ month: string; actual?: number; forecast: number }>;
  };
  insights: Array<{
    id: string;
    type: "root-cause" | "trend" | "anomaly";
    agent: string;
    confidence: number;
    title: string;
    description: string;
    details: string;
    metricLabel?: string;
    metricValue?: string;
    subItems?: Array<{ label: string; value: string; positive?: boolean }>;
  }>;
  recommendations: Array<{
    id: string;
    priority: "P0" | "P1" | "P2";
    impact: "High" | "Medium" | "Low";
    risk: "High" | "Medium" | "Low";
    title: string;
    description: string;
    actions: string[];
  }>;
  report: {
    title: string;
    subtitle: string;
    date: string;
    preparedFor: string;
    executiveSummary: string;
    methodology: string;
  };
}

export interface AnalysisTask {
  id: string;
  datasetId: string;
  question: string;
  status: "pending" | "running" | "completed" | "failed";
  progress: number;
  currentStepIndex: number;
  steps: AgentStep[];
  results?: AnalysisResults;
  createdAt: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  avatarUrl?: string;
}
