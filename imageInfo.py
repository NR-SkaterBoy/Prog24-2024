import base64
from PIL import Image
from io import BytesIO
import os

def createFile(text: str, filename: str) -> None:
    """
    This function creates a text file with the given content and filename in the 'info' directory.

    Parameters:
    text (str): The content to be written into the file.
    filename (str): The name of the file to be created.

    Returns:
    None: The function does not return any value. It creates a file in the 'info' directory.
    """
    if not os.path.exists("./info"):
        os.makedirs("./info")
    
    try:
        if text is None:
            print("A text None értéket kapott!")
        # Ellenőrizzük a text értékét
        print(f"text értéke: {text}")  
        with open(f"./info/{filename}.txt", "w", encoding="utf-8") as f:
            f.write(text)
    except Exception as e:
        print(f"Hiba a fájl létrehozásakor: {e}")


def CreateByteMap(imgPath: str, crit: int) -> str:
    """
    This function processes an image file to extract a binary string representing its content.

    Parameters:
    imgPath (str): The path to the image file to be processed.
    crit (int): A critical value used to determine the spacing between binary digits in the final string.

    Returns:
    str: A tuple containing the binary string extracted from the image and the filename of the image without extension.
    """
    i, msg = 1, ""
    nullCount, nullLength = 0, 0
    hasBlack, hasSpace = False, False
    im = Image.open(imgPath)
    px = im.load()
    try:
        while True:
            temp = px[i, 60]
            tempTest = px[i, 260]
            if tempTest == (0, 0, 0) and hasBlack == False:
                nullCount = 0
                hasSpace = False
                if temp == (255, 255, 255):
                    msg += "0"
                else:
                    msg += "1"
                hasBlack = True
            elif hasBlack == True and tempTest != (0, 0, 0):
                try:
                    asd = 1
                    while px[i + asd, 260] == (255, 255, 255):
                        nullLength += 1
                        asd += 1
                    # print(nullLength)
                except:
                    pass
                hasBlack = False
                # if tempTest != (0, 0, 0):
                nullCount += 1
            if nullCount >= 0:
                if nullLength > crit:
                    msg += " "
                else:
                    hasSpace = True
                nullLength = 0
            i += 1
    except:
        print("Az élet szép")

    trimmed = msg[1:]
    trim = ""
    one_count = 0
    zero_count = 0

    i = 0

    while i < len(trimmed):
        if trimmed[i] == "1":
            trim += "1"
            i += 9
        elif trimmed[i] == "0":
            trim += "0"
            i += 10
        i += 1

    minusBegin = trim[8:]
    trim2 = ""
    for i in range(len(minusBegin)):
        if (i + 1) % 8 != 0:
            trim2 += minusBegin[i]
        else:
            trim2 += " "
    # print(msg)
    return msg, imgPath.split("/")[2].split(".")[0]


def binaryToDecimal(binary: int) -> int:
    decimal, i = 0, 0
    while binary != 0:
        dec = binary % 10
        decimal = decimal + dec * pow(2, i)
        binary = binary // 10
        i += 1
    return decimal


def bitToStr(msg: str) -> str:
    """
    This function converts a binary string into a string of characters.

    Parameters:
    msg (str): The binary string to be converted. The string should consist of space-separated binary digits.

    Returns:
    str: The resulting string after converting the binary digits to characters.
    """
    data = msg.split()
    temp = ""
    for i in data:
        num = binaryToDecimal(int(i))
        temp += chr(num)
    # print(temp)
    return temp


def main():
    """
    This function is the entry point of the program. It processes all image files in the 'dat_img' directory.
    For each image file, it calls the CreateByteMap function to extract binary data, converts it to a string using the bitToStr function,
    and then creates a text file with the converted string in the 'info' directory using the createFile function.

    Returns:
    None: The function does not return any value. It processes image files and creates text files.
    """
    files = os.listdir("./dat_img")  # List all files in the 'dat_img' directory
    for i in range(10, len(files)):  # Start from the 11th file
        msg = ""
        print(f"Processing {i+1}, {files[i]}")
        match i+1:
            case 1:
                msg = CreateByteMap(f"./dat_img/{files[i]}", 1)
            case 37:
                break
            case _:  # default case
                msg = CreateByteMap(f"./dat_img/{files[i]}", 4)
        createFile(bitToStr(msg[0]), msg[1])


if __name__ == "__main__":
    main()
