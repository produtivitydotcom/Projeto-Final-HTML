function usuarioLogado() {
  try {
    return JSON.parse(localStorage.getItem('arcade_usuario'));
  } catch (e) {
    return null;
  }
}

function iniciarLogin() {
  // Se já existe um usuário logado, vai direto para o perfil
  if (usuarioLogado()) {
    window.location.href = 'perfil.html';
    return;
  }

  const form = document.getElementById('form-login');
  const erro = document.getElementById('login-erro');

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const nome = document.getElementById('campo-nome').value.trim();
    const email = document.getElementById('campo-email').value.trim();

    if (!nome || !email) {
      erro.style.display = 'block';
      return;
    }

    localStorage.setItem('arcade_usuario', JSON.stringify({ nome, email }));
    window.location.href = 'perfil.html';
  });
}

iniciarLogin();
