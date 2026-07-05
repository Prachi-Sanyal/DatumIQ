import pandas as pd
import numpy as np
from typing import Dict, Any, List

class AnalysisAgent:
    @staticmethod
    def execute_analysis(filepath: str, plan: dict) -> Dict[str, Any]:
        """
        Executes actual mathematical and statistical calculations on the dataset
        based on the planner agent's instructions.
        Does not use mock logic; runs actual Pandas/NumPy operations.
        """
        try:
            if filepath.endswith((".xlsx", ".xls")):
                df = pd.read_excel(filepath)
            else:
                df = pd.read_csv(filepath)
        except Exception as e:
            return {"error": f"Analysis engine failed to read data: {str(e)}"}

        row_count = len(df)
        if row_count == 0:
            return {"error": "Cannot perform math on empty dataset."}

        results = {
            "summary_statistics": {},
            "kpis": {},
            "correlations": {},
            "trends": {},
            "categorical_summaries": {},
            "outliers": {}
        }

        analysis_types = plan.get("analysis_types", ["summary_statistics"])
        metrics = plan.get("metrics", [])

        # Try to identify potential date/time columns
        dt_col = None
        for col in df.columns:
            if "date" in col.lower() or "time" in col.lower() or "month" in col.lower() or "year" in col.lower():
                try:
                    df[col] = pd.to_datetime(df[col])
                    dt_col = col
                    break
                except Exception:
                    pass

        # Try to guess value/revenue column if metrics are empty
        revenue_col = None
        for col in df.columns:
            if any(term in col.lower() for term in ["revenue", "sales", "amount", "total", "price", "margin", "value"]):
                if pd.api.types.is_numeric_dtype(df[col]):
                    revenue_col = col
                    break

        if not metrics and revenue_col:
            metrics = [revenue_col]

        # 1. SUMMARY STATISTICS
        if "summary_statistics" in analysis_types:
            numeric_df = df.select_dtypes(include=[np.number])
            for col in numeric_df.columns:
                results["summary_statistics"][col] = {
                    "count": int(df[col].count()),
                    "sum": float(df[col].sum()),
                    "mean": float(df[col].mean()),
                    "median": float(df[col].median()),
                    "min": float(df[col].min()),
                    "max": float(df[col].max()),
                    "std": float(df[col].std()) if len(df[col].dropna()) > 1 else 0.0
                }

        # 2. KEY PERFORMANCE INDICATORS (KPIs)
        # Compute core business metric aggregations
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        if numeric_cols:
            for col in numeric_cols[:4]:  # limit to top 4 numeric KPIs
                results["kpis"][col] = {
                    "total": float(df[col].sum()),
                    "average": float(df[col].mean()),
                    "variance": float(df[col].var()) if len(df[col].dropna()) > 1 else 0.0
                }

        # 3. CORRELATION ANALYSIS
        if "correlation_analysis" in analysis_types or len(numeric_cols) > 1:
            numeric_df = df.select_dtypes(include=[np.number])
            if len(numeric_df.columns) > 1:
                corr_matrix = numeric_df.corr().replace({np.nan: None}).to_dict()
                results["correlations"] = corr_matrix

        # 4. TREND ANALYSIS
        if "trend_analysis" in analysis_types and dt_col is not None:
            # Resample or group by year-month or year-week
            try:
                # Group by Month-Year
                df['__period'] = df[dt_col].dt.to_period('M').astype(str)
                trend_groups = df.groupby('__period')
                
                for col in numeric_cols[:2]:  # Track trends of top 2 numeric values
                    grouped_vals = trend_groups[col].sum().to_dict()
                    results["trends"][col] = {str(k): float(v) for k, v in sorted(grouped_vals.items())}
                df.drop(columns=['__period'], inplace=True)
            except Exception:
                pass

        # 5. CATEGORY-BASED ANALYSIS
        # Group numerical columns by categorical pillars
        categorical_cols = df.select_dtypes(include=[object, "category"]).columns.tolist()
        if categorical_cols:
            primary_cat = categorical_cols[0]
            # Sum up top numeric column per category
            num_target = numeric_cols[0] if numeric_cols else None
            if num_target:
                grouped = df.groupby(primary_cat)[num_target].sum().sort_values(ascending=False).head(10).to_dict()
                results["categorical_summaries"][primary_cat] = {
                    "metric": num_target,
                    "values": {str(k): float(v) for k, v in grouped.items()}
                }

        # 6. OUTLIER ANALYSIS
        if "outlier_analysis" in analysis_types:
            for col in numeric_cols[:2]:
                col_series = df[col].dropna()
                if len(col_series) > 4:
                    q1 = col_series.quantile(0.25)
                    q3 = col_series.quantile(0.75)
                    iqr = q3 - q1
                    lower_b = q1 - 1.5 * iqr
                    upper_b = q3 + 1.5 * iqr
                    outliers_df = df[(df[col] < lower_b) | (df[col] > upper_b)]
                    results["outliers"][col] = {
                        "total_outliers": len(outliers_df),
                        "percentage": float((len(outliers_df) / row_count) * 100),
                        "upper_bound": float(upper_b),
                        "lower_bound": float(lower_b),
                        "sample_anomalies": outliers_df.head(5).to_dict(orient="records")
                    }

        return results
