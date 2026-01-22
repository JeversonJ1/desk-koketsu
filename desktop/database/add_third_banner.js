const fs = require('fs');
const path = require('path');

const bannersPath = path.join(__dirname, 'banners.json');

function main() {
  try {
    let banners = [];
    if (fs.existsSync(bannersPath)) {
      const raw = fs.readFileSync(bannersPath, 'utf8');
      banners = JSON.parse(raw);
    }
    if (!Array.isArray(banners)) banners = [];

    // Se já houver 3 ou mais, não faz nada
    if (banners.length >= 3) {
      console.log('Já existem', banners.length, 'banners. Nada a fazer.');
      return;
    }

    const novo = {
      nome: 'Banner Terciário',
      imagem: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      dataCriacao: new Date().toISOString()
    };
    banners.push(novo);
    fs.writeFileSync(bannersPath, JSON.stringify(banners, null, 2), 'utf8');
    console.log('Banner adicionado com sucesso. Total:', banners.length);
  } catch (e) {
    console.error('Falha ao adicionar banner:', e);
    process.exit(1);
  }
}

main();
