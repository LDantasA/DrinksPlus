function obterDrinks() {
    const usuariosSalvos = JSON.parse(localStorage.getItem('usuarios')) || [];
    const indiceUsuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    const favoritos = usuariosSalvos[indiceUsuario].favoritos;
    favoritos.sort((a, b) => a.strDrink.localeCompare(b.strDrink));
    return favoritos;

}

function renderizarDrinks() {
    const receitas = obterDrinks();

    receitas.forEach(async (receita) => {
        const receitasContainer = document.getElementsByClassName("receitas-container")[0];
        receitasContainer.insertAdjacentHTML('beforeend', `
        <div class="receita-card">
        <button id="${receita.idDrink}" class="favorito-botao favorito-botao-true"></button>
        <a href="receita.html?id=${receita.idDrink}">
        <img src="${receita.strDrinkThumb}/large" alt="Foto do drink">
            <h3 class="receita-titulo">${receita.strDrink}</h3>
        </a>
        </div>`);
        adicionarEventoBotaoFavorito(receita);
    });
}

function adicionarEventoBotaoFavorito(receita) {
    document.getElementById(receita.idDrink).addEventListener('click', (e) => {
        alternarFavorito(receita, e);
    });
}

function alternarFavorito(receita, e) {
    const usuariosSalvos = JSON.parse(localStorage.getItem('usuarios')) || [];
    const indiceUsuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    if (indiceUsuario === null) return;
    const indiceFavorito = usuariosSalvos[indiceUsuario].favoritos.map(({ idDrink }) => idDrink).indexOf(receita.idDrink);
    const favoritado = (indiceFavorito >= 0);

    if (!favoritado) {
        usuariosSalvos[indiceUsuario].favoritos.push(receita);
    } else {
        usuariosSalvos[indiceUsuario].favoritos.splice(indiceFavorito, 1);
    }
    localStorage.setItem('usuarios', JSON.stringify(usuariosSalvos));
    e.target.className = `favorito-botao favorito-botao-${!favoritado}`;
}