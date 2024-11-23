// Captura o evento de envio do formulário
document.getElementById('mlForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita o recarregamento da página
  
    const productUrl = document.getElementById('productUrl').value;
  
    try {
        // Faz uma requisição para a API /api/comentarios_ml para buscar os comentários
        const response = await fetch('/api/comentarios_ml', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ product_url: productUrl }),
        });
    
        if (!response.ok) {
          throw new Error('Erro ao buscar os comentários da API /api/comentarios_ml.');
        }
    
        const data = await response.json();
        const comments = data.comments; // Obtém a lista de comentários
    
        // Lista para exibir os resultados no front-end
        let num = 0
        const commentsTable = document.getElementById('commentsTable');
    
        for (const comment of comments) {
          num = num + 1;
          
          // Criando uma nova linha
          const cTableRow = document.createElement('tr');
          const idRow = "linha_".concat(num.toString());
          cTableRow.setAttribute("id", idRow);

          // Criando as células: Id
          const cTableId = document.createElement('td');
          const idId = "id_".concat(num.toString());
          cTableId.setAttribute("id", idId);
          cTableId.textContent = num.toString();

          // Criando as células: Comentario
          const cTableComentario = document.createElement('td');
          const idComentario = "comentario_".concat(num.toString());
          cTableComentario.setAttribute("id", idComentario);
          cTableComentario.textContent = comment;
          
          // Criando as células: Sentimento
          const cTableSentimento = document.createElement('td');
          const idSentimento = "sentimento_".concat(num.toString());
          cTableSentimento.setAttribute("id", idSentimento);
          cTableSentimento.textContent = "";
          
          // Adicionando células à linha e linha à tabela
          cTableRow.appendChild(cTableId);
          cTableRow.appendChild(cTableComentario);
          cTableRow.appendChild(cTableSentimento);
          commentsTable.appendChild(cTableRow);

          // Faz a análise de sentimentos para cada comentário
          const result = await fetch('/api/analisar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ frase: comment }),
          });

          if (result.ok) {
              const analysis = await result.json();
              cTableSentimento.textContent = analysis.sentimento; // Atualiza com o sentimento retornado
          } else {
              cTableSentimento.textContent = "Erro ao analisar"; // Caso haja erro na análise
          }
        }
      } catch (error) {
        console.error(error);
        alert('Ocorreu um erro ao processar os comentários.');
      }
    });