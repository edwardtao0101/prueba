const grid = document.getElementById('grid');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const clearBtn = document.getElementById('clear-btn');
const status = document.getElementById('status');
const themeToggle = document.getElementById('theme-toggle');

const API = 'https://rickandmortyapi.com/api/character';
const THEME_KEY = 'theme';

async function fetchCharacters(query = '') {
  grid.innerHTML = '<div style="color:var(--muted)">Cargando...</div>';
  try {
    // ✅ corregido: sin el "/" antes del ?
    const url = query ? `${API}?name=${query}` : API;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al cargar personajes');
    const data = await res.json();
    renderCards(data.results);
    status.textContent = `Mostrando ${data.results.length} personajes`;
  } catch (err) {
    // ✅ corregido: usar string template válido
    grid.innerHTML = `<div style="color:red">${err.message}</div>`;
    status.textContent = '';
  }
}

function renderCards(characters) {
  grid.innerHTML = '';
  characters.forEach((c) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${c.image}" alt="${c.name}" />
      <div class="info">
        <div class="name">${c.name}</div>
        <div class="meta">${c.species} • ${c.status}</div>
        <div class="meta">Origen: ${c.origin.name}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Tema claro/oscuro
function applyTheme(theme) {
  document.body.classList.toggle('light', theme === 'light');
  themeToggle.textContent = theme === 'light' ? '☀️ Claro' : '🌙 Oscuro';
  localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);
}

themeToggle.addEventListener('click', () => {
  const isLight = document.body.classList.contains('light');
  applyTheme(isLight ? 'dark' : 'light');
});

// Eventos
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  fetchCharacters(searchInput.value.trim());
});

clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  fetchCharacters();
});

// Inicializar
initTheme();
fetchCharacters();