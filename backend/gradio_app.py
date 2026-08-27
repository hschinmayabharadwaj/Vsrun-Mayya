"""
Gradio wrapper for Citizen Services Portal Backend
Deployed on Hugging Face Spaces (free tier)
"""

import gradio as gr
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.main import app as fastapi_app
import asyncio
from contextlib import asynccontextmanager

# Initialize FastAPI in background
@asynccontextmanager
async def lifespan(app):
    # Startup
    yield
    # Shutdown

app = FastAPI(lifespan=lifespan)

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount FastAPI routes
app.mount("/api", fastapi_app)

# Gradio Interface
def get_services():
    """Fetch available services"""
    return {
        "status": "success",
        "data": [
            {
                "id": "svc-001",
                "name": "Passport Application",
                "category": "identity_civil",
                "description": "Apply for Indian passport"
            },
            {
                "id": "svc-002",
                "name": "Driving License",
                "category": "identity_civil",
                "description": "Apply for driving license"
            },
            {
                "id": "svc-003",
                "name": "Birth Certificate",
                "category": "identity_civil",
                "description": "Request birth certificate copy"
            }
        ]
    }

def submit_application(service_id: str, citizen_name: str, email: str):
    """Submit an application"""
    return {
        "status": "success",
        "message": f"Application submitted for {service_id}",
        "reference_id": "APP-2026-001",
        "submitted_by": citizen_name,
        "email": email
    }

def track_application(reference_id: str):
    """Track application status"""
    return {
        "status": "success",
        "data": {
            "reference_id": reference_id,
            "application_status": "under_review",
            "submitted_on": "2026-08-27",
            "last_updated": "2026-08-27",
            "message": "Your application is under review"
        }
    }

def file_grievance(grievance_type: str, description: str, email: str):
    """File a grievance"""
    return {
        "status": "success",
        "grievance_id": "GRV-2026-001",
        "message": "Grievance filed successfully",
        "reference": "GRV-2026-001"
    }

# Create Gradio Interface
with gr.Blocks(title="Citizen Services Portal API", theme=gr.themes.Soft()) as demo:
    gr.Markdown("# Citizen Services Portal - Backend API")
    gr.Markdown("Government citizen services platform running on Hugging Face Spaces")
    
    with gr.Tabs():
        # Services Tab
        with gr.Tab("Services"):
            gr.Markdown("### Browse Available Services")
            get_btn = gr.Button("Fetch Services", variant="primary")
            output = gr.JSON(label="Available Services")
            get_btn.click(fn=get_services, outputs=output)
        
        # Applications Tab
        with gr.Tab("Applications"):
            gr.Markdown("### Submit & Track Applications")
            
            with gr.Row():
                with gr.Column():
                    gr.Markdown("#### Submit Application")
                    service_id = gr.Textbox(label="Service ID", value="svc-001")
                    citizen_name = gr.Textbox(label="Your Name")
                    email = gr.Textbox(label="Email", type="email")
                    submit_btn = gr.Button("Submit Application", variant="primary")
                    result = gr.JSON(label="Result")
                    submit_btn.click(
                        fn=submit_application,
                        inputs=[service_id, citizen_name, email],
                        outputs=result
                    )
            
            with gr.Row():
                with gr.Column():
                    gr.Markdown("#### Track Application")
                    ref_id = gr.Textbox(label="Reference ID", value="APP-2026-001")
                    track_btn = gr.Button("Track Status", variant="primary")
                    track_result = gr.JSON(label="Status")
                    track_btn.click(
                        fn=track_application,
                        inputs=ref_id,
                        outputs=track_result
                    )
        
        # Grievance Tab
        with gr.Tab("Grievance"):
            gr.Markdown("### File a Grievance")
            grievance_type = gr.Dropdown(
                ["Service Quality", "Delay", "Staff Behavior", "Other"],
                label="Grievance Type"
            )
            description = gr.Textbox(label="Description", lines=4)
            email = gr.Textbox(label="Email", type="email")
            file_btn = gr.Button("File Grievance", variant="primary")
            grievance_result = gr.JSON(label="Result")
            file_btn.click(
                fn=file_grievance,
                inputs=[grievance_type, description, email],
                outputs=grievance_result
            )
        
        # API Info Tab
        with gr.Tab("API Info"):
            gr.Markdown("""
            ### API Endpoints
            
            This backend provides REST API endpoints for:
            - **Services**: Browse and filter citizen services
            - **Applications**: Submit and track applications
            - **Grievances**: File and track complaints
            - **Dashboard**: View citizen activity
            
            ### Base URL
            ```
            https://your-username-citizen-services.hf.space/api
            ```
            
            ### Frontend Integration
            The frontend at Vercel connects to this backend for all data.
            
            ### Authentication
            Uses Firebase or demo mode (no auth required)
            """)

if __name__ == "__main__":
    demo.launch(share=False, server_name="0.0.0.0", server_port=7860)
