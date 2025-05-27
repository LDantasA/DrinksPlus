
function obterDadosUsuarios() {
    const { usuarioAutenticado } = obterUsuario();

    if (!usuarioAutenticado) window.location.href = "./login.html";

    const { nome, nascimento, nacionalidade, email, telefone } = usuarioAutenticado;

    document.getElementsByName('nome')[0].value = nome;
    document.getElementsByName('nascimento')[0].value = nascimento;
    document.getElementsByName('nacionalidade')[0].value = nacionalidade;
    document.getElementsByName('email')[0].value = email;
    document.getElementsByName('telefone')[0].value = telefone;
}

document.getElementById('perfil').addEventListener('submit', (e) => {
    e.preventDefault();
    const { usuarioAutenticado } = obterUsuario();
    const formData = new FormData(e.target);
    const dadosPerfil = Object.fromEntries(formData);
    const { nome, nascimento, nacionalidade, email, telefone, senhaAtual, senha } = dadosPerfil;

    if (senhaAtual !== usuarioAutenticado.senha) {
        alert('A senha atual não confere. Perfil NÃO atualizado!');
        return;
    };

    if (nome && nome !== usuarioAutenticado.nome) atualizarPerfil({ nome });
    if (nascimento && nascimento !== usuarioAutenticado.nascimento) atualizarPerfil({ nascimento });
    if (nacionalidade && nacionalidade !== usuarioAutenticado.nacionalidade) atualizarPerfil({ nacionalidade });
    if (email && email !== usuarioAutenticado.email) atualizarPerfil({ email });
    if (telefone !== usuarioAutenticado.telefone) atualizarPerfil({ telefone });
    console.log((senha));
    if (senha && senha !== usuarioAutenticado.senha) atualizarPerfil({ senha });
    alert('Seu perfil foi atualizado com sucesso!');
    window.location.href = './index.html';
});

function atualizarPerfil(atualização) {
    const { usuarioAutenticado, indiceUsuario, usuariosSalvos } = obterUsuario();
    const novosDadosUsuario = { ...usuarioAutenticado, ...atualização };
    usuariosSalvos[indiceUsuario] = novosDadosUsuario;
    localStorage.setItem('usuarios', JSON.stringify(usuariosSalvos));

}


function obterUsuario() {
    const usuariosSalvos = JSON.parse(localStorage.getItem('usuarios'));
    const indiceUsuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    const usuarioAutenticado = indiceUsuario !== null ? usuariosSalvos[indiceUsuario] : null;

    return { usuarioAutenticado, indiceUsuario, usuariosSalvos };
}
