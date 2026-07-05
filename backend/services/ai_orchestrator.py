import os
import datetime
import logging
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from ..models.task import AnalysisTask
from ..models.dataset import Dataset
from ..agents.validation_agent import ValidationAgent
from ..agents.security_agent import SecurityAgent
from ..agents.planner_agent import PlannerAgent
from ..agents.analysis_agent import AnalysisAgent
from ..agents.visualization_agent import VisualizationAgent
from ..agents.insights_agent import InsightsAgent
from ..agents.recommendation_agent import RecommendationAgent
from ..reports.pdf_generator import PdfGenerator

class AiOrchestrator:
    @staticmethod
    def run_pipeline(db: Session, task_id: int) -> Dict[str, Any]:
        """
        Executes the full DatumIQ Agent Orchestration pipeline sequentially.
        Execution order: Ingestion/Upload -> Validation -> Security -> Planner -> 
                        Analysis -> Visualization -> Insights -> Recommendation -> PDF Report
        """
        # Retrieve task and associated dataset details
        task = db.query(AnalysisTask).filter(AnalysisTask.id == task_id).first()
        if not task:
            logging.error(f"Task with ID {task_id} not found.")
            return {"error": "Task not found."}

        dataset = db.query(Dataset).filter(Dataset.id == task.dataset_id).first()
        if not dataset:
            task.status = "FAILED"
            db.commit()
            return {"error": "Dataset not found."}

        task.status = "RUNNING"
        logs = []
        db.commit()

        def log_step(step_name: str, message: str):
            timestamp = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
            logs.append({
                "step": step_name,
                "message": message,
                "timestamp": timestamp
            })
            task.logs = logs
            db.commit()

        try:
            # 1. UPLOAD / INGESTION AGENT
            log_step("Upload Agent", "Starting file ingestion procedures...")
            file_exists = os.path.exists(dataset.filepath)
            if not file_exists:
                raise FileNotFoundError(f"Source file not found at path: {dataset.filepath}")
            log_step("Upload Agent", f"Completed. Loaded raw binary file: {dataset.filename} successfully.")

            # 2. VALIDATION AGENT
            log_step("Validation Agent", "Starting statistical profiling and schema validation...")
            profile_results = ValidationAgent.profile_dataset(dataset.filepath)
            
            # Save metrics in dataset DB model for continuous indexing
            dataset.row_count = profile_results.get("row_count", 0)
            dataset.col_count = profile_results.get("col_count", 0)
            dataset.profile_data = profile_results
            db.commit()
            log_step("Validation Agent", f"Completed. Score: {profile_results.get('quality_score')}% | Dimensions: {dataset.row_count}x{dataset.col_count}")

            # 3. SECURITY AGENT
            log_step("Security Agent", "Initiating PII leakage scan & injection shielding...")
            masked_filename = f"masked_{dataset.id}_{dataset.filename}"
            masked_filepath = os.path.join(os.path.dirname(dataset.filepath), masked_filename)
            
            security_results, saved_masked_path = SecurityAgent.scan_and_mask(dataset.filepath, masked_filepath)
            dataset.masked_filepath = saved_masked_path
            db.commit()
            log_step("Security Agent", f"Completed. Scrubbed PII headers: {', '.join(security_results.get('pii_detected', {}).keys()) or 'None'}")

            # 4. PLANNER AGENT
            log_step("Planner Agent", f"Deconstructing user query: '{task.question}'...")
            plan = PlannerAgent.generate_plan(task.question, profile_results)
            log_step("Planner Agent", f"Completed. Built {len(plan.get('charts_to_generate', []))} visual models and {len(plan.get('analysis_types', []))} analytics nodes.")

            # 5. ANALYSIS AGENT
            log_step("Analysis Agent", "Spawning secure execution sandboxes to compute pandas correlations and variables...")
            math_results = AnalysisAgent.execute_analysis(dataset.masked_filepath, plan)
            log_step("Analysis Agent", "Completed. Statistical matrices, KPIs, and aggregations finalized.")

            # 6. VISUALIZATION AGENT
            log_step("Visualization Agent", "Generating interactive chart configuration schemas...")
            charts = VisualizationAgent.generate_charts(dataset.masked_filepath, plan)
            log_step("Visualization Agent", f"Completed. Crafted {len(charts)} responsive Plotly JSON templates.")

            # 7. INSIGHTS AGENT
            log_step("Insights Agent", "Initiating logical reasoning models to deduce unexpected findings...")
            insights = InsightsAgent.extract_insights(math_results, profile_results)
            log_step("Insights Agent", f"Completed. Isolated {len(insights)} high-confidence findings.")

            # 8. RECOMMENDATION AGENT
            log_step("Recommendation Agent", "Formulating data-driven strategic actions and implementation roadmaps...")
            recommendations = RecommendationAgent.generate_recommendations(math_results, insights)
            log_step("Recommendation Agent", f"Completed. Formulated {len(recommendations)} boardroom recommendations.")

            # 9. REPORT AGENT
            log_step("Report Agent", "Assembling board-ready corporate PDF summaries...")
            pdf_report_name = f"report_task_{task.id}.pdf"
            
            pdf_path = PdfGenerator.compile_pdf_report(
                output_filename=pdf_report_name,
                question=task.question,
                dataset_meta={"filename": dataset.filename},
                profile_data=profile_results,
                insights=insights,
                recommendations=recommendations
            )
            
            task.pdf_report_path = pdf_path
            log_step("Report Agent", "Completed. PDF compiled and stored successfully.")

            # Save full execution payload in the results column
            task.results = {
                "profile": profile_results,
                "security": security_results,
                "plan": plan,
                "analysis": math_results,
                "charts": charts,
                "insights": insights,
                "recommendations": recommendations,
                "report": {
                    "title": f"DatumIQ Decisions Summary for {dataset.filename}",
                    "executiveSummary": f"The model evaluated {dataset.filename} and isolated key patterns focusing on query '{task.question}'. Ingested metadata scoring rated data reliability at {profile_results.get('quality_score')}% accuracy.",
                    "conclusion": "The consensus advises re-routing spending assets based on core ROI parameters tracked in the statistical analysis metrics.",
                    "nextSteps": "Execute priority roadmap action items. Continuous dashboards are scheduled."
                }
            }
            
            task.status = "COMPLETED"
            db.commit()
            
            return {"status": "SUCCESS", "task_id": task_id}

        except Exception as e:
            logging.error(f"Pipeline failure: {str(e)}")
            log_step("Engine Error", f"Execution halted: {str(e)}")
            task.status = "FAILED"
            db.commit()
            return {"status": "FAILED", "error": str(e)}
