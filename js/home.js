// =========================================================
//  HOME.JS — monta a página inicial a partir do dados.json
// =========================================================

async function iniciarHome() {
  const destaque = document.getElementById("destaque");
  const fileiras = document.getElementById("fileiras");

  try {
    const filmes = await carregarFilmes();

    montarDestaque(filmes, destaque);
    montarFileiras(filmes, fileiras);
  } catch (erro) {
    mostrarErro(fileiras, erro);
  }
}

// ---------------------------------------------------------
//  DESTAQUE: escolhe um filme e desenha o topo grande
// ---------------------------------------------------------
function montarDestaque(filmes, destaque) {
  // filme em destaque; se o id não existir, usa o primeiro da lista
  const filme = filmes.find(f => f.id === "metropolis-1927") || filmes[0];

  destaque.style.backgroundImage = `url('${filme.banner}')`;

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
//  FILEIRAS: uma linha de filmes por país e por gênero
// ---------------------------------------------------------
function montarFileiras(filmes, container) {
  // cada item tem um título e uma função que diz quais filmes entram
  const fileiras = [
    { titulo: "Cinema alemão",     filtro: f => f.pais === "Alemanha" },
    { titulo: "Cinema francês",    filtro: f => f.pais === "França" },
    { titulo: "Cinema soviético",  filtro: f => f.pais === "União Soviética" },
    { titulo: "Cinema sueco",      filtro: f => f.pais === "Suécia" },
    { titulo: "Terror",            filtro: f => f.generos.includes("Terror") },
    { titulo: "Ficção científica", filtro: f => f.generos.includes("Ficção Científica") },
    { titulo: "Drama",             filtro: f => f.generos.includes("Drama") },
    { titulo: "Documentário",      filtro: f => f.generos.includes("Documentário") }
  ];

  fileiras.forEach(item => {
    const selecionados = filmes.filter(item.filtro);

    if (selecionados.length === 0) return;  // categoria vazia: pula

    container.appendChild(criarFileira(item.titulo, selecionados));
  });
}

// cria UMA fileira (título + cards) e devolve o elemento pronto
function criarFileira(titulo, filmes) {
  const secao = document.createElement("section");
  secao.className = "fileira";

  secao.innerHTML = `
    <h2 class="fileira-titulo">${titulo}</h2>
    <div class="fileira-lista">${filmes.map(criarCard).join("")}</div>
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

iniciarHome();
