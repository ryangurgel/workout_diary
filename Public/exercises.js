// exercises.js

const EXERCISES_CONTAINER_ID = 'exercises';
const NOTE_CONTAINER_ID = 'note';

const exercisesContainer = document.getElementById(EXERCISES_CONTAINER_ID);
const database = firebase.database();

// Função assíncrona para buscar os exercícios do usuário no banco de dados Firebase
async function fetchExercises(userId) {
    try {
        const formattedDate = currentDate.format('YYYY-MM-DD');
        const snapshot = await database.ref(`users/${userId}/trainingLogs/${formattedDate}`).once('value');
        const data = snapshot.val();

        if (!data || !data.exercises) {
            updateExerciseDisplay([]); // Se não houver dados ou exercícios, atualiza o display com uma matriz vazia
            return;
        }

        updateExerciseDisplay(data.exercises);

        // Adiciona um ouvinte de eventos para atualizar dinamicamente a interface do usuário
        database.ref(`users/${userId}/trainingLogs/${formattedDate}`).on('value', snapshot => {
            const newData = snapshot.val();
            if (!newData || !newData.exercises) {
                updateExerciseDisplay([]); // Se não houver novos dados ou exercícios, atualiza o display com uma matriz vazia
                return;
            }
            updateExerciseDisplay(newData.exercises);
        });
    } catch (error) {
        console.error('Erro ao buscar dados do banco de dados:', error);
        exercisesContainer.innerHTML = 'Erro ao buscar dados do banco de dados.';
    }
}



// Função para atualizar o HTML com os exercícios formatados
function updateExerciseDisplay(exercises) {
    if (!exercises || exercises.length === 0) {
        exercisesContainer.innerHTML = '<p>Nenhum treino encontrado para esta data.</p>';

        // Adicionar o botão "Adicionar Exercício" apenas quando nenhum treino for encontrado
        exercisesContainer.innerHTML += `<div class="add-exercise-container">
                                            <button class="btn btn-primary add-exercise-btn" onclick="toggleAddExerciseModal('open')">Adicionar Exercício</button>
                                        </div>`;
        return;
    }

    exercisesContainer.innerHTML = formatExercises(exercises);
}

const exerciseDataMap = new Map();
function formatExercises(exercises) {
    let exerciseIndex = 0;

    return exercises.map((exercise) => {
        const { name, sets } = exercise;
        const setsHtml = sets ? sets.map(({ setNumber, load, repetitions, perception }) => {
            const exerciseId = `exercise_${exerciseIndex++}`;
            const exerciseData = {
                exercicioNome: name,
                numeroSerie: setNumber,
                cargaAtual: load,
                repeticoesAtual: repetitions,
                percepcaoAtual: perception
            };
            exerciseDataMap.set(exerciseId, exerciseData);

            return `<div class="serie-container">
                        <div class="serie-info">
                            <p>Carga: ${load}, Repetições: ${repetitions}, Percepção: ${perception}</p>
                        </div>
                        <div class="edit-button-container">
                            <button class="btn btn-primary" onclick="toggleEditModal('open','${exerciseId}')">Editar</button>
                        </div>
                    </div>`;
        }).join('') : '';

        // Inclui o botão "Detalhes do Exercício" junto com o nome do exercício
        const exerciseContainer = `
            <div class="exercise">
                <div class="exercise-header">
                    <h3>${name}</h3>
                    <button class="btn btn-primary view-exercise-btn" onclick="viewExerciseDetails('${name}')">Detalhes do Exercício</button>
                </div>
                ${setsHtml}
                <div class="add-series-container">
                    <button class="btn btn-secondary add-series-btn" data-exercicio="${name}" onclick="openAddSeriesModal('${name}')">Adicionar Série</button>
                </div>
            </div>
        `;

        return exerciseContainer;
    }).join('') +
    // Adiciona o botão de adicionar exercício
    `<div class="add-exercise-container">
        <button class="btn btn-primary add-exercise-btn" onclick="toggleAddExerciseModal()">Adicionar Exercício</button>
    </div>`;
}
