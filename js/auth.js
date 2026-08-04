// Lógica de sessão compartilhada por todas as páginas (liga o header ao login/perfil)

function obterUsuario() {
  try {
    return JSON.parse(localStorage.getItem('arcade_usuario'));
  } catch (e) {
    return null;
  }
}

function sairDaConta() {
  localStorage.removeItem('arcade_usuario');
  window.location.href = 'login.html';
}

function atualizarLinkConta() {
  const usuario = obterUsuario();

  document.querySelectorAll('.link-conta').forEach(link => {
    if (usuario && usuario.nome) {
      link.href = 'perfil.html';
      link.textContent = usuario.nome;
    } else {
      link.href = 'login.html';
      link.textContent = 'Entrar';
    }
  });
}

document.addEventListener('DOMContentLoaded', atualizarLinkConta);
