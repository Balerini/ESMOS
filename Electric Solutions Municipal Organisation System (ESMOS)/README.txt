#1 - Pre requisites
For the wireframe to run, we need the flask app to be running and for the HTML to be served on a local hosting environment. The flask application is called ML_Expose and we will be using WAMP/MAMP server to host the HTML file.

#2
Install all packages in the requirements.txt file in ML_Stuff_DBTT with pip install -r requirements.txt while in the folder.

#3 
Run the flask application ML_Expose, ML_Prediction does NOT need to be run if you are using the model that has been attached, (room_usage_linear_model_manual.pkl)

#4
Access the site http://localhost/Electric%20Solutions%20Municipal%20Organisation%20System%20(ESMOS)/, which will bring you to the wireframe prototype in HTML. If you have other methods of hosting the file, adjust accordingly. Do consider that since the ML graph is reliant on data provided from the flask ML, you will need to settle any CORS errors.

#5
Our application is justified based on the usage of real data provided from Enterprise Singapore and Energy Market Authority. The source is provided in the Analytics folder. To run the text mining model, remember to adjust the paths for the data to the DBTT_40_5_Star_Reviews, install the packages and download the udpipe text model.

#6 
For the Power BI charts, you can change the data source settings to the files inside the folder if you want to refresh/look at the data, but for just examining the dashboards, it is not necessary.