from bottle import route, run, template
import pandas as pd
import os

# Load the CSV files
results_path = os.path.join('..', 'public', 'Results.csv')
wellness_path = os.path.join('..', 'public', 'WellnessLoad.csv')

results_df = pd.read_csv(results_path)
wellness_df = pd.read_csv(wellness_path)

# Merge the dataframes on 'Athlete' and 'Date'
merged_df = pd.merge(results_df, wellness_df, on=['Athlete', 'Date'])

# Calculate correlation between performance metrics and wellness factors
performance_metrics = ['Time: Athlete', 'Split Time: Athlete Heat 2']
wellness_factors = ['Fatigue', 'Soreness', 'Motivation', 'Resting HR', 'Sleep Hours', 'Sleep Quality', 'Stress']

@route('/corr')
def index():
    correlations = merged_df[performance_metrics + wellness_factors].corr().loc[performance_metrics, wellness_factors]
    
    # Draw corrleation matrix and save to png
    import matplotlib.pyplot as plt
    import seaborn as sns
    import io
    import base64
    from bottle import response

    # Create a heatmap of the correlations
    plt.figure(figsize=(12, 8))
    sns.heatmap(correlations, annot=True, cmap='coolwarm', vmin=-1, vmax=1, center=0)
    plt.title('Correlation between Performance Metrics and Wellness Factors')
    plt.tight_layout()

    # Save the plot to a bytes buffer
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    
    # Encode the image to base64
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

    # Close the plot to free up memory
    plt.close()

    # Add the image to the JSON response
    response.content_type = 'application/json'
    correlations_dict = correlations.to_dict(orient='split')
    correlations_dict['heatmap_image'] = f"data:image/png;base64,{image_base64}"
    
    # Save the correlations and heatmap image to disk
    import json
    
    # Save correlations JSON
    correlations_output_path = os.path.join('..', 'public', 'correlations.json')
    with open(correlations_output_path, 'w') as f:
        json.dump(correlations_dict, f)
    
    print(f"Correlations saved to {correlations_output_path}")
    
    # Save heatmap image
    heatmap_output_path = os.path.join('..', 'public', 'correlation_heatmap.png')
    with open(heatmap_output_path, 'wb') as f:
        f.write(base64.b64decode(image_base64))
    
    print(f"Heatmap image saved to {heatmap_output_path}")

    # Convert correlations to JSON
    correlations_json = correlations.to_json(orient='split')
    
    return correlations_json

run(host='localhost', port=8080)