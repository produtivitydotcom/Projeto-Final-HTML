// Variáveis para armazenar os dados e os filtros ativos
let todosOsFilmes = [];
let filtroPaisAtivo = 'Todos';
let filtroGeneroAtivo = 'Todos';
let termoBusca = '';

async function carregarCatalogo() {
  try {
    // 1. Busca os dados na pasta 'dados/' (Ajuste o caminho se filmes.json estiver na raiz)
    const resposta = await fetch('dados/filmes.json');
    todosOsFilmes = await resposta.json();

    // 2. Monta os botões de filtros (País e Gênero)
    montarFiltros();

    // 3. Escuta a digitação no campo de busca por título
    const campoBusca = document.getElementById('campo-busca');
    if (campoBusca) {
      campoBusca.addEventListener('input', (e) => {
        termoBusca = e.target.value.toLowerCase();
        renderizarFilmes();
      });
    }

    // 4. Renderiza os filmes na tela inicialmente
    renderizarFilmes();
  } catch (erro) {
    console.error('Erro ao carregar o catálogo de filmes:', erro);
  }
}

// Cria os botões de filtro sem duplicar e adiciona a opção 'Todos'
function montarFiltros() {
  const generos = ['Todos', ...new Set(todosOsFilmes.map(f => f.genero))];
  const paises = ['Todos', ...new Set(todosOsFilmes.map(f => f.pais))];

  // Renderiza os botões de País
  const divPais = document.getElementById('filtros-pais');
  if (divPais) {
    divPais.innerHTML = paises.map(p => `
      <button 
        class="btn-filtro ${p === filtroPaisAtivo ? 'ativo' : ''}" 
        onclick="filtrarPorPais('${p}')">
        ${p}
      </button>
    `).join('');
  }

  // Renderiza os botões de Gênero
  const divGenero = document.getElementById('filtros-genero');
  if (divGenero) {
    divGenero.innerHTML = generos.map(g => `
      <button 
        class="btn-filtro ${g === filtroGeneroAtivo ? 'ativo' : ''}" 
        onclick="filtrarPorGenero('${g}')">
        ${g}
      </button>
    `).join('');
  }
}

// Altera o filtro de País ao clicar no botão e dispara a animação de bandeira
function filtrarPorPais(pais) {
  filtroPaisAtivo = pais;
  montarFiltros();    // Atualiza a cor/destaque do botão ativo
  renderizarFilmes();  // Atualiza a grade com a nova filtragem

  // Dispara o efeito visual temático das cores da bandeira
  dispararAnimacaoPais(pais);
}

// Altera o filtro de Gênero ao clicar no botão e dispara a animação
function filtrarPorGenero(genero) {
  filtroGeneroAtivo = genero;
  montarFiltros();    // Atualiza a cor/destaque do botão ativo
  renderizarFilmes();  // Atualiza a grade com a nova filtragem

  // Dispara o efeito visual temático do gênero
  dispararAnimacaoGenero(genero);
}

// Expõe as funções para garantir o funcionamento com o atributo onclick do HTML
window.filtrarPorPais = filtrarPorPais;
window.filtrarPorGenero = filtrarPorGenero;

// --- ANIMAÇÃO DE GÊNEROS ---
function dispararAnimacaoGenero(genero) {
  if (!genero || genero === 'Todos') return;

  // Normaliza o nome do gênero (ex: "Ficção Científica" -> "ficcao-cientifica")
  const classeGenero = 'efeito-' + genero
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');

  // Cria o overlay temporário na página
  const overlay = document.createElement('div');
  overlay.className = `efeito-genero-overlay ${classeGenero}`;
  document.body.appendChild(overlay);

  // Remove o elemento da tela após 1.2s para manter a aplicação leve
  setTimeout(() => {
    overlay.remove();
  }, 1200);
}

// --- ANIMAÇÃO DE PAÍSES (BANDEIRAS) ---
function dispararAnimacaoPais(pais) {
  if (!pais || pais === 'Todos') return;

  // Normaliza o nome do país (ex: "União Soviética" -> "uniao-sovietica")
  const classePais = 'efeito-' + pais
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');

  // Cria o overlay temporário na página
  const overlay = document.createElement('div');
  overlay.className = `efeito-genero-overlay ${classePais}`;
  document.body.appendChild(overlay);

  // Remove o elemento da tela após 1.2s
  setTimeout(() => {
    overlay.remove();
  }, 1200);
}

// Filtra a lista completa de filmes e desenha os cards na div#grade
function renderizarFilmes() {
  const grade = document.getElementById('grade');
  if (!grade) return;

  // Reinicia a animação CSS dos cards
  grade.style.animation = 'none';
  grade.offsetHeight; // Força o navegador a reiniciar a animação
  grade.style.animation = null;

  // Filtra os filmes de acordo com País, Gênero e Busca por Texto
  const filmesFiltrados = todosOsFilmes.filter(filme => {
    const batePais = filtroPaisAtivo === 'Todos' || filme.pais === filtroPaisAtivo;
    const bateGenero = filtroGeneroAtivo === 'Todos' || filme.genero === filtroGeneroAtivo;
    const bateBusca = filme.titulo.toLowerCase().includes(termoBusca);

    return batePais && bateGenero && bateBusca;
  });

  // Mensagem caso nenhum filme atenda ao filtro
  if (filmesFiltrados.length === 0) {
    grade.innerHTML = `
      <p style="grid-column: 1/-1; color: var(--texto-secundario, #A1A1AA); padding: 20px 0;">
        Nenhum filme encontrado para os filtros selecionados.
      </p>
    `;
    return;
  }

  // Renderiza os filmes na grade direcionando para a página de detalhes (filme.html)
  grade.innerHTML = filmesFiltrados.map(filme => {
    return `
      <a href="filme.html?id=${filme.id}" class="card-filme-link" style="text-decoration: none; color: inherit;">
        <div class="card-filme">
          <img src="${filme.capa}" alt="${filme.titulo}">
          <div class="card-filme-info">
            <h3>${filme.titulo}</h3>
            <span class="meta">${filme.genero} • ${filme.pais}</span>
          </div>
        </div>
      </a>
    `;
  }).join('');
}

// Executa a carga do catálogo ao abrir a página
carregarCatalogo();