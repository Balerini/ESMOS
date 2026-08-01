# Setup Guide

## Prerequisites

To run the application, the Flask backend must be running and the HTML files must be hosted on a local web server.

The Flask application used is:

- `ML_Expose`

The recommended local hosting environments are:

- WAMP (Windows)
- MAMP (MacOS)

---

## Installation

Navigate to the `ML_Stuff_DBTT` folder and install the required dependencies:

```bash
pip install -r requirements.txt
```

---

## Running the Application

### Step 1: Start the Flask Backend

Run the Flask application:

```bash
ML_Expose
```

> **Note:** `ML_Prediction` does not need to be run if you are using the provided pre-trained model:
>
> `room_usage_linear_model_manual.pkl`

### Step 2: Host the Frontend Files

Host the HTML files using WAMP, MAMP, or any local web server of your choice.

### Step 3: Access the Application

Open the following URL in your browser:

```text
http://localhost/Electric%20Solutions%20Municipal%20Organisation%20System%20(ESMOS)/
```

If you are using a different hosting setup, adjust the URL accordingly.

> **Important:** The machine learning graphs rely on data served from the Flask backend. Ensure that any Cross-Origin Resource Sharing (CORS) issues are resolved if hosting the frontend and backend separately.

---

## Data Sources

This application uses real-world datasets obtained from:

- Enterprise Singapore
- Energy Market Authority (EMA)

The datasets can be found in the **Analytics** folder.

---

## Running the Text Mining Model

To run the text mining component:

1. Update the data paths to point to:
   ```
   DBTT_40_5_Star_Reviews
   ```
2. Install all required packages.
3. Download and configure the UDPipe text model.

---

## Power BI Dashboards

The Power BI dashboards are already functional for viewing purposes.

If you wish to refresh or modify the dashboards:

1. Open the Power BI files.
2. Update the data source settings to point to the datasets provided in the project folder.
3. Refresh the data.

> For viewing the dashboards only, no additional configuration is required.
