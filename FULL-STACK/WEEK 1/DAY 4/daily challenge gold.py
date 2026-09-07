#SOLVE THE MATRIX.
import re

MATRIX_STR = '''7ir
Tsi
h%x
i ?
sM# 
$a 
#t%'''

def decrypt_matrix(matrix_str):
    # Step 1: Convert matrix string to a 2D list (list of rows)
    # Split by line and filter out empty lines caused by leading/trailing newlines
    rows = [line for line in matrix_str.split('\n') if line]
    
    num_rows = len(rows)
    num_cols = max(len(row) for row in rows)
    
    # Step 2 & 3: Iterate column-wise from top to bottom, left to right
    raw_column_chars = []
    for col in range(num_cols):
        for row in range(num_rows):
            # Safe character extraction if rows have varying lengths
            if col < len(rows[row]):
                raw_column_chars.append(rows[row][col])
    
    # Join into a single raw text string
    raw_text = "".join(raw_column_chars)
    
    # Step 4 & 5: Replace any non-alpha sequence located BETWEEN alpha characters with a space
    # Lookahead (?=[a-zA-I]) and lookbehind (?<=[a-zA-Z]) ensure symbols at the far start/end are ignored
    decoded_message = re.sub(r'(?<=[a-zA-Z])[^a-zA-Z]+(?=[a-zA-Z])', ' ', raw_text)
    
    return decoded_message

# Execute & Print
if __name__ == "__main__":
    secret_message = decrypt_matrix(MATRIX_STR)
    print("Decoded Message:")
    print(secret_message)