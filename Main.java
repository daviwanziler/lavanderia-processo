import java.util.ArrayList;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);
        ArrayList<Cliente> clientes = new ArrayList<>();
        TelegramService telegram = new TelegramService();

        System.out.println("======================================");
        System.out.println("     SISTEMA DE CONTROLE DE LAVANDERIA");
        System.out.println("======================================");

        System.out.print("Digite o nome do cliente: ");
        String nome = scanner.nextLine();

        System.out.print("Digite a quantidade de roupas: ");
        int quantidadeRoupas = scanner.nextInt();

        Cliente cliente = new Cliente(nome);
        Pedido pedido = new Pedido(quantidadeRoupas);

        clientes.add(cliente);

        System.out.println("\nCliente cadastrado com sucesso!");
        System.out.println("Cliente: " + cliente.getNome());
        System.out.println(
                "Quantidade de roupas: "
                + pedido.getQuantidadeRoupas()
        );

        System.out.println("Roupas sujas: "
                + pedido.getRoupasSujas());

        System.out.println("Roupas lavadas: "
                + pedido.getRoupasLavadas());

        System.out.println("\n--------------------------------------");
        System.out.println("Atualização do processo de lavagem");
        System.out.println("--------------------------------------");

        System.out.print(
                "Digite a quantidade de roupas que foram lavadas: "
        );

        int roupasLavadas = scanner.nextInt();

        try {

            pedido.atualizarLavagem(roupasLavadas);

            System.out.println(
                    "\nQuantidade de roupas lavadas: "
                    + pedido.getRoupasLavadas()
            );

            System.out.println(
                    "Quantidade de roupas sujas: "
                    + pedido.getRoupasSujas()
            );

        } catch (IllegalArgumentException e) {

            System.out.println(
                    "\nErro: " + e.getMessage()
            );

            scanner.close();
            return;
        }

        System.out.println("\n--------------------------------------");
        System.out.println("Pagamento");
        System.out.println("--------------------------------------");

        System.out.print(
                "O cliente realizou o pagamento? "
                + "(1 = Sim / 2 = Não): "
        );

        int pagamento = scanner.nextInt();

        if (pagamento == 1) {

            cliente.registrarPagamento();

            System.out.println(
                    "Pagamento registrado."
            );

        } else {

            System.out.println(
                    "Pagamento pendente."
            );
        }

        System.out.println("\n--------------------------------------");
        System.out.println("Status do pedido");
        System.out.println("--------------------------------------");

        System.out.println(
                "Cliente: " + cliente.getNome()
        );

        System.out.println(
                "Roupas: " + pedido.getQuantidadeRoupas()
        );

        System.out.println(
                "Lavadas: " + pedido.getRoupasLavadas()
        );

        System.out.println(
                "Sujas: " + pedido.getRoupasSujas()
        );

        System.out.println(
                "Pagamento realizado: "
                + (cliente.isPagamentoRealizado()
                ? "Sim"
                : "Não")
        );

        boolean podeReceber =
                pedido.todasRoupasLavadas()
                && cliente.isPagamentoRealizado();

        if (podeReceber) {

            System.out.println(
                    "\nPedido liberado para entrega!"
            );

            String mensagem =
                    "Olá, " + cliente.getNome()
                    + "! Seu pedido está pronto para entrega. "
                    + "Todas as roupas foram lavadas "
                    + "e o pagamento foi realizado.";

            telegram.enviarMensagem(mensagem);

        } else {

            System.out.println(
                    "\nPedido ainda não pode ser entregue."
            );

            if (!pedido.todasRoupasLavadas()) {

                System.out.println(
                        "- Existem roupas que ainda não foram lavadas."
                );
            }

            if (!cliente.isPagamentoRealizado()) {

                System.out.println(
                        "- O pagamento ainda não foi realizado."
                );
            }

            String mensagem =
                    "Atualização do pedido de "
                    + cliente.getNome()
                    + ": o pedido ainda não está "
                    + "liberado para entrega.";

            telegram.enviarMensagem(mensagem);
        }

        System.out.println("\n======================================");
        System.out.println("Sistema finalizado.");
        System.out.println("======================================");

        scanner.close();
    }
}