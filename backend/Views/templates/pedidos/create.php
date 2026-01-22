<div class="container" style="max-width: 600px; margin: 40px auto; padding: 25px; border: 1px solid #eee; border-radius: 6px; background-color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
    
    <h2 style="text-align: center; color: #333; margin-bottom: 30px; border-bottom: 2px solid #ffc107; padding-bottom: 10px;">Novo Pedido</h2>

    <form action="/backend/pedido/salvar" method="post" style="display: flex; flex-direction: column; gap: 20px;">
        
        <div>
            <h4 style="color: #555; margin-bottom: 15px;">Informações Básicas</h4>

            <label for="id_perfil" style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">ID do Perfil (Obrigatório):</label>
            <input type="number" id="id_perfil" name="id_perfil" placeholder="Ex: 5 (Deve existir na tabela de Perfis)" required style="width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 15px;">

            <label for="data_pedido" style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">Data do Pedido:</label>
            <input type="date" id="data_pedido" name="data_pedido" required style="width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 15px;">

            <label for="total_pedido" style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">Total do Pedido (R$):</label>
            <input type="number" step="0.01" id="total_pedido" name="total_pedido" placeholder="500.00" required style="width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 15px;">

            <label for="status_pedido" style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">Status:</label>
            <select id="status_pedido" name="status_pedido" required style="width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
                <option value="pendente" selected>Pendente</option>
                <option value="pago">Pago</option>
                <option value="cancelado">Cancelado</option>
            </select>
        </div>

        <div style="border: 1px solid #ffc107; padding: 15px; border-radius: 5px; background-color: #fffaf0;">
            <h4 style="color: #555; margin-top: 0; margin-bottom: 15px;">Item (Produto Inicial)</h4>

            <label for="id_produto" style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">ID do Produto:</label>
            <input type="number" id="id_produto" name="itens[0][id_produto]" placeholder="Ex: 101 (Deve existir na tabela de Produtos)" required style="width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 15px;">

            <label for="quantidade" style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">Quantidade:</label>
            <input type="number" id="quantidade" name="itens[0][quantidade]" placeholder="1" value="1" required style="width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 15px;">
            
            <label for="preco_unitario" style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">Preço Unitário (R$):</label>
            <input type="number" step="0.01" id="preco_unitario" name="itens[0][preco_unitario]" placeholder="10.50" required style="width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
        </div>
        
        <button type="submit" style="padding: 12px 20px; background-color: #ffc107; color: #333; border: none; border-radius: 4px; cursor: pointer; font-size: 18px; font-weight: bold; transition: background-color 0.3s ease;">
            Salvar Pedido
        </button>
    </form>
</div>