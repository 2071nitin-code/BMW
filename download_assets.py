import urllib.request
import urllib.parse
import json
import os

assets = {
    'i7_side.jpg': 'BMW 7 Series G70 side',
    'idrive.png': 'BMW iDrive 8',
    'm4_side.jpg': 'BMW M4 side',
    'm4_rear.jpg': 'BMW M4 rear',
    'x5m_side.jpg': 'BMW X5 M side',
    'x5m_rear.jpg': 'BMW X5 rear',
    '3series_side.jpg': 'BMW 3 Series G20 side',
    '3series_rear.jpg': 'BMW 3 Series G20 rear',
    'i4m50_side.jpg': 'BMW i4 side',
    'i4m50_rear.jpg': 'BMW i4 rear',
    'ix_side.jpg': 'BMW iX side',
    'ix_rear.jpg': 'BMW iX rear',
    'x7_side.jpg': 'BMW X7 side',
    'x7_rear.jpg': 'BMW X7 rear',
    'm8_side.jpg': 'BMW M8 Gran Coupe side',
    'm8_rear.jpg': 'BMW M8 rear',
}

def get_wikimedia_image(query):
    url = f"https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrlimit=3&pithumbsize=800"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            pages = data.get('query', {}).get('pages', {})
            for page_id in pages:
                src = pages[page_id].get('thumbnail', {}).get('source')
                if src: return src
    except Exception as e:
        print(f"Error searching {query}: {e}")
    return None

def download_image(url, filename):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(filename, 'wb') as out_file:
            out_file.write(response.read())
        print(f"Downloaded: {filename}")
    except Exception as e:
        print(f"Failed to download {url} to {filename}: {e}")

# Download Car Images
for filename, query in assets.items():
    if not os.path.exists(filename):
        print(f"Finding image for {filename} ({query})...")
        img_url = get_wikimedia_image(query)
        if img_url:
            download_image(img_url, filename)
        else:
            print(f"Could not find image for {query}")
    else:
        print(f"File {filename} already exists. Skipping.")

# Generate solid color swatches
colors = {
    'color_black.png': (11, 15, 25),
    'color_white.png': (209, 212, 216),
    'color_grey.png': (68, 71, 78),
    'color_red.png': (123, 25, 40),
    'color_blue.png': (26, 50, 80)
}

try:
    from PIL import Image
    for filename, rgb in colors.items():
        if not os.path.exists(filename):
            img = Image.new('RGB', (100, 100), color=rgb)
            img.save(filename)
            print(f"Generated color swatch: {filename}")
except ImportError:
    print("PIL not installed, skipping color swatches generation.")
