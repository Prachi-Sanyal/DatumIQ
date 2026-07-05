import pandas as pd
import numpy as np
from typing import Dict, Any

class ValidationAgent:
    @staticmethod
    def profile_dataset(filepath: str) -> Dict[str, Any]:
        """
        Profiles the uploaded CSV or Excel dataset.
        Identifies column types, empty/null cells, duplicate records,
        cardinalities, outlier bounds, and calculates a data quality score.
        """
        # Load dataset gracefully
        try:
            if filepath.endswith((".xlsx", ".xls")):
                df = pd.read_excel(filepath)
            else:
                df = pd.read_csv(filepath)
        except Exception as e:
            return {
                "error": f"Failed to read dataset: {str(e)}",
                "quality_score": 0,
                "columns": []
            }

        row_count, col_count = df.shape
        if row_count == 0:
            return {
                "row_count": 0,
                "col_count": col_count,
                "quality_score": 0,
                "columns": [],
                "warnings": ["Dataset has zero rows."]
            }

        # Global duplicates count
        duplicate_rows = int(df.duplicated().sum())

        # Profiling individual columns
        columns_profile = []
        numeric_cols_count = 0
        null_count_total = 0
        total_cells = row_count * col_count

        for col_name in df.columns:
            col_series = df[col_name]
            null_count = int(col_series.isnull().sum())
            null_count_total += null_count
            cardinality = int(col_series.nunique())
            
            # Determine data type precisely
            is_numeric = pd.api.types.is_numeric_dtype(col_series)
            is_datetime = False
            try:
                if not is_numeric:
                    # Attempt datetime parsing test
                    parsed_dt = pd.to_datetime(col_series.dropna().head(10), errors='raise')
                    is_datetime = True
            except (ValueError, TypeError):
                pass

            data_type = "numerical" if is_numeric else ("datetime" if is_datetime else "categorical")
            if is_numeric:
                numeric_cols_count += 1

            # Stats summary
            stats = {}
            if is_numeric and len(col_series.dropna()) > 0:
                stats["min"] = float(col_series.min())
                stats["max"] = float(col_series.max())
                stats["mean"] = float(col_series.mean())
                stats["median"] = float(col_series.median())
                stats["std"] = float(col_series.std()) if len(col_series.dropna()) > 1 else 0.0
                
                # Detect outliers using standard IQR (1.5 * IQR rule)
                q1 = col_series.quantile(0.25)
                q3 = col_series.quantile(0.75)
                iqr = q3 - q1
                lower_bound = q1 - 1.5 * iqr
                upper_bound = q3 + 1.5 * iqr
                outliers_mask = (col_series < lower_bound) | (col_series > upper_bound)
                stats["outlier_count"] = int(outliers_mask.sum())
            elif is_datetime and len(col_series.dropna()) > 0:
                try:
                    stats["min"] = str(pd.to_datetime(col_series).min())
                    stats["max"] = str(pd.to_datetime(col_series).max())
                except Exception:
                    pass
            else:
                # Categorical stats
                freq = col_series.value_counts().head(5).to_dict()
                stats["top_categories"] = {str(k): int(v) for k, v in freq.items()}

            columns_profile.append({
                "name": str(col_name),
                "type": data_type,
                "null_count": null_count,
                "null_percentage": float((null_count / row_count) * 100),
                "cardinality": cardinality,
                "is_empty": bool(null_count == row_count),
                "stats": stats
            })

        # Calculate a dynamic Data Quality Score
        # Deduct for nulls, duplicates, and empty columns
        null_ratio = null_count_total / total_cells if total_cells > 0 else 0
        duplicate_ratio = duplicate_rows / row_count if row_count > 0 else 0
        empty_cols_count = sum(1 for c in columns_profile if c["is_empty"])
        empty_ratio = empty_cols_count / col_count if col_count > 0 else 0

        # Calculate weighted score (out of 100)
        quality_score = 100.0 - (null_ratio * 40.0) - (duplicate_ratio * 20.0) - (empty_ratio * 40.0)
        quality_score = max(5.0, min(100.0, round(quality_score, 1)))

        warnings = []
        if null_ratio > 0.1:
            warnings.append(f"High percentage of missing data detected ({round(null_ratio*100, 1)}%).")
        if duplicate_rows > 0:
            warnings.append(f"Found {duplicate_rows} exact duplicate rows.")
        if empty_cols_count > 0:
            warnings.append(f"{empty_cols_count} entirely empty columns found.")

        return {
            "row_count": row_count,
            "col_count": col_count,
            "duplicate_count": duplicate_rows,
            "quality_score": quality_score,
            "columns": columns_profile,
            "warnings": warnings
        }
