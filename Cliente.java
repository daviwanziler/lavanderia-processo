public class Cliente {

    private String nome;
    private boolean pagamentoRealizado;

    public Cliente(String nome) {
        this.nome = nome;
        this.pagamentoRealizado = false;
    }

    public String getNome() {
        return nome;
    }

    public boolean isPagamentoRealizado() {
        return pagamentoRealizado;
    }

    public void registrarPagamento() {
        pagamentoRealizado = true;
    }
}