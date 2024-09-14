from bottle import route, run, template, response, request
import pandas as pd
import os
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
import json
import numpy as np

# Load the CSV files
results_path = os.path.join("..", "public", "ResultsWithFeatures.csv")
wellness_path = os.path.join("..", "public", "WellnessLoad.csv")

results_df = pd.read_csv(results_path)
wellness_df = pd.read_csv(wellness_path)

# Merge the dataframes on 'Athlete' and 'Date'
merged_df = pd.merge(results_df, wellness_df, on=["Athlete", "Date"])

# Calculate correlation between performance metrics and wellness factors
performance_metrics = ["Time Delta: Best", "Time Delta: Heat 2"]
wellness_factors = [
    "Fatigue",
    "Soreness",
    "Motivation",
    "Resting HR",
    "Sleep Hours",
    "Sleep Quality",
    "Stress",
]


@route("/corr/<gender>")
def index(gender):
    return compute_correlations(gender)


def compute_correlations(gender):
    gender_df = merged_df.copy()
    print(gender)
    if gender in ["m", "f"]:
        gender_df = merged_df[merged_df["Gender"] == gender]

    # Remove NaN values before computing stats
    gender_df = gender_df.dropna(subset=performance_metrics + wellness_factors)

    correlations = (
        gender_df[performance_metrics + wellness_factors]
        .corr()
        .loc[performance_metrics, wellness_factors]
    )

    # Create a heatmap of the correlations
    plt.figure(figsize=(12, 8))
    sns.heatmap(correlations, annot=True, cmap="coolwarm", vmin=-1, vmax=1, center=0)
    plt.title(
        f"Correlation between Performance Metrics and Wellness Factors ({gender.upper()})"
    )
    plt.tight_layout()

    # Save the plot to a bytes buffer
    buffer = io.BytesIO()
    plt.savefig(buffer, format="png")
    buffer.seek(0)

    # Encode the image to base64
    image_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

    # Close the plot to free up memory
    plt.close()

    # Add the image to the JSON response
    response.content_type = "application/json"
    correlations_dict = correlations.to_dict(orient="split")
    correlations_dict["heatmap_image"] = f"data:image/png;base64,{image_base64}"

    # Save the correlations and heatmap image to disk

    # Save correlations JSON
    correlations_output_path = os.path.join(
        "..", "public", f"correlations_{gender}.json"
    )
    with open(correlations_output_path, "w") as f:
        json.dump(correlations_dict, f)

    print(f"Correlations saved to {correlations_output_path}")

    # Save heatmap image
    heatmap_output_path = os.path.join(
        "..", "public", f"correlation_heatmap_{gender}.png"
    )
    with open(heatmap_output_path, "wb") as f:
        f.write(base64.b64decode(image_base64))

    print(f"Heatmap image saved to {heatmap_output_path}")
    
    # Generate scatter plots for all combinations
    for performance_metric in performance_metrics:
        for wellness_factor in wellness_factors:
            create_scatter_plot(gender_df, gender, performance_metric, wellness_factor)

    # Convert correlations to JSON
    correlations_json = correlations.to_json(orient="split")

    return correlations_json


def create_scatter_plot(df, gender, performance_metric, wellness_factor):
    plt.figure(figsize=(10, 6))
    plt.scatter(df[wellness_factor], df[performance_metric], label='Data Points')

    # Calculate the linear regression line
    x = df[wellness_factor]
    y = df[performance_metric]
    slope, intercept = np.polyfit(x, y, 1)
    line = slope * x + intercept

    # Plot the regression line
    plt.plot(x, line, color='red', label=f'Regression Line (slope: {slope:.4f})')

    plt.xlabel(wellness_factor)
    plt.ylabel(performance_metric)
    plt.title(f'{performance_metric} vs {wellness_factor} ({gender.upper()})')
    plt.legend()
    plt.tight_layout()

    # Save the scatter plot
    scatter_output_path = os.path.join(
        "..", "public", f"scatter_plot_{gender}_{performance_metric.replace(':', '_')} vs {wellness_factor}.png"
    )
    plt.savefig(scatter_output_path)
    plt.close()

    print(f"Scatter plot saved to {scatter_output_path}")


run(host="localhost", port=8080)
