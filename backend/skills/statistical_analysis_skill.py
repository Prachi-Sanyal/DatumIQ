import numpy as np
import pandas as pd


class StatisticalAnalysisSkill:
    """
    Performs statistical analysis on numerical columns.
    Returns descriptive statistics, correlations, outliers,
    skewness, kurtosis and trend insights.
    """

    @staticmethod
    def analyze(df: pd.DataFrame) -> dict:

        numeric_df = df.select_dtypes(include=[np.number])

        if numeric_df.empty:
            return {
                "statistics": {},
                "correlation_matrix": {},
                "outliers": {},
                "strong_correlations": [],
                "insights": [
                    "No numerical columns were detected."
                ]
            }

        statistics = {}

        for column in numeric_df.columns:

            series = numeric_df[column].dropna()

            if len(series) == 0:
                continue

            q1 = series.quantile(0.25)
            q3 = series.quantile(0.75)
            iqr = q3 - q1

            lower = q1 - 1.5 * iqr
            upper = q3 + 1.5 * iqr

            outlier_count = int(((series < lower) | (series > upper)).sum())

            statistics[column] = {
                "mean": round(float(series.mean()), 2),
                "median": round(float(series.median()), 2),
                "std": round(float(series.std()), 2),
                "variance": round(float(series.var()), 2),
                "minimum": round(float(series.min()), 2),
                "maximum": round(float(series.max()), 2),
                "range": round(float(series.max() - series.min()), 2),
                "skewness": round(float(series.skew()), 2),
                "kurtosis": round(float(series.kurtosis()), 2),
                "outliers": outlier_count
            }

        corr = numeric_df.corr(numeric_only=True).round(2)

        correlation_matrix = corr.to_dict()

        strong = []

        cols = corr.columns

        for i in range(len(cols)):
            for j in range(i + 1, len(cols)):

                value = corr.iloc[i, j]

                if abs(value) >= 0.7:

                    strong.append({
                        "column_1": cols[i],
                        "column_2": cols[j],
                        "correlation": round(float(value), 2)
                    })

        insights = []

        if strong:

            insights.append(
                f"{len(strong)} strong correlations detected."
            )

        high_outliers = [
            col
            for col in statistics
            if statistics[col]["outliers"] > 0
        ]

        if high_outliers:

            insights.append(
                "Outliers detected in: "
                + ", ".join(high_outliers)
            )

        return {

            "statistics": statistics,

            "correlation_matrix": correlation_matrix,

            "strong_correlations": strong,

            "insights": insights
        }