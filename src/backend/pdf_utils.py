import pytesseract
from pdf2image import convert_from_path
import PyPDF2
import os

# Configure Tesseract path if necessary
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_text_from_pdf(pdf_path):
    
    extracted_text = ""  # Initialize to store the final extracted text

    try:
        # Ensure the file exists
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"File not found: {pdf_path}")

        # Attempt to extract text from a standard PDF
        with open(pdf_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    extracted_text += page_text

        # If PyPDF2 successfully extracted text, return it
        if extracted_text.strip():
            print(f"Text successfully extracted from {pdf_path} using PyPDF2.")
            return extracted_text

        # Fallback to OCR if no text was found
        print(f"No text found in {pdf_path} using PyPDF2. Switching to OCR...")
        images = convert_from_path(pdf_path)
        for i, image in enumerate(images):
            print(f"Performing OCR on page {i + 1}...")
            extracted_text += pytesseract.image_to_string(image)

    except FileNotFoundError as fnf_error:
        print(fnf_error)
    except PyPDF2.errors.PdfReadError as pdf_error:
        print(f"PDF Read Error: {pdf_error}")
    except Exception as e:
        print(f"Unexpected error while processing {pdf_path}: {e}")

    # Save the raw text for debugging
    try:
        with open("debug_extracted_text.txt", "w", encoding="utf-8") as debug_file:
            debug_file.write(extracted_text)
        print("Debug text saved to 'debug_extracted_text.txt'.")
    except Exception as e:
        print(f"Error saving debug text: {e}")

    return extracted_text.strip()  # Return the final extracted text


if __name__ == "__main__":
    # Example usage
    pdf_file = r"C:\Users\kunig\OneDrive - Saint Louis University\Documents\ASN\2025 gnm Admissions"  # Replace with your PDF file path
    extracted_text = extract_text_from_pdf(pdf_file)
    print("Extracted Text:")
    print(extracted_text)
