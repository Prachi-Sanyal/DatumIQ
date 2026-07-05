import json
import logging
from google import genai
from google.genai import types
from ..config import settings

class PlannerAgent:
    @staticmethod
    def generate_plan(question: str, schema_profile: dict) -> dict:
        """
        Interprets user objective and creates a customized analytical plan.
        Selects target metrics, statistical models, and Plotly visualization schemas.
        """
        if not settings.GEMINI_API_KEY:
            # Fallback plan if Gemini API key is not configured
            return {
                "objectives": [f"Analyze dataset to answer: '{question}'"],
                "metrics": ["Revenue", "Margin", "Count"],
                "analysis_types": ["summary_statistics", "trend_analysis", "category_analysis"],
                "charts_to_generate": [
                    {"type": "Line", "x_axis": "Date", "y_axis": "Revenue", "title": "Revenue Over Time"},
                    {"type": "Bar", "x_axis": "Category", "y_axis": "Revenue", "title": "Revenue by Category"}
                ],
                "reasoning_steps": ["1. Compute general descriptive stats.", "2. Extract monthly performance indexes.", "3. Plot primary bar chart."]
            }

        # Initialize the official Google GenAI client
        try:
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            
            prompt = f"""
            You are the Master Data Planner Agent for DatumIQ.
            Your role is to deconstruct a business question and design a rigorous statistical analysis plan based on a dataset schema.

            User's Business Question:
            "{question}"

            Dataset Schema Profile:
            {json.dumps(schema_profile, indent=2)}

            Formulate a detailed execution plan in JSON format.
            Your response must be a single valid JSON object with the following fields:
            1. "objectives": List of key sub-questions to investigate.
            2. "metrics": Target columns or mathematical indicators to prioritize.
            3. "analysis_types": List of statistical procedures needed. Choose from: ["summary_statistics", "trend_analysis", "category_analysis", "correlation_analysis", "customer_segmentation", "outlier_analysis"].
            4. "charts_to_generate": List of chart configurations to build. Each config should specify:
               - "type": Choose from ["Bar", "Line", "Pie", "Scatter", "Area", "Boxplot"]
               - "x_axis": Column name for X
               - "y_axis": Column name for Y
               - "title": Title of chart
            5. "reasoning_steps": The logical chain of steps the downstream statistical analysis agent must follow.

            Return ONLY the raw JSON block. Do not include markdown code block formatting or wrapping.
            """

            response = client.models.generate_content(
                model="gemini-3.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2
                )
            )

            plan_text = response.text.strip()
            # Handle potential markdown wrappers if any
            if plan_text.startswith("```json"):
                plan_text = plan_text[7:]
            if plan_text.endswith("```"):
                plan_text = plan_text[:-3]
            
            return json.loads(plan_text.strip())

        except Exception as e:
            logging.error(f"PlannerAgent Gemini call failed: {str(e)}")
            # Robust fallback plan
            return {
                "objectives": [f"Investigate question: '{question}' using schema properties."],
                "metrics": [col["name"] for col in schema_profile.get("columns", [])[:3]],
                "analysis_types": ["summary_statistics", "category_analysis"],
                "charts_to_generate": [
                    {"type": "Bar", "x_axis": schema_profile.get("columns", [{}])[0].get("name", "X"), "y_axis": schema_profile.get("columns", [{}])[-1].get("name", "Y"), "title": "Overview Distribution"}
                ],
                "reasoning_steps": ["Fail-safe default execution due to engine latency."]
            }
        
# Note: Always keep clean structure and fallback guarantees.
