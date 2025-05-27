function cadastrar({ nome, nascimento, email, senha, telefone }) {
    const usuariosSalvos = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuariosSalvos.push({ nome, nascimento, nacionalidade: 'br', email, senha, telefone, favoritos: [] });

    const anoNascimento = new Date(nascimento).getFullYear();
    const anoAtual = new Date().getFullYear();
    console.log(anoAtual);
    if ((anoAtual - anoNascimento) < 18) {
        alert(`Você ainda é um pouco jovem para isso! 😉
As bebidas que mostramos aqui são destinadas a maiores de 18 anos.
Mas calma! Quando chegar lá, o brinde é por nossa conta. Até logo! 🍸`);
        return false;
    }
    localStorage.setItem('usuarios', JSON.stringify(usuariosSalvos));
    return true;
}

document.getElementById('registro').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const novoUsuario = Object.fromEntries(formData);
    if (cadastrar(novoUsuario)) {
        alert('Cadastro realizado com sucesso!');
        window.location.href = "./login.html";
    }
});
