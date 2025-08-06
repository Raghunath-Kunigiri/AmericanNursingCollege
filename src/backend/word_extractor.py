import re

def extract_special_words(text):
    data = {}

  # Regular expressions to capture the values for each field
    application_match = re.search(r"Application No[:.\s]*(\d+)", text, re.IGNORECASE)
    name_match = re.search(r"Name in Full[:.\s]*(.+)", text, re.IGNORECASE)
    father_name_match = re.search(r"Full Name of the Father / Guardian[:.\s]*(.+)", text, re.IGNORECASE)
    gender_match = re.search(r"Gender[:.\s]*(.+)", text, re.IGNORECASE)
    dob_match = re.search(r"Date of Birth[:.\s]*([\d/.]+)", text, re.IGNORECASE)
    group_match = re.search(r"Educational Qualification[:.\s]*([\w\s.-]+?)(?=\s* 15.Hall Ticket No)", text, re.IGNORECASE)  
    marks_match = re.search(r"Marks Secured\(GPA\)[:.\s]*(.+)", text, re.IGNORECASE)
    total_marks_match = re.search(r"Total Marks\(GPA\)[:.\s]*(\d+)(?=\s*/\s*Marks Secured)", text, re.IGNORECASE)
    social_match = re.search(r"social status: [:.\s]*([A-Z]+(?:-[A-Z])?)", text, re.IGNORECASE)
    college_name_match = re.search(r"Name of Institution: [:.\s]*(.+)",text,re.IGNORECASE)
    seat_match = re.search(r"seat[:.\s]*(\w+)", text, re.IGNORECASE)
    
   



    data["ADM.No"] = application_match.group(1).strip() if application_match else ""
    data["NAME"] = name_match.group(1).strip() if name_match else ""
    data["FATHER"] = father_name_match.group(1).strip() if father_name_match else ""
    data["Male|Female"] = gender_match.group(1).strip() if gender_match else ""
    data["DOB"] = dob_match.group(1).strip() if dob_match else ""
    data["GROUP"] = group_match.group(1).strip() if group_match else ""
    data["Marks Obtained"] = marks_match.group(1).strip() if marks_match else ""
    data["total marks"] = total_marks_match.group(1).strip() if total_marks_match else""
    data["Caste"] = social_match.group(1).strip() if social_match else ""
    data["College Name"] = college_name_match.group(1).strip() if college_name_match else ""
    data["Convenor/ Management"] = seat_match.group(1).strip() if seat_match else ""


    return data






    # if application_match:
    #     data["ADM.No"] = application_match.group(1).strip()
    # else:
    #     data["ADM.No"] = ""
    
    # if name_match:
    #     data["NAME"] = name_match.group(1).strip()
    # else:
    #     data["NAME"] = ""
    
    # if father_name_match:
    #     data["FATHER"] = father_name_match.group(1).strip()
    # else:
    #     data["FATHER"] = ""
    
    # if gender_match:
    #     data["Male/Female"] = gender_match.group(1).strip()
    # else:
    #     data["Male/Female"] = ""

    # if dob_match:
    #     data["DOB"] = dob_match.group(1).strip()
    # else:
    #     data["DOB"] = ""

    # if group_match:
    #     data["GROUP"] = group_match.group(1).strip()
    # else:
    #     data["Group"] = ""
    # if seat_match:
    #     data["Convenor/ Management"] =seat_match.group(1).strip()
    # else:
    #     data["Convenor/ Management"] =""
    
    # if social_match:
    #     data["Caste"] = social_match.group(1).strip()
    # else:
    #     data["Caste"] = ""
    # if marks_match:
    #     data["Marks Obtained"] = marks_match.group(1).strip()
    # else:
    #     data["Marks Obtained"] = ""
    

    # return data
