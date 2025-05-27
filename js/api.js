let indiceAtual = 0;
const letras = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g',
    'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u',
    'v', 'w', 'x', 'y', 'z'
];

async function obterDrinks() {
    const letraAtual = letras[indiceAtual++];
    if (indiceAtual === letras.length) indiceAtual = 0;

    const resposta = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letraAtual}`);
    const dados = await resposta.json();
    return dados.drinks;
}

async function buscarDrink(busca) {
    const maisReceitasBotao = document.getElementById('mais-botao');
    maisReceitasBotao.style.display = 'none';

    // inserindo a pesquisa na barra de busca
    document.getElementsByName('busca')[0].value = busca;

    const resposta = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${busca}`);
    const dados = await resposta.json();
    return dados.drinks || [];
}

async function renderizarDrinks() {
    desabilitarBotao(true);
    const urlParams = new URLSearchParams(window.location.search);
    const busca = urlParams.get('search');
    const receitas = busca ? await buscarDrink(busca) : await obterDrinks();

    receitas.forEach(async (receita) => {
        const favoritado = verificarFavorito(receita);
        const receitasContainer = document.getElementsByClassName("receitas-container")[0];
        receitasContainer.insertAdjacentHTML('beforeend', `
        <div class="receita-card">
            <button id="${receita.idDrink}" class="favorito-botao favorito-botao-${favoritado}"></button>
            <a href="receita.html?id=${receita.idDrink}">
            <img src="${receita.strDrinkThumb}/large" alt="Foto do drink">
                <h3 class="receita-titulo">${receita.strDrink}</h3>
            </a>
        </div>`);
        adicionarEventoBotaoFavorito(receita);
    });
    desabilitarBotao(false);
}

function adicionarEventoBotaoFavorito(receita) {
    document.getElementById(receita.idDrink).addEventListener('click', (e) => {
        alternarFavorito(receita, e);
    });
}

function verificarFavorito(receita) {
    const indiceUsuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    if (indiceUsuario === null) return false;

    const usuariosSalvos = JSON.parse(localStorage.getItem('usuarios')) || [];

    const indiceFavorito = usuariosSalvos[indiceUsuario].favoritos.map(({ idDrink }) => idDrink).indexOf(receita.idDrink);
    const favoritado = (indiceFavorito >= 0);
    return favoritado;
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

async function pesquisar(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { busca } = Object.fromEntries(formData);
    const url = new URL(window.location);

    url.searchParams.set('search', busca);
    window.location.href = url;
}

function desabilitarBotao(disabled) {
    const maisReceitasBotao = document.getElementById('mais-botao');
    maisReceitasBotao.textContent = disabled ? 'Carregando...' : 'Mais Receitas';
    maisReceitasBotao.disabled = disabled;
}

async function renderizarReceita() {
    const urlParams = new URLSearchParams(window.location.search);
    const idReceita = urlParams.get('id');
    const receita = await obterReceita(idReceita);

    console.log(receita);
    document.getElementById('drink-imagem').src = receita.strDrinkThumb;
    document.getElementById('titulo').textContent = receita.strDrink;
    const ingredientesEn = obterIngredientes(receita);
    const [instrucoes, recipiente, ...ingredientes] = await traduzir([receita.strInstructions, receita.strGlass, ...ingredientesEn]);
    document.getElementById('recipiente').textContent = recipiente;
    renderizarIngredientes(ingredientes, receita);
    renderizarInstrucoes(instrucoes);

}

async function obterReceita(id) {
    const resposta = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
    const dados = await resposta.json();
    const { drinks: [receita] } = dados;
    return receita;
};

function obterIngredientes(receita) {
    const ingredientes = [];

    for (let i = 1; receita[`strIngredient${i}`] != null; i++) {
        const ingrediente = receita[`strIngredient${i}`];
        const quantidade = converterQuantidade(receita[`strMeasure${i}`]);

        ingredientes.push(`${quantidade} ${ingrediente}`);
    }
    return ingredientes;
}

async function renderizarIngredientes(ingredientes, receita) {
    const ingredientesContainer = document.getElementById("ingredientes");
    for (let i = 0; ingredientes[i]; i++) {
        ingredientesContainer.innerHTML += `
            <div class="ingrediente-card borda-neon-rosa-hover">
            <img src="https://www.thecocktaildb.com/images/ingredients/${receita[`strIngredient${i + 1}`]}-small.png" alt="Imagem do ingrediente">
            <p>${ingredientes[i]}</p>`;
    }
}

function converterQuantidade(quantidade) {
    if (quantidade === null) return '';
    if (quantidade.includes(' oz')) return converterOzParaMl(quantidade);
    if (quantidade.includes(' cl')) return converterClParaMl(quantidade);
    return quantidade;
}

function converterOzParaMl(quantidade) {
    const quantidadeOz = Number.parseInt(quantidade); // mds do ceu, quem usa a medida oz
    let quantidadeMl = quantidadeOz * 29.574;
    quantidadeMl = Math.round(quantidadeMl / 10) * 10; // transformando a quantidade em um múltiplo de 10 (para evitar quantidades tipo 57,55 ml)

    if (quantidade.includes('/')) {
        const barraIndice = quantidade.indexOf('/');
        const percentual = quantidade[barraIndice - 1] / quantidade[barraIndice + 1];
        quantidadeMl = quantidadeMl + (quantidadeMl * percentual);
    }
    return `${quantidadeMl} ml of`;
}

function converterClParaMl(quantidade) {
    const quantidadeCl = Number.parseInt(quantidade);
    const quantidadeMl = quantidadeCl * 10;

    return `${quantidadeMl} ml of`;
}

function renderizarInstrucoes(instrucoesString) {
    const instrucoesContainer = document.getElementById("instrucoes");
    const instrucoes = instrucoesString.split('. ');

    instrucoes.forEach((instrucao) => {
        instrucoesContainer.innerHTML += `<li class="borda-neon-rosa-hover">${instrucao}</li>`;
    });
}

async function traduzir(textoIngles) {
    try {
        const response = await fetch('https://translation.googleapis.com/language/translate/v2?key=AIzaSyAmqmn5etZURoc6JZykrPhycRRo7QMyvV8', {
            method: "POST",
            body: JSON.stringify({
                q: textoIngles,
                target: 'pt-BR',
                source: 'en',
                format: 'text'
            })
        });
        const { data } = await response.json();
        console.log(data);
        const textoTraduzido = data.translations.map(({ translatedText }) => translatedText);
        return textoTraduzido;
    } catch (error) {
        console.log('Tradução falhou 😭');
        return textoIngles;
    }
}