y
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import tempfile
import zipfile
from werkzeug.utils import secure_filename
import datetime
from pdf_utils import extract_text_from_pdf
from word_extractor import extract_special_words
from csv_writer import save_words_to_csv

app = Flask(__name__)
CORS(app)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
ALLOWED_EXTENSIONS = {'pdf'}

# Create directories if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max file size

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload-pdf', methods=['POST'])
def upload_pdf():
    try:
        if 'files' not in request.files:
            return jsonify({'error': 'No files provided'}), 400
        
        files = request.files.getlist('files')
        if not files or files[0].filename == '':
            return jsonify({'error': 'No files selected'}), 400

        extracted_data = []
        processed_files = []
        failed_files = []

        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                
                try:
                    # Extract text from PDF
                    extracted_text = extract_text_from_pdf(filepath)
                    
                    if extracted_text:
                        # Extract structured data
                        data = extract_special_words(extracted_text)
                        data['filename'] = filename
                        extracted_data.append(data)
                        processed_files.append(filename)
                    else:
                        failed_files.append(filename)
                        
                except Exception as e:
                    failed_files.append(filename)
                    print(f"Error processing {filename}: {str(e)}")
                
                # Clean up uploaded file
                os.remove(filepath)

        if extracted_data:
            # Save to CSV
            timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
            output_filename = f"extracted_data_{timestamp}.csv"
            output_path = os.path.join(app.config['OUTPUT_FOLDER'], output_filename)
            save_words_to_csv(extracted_data, output_path)
            
            return jsonify({
                'success': True,
                'message': f'Successfully processed {len(processed_files)} files',
                'processed_files': processed_files,
                'failed_files': failed_files,
                'output_file': output_filename,
                'total_records': len(extracted_data)
            })
        else:
            return jsonify({
                'success': False,
                'error': 'No data could be extracted from the provided files',
                'failed_files': failed_files
            }), 400

    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/download/<filename>')
def download_file(filename):
    try:
        file_path = os.path.join(app.config['OUTPUT_FOLDER'], filename)
        if os.path.exists(file_path):
            return send_file(file_path, as_attachment=True)
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': f'Download error: {str(e)}'}), 500

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, port=5000) 