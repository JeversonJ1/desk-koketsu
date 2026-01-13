// ==========================================
// RESPONSIVIDADE - NAVBAR SCROLL
// ==========================================
window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// ==========================================
// FAQ ACCORDION
// ==========================================
const faqs = document.querySelectorAll(".faq-question");
  
faqs.forEach((btn) => {
  btn.addEventListener("click", () => {
    const parent = btn.parentElement;
    parent.classList.toggle("open");
  });
});





const produtosVitrine = [
  {
    categoria: "CAMISETAS",
    itens: [
      { id: "camiseta1", nome: "CAMISETA OVERSIZED - ESSENCE", preco: "100,00", img: "img/Captura de tela 2025-08-04 093118.png", alt: "Camiseta preta" },
      { id: "camiseta2", nome: "CAMISETA OVERSIZED - STREET", preco: "20,00", img: "img/NOCAP.png", alt: "Camiseta branca" },
      { id: "camiseta3", nome: "CAMISETA OVERSIZED - BIRD", preco: "100,00", img: "img/camiseta-marrom.png", alt: "Camiseta estampada" },
      { id: "camiseta4", nome: "CAMISETA OVERSIZED - EXCLUSIVE", preco: "100,00", img: "img/camiseta-off-white.png", alt: "Camiseta estampada" },
    ]
  },
  {
    categoria: "CALÇAS",
    itens: [
      { id: "calca1", nome: "CALÇA DE MOLETOM - FREEDOM", preco: "200,00", img: "img/carca.png", alt: "Calça jeans azul" },
      { id: "calca2", nome: "CALÇA DE MOLETOM - FREEDOM", preco: "200,00", img: "img/calca-2.png", alt: "Calça jeans azul" },
      { id: "calca3", nome: "CALÇA DE MOLETOM - FREEDOM", preco: "200,00", img: "img/calca-3.png", alt: "Calça jeans azul" },
      { id: "calca4", nome: "CALÇA Y2K - BAGGY", preco: "200,00", img: "img/calca-4.png", alt: "Calça jeans azul" },
     
    ]
  },
  {
    categoria: "BLUSAS",
    itens: [
      { id: "blusa1", nome: "ZIP UP - FREEDOMA", preco: "180,00", img: "img/moletom.png", alt: "Blusa preta" },
      { id: "blusa2", nome: "MOLETOM GOLA CARECA - FACE", preco: "180,00", img: "img/moletom-2.png", alt: "Blusa preta" },
      { id: "blusa3", nome: "MOLETOM GOLA CARECA - LOGO", preco: "180,00", img: "img/moletom-3.png", alt: "Blusa preta" },
      { id: "blusa4", nome: "CASACO MOLETOM OVERSIZED - LOGO", preco: "180,00", img: "img/moletom-4.png", alt: "Blusa preta" },
    ]
  },
  {
    categoria: "SAPATOS",
    itens: [
      { id: "sapato1", nome: "Tênis Nike Air Max Dn Feminino", preco: "250,00", img: "img/dn.png", alt: "Sapato casual" },
      { id: "sapato2", nome: "Air Max DN", preco: "250,00", img: "img/dn-vermelho.png", alt: "Sapato casual" },
      { id: "sapato3", nome: "Tênis Nike Air Max Dn Masculino", preco: "250,00", img: "img/dn-branco.png", alt: "Sapato casual" },
      { id: "sapato4", nome: "Tênis Nike Air Max Plus Drift Feminino", preco: "250,00", img: "img/TN.png", alt: "Sapato casual" },
    ]
  },
  {
    categoria: "CAMISAS - POLO",
    itens: [
      { id: "polo1", nome: "Camisa Polo Nike Court Dri-FIT Masculina", preco: "80,00", img: "/img/polo-.png", alt: "Camisa Polo" },
      { id: "polo2", nome: "Camisa Polo Nike Court Dri-FIT Masculina", preco: "80,00", img: "img/polo-2.png", alt: "Camisa Polo" },
      { id: "polo3", nome: "Camisa Polo Nike Court Dri-FIT Masculina", preco: "80,00", img: "img/polo-3.png", alt: "Camisa Polo" },
      { id: "polo4", nome: "Camisa Polo Nike Court Dri-FIT Masculina", preco: "80,00", img: "/img/polo-.png", alt: "Camisa Polo" },
    ]
  }
];

const container = document.getElementById("vitrine");

// Verificar se o elemento vitrine existe antes de adicionar produtos
if (container) {
  produtosVitrine.forEach(secao => {
    const section = document.createElement("section");
    section.classList.add("mb-5");

    const titulo = document.createElement("h2");
    titulo.className = "text-center mb-4";
    titulo.textContent = secao.categoria;
    section.appendChild(titulo);

    const row = document.createElement("div");
    row.className = "row g-4";

    secao.itens.forEach(prod => {
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6 col-md-4 col-lg-3";
      col.innerHTML = `
        <a href="produto.html?id=${prod.id}" class="text-decoration-none text-dark">
          <div class="card h-100">
            <img src="${prod.img}" class="card-img-top" alt="${prod.alt}">
            <div class="card-body text-center">
              <h4 class="card-title text-uppercase">${prod.nome}</h4>
              <p class="card-text">R$ ${prod.preco}</p>
              <h5>ou 6x de R$42,94 no cartão s/juros</h5>
              
            </div>
          </div>
        </a>
      `;
      row.appendChild(col);
    });

    section.appendChild(row);
    container.appendChild(section);
  });
}
window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}
); 










