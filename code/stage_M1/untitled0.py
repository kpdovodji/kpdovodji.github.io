# -*- coding: utf-8 -*-
"""
Created on Tue Apr  9 00:56:19 2024

@author: Admin
"""
import pandas as pd
import missingno as nano
import matplotlib.pyplot as plt
from datetime import datetime

url="data.csv"
df = pd.read_csv(url, sep=";")
#print(df.info())
#print(df.isnull().sum())
print(df.isna().sum())


nano.bar(df)
plt.show()


nano.matrix(df)
plt.show()
