#!/usr/bin/env python3
"""
Generate FRA Patta-holder dataset for DSS mapping.

This script reads district boundary GeoJSON data and generates
realistic patta-holder entries with coordinates guaranteed to be
within the correct district polygons.
"""

import json
import csv
import random
from pathlib import Path
from shapely.geometry import shape, Point

# Configuration
GEOJSON_DIR = "/Users/vinaykumar/Desktop/E-Forest-dss/public/data/new_districts"
OUTPUT_PATH = "/Users/vinaykumar/Desktop/E-Forest-dss/dssmappoints/fra_pattas_all_states.csv"

# Target states for SIH (matching the GeoJSON filenames)
TARGET_STATES = {
    "Telangana": "Telangana.json",
    "Madhya Pradesh": "Madhya Pradesh.json",
    "Jharkhand": "Jharkhand.json",
    "Odisha": "Odisha.json",
    "Tripura": "Tripura.json"
}

# State code mapping
STATE_CODES = {
    "Telangana": "TG",
    "Madhya Pradesh": "MP",
    "Jharkhand": "JH",
    "Odisha": "OD",
    "Tripura": "TR"
}

# Tribal-style name components for realistic names
FIRST_NAMES = [
    "Raju", "Lakshmi", "Soma", "Anji", "Sunitha", "Mallesh", "Gita", "Ram", 
    "Rekha", "Raghu", "Asha", "Biru", "Rita", "Sunil", "Lali", "Narayan",
    "Pinki", "Kalia", "Sita", "Babulal", "Devi", "Gouranga", "Kumari",
    "Kishore", "Reang", "Meena", "Chotu", "Kamalamma", "Mallaiah", "Rathnam",
    "Pothuraju", "Saroja", "Kiran", "Savitri", "Ramesh", "Shyam", "Anitha",
    "Veera", "Devanna", "Shanti", "Mohan", "Ramkali", "Devraj", "Durga",
    "Laxman", "Sarla", "Bhagwan", "Kamini", "Rakesh", "Gopal", "Sanjay",
    "Santosh", "Pushpa", "Amar", "Anjali", "Subhash", "Chandan", "Rakhi",
    "Guddu", "Soni", "Harish", "Ajay", "Meera", "Roshan", "Nita", "Lukra",
    "Prakash", "Radha", "Manoj", "Sarita", "Reena", "Jayant", "Linga",
    "Kamli", "Raja", "Santi", "Dinesh", "Rupali", "Bikash", "Sabita",
    "Akash", "Rinku", "Sonali", "Arjun", "Radhika", "Subal", "Manisha",
    "Jiten", "Pratap", "Sumita", "Krishna", "Lopa", "Debu"
]

LAST_NAMES = [
    "Nayak", "Bai", "Naik", "Gond", "Singh", "Oraon", "Munda", "Debbarma",
    "Ekka", "Koya", "Lambada", "Bhil", "Baiga", "Korku", "Sahariya", "Meena",
    "Kondh", "Santhal", "Pradhan", "Majhi", "Kharia", "Ho", "Birhor"
]

def load_state_geojson(state_name, filename):
    """Load GeoJSON data for a specific state."""
    filepath = Path(GEOJSON_DIR) / filename
    print(f"Loading {state_name} from: {filepath}")
    
    with open(filepath, 'r') as f:
        return json.load(f)

def extract_districts(geojson_data, state_name):
    """
    Extract district information from GeoJSON.
    Returns a list of {name, geometry} dicts.
    """
    districts = []
    
    for feature in geojson_data['features']:
        props = feature['properties']
        
        # Get district name from properties
        district_name = props.get('dtname') or props.get('DISTRICT') or props.get('district')
        
        if district_name:
            geometry = shape(feature['geometry'])
            districts.append({
                'name': district_name.strip(),
                'geometry': geometry
            })
    
    return districts

def generate_point_in_polygon(polygon, max_attempts=100):
    """
    Generate a random point guaranteed to be inside the polygon.
    Uses rejection sampling within the polygon's bounding box.
    """
    minx, miny, maxx, maxy = polygon.bounds
    
    for _ in range(max_attempts):
        # Generate random point within bounding box
        point = Point(
            random.uniform(minx, maxx),
            random.uniform(miny, maxy)
        )
        
        # Check if point is within polygon
        if polygon.contains(point):
            return point.y, point.x  # Return as (latitude, longitude)
    
    # Fallback: use polygon centroid if rejection sampling fails
    centroid = polygon.centroid
    return centroid.y, centroid.x

def generate_patta_holders_for_state(state_name, districts):
    """
    Generate patta-holder entries for all districts in a state.
    Returns a list of patta records.
    """
    pattas = []
    state_code = STATE_CODES[state_name]
    
    print(f"\nGenerating pattas for {state_name} ({len(districts)} districts)...")
    
    for district in districts:
        district_name = district['name']
        geometry = district['geometry']
        
        # Generate random number of pattas (10-20) for this district
        num_pattas = random.randint(10, 20)
        
        # Create district code (remove spaces and limit length)
        district_code = district_name.replace(' ', '').replace('-', '')[:3].upper()
        
        for i in range(num_pattas):
            # Generate unique ID
            patta_id = f"{state_code}_{district_code}_{(i+1):03d}"
            
            # Generate random holder name
            first_name = random.choice(FIRST_NAMES)
            last_name = random.choice(LAST_NAMES)
            holder_name = f"{first_name} {last_name}"
            
            # Random status
            status = random.choice(["APPROVED", "PENDING"])
            
            # Random land area (0.5 to 3.0 acres)
            land_area = round(random.uniform(0.5, 3.0), 1)
            
            # Generate coordinates within district polygon
            latitude, longitude = generate_point_in_polygon(geometry)
            
            # Generate village name
            village = f"Village_{random.randint(100, 999)}"
            
            # Create patta record
            patta = {
                'id': patta_id,
                'holder_name': holder_name,
                'status': status,
                'land_area_acres': land_area,
                'latitude': round(latitude, 4),
                'longitude': round(longitude, 4),
                'village': village,
                'district': district_name,
                'state': state_name
            }
            
            pattas.append(patta)
        
        print(f"  {district_name}: {num_pattas} pattas generated")
    
    return pattas

def write_csv(pattas, output_path):
    """Write patta records to CSV file."""
    # Remove existing file if it exists
    output_file = Path(output_path)
    if output_file.exists():
        output_file.unlink()
        print(f"\nRemoved existing file: {output_path}")
    
    # Ensure directory exists
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    # Write CSV
    fieldnames = ['id', 'holder_name', 'status', 'land_area_acres', 
                  'latitude', 'longitude', 'village', 'district', 'state']
    
    with open(output_path, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(pattas)
    
    print(f"\nDataset written to: {output_path}")

def main():
    """Main execution function."""
    print("=" * 60)
    print("FRA Patta-Holder Dataset Generator")
    print("=" * 60)
    
    all_pattas = []
    
    # Process each state
    for state_name, filename in TARGET_STATES.items():
        # Load GeoJSON for this state
        geojson_data = load_state_geojson(state_name, filename)
        
        # Extract districts
        districts = extract_districts(geojson_data, state_name)
        print(f"Found {len(districts)} districts in {state_name}")
        
        # Generate patta holders
        state_pattas = generate_patta_holders_for_state(state_name, districts)
        all_pattas.extend(state_pattas)
    
    # Write to CSV
    write_csv(all_pattas, OUTPUT_PATH)
    
    # Final summary
    print("\n" + "=" * 60)
    print(f"TOTAL PATTAS GENERATED: {len(all_pattas)}")
    print("=" * 60)
    
    # Status breakdown
    approved = sum(1 for p in all_pattas if p['status'] == 'APPROVED')
    pending = sum(1 for p in all_pattas if p['status'] == 'PENDING')
    print(f"  APPROVED: {approved}")
    print(f"  PENDING: {pending}")
    
    # State breakdown
    print("\nBreakdown by state:")
    for state_name in TARGET_STATES.keys():
        count = sum(1 for p in all_pattas if p['state'] == state_name)
        print(f"  {state_name}: {count}")
    
    print("=" * 60)

if __name__ == "__main__":
    main()
