document.querySelector('button')?.addEventListener('click', () => {
  const inputs = document.querySelectorAll('input');
  const login = inputs[0].value;
  const senha = inputs[1].value;

  if (login === 'admin' && senha === 'admin') {
    localStorage.setItem('auth', 'true');
    localStorage.setItem('usuario', JSON.stringify({ nome: 'Administrador' }));
    window.location.href = 'dashboard.html';
  } else {
    alert('Login ou senha inválidos');
  }
});
