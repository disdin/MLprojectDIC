import sys


# pip install statsmodels pmdarima

# to check above data 
print(dataSet[0])


import pandas as pd
import numpy as np
from pandas import read_csv
from statsmodels.tsa.stattools import adfuller
from pmdarima import auto_arima 
# Ignore harmless warnings
import warnings
from sklearn.metrics import mean_squared_error
from statsmodels.tools.eval_measures import rmse
import matplotlib.pyplot as plt
get_ipython().run_line_magic('matplotlib', 'inline')
from statsmodels.tsa.statespace.sarimax import SARIMAX
# import pymannkendall as mk
from pylab import rcParams
import statsmodels.api as sm
from statsmodels.tsa.seasonal import seasonal_decompose


def forecast(listOfValues,deviceID):
    findTimeAndValue(listOfValues,deviceID)



xaxis=[] # xaxis 
yaxis=[]  # yaxis
csv_data=[] # CSV file

def findTimeAndValue(dataSet,deviceID):
    
    series.clear()
    xaxis.clear()
    yaxis.clear()
    csv_data.clear()
    
    # Time data
    for i in range(0,len(dataSet)):
        xaxis.append(dataSet[i]['timeVal'])

    #Temperature data
    for i in range(0,len(dataSet)):
        yaxis.append(dataSet[i]['data']['tempVal']['value'])

    # Create csv
    convertFileToCSV(xaxis,yaxis)
    # Check series is stationary or non stationary
    checkTimeSeriesStationary(yaxis,deviceID) 


# convert  datasets into CSV format
def convertFileToCSV(xaxis,yaxis):
    # Make CSV
    date = np.array(xaxis)
    temp_value = np.array(yaxis)

    df = pd.DataFrame({"Date" : date, "value" : temp_value})
    df.to_csv("temperatureFile.csv", index=False)
    csv_data = pd.read_csv("temperatureFile.csv")

# check Time series is stationary 
def checkTimeSeriesStationary(yaxis,deviceID):
    
    series = read_csv('temperatureFile.csv', header=0, index_col=0, squeeze=True)
    temperature_values = series.values
    result = adfuller(temperature_values)
    print('ADF Statistic: %f' % result[0])
    print('p-value: %f' % result[1])
    print('Critical Values:')
    for key, value in result[4].items():
        print('\t%s: %.3f' % (key, value))
    if(result[1]>0.05):
        print("Series is Non Stationary")
        nonStationaryTimeSeries(yaxis,deviceID)
    else:
        print("Stationary")
        stationaryTimeSeries(yaxis,deviceID)

    
## STATIONARY FUNCTION
def stationaryTimeSeries(yaxis,deviceID):

    warnings.filterwarnings("ignore")
    # Run auto_arima function to get orders
    stepwise_fit = auto_arima(yaxis, start_p = 1, start_q = 1,
                              max_p = 3, max_q = 3, m = 12,
                              start_P = 0, seasonal = True,
                              d = None, D = 1, trace = True,
                              error_action ='ignore',   # we don't want to know if an order does not work
                              suppress_warnings = True,  # we don't want convergence warnings
                              stepwise = True)           # set to stepwise

    # To print the summary
    stepwise_fit.summary()
    print("stepwise_fit",stepwise_fit.order)
    print("stepwise_fit",stepwise_fit.seasonal_order)
    
    # run SARIMA Model
    model = SARIMAX(yaxis, 
                    order = stepwise_fit.order, 
                    seasonal_order =stepwise_fit.seasonal_order)

    result = model.fit()
    result.summary()
    
    # length of prediction graph
    start_point = len(yaxis)
    end_point = len(yaxis) +int(len(yaxis)/4) # maximum prediction duration
    
    # Prediction graph merge with existing data
    predictions = result.predict(0, end_point)
    plt.figure(figsize=(16,7)) # figure size
    font1 = {'family':'serif','size':15} # font size
    font2 = {'family':'serif','size':15} # font size
    plt.title("Forecasting", fontdict = font1) # title
    plt.ylabel("Temperature", fontdict = font2) # label
    plt.plot(yaxis, label='Previous Data')
    plt.plot(np.arange(start_point-2,end_point),predictions[start_point-2:end_point],color='green', label='Prediction')
    plt.legend(labels = ('Previous value', 'Forecasting ')) 
    plt.savefig(deviceID+'.jpg')# generate jpg image
    plt.show()


# NON STATIONARY FUNCTION

def nonStationaryTimeSeries(yaxis,deviceID):
    warnings.filterwarnings("ignore")
    # Split data for training and testing
    train = yaxis[:80]
    test = yaxis[80:]
    
    checkRolling(train,test,yaxis,deviceID)
    
def checkRolling(train,test,yaxis,deviceID):
    series = read_csv('temperatureFile.csv', header=0, index_col=0, squeeze=True)
    #log
    ts_log = np.log(series) # apply log to make stationary
    
    #Decomposition
    decomposition = seasonal_decompose(ts_log,freq=1,model = 'multiplicative')

    trend = decomposition.trend
    seasonal = decomposition.seasonal
    residual = decomposition.resid
    ts_log_diff=ts_log.dropna()
    
    stepwise_fit = auto_arima(ts_log_diff, start_p = 1, start_q = 1,
                          max_p = 3, max_q = 3, m = 12,
                          start_P = 0, seasonal = True,
                          d = None, D = 1, trace = True,
                          error_action ='ignore',   # we don't want to know if an order does not work
                          suppress_warnings = True,  # we don't want convergence warnings
                          stepwise = True)
    stepwise_fit.summary()
    
    model = SARIMAX(train, 
                order = stepwise_fit.order, 
                seasonal_order =stepwise_fit.seasonal_order)

    result = model.fit()
    result.summary()
  
    # length of prediction graph
    start_point = len(yaxis)
    end_point = len(yaxis) +int(len(yaxis)/4) # maximum prediction duration
    
    # Prediction graph merge with existing data
    predictions = result.predict(0, end_point)
    plt.figure(figsize=(16,7)) # figure size
    font1 = {'family':'serif','size':15} # font size
    font2 = {'family':'serif','size':15} # font size
    plt.title("Forecasting", fontdict = font1) # title
    plt.ylabel("Temperature", fontdict = font2) # label
    plt.plot(yaxis, label='Previous Data')
    plt.plot(np.arange(start_point-2,end_point),predictions[start_point-2:end_point],color='green', label='Prediction')
    plt.legend(labels = ('Previous value', 'Forecasting ')) 
    plt.savefig(deviceID+'.jpg')# generate jpg image
    plt.show()



forecast(dataSet,"123434")# here 123434 is dummy device id