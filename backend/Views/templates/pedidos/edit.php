<?php
$pedido = $dados['pedido'] ?? [];
?>

<div class="container mx-auto p-6 bg-gray-900 text-white min-h-screen">
    <h1 class="text-3xl font-bold mb-6 text-yellow-400 border-b border-gray-700 pb-2">
        Editar Pedido #<?php echo $pedido['id_pedido'] ?? 'N/A'; ?>
    </h1>

    <?php if (!empty($dados['mensagem'])): ?>
        <?php 
            $is_success = str_contains($dados['mensagem'], 'sucesso');
            $class = $is_success ? 'bg-green-600' : 'bg-red-600';
        ?>
        <div class="p-4 mb-6 rounded-lg <?php echo $class; ?>">
            <?php echo $dados['mensagem']; ?>
        </div>
    <?php endif; ?>

    <?php if (!empty($pedido) && isset($pedido['id_pedido'])): ?>

        <form action="/backend/pedido/atualizar/<?php echo (int)$pedido['id_pedido']; ?>" 
              method="POST" 
              class="space-y-6 bg-gray-800 p-8 rounded-xl shadow-xl">

            <!-- Data / Hora -->
            <div>
                <label for="data_pedido" class="font-semibold text-gray-300">Data e Hora:</label>
                <?php
                    $data_formatada = !empty($pedido['data_pedido']) 
                        ? date('Y-m-d\TH:i', strtotime($pedido['data_pedido'])) 
                        : '';
                ?>
                <input 
                    type="datetime-local" 
                    id="data_pedido" 
                    name="data_pedido"
                    value="<?php echo htmlspecialchars($data_formatada); ?>"
                    class="w-full p-3 rounded-lg bg-gray-700 text-yellow-300 border border-gray-600"
                    required>
            </div>

            <!-- Total -->
            <div>
                <label for="total_pedido" class="font-semibold text-gray-300">Total (R$):</label>
                <input 
                    type="number" 
                    step="0.01"
                    id="total_pedido" 
                    name="total_pedido"
                    value="<?php echo htmlspecialchars($pedido['total_pedido']); ?>"
                    class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600"
                    required>
            </div>

            <!-- Status -->
            <div>
                <label for="status_pedido" class="font-semibold text-gray-300">Status:</label>
                <select 
                    id="status_pedido" 
                    name="status_pedido"
                    class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600"
                    required>
                    <?php 
                        $statuses = ['pendente', 'pago', 'enviado', 'concluido', 'cancelado'];
                        $current = $pedido['status_pedido'] ?? '';
                        foreach ($statuses as $s):
                    ?>
                        <option value="<?php echo $s; ?>" 
                            <?php echo ($current === $s) ? 'selected' : ''; ?>>
                            <?php echo ucfirst($s); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <!-- Imagem -->
            <div>
                <label for="imagem" class="font-semibold text-gray-300">Imagem (URL):</label>
                <input 
                    type="text"
                    id="imagem" 
                    name="imagem"
                    value="<?php echo htmlspecialchars($pedido['imagem_pedidos'] ?? ''); ?>"
                    class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600">
                
                <?php if (!empty($pedido['imagem_pedidos'])): ?>
                    <p class="text-sm text-gray-400 mt-1">
                        Atual: <?php echo htmlspecialchars($pedido['imagem_pedidos']); ?>
                    </p>
                <?php endif; ?>
            </div>

            <input type="hidden" name="id_pedido" value="<?php echo $pedido['id_pedido']; ?>">

            <button 
                type="submit"
                class="w-full py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-bold text-white transition">
                Salvar Alterações
            </button>
        </form>

        <div class="mt-6 text-center">
            <a href="/backend/pedido/listar" 
               class="text-yellow-400 hover:text-yellow-300">
                &larr; Voltar para a Lista de Pedidos
            </a>
        </div>

    <?php else: ?>
        <div class="p-6 bg-red-700 rounded-lg">
            <h2 class="font-bold text-xl">Erro:</h2>
            <p>Pedido não encontrado.</p>
        </div>
    <?php endif; ?>
</div>
