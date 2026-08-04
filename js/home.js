// =========================================================
//  HOME.JS — monta a página inicial a partir do dados.json
// 

// Ponto de partida: busca o arquivo de dados e, quando ele
// chega, chama as funções que desenham a página.
async function iniciar() {
  try {
    const resposta = await fetch("dados/filmes.json");
    const filmes = await resposta.json();   // vira uma lista (array) de filmes

    montarDestaque(filmes);
    montarFileiras(filmes);
  } catch (erro) {
    console.error("Não consegui carregar os filmes:", erro);
  }
}

// ---------------------------------------------------------
//  DESTAQUE (hero): escolhe um filme e desenha o topo grande
// ---------------------------------------------------------
function montarDestaque(filmes) {
  // escolhe o filme em destaque (aqui, "Metropolis").
  // se não achar, usa o primeiro da lista.
  const filme = filmes.find(f => f.id === "metropolis-1927") || filmes[0];

  const destaque = document.getElementById("destaque");

  // usa a imagem de banner como fundo da seção
  destaque.style.backgroundImage = `url('${filme.banner}')`;

  // monta o HTML interno do destaque
  destaque.innerHTML = `
    <div class="destaque-conteudo">
    
      <p class="destaque-eyebrow">${filme.pais} · ${filme.ano} · ${filme.generos.join(", ")}</p>
      <h1 class="destaque-titulo">${filme.titulo}</h1>
      <p class="destaque-sinopse">${filme.sinopse}</p>
      <div class="destaque-botoes">
        <a href="player.html?id=${filme.id}" class="btn btn-principal">Assistir</a>
        <a href="filme.html?id=${filme.id}" class="btn btn-secundario">Mais detalhes</a>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------
//  FILEIRAS: cria várias linhas de filmes por país e gênero
// ---------------------------------------------------------
function montarFileiras(filmes) {
  const container = document.getElementById("fileiras");

  // Cada item define o título da fileira e como filtrar os filmes.
  // "filtro" é uma função que devolve true/false para cada filme.
  const fileiras = [
    { titulo: "Cinema alemão",       filtro: f => f.pais === "Alemanha" },
    { titulo: "Cinema francês",      filtro: f => f.pais === "França" },
    { titulo: "Cinema soviético",    filtro: f => f.pais === "União Soviética" },
    { titulo: "Terror",              filtro: f => f.generos.includes("Terror") },
    { titulo: "Ficção científica",   filtro: f => f.generos.includes("Ficção Científica") },
    { titulo: "Drama",               filtro: f => f.generos.includes("Drama") },
  ];

  // para cada fileira da lista acima...
  fileiras.forEach(item => {
    const selecionados = filmes.filter(item.filtro);

    // se não houver filme nessa categoria, pula
    if (selecionados.length === 0) return;

    container.appendChild(criarFileira(item.titulo, selecionados));
  });
}

// cria UMA fileira (título + lista de cards) e devolve o elemento pronto
function criarFileira(titulo, filmes) {
  const secao = document.createElement("section");
  secao.className = "fileira";

  // junta todos os cards num texto só e coloca dentro da lista
  const cards = filmes.map(criarCard).join("");

  secao.innerHTML = `
    <h2 class="fileira-titulo">${titulo}</h2>
    <div class="fileira-lista">${cards}</div>
  `;

  return secao;
}

// cria o HTML de UM card de filme (como texto)
function criarCard(filme) {
  return `
    <a class="card" href="filme.html?id=${filme.id}">
      <img class="card-capa" src="${filme.capa}" alt="Capa de ${filme.titulo}">
      <div class="card-info">
        <p class="card-titulo">${filme.titulo}</p>
        <p class="card-meta">${filme.pais} · ${filme.ano}</p>
      </div>
    </a>
  `;
}

// dispara tudo quando a página termina de carregar
iniciar();
