import pandas as pd

def save_words_to_csv(data, output_path):
    
    try:
        # Convert the list of dictionaries to a DataFrame
        df = pd.DataFrame(data)

        # Save the DataFrame to a CSV file
        df.to_csv(output_path, index=False)
        print(f"Data successfully saved to {output_path}")
    except Exception as e:
        print(f"Error saving data to CSV: {e}")
