import pandas as pd
import joblib

# Load OPR CSV
df_opr = pd.read_csv("opr_flat.csv")

# Load trained model
model = joblib.load("match_predictor.pkl")

# Function to sum a column for a list of team numbers
def sum_opr(teams, column):
    return df_opr[df_opr["number"].isin(teams)][column].sum()

# --- Interactive input ---
red_input = input("Enter Red team numbers separated by commas (e.g. 3491,10517): ")
red_teams = [int(t.strip()) for t in red_input.split(",")]

blue_input = input("Enter Blue team numbers separated by commas (e.g. 11143,11144): ")
blue_teams = [int(t.strip()) for t in blue_input.split(",")]

# Compute feature vector
features = ["tot_diff", "auto_diff", "teleop_diff", "endgame_diff"]
new_match = pd.DataFrame([[
    sum_opr(red_teams, "tot_value") - sum_opr(blue_teams, "tot_value"),
    sum_opr(red_teams, "auto_value") - sum_opr(blue_teams, "auto_value"),
    sum_opr(red_teams, "teleop_value") - sum_opr(blue_teams, "teleop_value"),
    sum_opr(red_teams, "endgame_value") - sum_opr(blue_teams, "endgame_value")
]], columns=features)

# Predict
pred_class = model.predict(new_match)[0]
pred_prob = model.predict_proba(new_match)[0]

print(f"\nPredicted winner: {'Red' if pred_class==1 else 'Blue'}")
print(f"Probability: Red win={pred_prob[1]:.2f}, Blue win={pred_prob[0]:.2f}")
