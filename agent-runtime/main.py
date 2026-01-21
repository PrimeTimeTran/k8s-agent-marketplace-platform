import sys
import logging
from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)

logger = logging.getLogger("agent-runtime")

app = FastAPI()

READY = False
PIPELINES = {}

class AgentRequest(BaseModel):
    agent: str
    prompt: str
    value: str

@app.on_event("startup")
def startup():
    global READY, PIPELINES

    from transformers import pipeline

    PIPELINES["classify"] = pipeline(
        "text-classification",
        model="distilbert-base-uncased-finetuned-sst-2-english"
    )

    PIPELINES["translate_hi"] = pipeline(
        "translation_en_to_hi",
        model="Helsinki-NLP/opus-mt-en-hi"
    )

    # PIPELINES["translate_cn"] = pipeline(
    #     "translation_en_to_zh",
    #     model="Helsinki-NLP/opus-mt-en-zh"
    # )

    # PIPELINES["translate_vi"] = pipeline(
    #     "translation_en_to_vi",
    #     model="Helsinki-NLP/opus-mt-en-vi"
    # )

    READY = True


@app.post("/execute")
def execute(req: AgentRequest):
    logger.info("Executing agent=%s", req.agent)

    if not READY:
        raise HTTPException(status_code=503, detail="Agent runtime not ready")

    pipeline_fn = PIPELINES.get(req.agent)
    if not pipeline_fn:
        raise HTTPException(status_code=400, detail=f"Unknown agent '{req.agent}'")

    res = pipeline_fn(req.prompt)

    if req.agent == "classify":
        return {"classification": res[0]["label"]}

    return {"translation": res[0]["translation_text"]}


@app.get("/healthz")
def healthz():
    return {"status": "ok"}


@app.get("/readyz")
def readyz():
    if not READY:
        return Response(status_code=503)
    return {"status": "ready"}



# from fastapi import FastAPI
# from pydantic import BaseModel

# app = FastAPI()

# class AgentRequest(BaseModel):
#     prompt: str
#     value: str

# @app.post("/execute")
# def execute(req: AgentRequest):
#     text = req.prompt.lower()
#     happy = any(word in text for word in ["happy", "great", "good", "love"])

#     return {
#         "sentiment": "happy" if happy else "unhappy",
#         "echo": req.value
#     }

# from fastapi import FastAPI
# from pydantic import BaseModel
# from anthropic import Anthropic

# client = Anthropic()
# app = FastAPI()

# class AgentRequest(BaseModel):
#     prompt: str
#     value: str

# @app.post("/execute")
# def execute(req: AgentRequest):
#     message = client.messages.create(
#         model="claude-3-5-sonnet-20240620",
#         max_tokens=10,
#         temperature=0,
#         system=(
#             "Classify the user's sentiment as either "
#             "'happy' or 'unhappy'. "
#             "Respond with only one word. Then a follow up which is happy with the user or unhappy with them"
#         ),
#         messages=[
#             {
#                 "role": "user",
#                 "content": req.prompt,
#             }
#         ],
#     )

#     sentiment = message.content[0].text.strip()

#     return {
#         "sentiment": sentiment,
#         "echo": req.value,
#     }
