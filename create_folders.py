import os
from pathlib import Path
import shutil

def create_folder_structure():
    # Define base path
    base_path = Path("src")
    
    # Dictionary of folders and their subfolders/files
    structure = {
        "components": {
            "common": {
                "Hint": [
                    "index.ts",
                    "Hint.tsx",
                    "Hint.types.ts"
                ]
            },
            "ui": {}
        },
        "features": {
            "editor": {
                "api": {},
                "components": {
                    "Canvas": {},
                    "Toolbar": {},
                    "Sidebar": {}
                },
                "hooks": {
                    "core": {},
                    "objects": {},
                    "styling": {}
                },
                "store": {},
                "types": {},
                "utils": {},
                "constants": {
                    "": [  # Files in constants folder
                        "defaults.ts",
                        "options.ts",
                        "index.ts"
                    ]
                }
            }
        },
        "lib": {},
        "styles": {
            "themes": {},
            "": ["globals.css"]  # Files in styles folder
        },
        "types": {
            "": ["index.d.ts"]  # Files in types folder
        }
    }

    def create_structure(current_path, structure):
        for name, contents in structure.items():
            # Create folder
            folder_path = current_path / name if name else current_path
            folder_path.mkdir(parents=True, exist_ok=True)
            print(f"Created directory: {folder_path}")

            # If contents is a dict, it contains more folders
            if isinstance(contents, dict):
                # Handle files in current directory (empty key)
                if "" in contents:
                    for file in contents[""]:
                        file_path = folder_path / file
                        if not file_path.exists():
                            file_path.touch()
                            print(f"Created file: {file_path}")
                
                # Handle subdirectories
                for key, value in contents.items():
                    if key != "":  # Skip the empty key as we already handled it
                        create_structure(folder_path, {key: value})
            # If contents is a list, it contains files
            elif isinstance(contents, list):
                for file in contents:
                    file_path = folder_path / file
                    if not file_path.exists():
                        file_path.touch()
                        print(f"Created file: {file_path}")

    try:
        # Backup existing src folder if it exists
        if base_path.exists():
            backup_path = Path("src_backup")
            if backup_path.exists():
                shutil.rmtree(backup_path)
            shutil.copytree(base_path, backup_path)
            print(f"Created backup of existing src folder at: {backup_path}")

        # Create the new structure
        create_structure(Path("."), {"src": structure})
        print("\nFolder structure created successfully!")
        print("\nNote: A backup of your existing src folder was created at 'src_backup'")
        print("Please verify the new structure and delete the backup if everything is correct.")

    except Exception as e:
        print(f"An error occurred: {e}")
        # Restore backup if creation failed
        if base_path.exists():
            shutil.rmtree(base_path)
        if Path("src_backup").exists():
            shutil.copytree(Path("src_backup"), base_path)
            print("Restored original src folder from backup")
        raise

if __name__ == "__main__":
    create_folder_structure()