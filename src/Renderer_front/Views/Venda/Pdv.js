import MensagemDeAlerta from '../../Services/MensagemDeAlerta.js';

class Pdv {
    constructor(){
        this.mensagem = new MensagemDeAlerta();
        this._produtos = [];
        this._carrinho = [];
    }

    async renderizar(){
        // carregar produtos
        this._produtos = await window.api.listarProdutos();
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
                const total = this._carrinho.reduce((s,i)=> s + i.total_item, 0);
                const venda = { itens: this._carrinho, total };
                const res = await window.api.criarVenda(venda);
                if (res && res.success) {
                    this.mensagem.sucesso('Venda registrada!');
                    // gerar cupom simples
                    const cupom = `Cupom - Venda #${res.id || res.uuid}\nTotal: R$ ${total.toFixed(2)}`;
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
