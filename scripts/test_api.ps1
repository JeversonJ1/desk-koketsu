param(
    [int]$Port = 3000
)

$base = "http://localhost:$Port/api"
Write-Host "Testando API em $base"

function Req($method, $path, $body=$null){
    $uri = "$base$path"
    Write-Host "--> $method $uri"
    try {
        if ($body -ne $null) {
            $json = $body | ConvertTo-Json -Depth 5
            $res = Invoke-RestMethod -Method $method -Uri $uri -Body $json -ContentType 'application/json'
        } else {
            $res = Invoke-RestMethod -Method $method -Uri $uri
        }
        Write-Host "SUCESSO:" -ForegroundColor Green
        $res | ConvertTo-Json -Depth 5
        return $res
    } catch {
        Write-Host "ERRO:" -ForegroundColor Red
        $_ | Format-List * -Force
        return $null
    }
}

# Health
Req GET '//health'

# Produtos: listar
$produtos = Req GET '/produtos'

# Criar produto de teste
$novo = Req POST '/produtos' @{ nome = 'TESTE API'; quantidade = 10; preco_custo = 10; preco_venda = 20 }

if ($novo -ne $null -and $novo.uuid) {
    $id = $novo.uuid
    # buscar criado
    Req GET "/produtos/$id"
    # atualizar
    Req PUT "/produtos/$id" @{ uuid = $id; nome = 'TESTE API ATUALIZADO'; quantidade = 5 }
    # deletar
    Req DELETE "/produtos/$id"
}

# Servicos
$servs = Req GET '/servicos'
$novoServ = Req POST '/servicos' @{ nome = 'SERVICO TESTE'; preco = 50 }
if ($novoServ -ne $null -and $novoServ.uuid) {
    $sid = $novoServ.uuid
    Req GET "/servicos/$sid"
    Req PUT "/servicos/$sid" @{ uuid = $sid; nome = 'SERVICO TESTE 2'; preco = 55 }
    Req DELETE "/servicos/$sid"
}

# Usuarios (listar)
Req GET '/usuarios'

# Vendas: criar
$itens = @(@{ uuid = 'fake-uuid'; nome='Item fake'; quantidade=1; preco_unitario=10 })
Req POST '/vendas' @{ itens = $itens }

Write-Host "Teste concluído." -ForegroundColor Cyan
