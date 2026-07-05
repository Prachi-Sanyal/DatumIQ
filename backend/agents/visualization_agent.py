import pandas as pd
import numpy as np
from typing import List, Dict, Any

class VisualizationAgent:
    @staticmethod
    def generate_charts(filepath: str, plan: dict) -> List[Dict[str, Any]]:
        """
        Generates production-grade chart JSON specs.
        Analyzes columns and aggregates data cleanly using Pandas
        so that Recharts or Plotly on the frontend can render them immediately.
        """
        try:
            if filepath.endswith((".xlsx", ".xls")):
                df = pd.read_excel(filepath)
            else:
                df = pd.read_csv(filepath)
        except Exception:
            return []

        charts_to_build = plan.get("charts_to_generate", [])
        if not charts_to_build:
            # Generate default fallback charts
            numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
            cat_cols = df.select_dtypes(include=[object]).columns.tolist()
            if numeric_cols and cat_cols:
                charts_to_build = [
                    {"type": "Bar", "x_axis": cat_cols[0], "y_axis": numeric_cols[0], "title": f"Total {numeric_cols[0]} by {cat_cols[0]}"}
                ]
            else:
                return []

        generated_charts = []

        for chart_spec in charts_to_build:
            chart_type = chart_spec.get("type", "Bar")
            x_col = chart_spec.get("x_axis")
            y_col = chart_spec.get("y_axis")
            title = chart_spec.get("title", "Insight Distribution")

            if x_col not in df.columns:
                continue

            # Case 1: Simple bar chart or pie chart (Categorical vs Numerical aggregation)
            if y_col in df.columns and pd.api.types.is_numeric_dtype(df[y_col]):
                try:
                    # Aggregate top 8 entries to avoid cluttering charts
                    grouped = df.groupby(x_col)[y_col].sum().sort_values(ascending=False).head(8)
                    chart_data = [{"label": str(k), "value": float(v)} for k, v in grouped.items()]
                except Exception:
                    continue
            else:
                # Count frequencies of categorical x_col if y_col not numeric/available
                try:
                    freqs = df[x_col].value_counts().head(8)
                    chart_data = [{"label": str(k), "value": int(v)} for k, v in freqs.items()]
                except Exception:
                    continue

            generated_charts.append({
                "type": chart_type,
                "title": title,
                "x_axis_label": x_col,
                "y_axis_label": y_col if y_col in df.columns else "Count",
                "data": chart_data
            })

        return generated_charts
