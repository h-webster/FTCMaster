from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from mangum import Mangum
from pymongo import MongoClient
import joblib
from typing import List
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.ftcmaster.org", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# MongoDB connection
client = MongoClient(os.getenv("MONGO_URI"))
db = client["ftc_data"]
opr_collection = db["team_opr"]

# Load model
model = joblib.load("match_predictor.pkl")

class MatchInput(BaseModel):
    redTeams: List[int]
    blueTeams: List[int]

def get_team_opr(team_number: int, stat: str):
    """Get OPR stat for a team from MongoDB"""
    team = opr_collection.find_one({"number": team_number})
    return team.get(stat, 0) if team else 0

def sum_opr(teams: List[int], stat: str):
    """Sum OPR values for multiple teams"""
    return sum(get_team_opr(team, stat) for team in teams)

@app.get("/")
def root():
    return {"status": "FTC Match Predictor API"}

@app.get("/teams/{team_number}")
def get_team(team_number: int):
    """Get team OPR data"""
    team = opr_collection.find_one({"number": team_number}, {"_id": 0})
    return team or {"error": "Team not found"}

@app.post("/predict")
def predict(match: MatchInput):
    red_tot = sum_opr(match.redTeams, "tot_value")
    blue_tot = sum_opr(match.blueTeams, "tot_value")
    red_auto = sum_opr(match.redTeams, "auto_value")
    blue_auto = sum_opr(match.blueTeams, "auto_value")
    red_teleop = sum_opr(match.redTeams, "teleop_value")
    blue_teleop = sum_opr(match.blueTeams, "teleop_value")
    red_endgame = sum_opr(match.redTeams, "endgame_value")
    blue_endgame = sum_opr(match.blueTeams, "endgame_value")
    
    features = [[
        red_tot - blue_tot,
        red_auto - blue_auto,
        red_teleop - blue_teleop,
        red_endgame - blue_endgame
    ]]
    
    pred_class = model.predict(features)[0]
    pred_prob = model.predict_proba(features)[0]
    
    return {
        "winner": "Red" if pred_class == 1 else "Blue",
        "probabilities": {
            "Red": float(pred_prob[1]),
            "Blue": float(pred_prob[0])
        },
        "oprs": {
            "red": {"total": red_tot, "auto": red_auto, "teleop": red_teleop, "endgame": red_endgame},
            "blue": {"total": blue_tot, "auto": blue_auto, "teleop": blue_teleop, "endgame": blue_endgame}
        }
    }

handler = Mangum(app)
