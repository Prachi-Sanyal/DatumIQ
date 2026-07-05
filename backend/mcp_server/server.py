from .registry import MCPRegistry


class DatumIQMCPServer:
    """
    Internal MCP Server.

    Allows DatumIQ agents to invoke reusable business tools
    through a unified interface.
    """

    @staticmethod
    def available_tools():

        return MCPRegistry.list_tools()

    @staticmethod
    def invoke(
        tool_name: str,
        *args,
        **kwargs
    ):

        return MCPRegistry.execute(
            tool_name,
            *args,
            **kwargs
        )