import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const Jimp = require('jimp');
import ImagemService from '../src/Main_back/Services/ImagemService.js';

async function runTest() {
  const tmpDir = path.join(process.cwd(), 'test_tmp_images');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  // Cria uma imagem vermelha simples
  const img = new Jimp(400, 300, 0xFF0000FF);
  const buffer = await img.getBufferAsync(Jimp.MIME_PNG);

  const payload = { name: 'test.png', data: Array.from(Buffer.from(buffer)) };

  try {
    const { fullPath, thumbPath } = await ImagemService.saveImage(tmpDir, payload);
    console.log('fullPath:', fullPath);
    console.log('thumbPath:', thumbPath);

    const existsFull = fs.existsSync(fullPath);
    const existsThumb = fs.existsSync(thumbPath);
    console.log('existsFull', existsFull, 'existsThumb', existsThumb);

    if (!existsFull || !existsThumb) throw new Error('Arquivos não foram criados');

    const deleted = ImagemService.deleteImage(fullPath);
    console.log('delete returned', deleted);
    console.log('exists after delete full', fs.existsSync(fullPath), 'thumb', fs.existsSync(thumbPath));

  } catch (err) {
    console.error('Teste ImagemService falhou:', err);
    process.exit(1);
  } finally {
    // limpa pasta temporária
    try { fs.rmdirSync(tmpDir, { recursive: true }); } catch (e) {}
  }

  console.log('Teste concluído com sucesso');
}

runTest();
