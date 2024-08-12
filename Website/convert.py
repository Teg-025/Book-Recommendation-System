import pickle
import json
import pandas as pd
import numpy as np


def load_and_save_pickle(file_name, output_name):
    with open(file_name, 'rb') as file:
        data = pickle.load(file)

    # If the loaded data is a pandas DataFrame or Series, convert it to a dictionary
    if isinstance(data, pd.DataFrame) or isinstance(data, pd.Series):
        data = data.to_dict(orient='list')

    # If the loaded data is a numpy ndarray, convert it to a list
    elif isinstance(data, np.ndarray):
        data = data.tolist()

    with open(output_name, 'w') as outfile:
        json.dump(data, outfile)


# Convert your pickle files to JSON
load_and_save_pickle('data/popular.pkl', 'data/popular1.json')
load_and_save_pickle('data/pt.pkl', 'data/pt1.json')
load_and_save_pickle('data/books.pkl', 'data/books1.json')
load_and_save_pickle('data/similarity_scores.pkl', 'data/similarity_scores1.json')
