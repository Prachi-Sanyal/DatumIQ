/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DatasetMetadata, AnalysisResults, AgentId, AgentStatus, AgentStep, AnalysisTask } from "./types";

export const SAMPLE_DATASETS: DatasetMetadata[] = [
  {
    id: "sales_q3_2026",
    fileName: "sales_q3_2026.csv",
    fileSize: "24.2 MB",
    rowsCount: 48231,
    columnsCount: 22,
    piiChecked: true,
    validationPassed: true,
    columns: [
      { name: "customer_id", type: "string", sampleValues: ["CUST-1002", "CUST-4912", "CUST-8831"], isPii: false, hasNulls: false, anomaliesCount: 0 },
      { name: "customer_name", type: "string", sampleValues: ["Priya Rao", "Marcus Lee", "Sofia Álvarez"], isPii: true, hasNulls: false, anomaliesCount: 0 },
      { name: "email", type: "string", sampleValues: ["priya@northwind.com", "m.lee@vertex.io", "sofia@heliogroup.com"], isPii: true, hasNulls: false, anomaliesCount: 0 },
      { name: "revenue", type: "number", sampleValues: ["1200", "450", "3200"], isPii: false, hasNulls: false, anomaliesCount: 0 },
      { name: "discount", type: "number", sampleValues: ["0.15", "0.0", "0.25"], isPii: false, hasNulls: true, anomaliesCount: 14 },
      { name: "segment", type: "string", sampleValues: ["Enterprise", "Mid-market", "SMB"], isPii: false, hasNulls: false, anomaliesCount: 0 },
      { name: "region", type: "string", sampleValues: ["AMER", "EMEA", "APAC"], isPii: false, hasNulls: false, anomaliesCount: 0 },
      { name: "country", type: "string", sampleValues: ["Germany", "United States", "Singapore"], isPii: false, hasNulls: false, anomaliesCount: 0 },
      { name: "purchase_date", type: "date", sampleValues: ["2026-07-01", "2026-07-02", "2026-07-03"], isPii: false, hasNulls: false, anomaliesCount: 0 },
      { name: "retention_week_1", type: "number", sampleValues: ["1", "0", "1"], isPii: false, hasNulls: false, anomaliesCount: 0 },
      { name: "retention_week_4", type: "number", sampleValues: ["1", "0", "1"], isPii: false, hasNulls: false, anomaliesCount: 0 },
      { name: "ssn_raw", type: "string", sampleValues: ["987-XX-XXXX", "321-XX-XXXX", "456-XX-XXXX"], isPii: true, hasNulls: false, anomaliesCount: 0 }
    ]
  },
  {
    id: "customer_churn_q2",
    fileName: "customer_churn_q2.csv",
    fileSize: "8.1 MB",
    rowsCount: 12450,
    columnsCount: 14,
    piiChecked: false,
    validationPassed: false,
    columns: [
      { name: "user_id", type: "string", sampleValues: ["USR-993", "USR-882", "USR-104"], isPii: false, hasNulls: false, anomaliesCount: 0 },
      { name: "churn_status", type: "boolean", sampleValues: ["true", "false", "false"], isPii: false, hasNulls: false, anomaliesCount: 0 },
      { name: "tenure_months", type: "number", sampleValues: ["14", "2", "36"], isPii: false, hasNulls: false, anomaliesCount: 0 },
      { name: "monthly_charges", type: "number", sampleValues: ["89.90", "49.99", "120.00"], isPii: false, hasNulls: false, anomaliesCount: 0 },
      { name: "support_tickets", type: "number", sampleValues: ["5", "0", "1"], isPii: false, hasNulls: true, anomaliesCount: 124 }
    ]
  },
  {
    id: "marketing_roi_2026",
    fileName: "marketing_roi_2026.xlsx",
    fileSize: "4.3 MB",
    rowsCount: 8900,
    columnsCount: 9,
    piiChecked: true,
    validationPassed: true,
    columns: [
      { name: "campaign_id", type: "string", sampleValues: ["CAMP-FALL", "CAMP-SUMMER", "CAMP-HOLIDAY"], isPii: false, hasNulls: false, anomaliesCount: 0 },
      { name: "ad_spend", type: "number", sampleValues: ["15000", "8000", "45000"], isPii: false, hasNulls: false, anomaliesCount: 0 },
      { name: "conversions", type: "number", sampleValues: ["320", "190", "1120"], isPii: false, hasNulls: false, anomaliesCount: 0 },
      { name: "channel", type: "string", sampleValues: ["LinkedIn Ads", "Google Search", "Meta Ads"], isPii: false, hasNulls: false, anomaliesCount: 0 }
    ]
  }
];

export const MOCK_ANALYSIS_RESULTS: Record<string, AnalysisResults> = {
  sales_q3_2026: {
    summary: {
      revenue: { value: "$4.82M", change: "+18.4%", trend: "up" },
      profit: { value: "$1.68M", change: "+22.1%", trend: "up" },
      growth: { value: "12.3%", change: "+2.4 pts", trend: "up" },
      activeCustomers: { value: "1,284", change: "-1.9%", trend: "down" }
    },
    charts: {
      revenueTrend: [
        { date: "Jan", value: 340000 },
        { date: "Feb", value: 390000 },
        { date: "Mar", value: 420000 },
        { date: "Apr", value: 480000 },
        { date: "May", value: 450000 },
        { date: "Jun", value: 510000 },
        { date: "Jul", value: 560000 },
        { date: "Aug", value: 540000 },
        { date: "Sep", value: 620000 },
        { date: "Oct", value: 680000 },
        { date: "Nov", value: 710000 },
        { date: "Dec", value: 800000 }
      ],
      revenueSegment: [
        { name: "Enterprise", value: 520000, color: "#1e3a8a" },
        { name: "Mid-market", value: 380000, color: "#3b82f6" },
        { name: "SMB", value: 180000, color: "#10b981" }
      ],
      revenueRegion: [
        { region: "AMER", value: 2150000 },
        { region: "EMEA", value: 1650000 },
        { region: "APAC", value: 1020000 }
      ],
      discountVolume: Array.from({ length: 40 }, (_, i) => ({
        discount: Math.round(Math.random() * 50),
        volume: Math.round(20 + Math.random() * 80),
        margin: Math.round(30 + Math.random() * 50)
      })),
      cohortRetention: [
        { cohort: "Cohort W1", week1: 100, week2: 85, week3: 80, week4: 76, week5: 72, week6: 70, week7: 68, week8: 65, week9: 64, week10: 62, week11: 60, week12: 59 },
        { cohort: "Cohort W2", week1: 100, week2: 82, week3: 78, week4: 74, week5: 70, week6: 67, week7: 65, week8: 62, week9: 60, week10: 58, week11: 56, week12: 55 },
        { cohort: "Cohort W3", week1: 100, week2: 89, week3: 84, week4: 80, week5: 77, week6: 74, week7: 71, week8: 69, week9: 67, week10: 65, week11: 64, week12: 63 }
      ],
      forecast: [
        { month: "Jan", actual: 340000, forecast: 340000 },
        { month: "Feb", actual: 390000, forecast: 395000 },
        { month: "Mar", actual: 420000, forecast: 425000 },
        { month: "Apr", actual: 480000, forecast: 475000 },
        { month: "May", actual: 450000, forecast: 460000 },
        { month: "Jun", actual: 510000, forecast: 505000 },
        { month: "Jul", forecast: 565000 },
        { month: "Aug", forecast: 580000 },
        { month: "Sep", forecast: 615000 },
        { month: "Oct", forecast: 650000 },
        { month: "Nov", forecast: 690000 },
        { month: "Dec", forecast: 740000 }
      ]
    },
    insights: [
      {
        id: "ins_1",
        type: "root-cause",
        agent: "Analysis Agent",
        confidence: 0.97,
        title: "EMEA revenue fell 14.2% in Q3 — driven by SMB churn in DACH",
        description: "SMB accounts in Germany, Austria, and Switzerland churned at 3.4x the plan rate after the price change on Jul 12. Enterprise remained flat.",
        details: "Detailed SQL cohort segment shows SMB customer acquisition costs also rose 25%, causing a compound effect. Actionable adjustments to sales compensation are advised.",
        metricLabel: "SMB revenue loss",
        metricValue: "-$240k",
        subItems: [
          { label: "SMB price increase", value: "-8.4 pts", positive: false },
          { label: "DACH sales rep turnover", value: "-3.1 pts", positive: false },
          { label: "Promo pull-forward from Q2", value: "-2.8 pts", positive: false },
          { label: "New enterprise logos", value: "+5.4 pts", positive: true },
          { label: "Cross-sell to existing base", value: "+3.7 pts", positive: true }
        ]
      },
      {
        id: "ins_2",
        type: "trend",
        agent: "Analysis Agent",
        confidence: 0.97,
        title: "Enterprise ACV has grown 6 quarters in a row (+11% CAGR)",
        description: "Growth is concentrated in accounts with >$100k ARR with a Customer Success touch. Land-and-expand motion is compounding.",
        details: "Expansion contracts grew by 42% Year-over-Year, indicating extremely high product-market fit in core developer tools.",
        metricLabel: "Enterprise CAGR",
        metricValue: "+11.0%"
      },
      {
        id: "ins_3",
        type: "anomaly",
        agent: "Analysis Agent",
        confidence: 0.97,
        title: "APAC pipeline conversion dropped 22% in weeks 34-36",
        description: "Coincides with a change to the qualification script. Registered AEs fell disproportionately.",
        details: "Reverting qualification script to the July baseline is expected to restore pipeline velocity by 15% immediately.",
        metricLabel: "APAC conversion",
        metricValue: "-22.0%"
      }
    ],
    recommendations: [
      {
        id: "rec_1",
        priority: "P0",
        impact: "High",
        risk: "Low",
        title: "Roll back SMB price change in DACH for 90 days",
        description: "Reinstate pre-Jul-12 pricing for accounts under €1k MRR in DACH. Modeled recovery: +$620k ARR by end of Q4, with a 4-week payback.",
        actions: [
          "Notify Sales + CS on Monday",
          "Push price rollback in billing",
          "Send apology + credit to churned SMBs"
        ]
      },
      {
        id: "rec_2",
        priority: "P1",
        impact: "High",
        risk: "Medium",
        title: "Double down on 'Vertex + Helio' cross-sell",
        description: "Accounts with both products retain 28% better and expand 34% more. Package as a bundle with a 60-day co-adoption plan.",
        actions: [
          "Create bundle SKU in CPQ",
          "Enable CS play in Gainsight",
          "Ship a launch email to top 200 targets"
        ]
      },
      {
        id: "rec_3",
        priority: "P2",
        impact: "Medium",
        risk: "Low",
        title: "Revamp Sales script for APAC pipeline",
        description: "Restore previous qualifications scripts for inbound leads and focus AE outreach within 2 hours of sign-up.",
        actions: [
          "Update HubSpot workflows",
          "Run a 1-hour alignment training with SDRs"
        ]
      }
    ],
    report: {
      title: "Q3 Revenue Anomaly Report",
      subtitle: "Diagnosis and recommended actions to restore EMEA growth.",
      date: "October 2026 - Confidential",
      preparedFor: "Acme Inc. Leadership Team",
      executiveSummary: "Q3 revenue came in at $4.82M, 14.2% below plan for EMEA and flat globally. Our diagnosis attributes the shortfall to an SMB price increase applied on Jul 12, compounded by sales-rep turnover in DACH. Enterprise remained healthy, with ACV growing for a sixth consecutive quarter. We recommend rolling back the DACH price changes for 90 days and doubling down on the 'Vertex + Helio' cross-sell, projected to add $1.6M ARR by end of Q4.",
      methodology: "Data was analyzed using DatumIQ's autonomous chief data officer multi-agent pipeline. Raw transactions (48,231 rows) were profiled for data quality, checked for privacy PII standards, plan-guided via our Planner DAG, processed using statistical Python container environments, and translated to tactical business interventions."
    }
  }
};

export const MOCK_TASKS: AnalysisTask[] = [
  {
    id: "task_1",
    datasetId: "sales_q3_2026",
    question: "Why did revenue drop in EMEA in Q3, and which segments were most affected?",
    status: "completed",
    progress: 100,
    currentStepIndex: 7,
    createdAt: "2026-07-04T14:32:00Z",
    results: MOCK_ANALYSIS_RESULTS.sales_q3_2026,
    steps: [
      { agentId: AgentId.PLANNER, name: "Planner Agent", status: AgentStatus.COMPLETED, message: "Deconstructed query into 6 analytical steps.", timestamp: "14:32:05" },
      { agentId: AgentId.VALIDATION, name: "Validation Agent", status: AgentStatus.COMPLETED, message: "Checked 48k rows; fixed 14 discount anomalies.", timestamp: "14:32:15" },
      { agentId: AgentId.SECURITY, name: "Security Agent", status: AgentStatus.COMPLETED, message: "Masked raw SSN and email details securely.", timestamp: "14:32:22" },
      { agentId: AgentId.ANALYSIS, name: "Analysis Agent", status: AgentStatus.COMPLETED, message: "Identified EMEA SMB drop of 14.2% in DACH.", timestamp: "14:32:45" },
      { agentId: AgentId.VISUALIZATION, name: "Visualization Agent", status: AgentStatus.COMPLETED, message: "Rendered cohort retention & revenue forecast.", timestamp: "14:33:02" },
      { agentId: AgentId.RECOMMENDATION, name: "Recommendation Agent", status: AgentStatus.COMPLETED, message: "Synthesized 3 tactical business plays.", timestamp: "14:33:12" },
      { agentId: AgentId.REPORT, name: "Report Agent", status: AgentStatus.COMPLETED, message: "Compiled Q3 executive PDF summary report.", timestamp: "14:33:20" }
    ]
  },
  {
    id: "task_2",
    datasetId: "sales_q3_2026",
    question: "Which customer segments have the highest LTV and retention over the last 12 months?",
    status: "completed",
    progress: 100,
    currentStepIndex: 7,
    createdAt: "2026-07-03T10:15:00Z",
    results: MOCK_ANALYSIS_RESULTS.sales_q3_2026,
    steps: [
      { agentId: AgentId.PLANNER, name: "Planner Agent", status: AgentStatus.COMPLETED, message: "Created execution DAG for LTV modeling.", timestamp: "10:15:05" },
      { agentId: AgentId.VALIDATION, name: "Validation Agent", status: AgentStatus.COMPLETED, message: "Validated transactional logs successfully.", timestamp: "10:15:10" },
      { agentId: AgentId.SECURITY, name: "Security Agent", status: AgentStatus.COMPLETED, message: "Verified zero raw customer data exposure.", timestamp: "10:15:15" },
      { agentId: AgentId.ANALYSIS, name: "Analysis Agent", status: AgentStatus.COMPLETED, message: "Calculated Enterprise expansion ARR at +42%.", timestamp: "10:15:30" },
      { agentId: AgentId.VISUALIZATION, name: "Visualization Agent", status: AgentStatus.COMPLETED, message: "Plotted 12-week retention cohort heatmaps.", timestamp: "10:15:45" },
      { agentId: AgentId.RECOMMENDATION, name: "Recommendation Agent", status: AgentStatus.COMPLETED, message: "Formulated 'Vertex + Helio' bundling recommendation.", timestamp: "10:15:52" },
      { agentId: AgentId.REPORT, name: "Report Agent", status: AgentStatus.COMPLETED, message: "Generated PDF overview deck on customer accounts.", timestamp: "10:16:00" }
    ]
  }
];
