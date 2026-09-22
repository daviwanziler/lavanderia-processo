public class Pedido {

    private int quantidadeRoupas;
    private int roupasSujas;
    private int roupasLavadas;

    public Pedido(int quantidadeRoupas) {
        this.quantidadeRoupas = quantidadeRoupas;
        this.roupasSujas = quantidadeRoupas;
        this.roupasLavadas = 0;
    }

    public int getQuantidadeRoupas() {
        return quantidadeRoupas;
    }

    public int getRoupasSujas() {
        return roupasSujas;
    }

    public int getRoupasLavadas() {
        return roupasLavadas;
    }

    public void atualizarLavagem(int roupasLavadas) {

        if (roupasLavadas < 0 || roupasLavadas > quantidadeRoupas) {
            throw new IllegalArgumentException(
                    "A quantidade de roupas lavadas é inválida."
            );
        }

        this.roupasLavadas = roupasLavadas;
        this.roupasSujas = quantidadeRoupas - roupasLavadas;
    }

    public boolean todasRoupasLavadas() {
        return roupasLavadas == quantidadeRoupas;
    }
}