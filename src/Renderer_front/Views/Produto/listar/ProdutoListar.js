import ProdutosView from "../ProdutosView.js";
import MensagemDeAlerta from "../../../Services/MensagemDeAlerta.js";

class ProdutoListar {
    constructor() {
        this.view = new ProdutosView();
        this.mensagem = new MensagemDeAlerta();
    this._dadosCache = [];
    this._ordenacao = { coluna: null, direcao: 'asc' }; // direcao: 'asc' | 'desc'
    }

    aplicarOrdenacao(lista) {
        const col = this._ordenacao.coluna;
        const dir = this._ordenacao.direcao;
        if (!col) return lista;
        const mult = dir === 'asc' ? 1 : -1;
        // ordenar de forma genérica lidando com números e strings
        lista.sort((a, b) => {
            const va = a[col] == null ? '' : a[col];
            const vb = b[col] == null ? '' : b[col];
            // números
            if (!isNaN(Number(va)) && !isNaN(Number(vb))) {
                return (Number(va) - Number(vb)) * mult;
            }
            // strings
            return String(va).localeCompare(String(vb)) * mult;
        });
        return lista;
    }

    atualizarIndicadorOrdenacao() {
        const inds = document.querySelectorAll('.sort-ind');
        inds.forEach(ind => {
            const col = ind.getAttribute('data-col');
            if (this._ordenacao.coluna === col) {
                ind.textContent = this._ordenacao.direcao === 'asc' ? ' ▲' : ' ▼';
            } else {
                ind.textContent = '';
            }
        });
    }

    async renderizarLista() {
    const res = await window.api.listarProdutos();
    const dados = res && res.success ? (Array.isArray(res.data) ? res.data : []) : [];
    // manter cache local para buscas sem novo fetch
    this._dadosCache = dados || [];
    setTimeout(() => this.adicionarEventos(), 0);
    // aplicar ordenação atual antes de exibir
    const dadosParaRender = this.aplicarOrdenacao(this._dadosCache.slice());
    return this.view.renderizarLista(dadosParaRender);
    }

    adicionarEventos() {
        const container = document.querySelector('.container-estoque');
        const btnLogout = document.getElementById('btn_logout');
        if (btnLogout && !btnLogout.dataset.listener) {
            btnLogout.dataset.listener = '1';
            btnLogout.addEventListener('click', async () => {
                await window.api.logout();
                localStorage.removeItem('user');
                location.hash = '#/login';
            });
        }
    const inputBusca = document.getElementById('buscar_produto');
    const selectTamanho = document.getElementById('filtro_tamanho');
    const selectCategoria = document.getElementById('filtro_categoria');
    const inputPrecoMin = document.getElementById('filtro_preco_min');
    const inputPrecoMax = document.getElementById('filtro_preco_max');
    const selectOper = document.getElementById('filtro_qtd_operador');
    const inputQtd = document.getElementById('filtro_qtd_valor');
        // função que aplica filtros combinados
        const aplicarFiltros = () => {
            const termo = inputBusca ? inputBusca.value.trim().toLowerCase() : '';
            const tamanhoFiltro = selectTamanho ? (selectTamanho.value || '') : '';
            const oper = selectOper ? selectOper.value : '';
            const valor = inputQtd && inputQtd.value !== '' ? Number(inputQtd.value) : null;
            const categoriaFiltro = selectCategoria ? (selectCategoria.value || '') : '';
            const precoMin = inputPrecoMin && inputPrecoMin.value !== '' ? Number(inputPrecoMin.value) : null;
            const precoMax = inputPrecoMax && inputPrecoMax.value !== '' ? Number(inputPrecoMax.value) : null;

            let filtrados = this._dadosCache.slice();
            if (termo) filtrados = filtrados.filter(p => p.nome && p.nome.toLowerCase().includes(termo));
            if (tamanhoFiltro) filtrados = filtrados.filter(p => (p.tamanho||'').toString().toLowerCase() === tamanhoFiltro.toLowerCase());
            if (categoriaFiltro) filtrados = filtrados.filter(p => (p.categoria||'').toString().toLowerCase() === categoriaFiltro.toLowerCase());
            if (precoMin !== null) filtrados = filtrados.filter(p => (p.preco_venda !== null && p.preco_venda !== undefined) ? Number(p.preco_venda) >= precoMin : false);
            if (precoMax !== null) filtrados = filtrados.filter(p => (p.preco_venda !== null && p.preco_venda !== undefined) ? Number(p.preco_venda) <= precoMax : false);
            if (oper && valor !== null && !Number.isNaN(valor)) {
                if (oper === 'lt') filtrados = filtrados.filter(p => Number(p.quantidade) <= valor);
                if (oper === 'gt') filtrados = filtrados.filter(p => Number(p.quantidade) >= valor);
                if (oper === 'eq') filtrados = filtrados.filter(p => Number(p.quantidade) === valor);
            }

            const tbody = document.getElementById('produtos_tbody');
            if (tbody) tbody.innerHTML = this.view.renderizarLinhas(filtrados);
            setTimeout(() => this.adicionarEventos(), 0);
        };

        // evitar múltiplos listeners: marcar controles com data-listener
        if (inputBusca && !inputBusca.dataset.listener) {
            inputBusca.dataset.listener = '1';
            inputBusca.addEventListener('input', aplicarFiltros);
        }
        // popular o select de tamanhos e categorias com opções únicas
        if (selectTamanho && !selectTamanho.dataset.populated) {
            const tamanhos = Array.from(new Set((this._dadosCache || []).map(p => p.tamanho).filter(Boolean)));
            tamanhos.sort((a,b)=> String(a).localeCompare(String(b)));
            tamanhos.forEach(t => {
                const opt = document.createElement('option');
                opt.value = t; opt.textContent = t;
                selectTamanho.appendChild(opt);
            });
            selectTamanho.dataset.populated = '1';
            selectTamanho.addEventListener('change', aplicarFiltros);
        }
        if (selectCategoria && !selectCategoria.dataset.populated) {
            const categorias = Array.from(new Set((this._dadosCache || []).map(p => p.categoria).filter(Boolean)));
            categorias.sort((a,b)=> String(a).localeCompare(String(b)));
            categorias.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c; opt.textContent = c;
                selectCategoria.appendChild(opt);
            });
            selectCategoria.dataset.populated = '1';
            selectCategoria.addEventListener('change', aplicarFiltros);
        }
        if (inputPrecoMin && !inputPrecoMin.dataset.listener) { inputPrecoMin.dataset.listener = '1'; inputPrecoMin.addEventListener('input', aplicarFiltros); }
        if (inputPrecoMax && !inputPrecoMax.dataset.listener) { inputPrecoMax.dataset.listener = '1'; inputPrecoMax.addEventListener('input', aplicarFiltros); }
        if (selectOper && !selectOper.dataset.listener) {
            selectOper.dataset.listener = '1';
            selectOper.addEventListener('change', aplicarFiltros);
        }
        if (inputQtd && !inputQtd.dataset.listener) {
            inputQtd.dataset.listener = '1';
            inputQtd.addEventListener('input', aplicarFiltros);
        }

        // handlers para ordenação por coluna
        const ths = document.querySelectorAll('th[data-col]');
        ths.forEach(th => {
            const col = th.getAttribute('data-col');
            if (!th.dataset.listener) {
                th.dataset.listener = '1';
                th.addEventListener('click', () => {
                    if (this._ordenacao.coluna === col) {
                        // alterna direção
                        this._ordenacao.direcao = this._ordenacao.direcao === 'asc' ? 'desc' : 'asc';
                    } else {
                        this._ordenacao.coluna = col;
                        this._ordenacao.direcao = 'asc';
                    }
                    // aplicar filtros + ordenação
                    aplicarFiltros();
                    this.atualizarIndicadorOrdenacao();
                });
            }
    });
        // Evento para fechar modal
        const closeBtn = document.querySelector('.close-modal');
        if(closeBtn) closeBtn.onclick = () => this.view.fecharModal();

        container.addEventListener('click', async (e) => {
            const uuid = e.target.getAttribute('data-id');

            // --- EXCLUIR ---
            if (e.target.classList.contains('excluir-prod')) {
                if(confirm("Tem certeza que deseja excluir este item do estoque?")) {
                    const res = await window.api.removerProduto(uuid);
                    if (res && res.success) {
                        this.mensagem.sucesso("Produto removido!");
                        document.getElementById("app").innerHTML = await this.renderizarLista();
                    } else {
                        const msg = res && res.error ? res.error : 'Erro ao remover.';
                        this.mensagem.erro(msg);
                    }
                }
            }

            // --- EDITAR (Abrir Modal) ---
            if (e.target.classList.contains('editar-prod')) {
                const res = await window.api.buscarProduto(uuid);
                const produto = res && res.success ? res.data || res : null;
                if (produto) {
                    document.getElementById('edit_uuid').value = produto.uuid;
                    document.getElementById('edit_nome').value = produto.nome;
                    document.getElementById('edit_tamanho').value = produto.tamanho;
                    document.getElementById('edit_categoria').value = produto.categoria || '';
                    document.getElementById('edit_codigo_produto').value = produto.codigo_produto || '';
                    document.getElementById('edit_quantidade').value = produto.quantidade;
                    document.getElementById('edit_preco_venda').value = produto.preco_venda;
                    document.getElementById('edit_preco_custo').value = produto.preco_custo;
                    this.view.abrirModal();
                } else {
                    this.mensagem.erro('Produto não encontrado.');
                }
            }
        });

        // --- SALVAR EDIÇÃO ---
        const formEdit = document.getElementById('form-editar-produto');
        if(formEdit) {
            formEdit.addEventListener('submit', async (e) => {
                e.preventDefault();
                const produto = {
                    uuid: document.getElementById('edit_uuid').value,
                    nome: document.getElementById('edit_nome').value,
                    tamanho: document.getElementById('edit_tamanho').value,
                    categoria: document.getElementById('edit_categoria') ? document.getElementById('edit_categoria').value : undefined,
                    codigo_produto: document.getElementById('edit_codigo_produto') ? document.getElementById('edit_codigo_produto').value : undefined,
                    quantidade: document.getElementById('edit_quantidade').value,
                    preco_venda: document.getElementById('edit_preco_venda').value,
                    preco_custo: document.getElementById('edit_preco_custo').value
                };
                // se tiver arquivo selecionado, fazer upload
                const fileInput = document.getElementById('edit_imagem_produto');
                if (fileInput && fileInput.files && fileInput.files.length > 0) {
                    const filePath = fileInput.files[0].path;
                    const saved = await window.api.uploadImagem(filePath);
                    if (saved && saved.success) produto.imagem = saved.data && saved.data.path ? saved.data.path : null;
                }
                
                const res = await window.api.atualizarProduto(produto);
                if(res && res.success) {
                    this.mensagem.sucesso("Estoque atualizado!");
                    this.view.fecharModal();
                    document.getElementById("app").innerHTML = await this.renderizarLista();
                } else {
                    const msg = res && res.error ? res.error : 'Erro ao atualizar.';
                    this.mensagem.erro(msg);
                }
            });
        }
    }
}
export default ProdutoListar;