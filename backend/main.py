from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class GenerateRequest(BaseModel):
    prompt: str


app = FastAPI(title="Image-AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok"}


@app.post("/generate")
def generate_image(req: GenerateRequest):
    # Return a deterministic placeholder image based on the prompt
    # Picsum supports a `seed` query param to create stable images per prompt
    safe_seed = req.prompt.strip().replace(" ", "+") or "default"
    image_url = f"https://picsum.photos/seed/{safe_seed}/1024/768"
    return {"image_url": image_url}


