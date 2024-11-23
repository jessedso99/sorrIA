from machine.predict import text_process
from flask import Flask, jsonify, request, render_template
import requests

app = Flask(__name__)

# Página principal com o SentimentoForm
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/analiseml')
def analiseml():
    return render_template('analiseml.html')

# Página para o mlForm
@app.route('/comentarios')
def comentarios():
    return render_template('comentarios.html')

@app.route('/api/analisar', methods=['POST'])
def predict():
    data = request.get_json()
    x_frase = data.get('frase') # Features do modelo

    if not x_frase:
        return jsonify({'error': 'No text provided'}), 400
    else:
        x_sentimento = text_process(x_frase)
        return jsonify({'sentimento': x_sentimento[0]})

@app.route('/api/comentarios_ml', methods=['POST'])
def comentarios_ml():
    data = request.get_json()
    product_url = data.get('product_url')

    # Extraindo o objectId da URL do produto do Mercado Livre
    try:
        object_id = product_url.split('/')[-1]
        object_id = object_id.split('?')[0]  # Remove parâmetros extras
    except IndexError:
        return jsonify({"error": "URL do produto inválida"}), 400

    # Configurando a URL da API de comentários do Mercado Livre
    api_url = f"https://www.mercadolivre.com.br/noindex/catalog/reviews/{object_id}/search"

    # Parâmetros iniciais da requisição
    offset = 0
    limit = 15
    params = {
        "objectId": object_id,
        "siteId": "MLB",
        "isItem": "false",
        "rating": "",
        "order": "",
        "offset": str(offset),
        "limit": str(limit),
        "x-is-webview": "false"
    }

    all_comments = []  # Lista para armazenar todos os comentários

    # Loop para realizar a paginação
    try:
        while True:
            response = requests.get(api_url, params=params)
            if response.status_code == 200:
                data = response.json()
                # Extraindo os comentários do campo "reviews"
                comments = [
                    review.get("comment", {}).get("content", {}).get("text", "")
                    for review in data.get("reviews", [])
                    if review.get("comment", {}).get("content", {}).get("text", "")
                ]

                # Adicionando os comentários extraídos à lista total
                all_comments.extend(comments)

                # Se o número de comentários retornados for menor que o limite, encerra o loop
                if len(comments) < limit:
                    break

                # Incrementa o offset para buscar a próxima página
                offset += limit
                params["offset"] = str(offset)
            else:
                return jsonify({"error": f"Erro ao acessar a API do Mercado Livre: {response.status_code}"}), response.status_code

        return jsonify({"comments": all_comments})

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Erro ao fazer a requisição: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)