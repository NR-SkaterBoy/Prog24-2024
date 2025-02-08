import base64
from PIL import Image
from io import BytesIO
import os


def DecodedDatFile(path: str) -> bytes:
    """
    Decodes a base64-encoded .dat file and returns the decoded bytes.

    Parameters:
    path (str): The path to the .dat file to be decoded.

    Returns:
    bytes: The decoded bytes from the .dat file.
    """
    return base64.b64decode(open(path, "rb").read())


def CreateIMG(raw: bytes, fileName: str) -> None:
    """
    Converts raw bytes into an image, modifies the pixel colors, and saves the image as a PNG file.

    Parameters:
    raw (bytes): The raw bytes representing the image data.
    fileName (str): The name of the output image file (without the file extension).

    Returns:
    None: The function does not return any value. It saves the modified image as a PNG file.
    """
    image = Image.open(BytesIO(raw))
    image = image.convert("RGB")

    # Modify the image pixels
    for x in range(image.width):
        for y in range(image.height):
            r, g, b = image.getpixel((x, y))
            if (r, g, b) == (0, 0, 0):
                image.putpixel((x, y), (0, 0, 0))  # Keep black
            else:
                image.putpixel((x, y), (255, 255, 255))  # Change others to white

    # Create directory if it doesn't exist
    os.makedirs("./dat_img", exist_ok=True)
    image.save(f"./dat_img/{fileName}.png")


def IMGInfo():
    """
    This function checks for .dat files in the ./dat_dir directory, decodes them using the DecodedDatFile function,
    and creates corresponding PNG images in the ./dat_img directory using the CreateIMG function.
    If the ./dat_img directory does not exist, it is created.

    Parameters:
    None

    Returns:
    None: The function does not return any value. It processes .dat files and saves corresponding PNG images.
    """
    if not os.path.exists("./dat_dir"):
        return

    for file in os.listdir("./dat_dir"):
        if not file.endswith(".dat"):
            continue
        raw = DecodedDatFile(f"./dat_dir/{file}")
        if not os.path.exists(f"./dat_img/{file}.png"):
            CreateIMG(raw, file)

def main():
    IMGInfo()

if __name__ == "__main__":
    try: main()
    except IOError as e: print("Error occured wile IO: {}".format(e))
