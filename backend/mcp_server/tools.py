import pandas as pd

from ..skills.dataset_profile_skill import DatasetProfileSkill
from ..skills.kpi_skill import KPISkill
from ..skills.statistical_analysis_skill import StatisticalAnalysisSkill
from ..skills.visualization_skill import VisualizationSkill


class MCPTools:
    """
    Reusable MCP tools exposed to DatumIQ Agents.
    """

    @staticmethod
    def load_dataframe(filepath: str):

        if filepath.endswith((".xlsx", ".xls")):
            return pd.read_excel(filepath)

        return pd.read_csv(filepath)

    @staticmethod
    def profile_dataset(filepath: str):

        df = MCPTools.load_dataframe(filepath)

        return DatasetProfileSkill.profile(df)

    @staticmethod
    def calculate_kpis(filepath: str):

        df = MCPTools.load_dataframe(filepath)

        return KPISkill.extract(df)

    @staticmethod
    def statistical_analysis(filepath: str):

        df = MCPTools.load_dataframe(filepath)

        return StatisticalAnalysisSkill.analyze(df)

    @staticmethod
    def recommend_visualizations(filepath: str):

        df = MCPTools.load_dataframe(filepath)

        return VisualizationSkill.recommend(df)

    @staticmethod
    def prepare_chart(filepath: str, chart_spec: dict):

        df = MCPTools.load_dataframe(filepath)

        return VisualizationSkill.prepare_chart(
            df,
            chart_spec
        )