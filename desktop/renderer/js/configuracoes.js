// ================================
// FUNÇÕES AUXILIARES
// ================================

// Notificações Toast
function mostrarNotificacao(mensagem, tipo = 'info') {
  const cores = {
    sucesso: '#51cf66',
    erro: '#ff6b6b',
    aviso: '#ffa94d',
    info: '#4dabf7'
  };
  
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${cores[tipo] || cores.info};
    color: #000;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    animation: slideIn 0.3s ease;
  `;
  toast.textContent = mensagem;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Toggle de visibilidade de senha
function toggleSenhaVisibilidade() {
  const senhaInput = document.getElementById('novaSenha');
  const toggleBtn = document.getElementById('toggleSenha');
  
  if (senhaInput.type === 'password') {
    senhaInput.type = 'text';
    toggleBtn.textContent = '👁️';
  } else {
    senhaInput.type = 'password';
    toggleBtn.textContent = '👁️';
  }
}

// Verificar força da senha
function verificarForcaSenha(senha) {
  const forcaDiv = document.getElementById('forcaSenha');
  const forcaTexto = document.getElementById('forcaTexto');
  const barras = document.querySelectorAll('.forca-bar');
  
  if (!senha || senha.length === 0) {
    forcaDiv.style.display = 'none';
    return;
  }
  
  forcaDiv.style.display = 'block';
  
  let forca = 0;
  if (senha.length >= 6) forca++;
  if (senha.length >= 10) forca++;
  if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) forca++;
  if (/[0-9]/.test(senha)) forca++;
  if (/[^a-zA-Z0-9]/.test(senha)) forca++;
  
  // Calcular nível (0-4)
  const nivel = Math.min(Math.floor(forca / 1.25), 4);
  
  const cores = ['#ff6b6b', '#ffa94d', '#ffc107', '#51cf66', '#51cf66'];
  const textos = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'];
  
  barras.forEach((barra, index) => {
    if (index < nivel) {
      barra.style.background = cores[nivel];
    } else {
      barra.style.background = '#333';
    }
  });
  
  forcaTexto.textContent = textos[nivel];
  forcaTexto.style.color = cores[nivel];
}

// Verificar correspondência de senhas
function verificarSenhasIguais() {
  const novaSenha = document.getElementById('novaSenha').value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;
  const matchEl = document.getElementById('senhaMatch');
  
  if (!confirmarSenha) {
    matchEl.style.display = 'none';
    return;
  }
  
  matchEl.style.display = 'block';
  
  if (novaSenha === confirmarSenha) {
    matchEl.textContent = '✓ Senhas correspondem';
    matchEl.style.color = '#51cf66';
  } else {
    matchEl.textContent = '× Senhas não correspondem';
    matchEl.style.color = '#ff6b6b';
  }
}

// ================================
// MUDAR ABA
// ================================
function mudarAba(abaName) {
  // Ocultar todas as abas
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = 'none';
  });
  
  // Remover classe active dos botões
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.style.borderBottomColor = 'transparent';
  });
  
  // Mostrar aba selecionada
  const abaElement = document.getElementById(abaName);
  if (abaElement) {
    abaElement.style.display = 'block';
  }
  
  // Marcar botão como ativo
  const botao = document.querySelector(`[data-tab="${abaName}"]`);
  if (botao) {
    botao.classList.add('active');
    botao.style.borderBottomColor = '#ffc107';
  }
  
  // Carregar dados ao abrir aba
  if (abaName === 'banners') {
    carregarBanners();
  } else if (abaName === 'aplicativo') {
    carregarConfiguracoes();
  }
}

// ================================
// CARREGAR CONFIGURAÇÕES
// ================================
async function carregarConfiguracoes() {
  try {
    const config = await window.api.obterConfig();
    
    // App
    if (config.app) {
      document.getElementById('appTheme').value = config.app.theme || 'dark';
      document.getElementById('appAutoStart').checked = config.app.autoStart || false;
      document.getElementById('appShowInTray').checked = config.app.showInTray !== false;
      document.getElementById('appCloseToTray').checked = config.app.closeToTray || false;
    }
    
    // Backup
    if (config.backup) {
      document.getElementById('backupEnabled').checked = config.backup.enabled !== false;
      document.getElementById('backupAutoBackup').checked = config.backup.autoBackup !== false;
      document.getElementById('backupFrequency').value = config.backup.frequency || 'daily';
      document.getElementById('backupMaxBackups').value = config.backup.maxBackups || 7;
      document.getElementById('backupPath').value = config.backup.path || '';
    }
  } catch (err) {
    console.error('Erro ao carregar configurações:', err);
    mostrarNotificacao('Erro ao carregar configurações', 'erro');
  }
}

// ================================
// RESETAR CONFIGURAÇÕES
// ================================
async function resetarConfiguracoes() {
  if (!confirm('Tem certeza que deseja resetar TODAS as configurações para os valores padrão?\n\nIsso NÃO afetará suas credenciais de login.')) {
    return;
  }
  
  try {
    await window.api.resetarConfig();
    mostrarNotificacao('Configurações resetadas com sucesso', 'sucesso');
    carregarConfiguracoes();
  } catch (err) {
    console.error('Erro ao resetar configurações:', err);
    mostrarNotificacao('Erro ao resetar: ' + err.message, 'erro');
  }
}

// Expor função globalmente
window.resetarConfiguracoes = resetarConfiguracoes;

// ================================
// CARREGAR BANNERS EXISTENTES
// ================================
async function carregarBanners() {
  try {
    const banners = await window.api.obterBanners();
    renderizarBanners(banners || []);
  } catch (err) {
    console.error('Erro ao carregar banners:', err);
  }
}

// ================================
// RENDERIZAR LISTA DE BANNERS
// ================================
function renderizarBanners(banners) {
  const container = document.getElementById('bannersList');
  
  if (!banners || banners.length === 0) {
    container.innerHTML = '<p style="color: #888; text-align: center; padding: 20px;">Nenhum banner cadastrado ainda</p>';
    return;
  }
  
  container.innerHTML = banners.map((banner, index) => `
    <div style="background: linear-gradient(135deg, #1f1f1f 0%, #0f0f0f 100%); border: 1px solid #444; border-radius: 12px; padding: 16px; margin-bottom: 16px; display: flex; gap: 16px; align-items: center;">
      <img src="${banner.imagem}" alt="Thumb do banner" style="width: 320px; height: 140px; object-fit: cover; border-radius: 8px; border: 1px solid #444;">
      <div style="flex: 1; min-width: 0;">
        <div style="color: #fff; font-weight: 700; margin-bottom: 6px; font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${banner.nome || `Banner ${index + 1}`}</div>
        <div style="color: #aaa; font-size: 12px;">Criado em: ${new Date(banner.dataCriacao).toLocaleDateString('pt-BR')}${banner.dataAtualizacao ? ` • Atualizado: ${new Date(banner.dataAtualizacao).toLocaleDateString('pt-BR')}` : ''}</div>
      </div>
      <div style="display: flex; gap: 8px;">
        <button type="button" class="btn btn-sm" onclick="editarBanner(${index})" style="background: #ffc107; color: #000; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer;">Editar</button>
        <button type="button" class="btn btn-sm" onclick="excluirBanner(${index})" style="background: #ff4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer;">Excluir</button>
      </div>
    </div>
  `).join('');
}

// ================================
// EDITAR BANNER
// ================================
window.editarBanner = async function(index) {
  try {
    const banners = await window.api.obterBanners();
    const banner = banners[index];
    
    if (!banner) {
      mostrarNotificacao('Banner não encontrado', 'erro');
      return;
    }
    
    // Preencher form com dados do banner
    document.getElementById('nomeBanner').value = banner.nome || '';
    
    // Mostrar preview da imagem atual
    const preview = document.getElementById('previewNovo');
    preview.src = banner.imagem;
    preview.style.display = 'block';
    atualizarInfoImagem(banner.imagem);
    const simg = document.getElementById('simulacaoImg');
    const sbox = document.getElementById('simulacaoBanner');
    if (simg && sbox) { simg.src = banner.imagem; sbox.style.display = 'block'; }
    
    // Guardar índice para atualização
    document.getElementById('formBanners').dataset.bannerIndex = index;
    document.getElementById('formBanners').dataset.modoEdicao = 'true';
    
    // Scroll para formulário
    document.getElementById('formBanners').scrollIntoView({ behavior: 'smooth' });
    mostrarNotificacao('Modo de edição ativado', 'info');
  } catch (err) {
    console.error('Erro ao editar banner:', err);
    mostrarNotificacao('Erro ao editar banner: ' + err.message, 'erro');
  }
}

// ================================
// EXCLUIR BANNER
// ================================
window.excluirBanner = async function(index) {
  if (!confirm('Tem certeza que deseja excluir este banner? Esta ação não pode ser desfeita.')) return;
  
  try {
    await window.api.excluirBanner(index);
    mostrarNotificacao('Banner excluído com sucesso', 'sucesso');
    carregarBanners();
  } catch (err) {
    console.error('Erro ao excluir banner:', err);
    mostrarNotificacao('Erro ao excluir banner: ' + err.message, 'erro');
  }
}

// ================================
// PREVIEW DE BANNER
// ================================
function previewBanner(input, previewId) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.getElementById(previewId);
      preview.src = e.target.result;
      preview.style.display = 'block';
      atualizarInfoImagem(e.target.result);
      const simg = document.getElementById('simulacaoImg');
      const sbox = document.getElementById('simulacaoBanner');
      if (simg && sbox) { simg.src = e.target.result; sbox.style.display = 'block'; }
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// ================================
// INFO DE ESCALA E SIMULAÇÃO
// ================================
const RATIO_RECOMENDADO = 8/3; // ~2.6667
const LARGURA_RECOMENDADA = 1920;
const ALTURA_RECOMENDADA = 720;

function atualizarInfoImagem(src) {
  const img = new Image();
  img.onload = () => {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const ratio = (w / h);
    const info = document.getElementById('previewInfo');
    if (!info) return;
    const diff = Math.abs(ratio - RATIO_RECOMENDADO);
    let ajuste = 'sem cortes';
    if (diff > 0.06) {
      ajuste = ratio > RATIO_RECOMENDADO ? 'corte lateral (largura maior)' : 'corte superior/inferior (altura maior)';
    }
    info.innerHTML = `Recomendado: <strong>${LARGURA_RECOMENDADA}×${ALTURA_RECOMENDADA}</strong> (≈${RATIO_RECOMENDADO.toFixed(2)}:1) • Sua imagem: <strong>${w}×${h}</strong> (≈${ratio.toFixed(2)}:1) → <span style="color:#ffc107;">${ajuste}</span>`;
    info.style.display = 'block';
  };
  img.src = src;
}

// ================================
// DRAG AND DROP BANNERS
// ================================
document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('imagemBanner');
  
  if (dropZone && fileInput) {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = '#ffc107';
      dropZone.style.background = 'rgba(255,193,7,0.15)';
    });
    
    dropZone.addEventListener('dragleave', () => {
      dropZone.style.borderColor = '#ffc107';
      dropZone.style.background = 'rgba(255,193,7,0.05)';
    });
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        previewBanner(fileInput, 'previewNovo');
      }
      dropZone.style.borderColor = '#ffc107';
      dropZone.style.background = 'rgba(255,193,7,0.05)';
    });
  }
});

// ================================
// FORMULÁRIO CREDENCIAIS
// ================================
const formCredenciais = document.getElementById('formCredenciais');
if (formCredenciais) {
  // Listeners para validação em tempo real
  const novaSenhaInput = document.getElementById('novaSenha');
  const confirmarSenhaInput = document.getElementById('confirmarSenha');
  
  if (novaSenhaInput) {
    novaSenhaInput.addEventListener('input', (e) => {
      verificarForcaSenha(e.target.value);
      verificarSenhasIguais();
    });
  }
  
  if (confirmarSenhaInput) {
    confirmarSenhaInput.addEventListener('input', verificarSenhasIguais);
  }
  
  formCredenciais.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const loginAtual = document.getElementById('loginAtual').value.trim();
    const senhaAtual = document.getElementById('senhaAtual').value.trim();
    const novoLogin = document.getElementById('novoLogin').value.trim();
    const novaSenha = document.getElementById('novaSenha').value.trim();
    const confirmarSenha = document.getElementById('confirmarSenha').value.trim();
    
    // Validações
    if (!loginAtual || !senhaAtual || !novoLogin || !novaSenha || !confirmarSenha) {
      mostrarNotificacao('Preencha todos os campos', 'aviso');
      return;
    }
    
    if (novaSenha !== confirmarSenha) {
      mostrarNotificacao('As senhas não correspondem', 'erro');
      return;
    }
    
    if (novaSenha.length < 6) {
      mostrarNotificacao('A senha deve ter no mínimo 6 caracteres', 'aviso');
      return;
    }
    
    if (novoLogin.length < 3) {
      mostrarNotificacao('O login deve ter no mínimo 3 caracteres', 'aviso');
      return;
    }
    
    if (!confirm('Confirma a alteração das credenciais? Você precisará fazer login novamente.')) {
      return;
    }
    
    try {
      await window.api.alterarCredenciais({
        loginAtual,
        senhaAtual,
        novoLogin,
        novaSenha
      });
      
      mostrarNotificacao('Credenciais alteradas com sucesso!', 'sucesso');
      formCredenciais.reset();
      
      // Resetar indicadores
      document.getElementById('forcaSenha').style.display = 'none';
      document.getElementById('senhaMatch').style.display = 'none';
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    } catch (err) {
      console.error('Erro ao alterar credenciais:', err);
      mostrarNotificacao('Erro ao alterar credenciais: ' + err.message, 'erro');
    }
  });
}

// ================================
// FORMULÁRIO BANNERS
// ================================
const formBanners = document.getElementById('formBanners');
if (formBanners) {
  formBanners.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nomeBanner = document.getElementById('nomeBanner').value.trim();
    const imagemFile = document.getElementById('imagemBanner').files[0];
    const modoEdicao = formBanners.dataset.modoEdicao === 'true';
    const bannerIndex = parseInt(formBanners.dataset.bannerIndex);
    
    if (!nomeBanner) {
      mostrarNotificacao('Digite o nome do banner', 'aviso');
      return;
    }
    
    if (!imagemFile && !modoEdicao) {
      mostrarNotificacao('Selecione uma imagem para o banner', 'aviso');
      return;
    }
    
    // Validar tamanho
    if (imagemFile && imagemFile.size > 5 * 1024 * 1024) {
      mostrarNotificacao('A imagem não pode ultrapassar 5MB', 'erro');
      return;
    }
    
    // Validar tipo de arquivo
    if (imagemFile && !['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(imagemFile.type)) {
      mostrarNotificacao('Formato inválido. Use JPG, PNG, GIF ou WebP', 'erro');
      return;
    }
    
    try {
      if (imagemFile) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const imagemData = e.target.result;
          
          if (modoEdicao) {
            // Modo edição
            await window.api.atualizarBanner(bannerIndex, {
              nome: nomeBanner,
              imagem: imagemData
            });
            mostrarNotificacao('Banner atualizado com sucesso', 'sucesso');
          } else {
            // Modo criação
            await window.api.criarBanner({
              nome: nomeBanner,
              imagem: imagemData
            });
            mostrarNotificacao('Banner criado com sucesso', 'sucesso');
          }
          
          // Limpar form
          limparFormBanner();
          
          // Recarregar lista
          carregarBanners();
        };
        reader.readAsDataURL(imagemFile);
      } else if (modoEdicao) {
        // Editar sem mudar imagem
        await window.api.atualizarBanner(bannerIndex, {
          nome: nomeBanner
        });
        mostrarNotificacao('Banner atualizado com sucesso', 'sucesso');
        
        limparFormBanner();
        carregarBanners();
      }
    } catch (err) {
      console.error('Erro ao salvar banner:', err);
      mostrarNotificacao('Erro ao salvar banner: ' + err.message, 'erro');
    }
  });
}

// Função auxiliar para limpar formulário de banner
function limparFormBanner() {
  formBanners.reset();
  document.getElementById('previewNovo').style.display = 'none';
  const sbox = document.getElementById('simulacaoBanner');
  const info = document.getElementById('previewInfo');
  if (sbox) sbox.style.display = 'none';
  if (info) info.style.display = 'none';
  delete formBanners.dataset.modoEdicao;
  delete formBanners.dataset.bannerIndex;
}

// ================================
// FORMULÁRIO APP
// ================================
const formApp = document.getElementById('formApp');
if (formApp) {
  formApp.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      const dados = {
        theme: document.getElementById('appTheme').value,
        autoStart: document.getElementById('appAutoStart').checked,
        showInTray: document.getElementById('appShowInTray').checked,
        closeToTray: document.getElementById('appCloseToTray').checked
      };
      
      await window.api.atualizarConfigApp(dados);
      mostrarNotificacao('Configurações do aplicativo salvas', 'sucesso');
    } catch (err) {
      console.error('Erro ao salvar config app:', err);
      mostrarNotificacao('Erro: ' + err.message, 'erro');
    }
  });
}

// ================================
// FORMULÁRIO BACKUP
// ================================
const formBackup = document.getElementById('formBackup');
if (formBackup) {
  formBackup.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      const dados = {
        enabled: document.getElementById('backupEnabled').checked,
        autoBackup: document.getElementById('backupAutoBackup').checked,
        frequency: document.getElementById('backupFrequency').value,
        maxBackups: parseInt(document.getElementById('backupMaxBackups').value)
      };
      
      await window.api.atualizarConfigBackup(dados);
      mostrarNotificacao('Configurações de backup salvas', 'sucesso');
    } catch (err) {
      console.error('Erro ao salvar config backup:', err);
      mostrarNotificacao('Erro: ' + err.message, 'erro');
    }
  });
}

// ================================
// CARREGAR CONFIGURAÇÕES AO INICIAR
// ================================
document.addEventListener('DOMContentLoaded', () => {
  carregarConfiguracoes();
});
