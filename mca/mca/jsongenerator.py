import json

def parse_trace(file_path):
    result = []
    current_mca = None
    with open(file_path, 'r') as file:
        for line in file:
            if line.startswith('MCA'):
                current_mca = line.strip().split()[2]
            else:
                source, destination = line.strip().split('->')
                result.append({
                    'MCA': current_mca,
                    'trace': {
                        'source': source,
                        'destination': destination
                    }
                })
    return result

def save_to_json(data, file_path):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

file_path = 'result.txt'
output_file_path = 'data.json'

parsed_data = parse_trace(file_path)
save_to_json(parsed_data, output_file_path)

print(f"Data saved to {output_file_path}.")