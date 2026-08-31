let filmeAtual = null;

// Função para converter links padrões do YouTube/Archive para formato Embed
function formatarUrlEmbed(url) {
  if (!url) return '';
  if (url.includes('youtube.com/watch?v=')) {
    return url.replace('watch?v=', 'embed/') + '?autoplay=1';
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1`;
  }
  return url;
}

async function carregarDetalhesFilme() {
  const urlParams = new URLSearchParams(window.location.search);
  const idFilme = urlParams.get('id');

  try {
    const resposta = await fetch('dados/filmes.json');
    const filmes = await resposta.json();

    filmeAtual = filmes.find(f => String(f.id) === String(idFilme)) || filmes[0];

    if (!filmeAtual) return;

    document.getElementById('filme-capa').src = filmeAtual.capa || '';
    document.getElementById('filme-capa').alt = filmeAtual.titulo || 'Filme';
    document.getElementById('filme-titulo').innerText = filmeAtual.titulo || 'Sem Título';
    document.getElementById('filme-genero').innerText = filmeAtual.genero || 'Gênero';
    document.getElementById('filme-pais').innerText = filmeAtual.pais || 'Internacional';
    document.getElementById('filme-ano').innerText = filmeAtual.ano || 'Clássico';
    
    document.getElementById('filme-sinopse').innerText = filmeAtual.sinopse || 
      `Acompanhe a obra clássica "${filmeAtual.titulo}", um importante marco do cinema.`;

    document.getElementById('btn-assistir-agora').href = `player.html?id=${filmeAtual.id}`;

    // Lógica do Modal de Trailer (Lê a propriedade "trailer" ou "link")
    const btnTrailer = document.getElementById('btn-trailer');
    const linkTrailer = filmeAtual.trailer || filmeAtual.link;

    if (linkTrailer) {
      btnTrailer.style.display = 'inline-flex';
      btnTrailer.onclick = () => abrirTrailer(linkTrailer);
    } else {
      btnTrailer.style.display = 'none';
    }

    registrarNoHistorico(filmeAtual);
    atualizarEstadoBotoes();

  } catch (erro) {
    console.error("Erro ao carregar dados do filme:", erro);
  }
}

function abrirTrailer(link) {
  const modal = document.getElementById('modal-trailer');
  const iframe = document.getElementById('iframe-trailer');
  iframe.src = formatarUrlEmbed(link);
  modal.style.display = 'flex';
}

function fecharTrailer() {
  const modal = document.getElementById('modal-trailer');
  const iframe = document.getElementById('iframe-trailer');
  iframe.src = ''; // Limpa o src para parar o áudio do vídeo
  modal.style.display = 'none';
}

document.getElementById('btn-fechar-modal').addEventListener('click', fecharTrailer);
document.getElementById('modal-trailer').addEventListener('click', (e) => {
  if (e.target.id === 'modal-trailer') fecharTrailer();
});

function registrarNoHistorico(filme) {
  if (!filme || !filme.id) return;
  let historico = JSON.parse(localStorage.getItem('arcade_historico')) || [];
  historico = historico.filter(f => String(f.id) !== String(filme.id));
  historico.unshift(filme);
  localStorage.setItem('arcade_historico', JSON.stringify(historico));
}

function alternarLista(chave) {
  if (!filmeAtual || !filmeAtual.id) return;

  let lista = JSON.parse(localStorage.getItem('arcade_' + chave)) || [];
  const existeIndex = lista.findIndex(f => String(f.id) === String(filmeAtual.id));

  if (existeIndex !== -1) {
    lista.splice(existeIndex, 1);
  } else {
    lista.push(filmeAtual);
  }

  localStorage.setItem('arcade_' + chave, JSON.stringify(lista));
  atualizarEstadoBotoes();
}

function atualizarEstadoBotoes() {
  if (!filmeAtual) return;

  const favoritos = JSON.parse(localStorage.getItem('arcade_favoritos')) || [];
  const depois = JSON.parse(localStorage.getItem('arcade_assistirDepois')) || [];

  const ehFavorito = favoritos.some(f => String(f.id) === String(filmeAtual.id));
  const ehDepois = depois.some(f => String(f.id) === String(filmeAtual.id));

  const btnFav = document.getElementById('btn-favorito');
  const btnDep = document.getElementById('btn-depois');

  if (ehFavorito) {
    btnFav.classList.add('ativo');
    btnFav.innerText = '❤️ Nos Favoritos';
  } else {
    btnFav.classList.remove('ativo');
    btnFav.innerText = '❤️ Favoritos';
  }

  if (ehDepois) {
    btnDep.classList.add('ativo');
    btnDep.innerText = '🔖 Salvo p/ Depois';
  } else {
    btnDep.classList.remove('ativo');
    btnDep.innerText = '🔖 Assistir Depois';
  }
}

document.getElementById('btn-favorito').addEventListener('click', () => alternarLista('favoritos'));
document.getElementById('btn-depois').addEventListener('click', () => alternarLista('assistirDepois'));

carregarDetalhesFilme();