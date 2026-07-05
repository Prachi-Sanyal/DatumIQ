import pandas as pd
import numpy as np


class VisualizationSkill:
    """
    Automatically recommends charts and prepares chart-ready JSON
    for the Visualization Agent.
    """

    @staticmethod
    def recommend(df: pd.DataFrame):

        numeric = df.select_dtypes(include=[np.number]).columns.tolist()

        categorical = df.select_dtypes(include=["object", "category"]).columns.tolist()

        datetime_cols = df.select_dtypes(
            include=["datetime64", "datetime64[ns]"]
        ).columns.tolist()

        charts = []

        if categorical and numeric:

            charts.append({

                "type": "bar",

                "title": f"{numeric[0]} by {categorical[0]}",

                "x_axis": categorical[0],

                "y_axis": numeric[0]

            })

            charts.append({

                "type": "pie",

                "title": f"{categorical[0]} Distribution",

                "x_axis": categorical[0]

            })

        if len(numeric) >= 2:

            charts.append({

                "type": "scatter",

                "title": f"{numeric[0]} vs {numeric[1]}",

                "x_axis": numeric[0],

                "y_axis": numeric[1]

            })

        if numeric:

            charts.append({

                "type": "histogram",

                "title": f"{numeric[0]} Distribution",

                "x_axis": numeric[0]

            })

            charts.append({

                "type": "box",

                "title": f"{numeric[0]} Outlier Analysis",

                "x_axis": numeric[0]

            })

        if datetime_cols and numeric:

            charts.append({

                "type": "line",

                "title": f"{numeric[0]} Trend",

                "x_axis": datetime_cols[0],

                "y_axis": numeric[0]

            })

        return charts

    @staticmethod
    def prepare_chart(df, chart):

        chart_type = chart["type"]

        x = chart.get("x_axis")

        y = chart.get("y_axis")

        if chart_type == "bar":

            grouped = (
                df.groupby(x)[y]
                .sum()
                .sort_values(ascending=False)
                .head(10)
            )

            return [

                {

                    "label": str(idx),

                    "value": float(val)

                }

                for idx, val in grouped.items()

            ]

        elif chart_type == "pie":

            grouped = (

                df[x]

                .fillna("Unknown")

                .value_counts()

                .head(10)

            )

            return [

                {

                    "label": str(idx),

                    "value": int(val)

                }

                for idx, val in grouped.items()

            ]

        elif chart_type == "scatter":

            subset = (

                df[[x, y]]

                .dropna()

                .head(300)

            )

            return subset.to_dict("records")

        elif chart_type == "histogram":

            values = df[x].dropna()

            hist, bins = np.histogram(values, bins=10)

            return [

                {

                    "bin": f"{round(bins[i],2)}-{round(bins[i+1],2)}",

                    "count": int(hist[i])

                }

                for i in range(len(hist))

            ]

        elif chart_type == "line":

            grouped = (

                df.groupby(x)[y]

                .sum()

                .reset_index()

            )

            grouped[x] = grouped[x].astype(str)

            return grouped.rename(

                columns={

                    x: "label",

                    y: "value"

                }

            ).to_dict("records")

        elif chart_type == "box":

            values = df[x].dropna()

            return {

                "minimum": float(values.min()),

                "q1": float(values.quantile(0.25)),

                "median": float(values.median()),

                "q3": float(values.quantile(0.75)),

                "maximum": float(values.max())

            }

        return []