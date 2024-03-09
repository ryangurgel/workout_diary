// day.js

let currentDate = dayjs();

// Função para atualizar a exibição da data
function updateDisplay() {
    document.getElementById('currentDate').textContent = currentDate.format('DD/MM/YY');
}

// Adiciona ouvintes de eventos para os botões de navegação de data
document.getElementById('nextDay').addEventListener('click', () => {
    currentDate = currentDate.add(1, 'day');
    updateDisplay(); // Atualiza a exibição da data
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            const userId = user.uid;
            fetchExercises(userId); // Passa o userId como argumento para a função fetchExercises
        }
    });
});

document.getElementById('prevDay').addEventListener('click', () => {
    currentDate = currentDate.subtract(1, 'day');
    updateDisplay(); // Atualiza a exibição da data
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            const userId = user.uid;
            fetchExercises(userId); // Passa o userId como argumento para a função fetchExercises
        }
    });
});

// Chama a função updateDisplay() pela primeira vez para exibir a data inicial
updateDisplay();
