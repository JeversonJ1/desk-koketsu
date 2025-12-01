class Servicos {
  constructor() {
    this.servicos = [
      { id: 1, nome: "pintura", preço: 1500 },
      { id: 2, nome: "reforma de banheiro", preço: 5000 },
    ];
    this.nextId = 3;
  }

  adicionar(servico) {
    const novoServico = { ...servico, id: this.nextId++ };
    this.servicos.push(novoServico);
    return novoServico;
  }

  listar() {
    return this.servicos;
  }

  remover(id) {
   
    const index = this.servicos.findIndex(s => s.id === id);
    if (index !== -1) {
      this.servicos.splice(index, 1);
      return true;
    }
    return false;
  }
}
export default Servicos;