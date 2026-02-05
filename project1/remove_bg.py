from PIL import Image
import os

def remove_white_bg(image_path):
    try:
        img = Image.open(image_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Check if pixel is white (or very close to white)
            if item[0] > 220 and item[1] > 220 and item[2] > 220:
                newData.append((255, 255, 255, 0)) # Make transparent
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(image_path, "PNG")
        print(f"Processed {image_path}")
    except Exception as e:
        print(f"Error processing {image_path}: {e}")

assets_dir = r"c:\Users\khalid_youssef\Desktop\Code\M2_IA2_CASA_G1_2025_2026\project1\assets"
files = ["player.png", "enemy_seeker.png", "enemy_shooter.png", "asteroid.png"]

for file in files:
    path = os.path.join(assets_dir, file)
    if os.path.exists(path):
        remove_white_bg(path)
    else:
        print(f"File not found: {path}")
