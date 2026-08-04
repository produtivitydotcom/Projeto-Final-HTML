/* ==========================================
   FUNÇÃO DA ANIMAÇÃO DISNEY (VÍDEO 1s até 7s)
   ========================================== */
function dispararEfeitoDisney() {
  const DURACAO = 6000; 

  const overlay = document.createElement('div');
  overlay.className = 'efeito-genero-overlay efeito-disney-video';

  overlay.innerHTML = `
    <div class="video-container-disney">
      <iframe 
        src="https://www.youtube.com/embed/cgD6i44ctDs?autoplay=1&mute=1&controls=0&loop=0&start=1&end=7&enablejsapi=1&rel=0&playlist=cgD6i44ctDs" 
        title="Disney Intro"
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    </div>
  `;

  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.classList.add('fechando-overlay');
    setTimeout(() => overlay.remove(), 500);
  }, DURACAO);
}