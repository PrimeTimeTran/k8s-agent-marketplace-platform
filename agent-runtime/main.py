from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

classifier = pipeline(
    "text-classification",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

def run_classifier(prompt: str):
    res = classifier(prompt)
    return {
        "classification": res[0]["label"]
    }

translator_hi = pipeline(
    "translation_en_to_hi",
    model="Helsinki-NLP/opus-mt-en-hi"
)

def run_translator_hi(prompt: str):
    res = translator_hi(prompt)
    return {
        "translation": res[0]["translation_text"]
    }

translator_cn = pipeline(
    "translation_en_to_zh",
    model="Helsinki-NLP/opus-mt-en-zh"
)

def run_translator_cn(prompt: str):
    res = translator_cn(prompt)
    return {
        "translation": res[0]["translation_text"]
    }

translator_vi = pipeline(
    "translation_en_to_vi",
    model="Helsinki-NLP/opus-mt-en-vi"
)

def run_translator_vi(prompt: str):
    res = translator_vi(prompt)
    return {
        "translation": res[0]["translation_text"]
    }


AGENTS = {
    "classify": run_classifier,
    "translate_hi": run_translator_hi,
    "translate_cn": run_translator_cn,
    "translate_vi": run_translator_vi,
}


class AgentRequest(BaseModel):
    agent: str
    prompt: str
    value: str

@app.post("/execute")
def execute(req: AgentRequest):
    print("EXECUTE:", req.dict())
    agent_fn = AGENTS.get(req.agent)

    if not agent_fn:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown agent '{req.agent}'"
        )

    result = agent_fn(req.prompt)

    return {
        "agent": req.agent,
        "result": result,
        "echo": req.value,
    }


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
