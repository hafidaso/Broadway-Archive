import pandas as pd
import json

# File path
file_path = '/Users/hafida/Downloads/Broadway Conductors Data Visualization Contest/Conductor Timeline Data_Contest.xlsx'

# 1. Load data
df_timeline = pd.read_excel(file_path, sheet_name='Conductor Timeline')

# 2. Clean column names
df_timeline.columns = df_timeline.columns.str.strip().str.replace('  ', ' ')

# 3. Process dates
date_cols = ['OPENING DATE', 'CLOSING DATE', 'Person Start Date', 'Person End Date']
for col in date_cols:
    df_timeline[col] = pd.to_datetime(df_timeline[col], errors='coerce')

# 4. Add Decade column
df_timeline['Decade'] = (df_timeline['OPENING DATE'].dt.year // 10 * 10).fillna(0).astype(int)

# 5. Build data list with new dictionary structure
clean_data = []

for index, row in df_timeline.iterrows():
    # Calculate status: if closing date is empty, the show is still running
    status = "Running" if pd.isna(row['CLOSING DATE']) else "Closed"
    
    entry = {
        "id": int(row['ROW ID']),
        "show_info": {
            "title": str(row['SHOW']),
            "type": str(row['PRODUCTION TYPE']), # Original / Revival
            "status": status,
            "opening": row['OPENING DATE'].strftime('%Y-%m-%d') if pd.notnull(row['OPENING DATE']) else None,
            "performances": row['# of PERFORMANCES'] if pd.notnull(row['# of PERFORMANCES']) else 0
        },
        "conductor_info": {
            "name": f"{row['FIRST NAME']} {row['LAST NAME']}",
            "lifespan": str(row['Lifespan if deceased']) if pd.notnull(row['Lifespan if deceased']) else "",
            "role": str(row['Role']),
            "photo": str(row['LINK TO PHOTO']) if pd.notnull(row['LINK TO PHOTO']) else "",
            "website": str(row['WEBSITE']) if pd.notnull(row['WEBSITE']) else "",
            "ibdb": str(row['INTERNET BROADWAY DATABASE']) if pd.notnull(row['INTERNET BROADWAY DATABASE']) else "",
            "fact": str(row['PERSON FUN FACTS']) if pd.notnull(row['PERSON FUN FACTS']) else ""
        },
        "decade": int(row['Decade'])
    }
    clean_data.append(entry)

# 6. Save file as JSON
with open('cleaned_data.json', 'w', encoding='utf-8') as f:
    json.dump(clean_data, f, ensure_ascii=False, indent=4)

print(f"Data updated! Extracted {len(clean_data)} records with complete dictionary details.")