document.getElementById('generateChart').addEventListener('click', () => {
    // Seleciona todas as células da coluna "Sentimento"
    const sentimentCells = document.querySelectorAll('#commentsTable tbody tr td:nth-child(3)');

    // Inicializa um contador para os sentimentos
    const sentimentCounts = {
        Positivo: 0,
        Negativo: 0,
        Neutro: 0,
        Outro: 0 // Para sentimentos não reconhecidos
    };

    // Conta as ocorrências de cada sentimento
    sentimentCells.forEach(cell => {
        const text = cell.textContent.trim(); // Obtém o texto e remove espaços em branco

        // Incrementa os contadores de acordo com o sentimento
        if (text === 'Negativo') {
            sentimentCounts['Negativo']++;
        } else if (text === 'Positivo') {
            sentimentCounts['Positivo']++;
        } else if (text === 'Neutro') {
            sentimentCounts['Neutro']++;
        } else {
            sentimentCounts['Outro']++;
        }
    });


});


document.addEventListener("DOMContentLoaded", function () {
    // Seleciona o botão pelo ID
    const button = document.getElementById("generateChart");

    // Adiciona o evento de clique
    button.addEventListener("click", function () {
        // Seleciona a tabela e suas linhas
        const table = document.getElementById("commentsTable");
        const rows = table.getElementsByTagName("tr");

        // Inicializa um objeto para armazenar as contagens
        const sentimentoCounts = {
            Positivo: 0,
            Negativo: 0,
            Reembolso: 0,
            Melhorias: 0,
            Dúvidas: 0
        };

        // Itera sobre as linhas da tabela (ignora o cabeçalho)
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const sentimentoCell = row.getElementsByTagName("td")[2]; // A terceira célula é a coluna "Sentimento"

            if (sentimentoCell) {
                const sentimento = sentimentoCell.textContent.trim();
                if (sentimentoCounts.hasOwnProperty(sentimento)) {
                    sentimentoCounts[sentimento]++;
                }
            }
        }
            
        // Exibindo os dados no console para debug
        console.log(sentimentoCounts);

        // Preparando os dados para o gráfico
        const labels = Object.keys(sentimentoCounts);
        const data = Object.values(sentimentoCounts);

        // Exibindo o gráfico usando Chart.js
        const ctx = document.getElementById('sentimentChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Quantidade/Sentimentos',
                    data: data,
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)', // Positivo
                        'rgba(255, 99, 132, 0.6)', // Negativo
                        'rgba(255, 206, 86, 0.6)', // Reembolso
                        'rgba(201, 203, 207, 0.6)', // Melhorias
                        'rgba(54, 162, 235, 0.6)'  // Dúvidas
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(201, 203, 207, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false, // Desativa o comportamento responsivo
                maintainAspectRatio: false, // Permite usar as dimensões do canvas definidas no HTML
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    });
});
