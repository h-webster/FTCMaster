from pymongo import MongoClient
import pandas as pd
from datetime import datetime
import os
from dotenv import load_dotenv
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
print(MONGO_URI)
DB_NAME = "myFirstDatabase"
OPR_COLLECTION = "alloprs"
MATCH_COLLECTION = "allevents"

def update_opr_csv():
    try:
        print(f"[{datetime.now()}] connecting to MongoDB")
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        collection = db[OPR_COLLECTION]

        print(f"[{datetime.now()}] Fetching OPR data...")
        data = list(collection.find({}, {
            '_id': 0,  # Exclude MongoDB ID
            'number': 1,
            'tot.value': 1,
            'auto.value': 1,
            'teleop.value': 1,
            'endgame.value': 1
            # Add any other fields you need
        })) 

        flattened_data = []
        for doc in data:
            flattened_data.append({
                'number': doc.get('number'),
                'tot_value': doc.get('tot', {}).get('value', 0),
                'auto_value': doc.get('auto', {}).get('value', 0),
                'teleop_value': doc.get('teleop', {}).get('value', 0),
                'endgame_value': doc.get('endgame', {}).get('value', 0)
            })
        
         # Convert to DataFrame and save
        df = pd.DataFrame(flattened_data)
        df.to_csv('opr_flat.csv', index=False)
        
        print(f"[{datetime.now()}] Successfully updated opr_flat.csv with {len(df)} teams")
        print(f"Columns: {list(df.columns)}")
        print(f"Sample data:\n{df.head()}")
        
        client.close()
    except Exception as e:
        print(f"[{datetime.now()}] ERROR: {str(e)}")
        raise


if __name__ == "__main__":
    update_opr_csv()