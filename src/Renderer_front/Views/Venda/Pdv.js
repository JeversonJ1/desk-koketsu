import MensagemDeAlerta from '../../Services/MensagemDeAlerta.js';

class Pdv {
    constructor(){
        this.mensagem = new MensagemDeAlerta();
        this._produtos = [];
        this._carrinho = [];
    }

    async renderizar(){
    // carregar produtos
    const res = await window.api.listarProdutos();
    this._produtos = res && res.success ? (Array.isArray(res.data) ? res.data : []) : [];
        setTimeout(()=> this.adicionarEventos(), 0);
        return this._template();
    }

    _template(){
        const options = (this._produtos || []).map(p => `<option value="${p.uuid}">${p.nome} — R$ ${p.preco_venda} — Qtd: ${p.quantidade}</option>`).join('');
        return `
            <div class="pdv-container">
                <h2>PDV - Vendas</h2>
                <div style="display:flex; gap:10px; align-items:center;">
                    <select id="pdv_produto">${options}</select>
                    <input type="number" id="pdv_qtd" value="1" min="1" style="width:80px;">
                    <button id="pdv_add">Adicionar</button>
                </div>
                <h3>Carrinho</h3>
                <div id="pdv_carrinho">Nenhum item</div>
                                <!-- Opções de pagamento (rádios customizados) -->
                                <style>
                                /* Styles scoped ao PDV para rádios customizados */
                                .pdv-radio { display:block; position:relative; padding-left:35px; margin-bottom:8px; cursor:pointer; font-size:16px; -webkit-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none; }
                                .pdv-radio input { position:absolute; opacity:0; cursor:pointer; }
                                .pdv-checkmark { position:absolute; top:0; left:0; height:20px; width:20px; background-color:#eee; border-radius:50%; }
                                .pdv-radio:hover input ~ .pdv-checkmark { background-color:#ccc; }
                                .pdv-radio input:checked ~ .pdv-checkmark { background-color:#2196F3; }
                                .pdv-checkmark:after { content:""; position:absolute; display:none; }
                                .pdv-radio input:checked ~ .pdv-checkmark:after { display:block; }
                                .pdv-radio .pdv-checkmark:after { top:6px; left:6px; width:8px; height:8px; border-radius:50%; background:#fff; }
                                .pdv-pagamento { margin-top:10px; }
                                </style>

                                <div class="pdv-pagamento">
                                        <h4>Forma de pagamento</h4>
                                        <label class="pdv-radio">Dinheiro
                                            <input type="radio" name="pdv_pagamento" value="dinheiro" checked>
                                            <span class="pdv-checkmark"></span>
                                        </label>
                                        <label class="pdv-radio">Cartão
                                            <input type="radio" name="pdv_pagamento" value="cartao">
                                            <span class="pdv-checkmark"></span>
                                        </label>
                                        <label class="pdv-radio">Pix
                                            <input type="radio" name="pdv_pagamento" value="pix">
                                            <span class="pdv-checkmark"></span>
                                        </label>
                                </div>

                                <div style="margin-top:10px;"><button id="pdv_finalizar">Finalizar Venda</button></div>
            </div>
        `;
    }

    adicionarEventos(){
        const btnAdd = document.getElementById('pdv_add');
        if (btnAdd && !btnAdd.dataset.listener) {
            btnAdd.dataset.listener = '1';
            btnAdd.addEventListener('click', async ()=>{
                const uuid = document.getElementById('pdv_produto').value;
                const qtd = Number(document.getElementById('pdv_qtd').value || 1);
                const prod = this._produtos.find(p => p.uuid === uuid);
                if (!prod) return;
                this._carrinho.push({ uuid: prod.uuid, nome: prod.nome, quantidade: qtd, preco_unitario: prod.preco_venda, total_item: Number(prod.preco_venda) * qtd });
                this._renderCarrinho();
            });
        }

        const btnFin = document.getElementById('pdv_finalizar');
        if (btnFin && !btnFin.dataset.listener) {
            btnFin.dataset.listener = '1';
            btnFin.addEventListener('click', async ()=>{
                if (this._carrinho.length === 0) { this.mensagem.erro('Carrinho vazio'); return; }
                // obter forma de pagamento selecionada
                const forma = (document.querySelector('input[name="pdv_pagamento"]:checked') || {}).value || 'nao_informado';
                const total = this._carrinho.reduce((s,i)=> s + i.total_item, 0);
                const venda = { itens: this._carrinho, total, pagamento: forma };
                const res = await window.api.criarVenda(venda);
                if (res && res.success) {
                    this.mensagem.sucesso('Venda registrada!');
                    // gerar cupom simples com forma de pagamento
                    const cupom = `Cupom - Venda #${res.id || res.uuid}\nTotal: R$ ${total.toFixed(2)}\nPagamento: ${forma}`;
                    console.log(cupom);
                    this._carrinho = [];
                    document.getElementById('pdv_carrinho').innerText = 'Nenhum item';
                } else {
                    this.mensagem.erro('Erro ao registrar venda');
                }
            });
        }
    }

    _renderCarrinho(){
        const container = document.getElementById('pdv_carrinho');
        if (!container) return;
        const html = this._carrinho.map((i, idx) => `<div>${idx+1}. ${i.nome} x${i.quantidade} — R$ ${i.total_item.toFixed(2)}</div>`).join('');
        container.innerHTML = html || 'Nenhum item';
    }
}

export default Pdv;
