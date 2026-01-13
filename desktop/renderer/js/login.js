document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const login = document.getElementById("login").value;
  const senha = document.getElementById("senha").value;

  if (login === "admin" && senha === "admin") {
    localStorage.setItem("auth", "true");
    localStorage.setItem("usuario", JSON.stringify({ nome: "Administrador" }));
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("erro").classList.remove("d-none");
  }
});
