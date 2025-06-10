import readline 
from pathlib import Path 

import lmstudio as lms 

def create_file(name:str, content:str):
    dest_path = Path(name)
    if dest_path.exists():
        return "Error : File already exists"
    try:
        dest_path.write_text(content, encoding="utf-8")
    except Exception as e:
        return f"Error : {e!r}"
    return f"File created : {name}"

def 