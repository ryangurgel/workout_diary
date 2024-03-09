// modals.js

// Função para abrir ou fechar o modal de adicionar exercício
function toggleAddExerciseModal(action) {
    const modal = document.getElementById('addExerciseModal');
    if (action === 'open') {
        modal.classList.add('show');
        modal.style.display = 'block';
    } else if (action === 'close') {
        modal.classList.remove('show');
        modal.style.display = 'none';
    }
}


// Função para lidar com a submissão do formulário de adicionar exercício
async function submitAddExercise(currentUserID) {
    const novoExercicioInput = document.querySelector('#add-exercise-form input[name="exercicio"]');
    const novoExercicio = novoExercicioInput.value;

    // Verifica se o nome do exercício foi preenchido
    if (novoExercicio) {
        try {
            const formattedDate = currentDate.format('YYYY-MM-DD');
            const trainingLogsRef = database.ref(`users/${currentUserID}/trainingLogs/${formattedDate}`);

            // Verifica se o usuário já possui logs de treinamento para a data atual
            const snapshot = await trainingLogsRef.once('value');
            const data = snapshot.val();

            if (data) {
                // O usuário já possui logs de treinamento
                if (data.exercises) {
                    // Adiciona o novo exercício aos logs existentes
                    data.exercises.push({ name: novoExercicio });
                } else {
                    // Cria uma lista de exercícios com o novo exercício
                    data.exercises = [{ name: novoExercicio }];
                }

                // Atualiza os logs de treinamento no banco de dados
                await trainingLogsRef.set(data);
                console.log('Novo exercício adicionado com sucesso.');
            } else {
                // O usuário ainda não possui logs de treinamento para a data atual
                const newData = {
                    exercises: [{ name: novoExercicio, sets: [] }]
                };

                // Cria um novo log de treinamento para a data atual
                await trainingLogsRef.set(newData);
                console.log('Novo treino criado com sucesso.');
            }

            // Fechar o modal após enviar os dados
            closeAddExerciseModal();

            // Atualiza o HTML com os exercícios formatados
            fetchExercises(currentUserID);

            // Limpar o campo de entrada após o envio
            novoExercicioInput.value = '';
        } catch (error) {
            console.error('Erro ao adicionar novo exercício:', error);
        }
    } else {
        console.error('Preencha o nome do exercício antes de adicionar.');
    }
}





// Função para abrir o modal de detalhes do exercício
function viewExerciseDetails(exercise) {
    const modal = document.getElementById('exerciseDetailsModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    // Preencher o campo de entrada "Editar Nome do Exercício" com o nome do exercício
    document.getElementById('editarNomeExercicio').value = exercise;

    // Armazenar o nome do exercício no próprio modal
    modal.dataset.exercicio = exercise;
}


// Função para fechar o modal de detalhes do exercício
function closeExerciseDetailsModal() {
    const modal = document.getElementById('exerciseDetailsModal');
    modal.classList.remove('show');
    modal.style.display = 'none';
}

// Função para deletar o exercício
async function deleteExercise(currentUserID) {
    const modal = document.getElementById('exerciseDetailsModal');
    const exercicio = modal.dataset.exercicio;

    try {
        const formattedDate = currentDate.format('YYYY-MM-DD');
        const snapshot = await database.ref(`users/${currentUserID}/trainingLogs/${formattedDate}/exercises`).once('value');
        const exercises = snapshot.val();

        if (exercises) {
            let exerciseFound = false;
            exercises.forEach((exercise, index) => {
                if (exercise.name === exercicio) {
                    exerciseFound = true;
                    exercises.splice(index, 1); // Remove o exercício da matriz
                    return;
                }
            });

            if (exerciseFound) {
                await database.ref(`users/${currentUserID}/trainingLogs/${formattedDate}/exercises`).set(exercises);
                console.log(`Exercício "${exercicio}" deletado com sucesso.`);
                closeExerciseDetailsModal();
            } else {
                console.error('Exercício não encontrado para exclusão.');
            }
        } else {
            console.error('Nenhum exercício encontrado para exclusão.');
        }
    } catch (error) {
        console.error('Erro ao excluir o exercício:', error);
    }
}


// Função para submeter as alterações no nome do exercício
async function submitEditedExercise(currentUserID) {
    const modal = document.getElementById('exerciseDetailsModal');
    const newName = document.getElementById('editarNomeExercicio').value;
    const oldName = modal.dataset.exercicio;

    try {
        
        
        const formattedDate = currentDate.format('YYYY-MM-DD');
        

        const snapshot = await database.ref(`users/${currentUserID}/trainingLogs/${formattedDate}/exercises`).once('value');
        

        const exercises = snapshot.val();
        

        if (exercises) {
            let exerciseFound = false;
            exercises.forEach((exercise, index) => {
                if (exercise.name === oldName) {
                    exerciseFound = true;
                    
                    
                    // Atualiza o nome do exercício
                    exercise.name = newName;

                    // Atualiza o exercício no banco de dados
                    exercises[index] = exercise;
                    return;
                }
            });

            if (exerciseFound) {
                await database.ref(`users/${currentUserID}/trainingLogs/${formattedDate}/exercises`).set(exercises);
                console.log(`Nome do exercício atualizado para "${newName}" com sucesso.`);
                closeExerciseDetailsModal();
            } else {
                console.error('Exercício não encontrado para edição.');
            }
        } else {
            console.error('Nenhum exercício encontrado para edição.');
        }
    } catch (error) {
        console.error('Erro ao atualizar o nome do exercício:', error);
    }
}









// Função para abrir ou fechar o modal de edição
function toggleEditModal(action, exerciseId) {
    const modal = document.getElementById('editModal');
    const exerciseData = exerciseDataMap.get(exerciseId);

    if (action === 'open') {
        modal.classList.add('show');
        modal.style.display = 'block';

        // Preencher os campos de entrada do formulário com os valores atuais
        const form = document.getElementById('edit-form');
        const cargaInput = form.querySelector('input[name="carga"]');
        const repeticoesInput = form.querySelector('input[name="repeticoes"]');
        const percepcaoInput = form.querySelector('input[name="percepcao"]');

        // Armazenar o nome do exercício e o número da série no próprio modal
        modal.dataset.exercicio = exerciseData.exercicioNome;
        modal.dataset.serie = exerciseData.numeroSerie;

        cargaInput.value = exerciseData.cargaAtual;
        repeticoesInput.value = exerciseData.repeticoesAtual;
        percepcaoInput.value = exerciseData.percepcaoAtual;

        
    } else if (action === 'close') {
        modal.classList.remove('show');
        modal.style.display = 'none';
    }
}


// Função para submeter a edição da série
async function submitEdit(currentUserID) {
    // Recupera os valores dos campos do modal de edição
    const modal = document.getElementById('editModal');
    const exercicio = modal.dataset.exercicio;
    const serie = parseInt(modal.dataset.serie);
    const carga = parseFloat(document.querySelector('#edit-form input[name="carga"]').value);
    const repeticoes = parseInt(document.querySelector('#edit-form input[name="repeticoes"]').value);
    const percepcao = parseInt(document.querySelector('#edit-form input[name="percepcao"]').value);

    // Atualiza os dados no banco de dados Firebase
    const formattedDate = currentDate.format('YYYY-MM-DD');

    // Verifica se todos os campos do formulário estão preenchidos
    if (exercicio && carga && repeticoes && percepcao) {
        try {
            const snapshot = await database.ref(`users/${currentUserID}/trainingLogs/${formattedDate}`).once('value');
            const exercicios = snapshot.val();
            if (exercicios) {
                for (const exercicioKey in exercicios.exercises) {
                    if (exercicios.exercises[exercicioKey].name === exercicio) {
                        const series = exercicios.exercises[exercicioKey].sets;
                        if (series && serie >= 0 && serie < series.length) {
                            const serieToUpdate = series[serie];
                            if (serieToUpdate) {
                                // Atualiza os dados da série no banco de dados
                                serieToUpdate.load = carga;
                                serieToUpdate.repetitions = repeticoes;
                                serieToUpdate.perception = percepcao;
                
                                await database.ref(`users/${currentUserID}/trainingLogs/${formattedDate}/exercises/${exercicioKey}/sets/${serie}`).set(serieToUpdate);
                                console.log('Dados atualizados com sucesso.');
                                // Fechar o modal após enviar os dados
                                toggleEditModal('close');
                            } else {
                                console.error('Série não encontrada.');
                            }
                        } else {
                            console.error('Série inválida.');
                        }
                        break;
                    }
                }                
            } else {
                console.error('Nenhum exercício encontrado para esta data.');
            }
        } catch (error) {
            console.error('Erro ao atualizar dados no banco de dados:', error);
        }
    } else {
        console.error('Preencha todos os campos antes de atualizar.');
    }
}

// Função para excluir série
async function deleteSeries(currentUserID) {
    const modal = document.getElementById('editModal');
    const exercicio = modal.dataset.exercicio;
    const serie = parseInt(modal.dataset.serie);

    try {
        const formattedDate = currentDate.format('YYYY-MM-DD');
        const snapshot = await database.ref(`users/${currentUserID}/trainingLogs/${formattedDate}`).once('value');
        let data = snapshot.val();

        if (data && data.exercises) {
            const exerciseToUpdate = data.exercises.find(exercise => exercise.name === exercicio);

            if (exerciseToUpdate && exerciseToUpdate.sets.length > serie) {
                exerciseToUpdate.sets.splice(serie, 1); // Remove a série do array

                // Reordenar os números de série
                exerciseToUpdate.sets.forEach((set, index) => {
                    set.setNumber = index;
                });

                await database.ref(`users/${currentUserID}/trainingLogs/${formattedDate}`).set(data);
                console.log('Série excluída com sucesso.');
                // Fechar o modal após excluir a série
                closeEditModal();
            } else {
                console.error('Série não encontrada.');
            }
        } else {
            console.error('Nenhum exercício encontrado para esta data.');
        }
    } catch (error) {
        console.error('Erro ao excluir série:', error);
    }
}









// Função para abrir o modal de adição de série
function openAddSeriesModal(exercicioNome) {
    const modal = document.getElementById('addSeriesModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    // Armazenar o nome do exercício no próprio modal
    modal.dataset.exercicio = exercicioNome;
}

// Função para fechar o modal de adição de série
function closeAddSeriesModal() {
    const modal = document.getElementById('addSeriesModal');
    modal.classList.remove('show');
    modal.style.display = 'none';
}

// Função para limpar os campos do formulário
function clearFormFields() {
    document.querySelector('#add-series-form input[name="carga"]').value = '';
    document.querySelector('#add-series-form input[name="repeticoes"]').value = '';
    document.querySelector('#add-series-form input[name="percepcao"]').value = '';
}

// Função para submeter a adição de série
async function submitAddSeries(currentUserID) {
    // Recupera o nome do exercício do modal
    const modal = document.getElementById('addSeriesModal');
    const exercicio = modal.dataset.exercicio;

    // Recupera os valores dos inputs do formulário de adicionar série
    const carga = parseFloat(document.querySelector('#add-series-form input[name="carga"]').value);
    const repeticoes = parseInt(document.querySelector('#add-series-form input[name="repeticoes"]').value);
    const percepcao = parseInt(document.querySelector('#add-series-form input[name="percepcao"]').value);

    // Verifica se todos os campos do formulário estão preenchidos
    if (exercicio && carga && repeticoes && percepcao) {
        try {
            const formattedDate = currentDate.format('YYYY-MM-DD');
            const snapshot = await database.ref(`users/${currentUserID}/trainingLogs/${formattedDate}`).once('value');
            let data = snapshot.val();

            if (data && data.exercises) {
                let exerciseToUpdate = data.exercises.find(exercise => exercise.name === exercicio);

                if (!exerciseToUpdate) {
                    // Se o exercício não existe, cria-se um novo
                    exerciseToUpdate = {
                        name: exercicio,
                        sets: []
                    };
                    data.exercises.push(exerciseToUpdate);
                }

                // Verifica se 'sets' está definido
                if (!exerciseToUpdate.sets) {
                    exerciseToUpdate.sets = []; // Inicializa como um array vazio
                }

                // Encontrando ou criando o próximo número de série
                const nextSetNumber = exerciseToUpdate.sets.length > 0 ? Math.max(...exerciseToUpdate.sets.map(set => set.setNumber)) + 1 : 0;

                // Criando a nova série
                const newSet = {
                    load: carga,
                    repetitions: repeticoes,
                    perception: percepcao,
                    setNumber: nextSetNumber
                };

                // Adicionando a nova série ao exercício
                exerciseToUpdate.sets.push(newSet);

                // Atualizando os dados no banco de dados
                await database.ref(`users/${currentUserID}/trainingLogs/${formattedDate}`).set(data);
                console.log('Nova série adicionada com sucesso.');
                // Fechar o modal após enviar os dados

                clearFormFields();

                closeAddSeriesModal();
                // Atualiza o HTML com os exercícios formatados
                fetchExercises(currentUserID);
            } else {
                console.error('Nenhum exercício encontrado para esta data.');
            }
        } catch (error) {
            console.error('Erro ao adicionar nova série:', error);
        }
    } else {
        console.error('Preencha todos os campos antes de adicionar a série.');
    }
}



