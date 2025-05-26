function cadastrar({ nome, nascimento, email, senha, telefone }) {
    const usuariosSalvos = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuariosSalvos.push({ nome, nascimento, nacionalidade: 'br', email, senha, telefone, favoritos: [] });
    localStorage.setItem('usuarios', JSON.stringify(usuariosSalvos));
}

document.getElementById('registro').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const novoUsuario = Object.fromEntries(formData);
    cadastrar(novoUsuario);
    alert('Cadastro realizado com sucesso!');
    window.location.href = "./login.html";
});
