// Variáveis para armazenar os dados e os filtros ativos
let todosOsFilmes = [];
let filtroPaisAtivo = 'Todos';
let filtroGeneroAtivo = 'Todos';
let termoBusca = '';

async function carregarCatalogo() {
  try {
    // 1. Busca os dados na pasta 'dados/'
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

// Altera o filtro de País ao clicar no botão
function filtrarPorPais(pais) {
  filtroPaisAtivo = pais;
  montarFiltros();     // Atualiza a cor/destaque do botão ativo
  renderizarFilmes();  // Atualiza a grade com a nova filtragem
}

// Altera o filtro de Gênero ao clicar no botão
function filtrarPorGenero(genero) {
  filtroGeneroAtivo = genero;
  montarFiltros();     // Atualiza a cor/destaque do botão ativo
  renderizarFilmes();  // Atualiza a grade com a nova filtragem
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

  // Renderiza os filmes filtrados na grade
  grade.innerHTML = filmesFiltrados.map(filme => `
    <div class="card-filme">
      <img src="${filme.capa}" alt="${filme.titulo}">
      <div class="card-filme-info">
        <h3>${filme.titulo}</h3>
        <span class="meta">${filme.genero} • ${filme.pais}</span>
      </div>
    </div>
  `).join('');
}

// Executa a carga do catálogo ao abrir a página
carregarCatalogo();