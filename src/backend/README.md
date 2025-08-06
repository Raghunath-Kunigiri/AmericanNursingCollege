# PDF Data Extraction System

This system provides a web-based interface for extracting structured data from PDF files and saving the results as CSV files.

## Features

- **Multiple File Upload**: Upload single or multiple PDF files
- **Text Extraction**: Extract text from PDFs using PyPDF2
- **OCR Support**: Fallback to OCR for scanned documents using Tesseract
- **Structured Data Extraction**: Extract specific fields like Application No, Name, Father's Name, etc.
- **CSV Export**: Save extracted data as CSV files
- **Modern UI**: Clean, responsive web interface

## Prerequisites

### Python Dependencies
- Python 3.7 or higher
- pip (Python package installer)

### Tesseract OCR (Optional but Recommended)
For OCR functionality on scanned PDFs:
1. Download Tesseract from: https://github.com/UB-Mannheim/tesseract/wiki
2. Install to default location: `C:\Program Files\Tesseract-OCR\`
3. Add to PATH environment variable

## Installation

### 1. Navigate to Backend Directory
```bash
cd src/backend
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Verify Installation
```bash
python app.py
```

The server should start on `http://localhost:5000`

## Usage

### Starting the Backend Server

1. **Navigate to the backend directory:**
   ```bash
   cd src/backend
   ```

2. **Run the Flask server:**
   ```bash
   python app.py
   ```

3. **Verify the server is running:**
   - Open browser to `http://localhost:5000/api/health`
   - Should return: `{"status": "healthy"}`

### Using the Frontend

1. **Start your React development server:**
   ```bash
   npm start
   ```

2. **Navigate to the admin dashboard:**
   - Go to your React app's admin section
   - Look for the "PDF Extractor" tab

3. **Upload and Process PDFs:**
   - Drag and drop PDF files or click to browse
   - Click "Extract Data" to process files
   - Download the resulting CSV file

## API Endpoints

### POST /api/upload-pdf
Upload and process PDF files.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: Form data with 'files' field containing PDF files

**Response:**
```json
{
  "success": true,
  "message": "Successfully processed 2 files",
  "processed_files": ["file1.pdf", "file2.pdf"],
  "failed_files": [],
  "output_file": "extracted_data_20231201_143022.csv",
  "total_records": 2
}
```

### GET /api/download/<filename>
Download processed CSV files.

**Request:**
- Method: GET
- URL: `/api/download/extracted_data_20231201_143022.csv`

**Response:**
- CSV file download

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy"
}
```

## Extracted Data Fields

The system extracts the following fields from PDFs:

- **ADM.No**: Application number
- **NAME**: Full name of the applicant
- **FATHER**: Father's/Guardian's name
- **Male|Female**: Gender
- **DOB**: Date of birth
- **GROUP**: Educational qualification/group
- **Marks Obtained**: Marks secured (GPA)
- **total marks**: Total marks available
- **Caste**: Social status/caste
- **College Name**: Institution name
- **Convenor/ Management**: Seat allocation type
- **filename**: Original PDF filename

## File Structure

```
src/backend/
├── app.py                 # Flask API server
├── pdf_utils.py          # PDF text extraction
├── word_extractor.py     # Structured data extraction
├── csv_writer.py         # CSV file writing
├── requirements.txt      # Python dependencies
├── setup.py             # Installation script
├── README.md            # This file
├── uploads/             # Temporary upload directory
└── outputs/             # Generated CSV files
```

## Troubleshooting

### Common Issues

1. **Tesseract not found:**
   - Install Tesseract OCR
   - Ensure it's in PATH or update the path in `pdf_utils.py`

2. **Port 5000 already in use:**
   - Change the port in `app.py`: `app.run(debug=True, port=5001)`
   - Update the frontend API calls accordingly

3. **CORS errors:**
   - Ensure Flask-CORS is installed: `pip install flask-cors`
   - Check that CORS is properly configured in `app.py`

4. **File upload errors:**
   - Check file size limits in `app.py`
   - Ensure upload directory exists and is writable

### Debug Mode

To enable debug mode for development:
```python
app.run(debug=True, port=5000)
```

This will show detailed error messages and auto-reload on code changes.

## Development

### Adding New Fields

To extract additional fields, modify `word_extractor.py`:

1. Add new regex patterns in `extract_special_words()`
2. Add corresponding data dictionary entries
3. Test with sample PDFs

### Customizing Output Format

Modify `csv_writer.py` to change the CSV output format or add additional processing.

## License

This project is part of the American Nursing College application system. 