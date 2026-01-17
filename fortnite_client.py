import os
import requests
from dotenv import load_dotenv

load_dotenv()

class FortniteClient:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("FORTNITE_API_KEY")
        if not self.api_key:
            # Fallback for now to avoid breaking if not set immediately, but should be set in .env
            # In a real scenario we might raise an error or warn. 
            pass 
        self.base_url = "https://fortnite-api.com/v2"

    def get_stats(self, player_name, account_type="epic"):
        if not self.api_key:
             return {"status": 401, "error": "API Key not found"}

        headers = {"Authorization": self.api_key}
        url = f"{self.base_url}/stats/br/v2"
        params = {
            "name": player_name,
            "accountType": account_type
        }

        try:
            response = requests.get(url, headers=headers, params=params)
            if response.status_code == 200:
                return {"status": 200, "data": response.json().get("data", {})}
            else:
                return {"status": response.status_code, "error": response.text}
        except Exception as e:
            return {"status": 500, "error": str(e)}
