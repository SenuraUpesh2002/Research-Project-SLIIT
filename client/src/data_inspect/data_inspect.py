import pandas as pd

data = pd.read_csv('FuelConsumption.csv')

print(data.head())

print(data.isnull().sum())