function exibirBotaoUsuario() {
    const usuariosSalvos = JSON.parse(localStorage.getItem('usuarios'));
    const indiceUsuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    const usuarioAutenticado = indiceUsuario !== null ? usuariosSalvos[indiceUsuario] : null;

    if (usuarioAutenticado) {
        const botaoLogin = document.getElementById('login-botao');
        botaoLogin.style.display = 'none';

        const container = document.getElementById('usuario-botao-container');
        container.style.display = 'block';

        const nomeUsuarioP = document.createElement('p');
        nomeUsuarioP.innerHTML = `Olá, <b>${usuarioAutenticado.nome.split(' ')[0]}</b>!`;

        const botaoUsuario = document.getElementById('usuario-botao');
        botaoUsuario.append(nomeUsuarioP);

        const usuarioMenu = document.getElementById('usuario-menu');
        botaoUsuario.addEventListener('click', () => {
            usuarioMenu.classList.remove('usuario-menu-escondido');
        });

        usuarioMenu.addEventListener('mouseleave', () => {
            usuarioMenu.classList.add('usuario-menu-escondido');
        });

        const botaoSair = document.getElementById('logout');
        botaoSair.addEventListener('click', sair);
    }
};

function sair() {
    sessionStorage.removeItem('usuarioLogado');
    window.location.reload();
}

document.addEventListener('DOMContentLoaded', function () {
    exibirBotaoUsuario();

    const botaoHamb = document.getElementById('menu-hamburguer');
    botaoHamb.addEventListener('click', () => {
        const nav = document.getElementById('nav');
        nav.classList.toggle('menu-ativo');
    });
});

