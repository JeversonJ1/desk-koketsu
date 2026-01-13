document.getElementById('logout')?.addEventListener('click', () => {
  localStorage.removeItem('auth');
  window.location.href = 'login.html';
});
