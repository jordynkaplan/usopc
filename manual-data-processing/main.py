import pandas as pd
import os

# Define the path to the CSV file
results_path = os.path.join('..', 'public', 'Results.csv')
results_features_path = os.path.join('..', 'public', 'ResultsWithFeatures.csv')

# Read the CSV file
results_df = pd.read_csv(results_path)

# Compute Time Delta columns
results_df['Time Delta: Best'] = (results_df['Time: Athlete'] - results_df['Time: Best']).round(2)
results_df['Time Delta: Heat 1'] = (results_df['Time: Athlete Heat 1'] - results_df['Time: Best Heat 1']).round(2)
results_df['Time Delta: Heat 2'] = (results_df['Time: Athlete Heat 2'] - results_df['Time: Best Heat 2']).round(2)

# Generate a computed competition id column
results_df['Competition ID'] = results_df.groupby(['Date', 'Time: Best', 'Time: Best Heat 1', 'Time: Best Heat 2', 'Event']).ngroup()
# Replace -1 with NaN in the Competition ID column
results_df['Competition ID'] = results_df['Competition ID'].replace(-1, pd.NA)
# Start from competition id 1
results_df['Competition ID'] = results_df['Competition ID'].add(1)


# Display the first few rows to verify the new columns
print(results_df[['Time Delta: Best', 'Time Delta: Heat 1', 'Time Delta: Heat 2', 'Competition ID']].head())

# Save the updated DataFrame back to CSV
results_df.to_csv(results_features_path, index=False)
print("Updated CSV file saved successfully.")
