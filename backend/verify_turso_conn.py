import sys
import urllib.request
import urllib.error
import json

def test_connection(db_url: str, token: str):
    # Normalize protocol for HTTP request
    url = db_url.strip()
    if url.startswith("libsql://"):
        url = url.replace("libsql://", "https://", 1)
    elif url.startswith("sqlite+libsql://"):
        url = url.replace("sqlite+libsql://", "https://", 1)
    elif not url.startswith("http"):
        url = "https://" + url
        
    url = url.rstrip("/")
    endpoint = f"{url}/v1/execute"
    
    # Clean token
    clean_token = token.strip()
    
    print(f"Connecting to: {url}")
    print(f"Using Token: {clean_token[:15]}...{clean_token[-15:] if len(clean_token) > 30 else ''}")
    
    # Query payload matching Turso v1 REST API schema
    payload = {
        "stmt": {
            "sql": "SELECT 1 as connection_test;"
        }
    }
    
    req = urllib.request.Request(
        endpoint,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {clean_token}",
            "Content-Type": "application/json"
        },
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            body = response.read().decode("utf-8")
            print("\n[SUCCESS] Your Turso database URL and Auth Token are correct and active.")
            print(f"Response: {body}")
            return True
    except urllib.error.HTTPError as e:
        print(f"\n[FAILED] with status code: {e.code}")
        try:
            print(f"Error body: {e.read().decode('utf-8')}")
        except Exception:
            pass
        return False
    except Exception as e:
        print(f"\n[ERROR] Error connecting: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python verify_turso_conn.py <DATABASE_URL> <AUTH_TOKEN>")
        sys.exit(1)
        
    test_connection(sys.argv[1], sys.argv[2])
