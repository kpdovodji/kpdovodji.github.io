# -*- coding: utf-8 -*-
"""
Created on Fri Apr 12 03:34:17 2024

@author: Admin
"""

import pandas as pd
import missingno as nano
import matplotlib.pyplot as plt
from datetime import datetime

url="data.csv"
df = pd.read_csv(url, sep=";")


""""Les fonctions"""

def phone(nombre):
    try: 
        nombre_inverse = str(nombre)[::-1]
        return int(nombre_inverse)
    except ValueError:
        pass
    


"""Inspection des données"""
print(df.head())
print(df.info())

df.rename(columns={df.columns[29]: 'Bookings number'}, inplace=True)


# Concervation des variable a utiliser
variables = ['Phone','Guest Status', 'Email optin market',
       'SMS optin market', 'Mail optin review',
       'SMS optin review','Has no show', 
       'Bookings number',
       'Updated at', 'Created at']
df = df[variables]

# Conversion des types des varibles
df['Updated at'] = pd.to_datetime(df['Updated at'])
df['Created at'] = pd.to_datetime(df['Created at'])
df['Phone'] = [phone(row) for row in df['Phone']]

#Creation de la  colone date 
df['Date'] = pd.to_datetime([row.date() for row in df['Created at']])

print(df.head())
print(df.info())
#df[[ 'Guest Status','Email optin market', 'SMS optin market', 'Mail optin review','SMS optin review','Has no show']].describe()

counts = df['Guest Status'].value_counts()

# Création du bar plot
plt.figure(figsize=(8, 6))
counts.plot(kind='bar', color='skyblue')
plt.xlabel('Guest Status')
plt.ylabel('Nombre d\'occurrences')
plt.title('Distribution des catégories')
plt.xticks(rotation=0)  # Rotation des étiquettes de l'axe des x si nécessaire
plt.grid(axis='y', linestyle='--', alpha=0.7)  # Ajout d'une grille
plt.tight_layout()  # Ajustement automatique de la mise en page
plt.show()
""" Valeurs manquants """