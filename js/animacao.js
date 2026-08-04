/* ==========================================
   FUNÇÃO DA ANIMAÇÃO DISNEY (VÍDEO 1s até 7s)
   ========================================== */
function dispararEfeitoDisney() {
  // Duração de 6 segundos (do segundo 1 ao 7)
  const DURACAO = 6000; 

  // Cria o container do overlay
  const overlay = document.createElement('div');
  overlay.className = 'efeito-genero-overlay efeito-disney-video';

  // Configurado com start=1 e end=7
  overlay.innerHTML = `
    <div class="video-container-disney">
      <iframe 
        src="https://www.youtube.com/embed/cgD6i44ctDs?autoplay=1&mute=1&controls=0&loop=0&start=1&end=7&enablejsapi=1&rel=0" 
        title="Disney Intro"
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    </div>
  `;

  document.body.appendChild(overlay);

  // Remove o overlay suavemente após 6 segundos
  setTimeout(() => {
    overlay.classList.add('fechando-overlay');
    setTimeout(() => overlay.remove(), 500); // 500ms para o efeito de fade-out
  }, DURACAO);
}