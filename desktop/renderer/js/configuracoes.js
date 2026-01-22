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
  
  // Carregar banners ao abrir aba
  if (abaName === 'banners') {
    carregarBanners();
  }
}

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
        <button type="button" class="btn btn-sm" onclick="editarBanner(${index})" style="background: #ffc107; color: #000; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer;">✏️ Editar</button>
        <button type="button" class="btn btn-sm" onclick="excluirBanner(${index})" style="background: #ff4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer;">🗑️ Excluir</button>
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
      alert('❌ Banner não encontrado');
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
  } catch (err) {
    alert('❌ Erro ao editar banner: ' + err.message);
  }
}

// ================================
// EXCLUIR BANNER
// ================================
window.excluirBanner = async function(index) {
  if (!confirm('Tem certeza que deseja excluir este banner?')) return;
  
  try {
    await window.api.excluirBanner(index);
    alert('✅ Banner excluído com sucesso!');
    carregarBanners();
  } catch (err) {
    alert('❌ Erro ao excluir banner: ' + err.message);
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
  formCredenciais.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const loginAtual = document.getElementById('loginAtual').value.trim();
    const senhaAtual = document.getElementById('senhaAtual').value.trim();
    const novoLogin = document.getElementById('novoLogin').value.trim();
    const novaSenha = document.getElementById('novaSenha').value.trim();
    const confirmarSenha = document.getElementById('confirmarSenha').value.trim();
    
    // Validações
    if (!loginAtual || !senhaAtual || !novoLogin || !novaSenha || !confirmarSenha) {
      alert('❌ Preencha todos os campos');
      return;
    }
    
    if (novaSenha !== confirmarSenha) {
      alert('❌ As senhas não conferem');
      return;
    }
    
    if (novaSenha.length < 6) {
      alert('❌ A senha deve ter no mínimo 6 caracteres');
      return;
    }
    
    try {
      await window.api.alterarCredenciais({
        loginAtual,
        senhaAtual,
        novoLogin,
        novaSenha
      });
      
      alert('✅ Credenciais alteradas com sucesso!');
      formCredenciais.reset();
    } catch (err) {
      alert('❌ Erro ao alterar credenciais: ' + err.message);
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
      alert('❌ Digite o nome do banner');
      return;
    }
    
    if (!imagemFile && !modoEdicao) {
      alert('❌ Selecione uma imagem para o banner');
      return;
    }
    
    // Validar tamanho
    if (imagemFile && imagemFile.size > 5 * 1024 * 1024) {
      alert('❌ A imagem não pode ultrapassar 5MB');
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
            alert('✅ Banner atualizado com sucesso!');
          } else {
            // Modo criação
            await window.api.criarBanner({
              nome: nomeBanner,
              imagem: imagemData
            });
            alert('✅ Banner criado com sucesso!');
          }
          
          // Limpar form
          formBanners.reset();
          document.getElementById('previewNovo').style.display = 'none';
          const sbox = document.getElementById('simulacaoBanner');
          const info = document.getElementById('previewInfo');
          if (sbox) sbox.style.display = 'none';
          if (info) info.style.display = 'none';
          delete formBanners.dataset.modoEdicao;
          delete formBanners.dataset.bannerIndex;
          
          // Recarregar lista
          carregarBanners();
        };
        reader.readAsDataURL(imagemFile);
      } else if (modoEdicao) {
        // Editar sem mudar imagem
        await window.api.atualizarBanner(bannerIndex, {
          nome: nomeBanner
        });
        alert('✅ Banner atualizado com sucesso!');
        
        formBanners.reset();
        document.getElementById('previewNovo').style.display = 'none';
        const sbox = document.getElementById('simulacaoBanner');
        const info = document.getElementById('previewInfo');
        if (sbox) sbox.style.display = 'none';
        if (info) info.style.display = 'none';
        delete formBanners.dataset.modoEdicao;
        delete formBanners.dataset.bannerIndex;
        
        carregarBanners();
      }
    } catch (err) {
      alert('❌ Erro ao salvar banner: ' + err.message);
    }
  });
}
