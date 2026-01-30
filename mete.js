// CONFIGURAÇÃO DO METEFLIX
const API_KEY = '3bc56bcb18fef00901ed2c1ce5498378'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const grid = document.getElementById('movie-grid');
const searchInput = document.getElementById('search');

/**
 * Busca filmes na API do TMDB
 * @param {string} type - Tipo de busca (popular, top_rated, upcoming)
 * @param {string} query - Termo de pesquisa (opcional)
 */
async function loadMovies(type = 'popular', query = '') {
    let url = `${BASE_URL}/movie/${type}?api_key=${API_KEY}&language=pt-BR`;
    
    if(query) {
        url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.success === false) {
            grid.innerHTML = `<h2 style="color:#FFD700; text-align:center; width:100%;">Erro: API KEY Inválida!</h2>`;
            return;
        }

        renderMovies(data.results);
    } catch (error) {
        console.error("Erro na requisição:", error);
        grid.innerHTML = `<h2 style="color:red; text-align:center; width:100%;">Falha na conexão com o servidor.</h2>`;
    }
}

/**
 * Renderiza os cards de filmes no HTML
 */
function renderMovies(movies) {
    grid.innerHTML = '';

    if(movies.length === 0) {
        grid.innerHTML = `<h2 style="color:white; text-align:center; width:100%;">Nenhum filme encontrado.</h2>`;
        return;
    }

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.classList.add('movie-card');
        
        // Criando a estrutura do card
        card.innerHTML = `
            <span class="rating">${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
            <img src="${movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/500x750?text=Sem+Imagem'}" alt="${movie.title}">
            <div class="movie-info">
                <strong>${movie.title}</strong>
            </div>
        `;

        // Evento de clique para abrir o player
        card.onclick = () => openPlayer(movie.title);
        grid.appendChild(card);
    });
}

/**
 * Controle do Player (Modal)
 */
function openPlayer(title) {
    const modal = document.getElementById('player-modal');
    const playerContainer = document.getElementById('video-player');
    
    modal.style.display = 'block';
    // Player de exemplo (Trailer)
    playerContainer.innerHTML = `
        <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                frameborder="0" 
                allow="autoplay; encrypted-media" 
                allowfullscreen>
        </iframe>`;
}

function closePlayer() {
    document.getElementById('player-modal').style.display = 'none';
    document.getElementById('video-player').innerHTML = '';
}

/**
 * Event Listeners (Busca e Teclado)
 */
searchInput.addEventListener('input', (e) => {
    const term = e.target.value;
    if(term.length > 2) {
        loadMovies('search', term);
    } else if(term.length === 0) {
        loadMovies('popular');
    }
});

// Fechar modal ao clicar fora dele
window.onclick = (event) => {
    const modal = document.getElementById('player-modal');
    if (event.target == modal) {
        closePlayer();
    }
};

// Inicialização
if(API_KEY === 'SUA_CHAVE_AQUI_DENTRO' || API_KEY === '') {
    grid.innerHTML = `<h2 style="color:#FFD700; text-align:center; width:100%;">Por favor, configure sua API KEY no arquivo JS.</h2>`;
} else {
    loadMovies();
}
