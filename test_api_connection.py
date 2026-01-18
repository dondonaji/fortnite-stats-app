from fortnite_client import FortniteClient
import os

# Initialize
client = FortniteClient()
print(f"API Key Present: {bool(client.api_key)}")

# Test 1: Public Pro Player (Should Work)
player = "Ninja"
print(f"\n--- Testing Public Account: {player} ---")
res = client.get_stats(player)
if res["status"] == 200:
    print("✅ Success! Data received.")
    print(f"K/D: {res['data']['stats']['all']['overall']['kd']}")
else:
    print(f"❌ Failed: {res['status']} - {res.get('error')}")

# Test 2: The User's Query (likely failed previously)
# We don't know the exact username they typed, but we can simulate the error handling logic here.
print("\n--- Testing Error Handling Logic ---")
if res["status"] == 403:
    print("Detected Private Account. Solution: Enable 'Show on Career Leaderboard' in Fortnite settings.")
