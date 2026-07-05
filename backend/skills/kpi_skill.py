import pandas as pd
import numpy as np


class KPISkill:
    """
    Automatically extracts meaningful KPIs from any business dataset.
    """

    @staticmethod
    def extract(df: pd.DataFrame) -> dict:

        numeric_columns = df.select_dtypes(include=[np.number]).columns.tolist()

        kpis = {}

        kpis["total_records"] = int(len(df))
        kpis["total_columns"] = int(len(df.columns))

        if numeric_columns:

            totals = {}

            averages = {}

            maximums = {}

            minimums = {}

            for col in numeric_columns:
                values = df[col].dropna()

                if len(values) == 0:
                    continue

                totals[col] = round(float(values.sum()), 2)
                averages[col] = round(float(values.mean()), 2)
                maximums[col] = round(float(values.max()), 2)
                minimums[col] = round(float(values.min()), 2)

            kpis["totals"] = totals
            kpis["averages"] = averages
            kpis["maximums"] = maximums
            kpis["minimums"] = minimums

        missing_percentage = (
            (
                df.isnull().sum()
                / len(df)
            ) * 100
        ).round(2)

        kpis["missing_percentage"] = missing_percentage.to_dict()

        duplicates = int(df.duplicated().sum())

        kpis["duplicate_records"] = duplicates

        business_metrics = {}

        lower_columns = {c.lower(): c for c in df.columns}

        revenue_keywords = [
            "revenue",
            "sales",
            "amount",
            "income",
            "profit",
            "price",
            "total"
        ]

        quantity_keywords = [
            "quantity",
            "qty",
            "units"
        ]

        for keyword in revenue_keywords:
            if keyword in lower_columns:
                col = lower_columns[keyword]

                business_metrics["estimated_total_" + keyword] = round(
                    float(df[col].sum()),
                    2
                )

        for keyword in quantity_keywords:
            if keyword in lower_columns:
                col = lower_columns[keyword]

                business_metrics["total_" + keyword] = round(
                    float(df[col].sum()),
                    2
                )

        kpis["business_metrics"] = business_metrics

        return kpis