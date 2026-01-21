from fortnite_client import FortniteClient
import requests
import os

client = FortniteClient()
print(f"--- DEBUG INFO ---")
print(f"API Key Configured: {'Yes' if client.api_key else 'No'}")
print(f"Base URL: {client.base_url}")

# List of players to test. Mix of platforms might help if username is ambiguous
players = ["Ninja", "SypherPK", "Mongraal", "Mrsavage", "Clix"]

print("\n--- TESTING MULTIPLE ACCOUNTS ---")
for p in players:
    print(f"\nChecking: {p}")
    # Force 'epic' account type explicitly, though it's default
    res = client.get_stats(p, account_type="epic")
    status = res.get("status")
    print(f"Status: {status}")
    if status == 200:
        print("✅ SUCCESS!")
        print(f"Matches: {res['data']['stats']['all']['overall']['matches']}")
        break # Found one that works, API is fine.
    else:
        print(f"❌ Error: {res.get('error')}")

# If all fail, let's try a direct request to check if headers are malformed in the class (unlikely but verifying)
print("\n--- RAW REQUEST CHECK ---")
if client.api_key:
    headers = {"Authorization": client.api_key}
    # Trying a non-stats endpoint to verify Auth matches
    url_news = "https://fortnite-api.com/v2/news/br"
    print(f"Testing Auth on News Endpoint: {url_news}")
    try:
        r = requests.get(url_news, headers=headers)
        print(f"News Status: {r.status_code}")
        if r.status_code == 200:
            print("✅ Auth is VALID (News accessed). Issue is likely specific to Stats/Privacy.")
        else:
            print("❌ Auth FAILED on News. Key might be invalid or rate limited.")
    except Exception as e:
        print(f"Request Exception: {e}")
