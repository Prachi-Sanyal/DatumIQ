import pandas as pd
import numpy as np


class DatasetProfileSkill:
    """
    Profiles uploaded datasets and returns comprehensive metadata
    for downstream agents.
    """

    @staticmethod
    def profile(df: pd.DataFrame) -> dict:
        numeric_columns = df.select_dtypes(include=[np.number]).columns.tolist()
        categorical_columns = df.select_dtypes(include=["object", "category"]).columns.tolist()
        datetime_columns = df.select_dtypes(include=["datetime64"]).columns.tolist()

        profile = {
            "rows": int(df.shape[0]),
            "columns": int(df.shape[1]),
            "column_names": df.columns.tolist(),
            "numeric_columns": numeric_columns,
            "categorical_columns": categorical_columns,
            "datetime_columns": datetime_columns,
            "missing_values": df.isnull().sum().to_dict(),
            "duplicate_rows": int(df.duplicated().sum()),
            "memory_usage_mb": round(
                df.memory_usage(deep=True).sum() / (1024 * 1024), 2
            ),
            "data_types": {
                col: str(dtype)
                for col, dtype in df.dtypes.items()
            },
            "summary": {}
        }

        for column in numeric_columns:
            series = df[column].dropna()

            if len(series) == 0:
                continue

            profile["summary"][column] = {
                "min": float(series.min()),
                "max": float(series.max()),
                "mean": round(float(series.mean()), 2),
                "median": round(float(series.median()), 2),
                "std": round(float(series.std()), 2),
                "variance": round(float(series.var()), 2),
                "sum": round(float(series.sum()), 2),
                "missing": int(df[column].isna().sum())
            }

        for column in categorical_columns:
            counts = (
                df[column]
                .fillna("Unknown")
                .astype(str)
                .value_counts()
                .head(10)
                .to_dict()
            )

            profile["summary"][column] = {
                "unique_values": int(df[column].nunique(dropna=True)),
                "top_categories": counts,
                "missing": int(df[column].isna().sum())
            }

        return profile