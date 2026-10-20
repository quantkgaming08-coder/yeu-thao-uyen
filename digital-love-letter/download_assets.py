import re
import os
import urllib.request
import json

base_dir = r"c:\Users\NGUYEN ANH QUAN\Downloads\digital-love-letter"
img_dir = os.path.join(base_dir, "images")
os.makedirs(img_dir, exist_ok=True)

html_file = os.path.join(base_dir, "screen_07c5e4ed.html")
with open(html_file, "r", encoding="utf-8") as f:
    html_content = f.read()

# Find all img src urls
img_urls = re.findall(r'src=["\'](https?://[^"\']+)["\']', html_content)

print(f"Found {len(img_urls)} image URLs in HTML:")
url_to_local = {}

for idx, url in enumerate(img_urls):
    if "cdn.tailwindcss.com" in url:
        continue
    ext = "png" if "png" in url.lower() else "jpg"
    filename = f"img_{idx:02d}.{ext}"
    local_path = os.path.join(img_dir, filename)
    rel_path = f"images/{filename}"
    url_to_local[url] = rel_path
    
    if not os.path.exists(local_path):
        print(f"Downloading {filename}...")
        try:
            req = urllib.request.Request(
                url, 
                headers={'User-Agent': 'Mozilla/5.0'}
            )
            with urllib.request.urlopen(req) as resp, open(local_path, "wb") as out:
                out.write(resp.read())
            print(f"Saved {filename} ({os.path.getsize(local_path)} bytes)")
        except Exception as e:
            print(f"Error downloading {url}: {e}")
    else:
        print(f"Already exists: {filename}")

# Save url mapping
with open(os.path.join(base_dir, "image_mapping.json"), "w", encoding="utf-8") as f:
    json.dump(url_to_local, f, indent=2)

print("Done downloading HTML images.")
