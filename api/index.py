from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from mangum import Mangum
import pandas as pd
import joblib
from typing import List
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load ML model and CSV (use paths relative to this file)
base_path = os.path.dirname(__file__)
model = joblib.load(os.path.join(base_path, "..", "ML", "match_predictor.pkl"))
df_opr = pd.read_csv(os.path.join(base_path, "..", "ML", "opr.csv"))

class MatchInput(BaseModel):
    redTeams: List[int]
    blueTeams: List[int]

def sum_opr(teams, column):
    return df_opr[df_opr["number"].isin(teams)][column].sum()

@app.get("/")
def root():
    return {"status": "FTC Match Predictor API is running"}

@app.post("/predict")
def predict(match: MatchInput):
    features = ["tot_diff", "auto_diff", "teleop_diff", "endgame_diff"]
    new_match = pd.DataFrame([[
        sum_opr(match.redTeams, "tot_value") - sum_opr(match.blueTeams, "tot_value"),
        sum_opr(match.redTeams, "auto_value") - sum_opr(match.blueTeams, "auto_value"),
        sum_opr(match.redTeams, "teleop_value") - sum_opr(match.blueTeams, "teleop_value"),
        sum_opr(match.redTeams, "endgame_value") - sum_opr(match.blueTeams, "endgame_value")
    ]], columns=features)
    
    pred_class = model.predict(new_match)[0]
    pred_prob = model.predict_proba(new_match)[0]
    
    return {
        "winner": "Red" if pred_class == 1 else "Blue",
        "probabilities": {
            "Red": float(pred_prob[1]), 
            "Blue": float(pred_prob[0])
        }
    }

# Vercel handler
handler = Mangum(app)