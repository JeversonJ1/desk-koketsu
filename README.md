# Koketsu

Aplicação desktop desenvolvida com Electron, Vite e SQLite.

## 📋 Descrição

Koketsu é uma aplicação Electron moderna que utiliza Vite para build e desenvolvimento rápido, com suporte a banco de dados SQLite através do better-sqlite3.

## 🚀 Tecnologias

- **Electron** (v39.2.4) - Framework para aplicações desktop multiplataforma
- **Vite** (v5.4.21) - Build tool e dev server
- **better-sqlite3** (v12.4.6) - Interface SQLite de alto desempenho
- **SweetAlert2** (v11.26.3) - Modais e alertas bonitos e responsivos
- **Electron Forge** (v7.10.2) - Ferramentas para empacotamento e distribuição

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/JeversonJ1/desk-koketsu.git

# Entre no diretório
cd desk-koketsu

# Instale as dependências
npm install
```

## 🎯 Como Usar

### Modo Desenvolvimento

```bash
npm run dev
```

### Build da Aplicação

```bash
npm run package
```

### Criar Instaladores

```bash
npm run make
```

Este comando irá gerar instaladores para diferentes plataformas:
- **Windows**: Squirrel installer
- **Linux**: DEB e RPM packages
- **Multiplataforma**: ZIP archives

### Publicar

```bash
npm run publish
```

## 🏗️ Estrutura do Projeto

```
desk-koketsu/
├── src/
│   ├── main.js          # Processo principal do Electron
│   ├── preload.js       # Script de preload
│   ├── renderer.js      # Processo de renderização
│   └── index.css        # Estilos
├── index.html           # HTML principal
├── package.json         # Configurações e dependências
├── forge.config.js      # Configuração do Electron Forge
├── vite.main.config.mjs    # Config Vite para main process
├── vite.preload.config.mjs # Config Vite para preload
└── vite.renderer.config.mjs # Config Vite para renderer
```

## 🔧 Configuração

A aplicação é configurada através do Electron Forge com os seguintes makers:

- **Squirrel** - Instalador Windows
- **ZIP** - Arquivos compactados multiplataforma
- **DEB** - Pacotes Debian/Ubuntu
- **RPM** - Pacotes RedHat/Fedora

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o ambiente de desenvolvimento |
| `npm run package` | Empacota a aplicação |
| `npm run make` | Cria instaladores para distribuição |
| `npm run publish` | Publica a aplicação |
| `npm run lint` | Executa linting (atualmente não configurado) |

## 🔒 Segurança

O projeto utiliza [@electron/fuses](https://www.npmjs.com/package/@electron/fuses) para configurações de segurança avançadas do Electron.

## 👤 Autor

**thurflx213**
- Email: thurfelix10@gmail.com
- GitHub: [@JeversonJ1](https://github.com/JeversonJ1)

## 📄 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📚 Recursos

- [Documentação do Electron](https://www.electronjs.org/docs)
- [Documentação do Vite](https://vitejs.dev/)
- [Electron Forge](https://www.electronforge.io/)
- [Better SQLite3](https://github.com/WiseLibs/better-sqlite3)

---

Desenvolvido com ❤️ usando Electron
