// Arquivo: register.js

// Inicializa o Firebase Authentication
const auth = firebase.auth();
const database = firebase.database(); // Inicializa o Firebase Database

// Função para lidar com o envio do formulário de registro
document.getElementById('register-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Impede o envio padrão do formulário

  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  // Chama a função para registrar o novo usuário
  registerUserWithEmailAndPassword(email, password);
});

// Função para registrar um novo usuário com email/senha
async function registerUserWithEmailAndPassword(email, password) {
  try {
    // Tenta criar o usuário
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    // Registro bem-sucedido
    const user = userCredential.user;
    console.log("Novo usuário registrado:", user);

    // Obter o ID do usuário recém-criado
    const userID = user.uid;
    console.log("UserID:", userID);

    // Criar o usuário no banco de dados com o ID e o email do usuário
    await database.ref(`users/${userID}`).set({ email: email });
    console.log("Usuário adicionado ao banco de dados com sucesso.");

    // Redirecionar o usuário para a página principal, por exemplo
    window.location.href = "index.html"; // Redireciona para a página principal após o registro
  } catch (error) {
    // Tratar erros de registro
    if (error.code === "auth/email-already-in-use") {
      console.error("O endereço de e-mail já está em uso por outra conta.");
      // Exibir mensagem ao usuário informando que o endereço de e-mail já está em uso
    } else {
      console.error("Erro ao registrar novo usuário:", error.code, error.message);
      // Exibir mensagem de erro ao usuário, se necessário
    }
  }
}


