from .tools import MCPTools


class MCPRegistry:
    """
    Registry of every MCP tool available to DatumIQ.
    """

    TOOLS = {

        "profile_dataset": MCPTools.profile_dataset,

        "calculate_kpis": MCPTools.calculate_kpis,

        "statistical_analysis": MCPTools.statistical_analysis,

        "recommend_visualizations": MCPTools.recommend_visualizations,

        "prepare_chart": MCPTools.prepare_chart,

    }

    @classmethod
    def list_tools(cls):

        return list(cls.TOOLS.keys())

    @classmethod
    def execute(cls, tool_name, *args, **kwargs):

        if tool_name not in cls.TOOLS:

            raise ValueError(
                f"MCP Tool '{tool_name}' not found."
            )

        return cls.TOOLS[tool_name](
            *args,
            **kwargs
        )