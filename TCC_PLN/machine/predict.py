import joblib
vectorizer = joblib.load('machine/models/rbf_vectorizer.pkl')
modelo = joblib.load('machine/models/rbf_modelo_treinado_svc.pkl')
stopwords = joblib.load('machine/models/rbf_stopwords.pkl')

from nltk.tokenize import word_tokenize
import numpy as np
def rem_stopwords(text):
  words = word_tokenize(text.lower())
  return [w for w in words if w not in stopwords]

def text_process(meuTexto):
    meuTexto = [meuTexto]
    meuTexto = [" ".join(rem_stopwords(text)) for text in meuTexto]
    meuTexto_tfidf = vectorizer.transform(meuTexto).toarray()

    y_pred_new = modelo.predict(np.array(meuTexto_tfidf[0]).reshape(1, -1))
    return y_pred_new