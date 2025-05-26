function autenticar(email, senha) {
    const usuariosSalvos = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioEncontrado = usuariosSalvos.find((usuario) => (usuario.email === email && usuario.senha === senha)) || null;
    const usuarioNumero = usuariosSalvos.indexOf(usuarioEncontrado);
    sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioNumero));
    if (usuarioEncontrado) return true;
}

document.getElementById('login').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const dadosLogin = Object.fromEntries(formData);
    const { email, senha } = dadosLogin;

    if (autenticar(email, senha)) {
        window.location.href = "./index.html";
    } else {
        alert('Email e/ou senha incorretos!');
    };
});
