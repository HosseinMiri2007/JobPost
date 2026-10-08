import os 

def validate_file_format(name):
    isValid = True
    frm = os.path.splitext(name)[1]
    valid_format = ['.pdf','.png','.jpg']

    if not frm.lower() in valid_format:
        isValid = False

    return isValid
