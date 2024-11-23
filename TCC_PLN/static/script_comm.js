// Captura o evento de submit do formulário
document.getElementById('sentimentoForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Impede o comportamento padrão do formulário

    // Captura a frase digitada
    const frase = document.getElementById('frase').value;

    // Envia a frase para a API Flask usando fetch
    fetch('/api/analisar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ frase: frase })
    })
    .then(response => response.json())
    .then(data => {
        // Exibe o sentimento retornado pela API
        document.getElementById('resultado').textContent = 'sentimento: ' + data.sentimento;
    })
    .catch(error => console.error('Erro:', error));
});