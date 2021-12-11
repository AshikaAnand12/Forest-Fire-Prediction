import uvicorn
import pickle
import sklearn
import pandas as pd
from fastapi import FastAPI, Response

with open('model.pickle','rb') as f:
    model = pickle.load(f)

app = FastAPI()

@app.get('/')
def index():
    return {'message': 'Forest Fire Prediction'}

@app.get('/predict/')
def predict(lat: float, lon: float, month:int , response: Response):
    fields = ["latitude","longitude","scan","frp", "month"]
    feature_1 = lat
    feature_2 = lon
    feature_3 = 1.569980
    feature_4 = 40.864432
    feature_5 = month
    df=pd.DataFrame([[feature_1,feature_2,feature_3,feature_4,feature_5]],columns=fields)
    response.headers['Access-Control-Allow-Origin']= "*"
    return {'output': model.predict(df).tolist()}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=80)
