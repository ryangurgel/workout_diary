// Arquivo: login.js

// Inicializa o Firebase Authentication
const auth = firebase.auth();

// Função para lidar com o envio do formulário de login
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Impede o envio padrão do formulário

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Chama a função para fazer login
  loginUserWithEmailAndPassword(email, password);
});

// Função para fazer login com email/senha
function loginUserWithEmailAndPassword(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Login bem-sucedido
      const user = userCredential.user;
      console.log("Usuário autenticado:", user);
      // Redirecionar o usuário para a página principal, por exemplo
      window.location.href = "index.html"; // Redireciona para a página principal após o login
    })
    .catch((error) => {
      // Tratar erros de login
      const errorCode = error.code;
      const errorMessage = error.message;
  
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
          // E-mail ou senha incorretos
          console.error("E-mail ou senha incorretos. Por favor, verifique e tente novamente.");
      } else if (errorCode === 'auth/invalid-email') {
          // E-mail inválido
          console.error("E-mail inválido. Por favor, forneça um e-mail válido.");
      } else {
          // Outros erros
          console.error("Erro ao autenticar usuário:", errorMessage);
      }
  
      // Exibir mensagem de erro ao usuário, se necessário
  });  
}
