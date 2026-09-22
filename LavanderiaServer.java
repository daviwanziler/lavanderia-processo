import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

public class LavanderiaServer {

    public static void main(String[] args) throws IOException {

        HttpServer servidor = HttpServer.create(
                new InetSocketAddress(8080),
                0
        );

        servidor.createContext(
                "/pedido",
                LavanderiaServer::receberPedido
        );

        servidor.start();

        System.out.println("======================================");
        System.out.println("   SERVIDOR LAVANDERIA FRESH");
        System.out.println("======================================");
        System.out.println("Servidor iniciado em:");
        System.out.println("http://localhost:8080");
        System.out.println();
        System.out.println("Aguardando pedidos do site...");
    }


    private static void receberPedido(
            HttpExchange exchange
    ) throws IOException {

        // Permite que o site se comunique com o Java

        Headers headers =
                exchange.getResponseHeaders();

        headers.add(
                "Access-Control-Allow-Origin",
                "*"
        );

        headers.add(
                "Access-Control-Allow-Methods",
                "POST, OPTIONS"
        );

        headers.add(
                "Access-Control-Allow-Headers",
                "Content-Type"
        );


        // Trata a verificação CORS do navegador

        if (
                exchange.getRequestMethod()
                        .equalsIgnoreCase("OPTIONS")
        ) {

            exchange.sendResponseHeaders(
                    204,
                    -1
            );

            exchange.close();

            return;
        }


        // Aceita somente POST

        if (
                !exchange.getRequestMethod()
                        .equalsIgnoreCase("POST")
        ) {

            enviarResposta(
                    exchange,
                    405,
                    "Método não permitido."
            );

            return;
        }


        // Lê os dados enviados pelo site

        String corpo =
                new String(
                        exchange
                                .getRequestBody()
                                .readAllBytes(),
                        StandardCharsets.UTF_8
                );


        String cliente =
                obterValor(
                        corpo,
                        "cliente"
                );


        String roupas =
                obterValor(
                        corpo,
                        "roupas"
                );


        String lavadas =
                obterValor(
                        corpo,
                        "lavadas"
                );


        String pagamento =
                obterValor(
                        corpo,
                        "pagamento"
                );


        // Mostra o pedido no terminal

        System.out.println();
        System.out.println(
                "--------------------------------------"
        );

        System.out.println(
                "NOVO PEDIDO RECEBIDO"
        );

        System.out.println(
                "--------------------------------------"
        );

        System.out.println(
                "Cliente: " + cliente
        );

        System.out.println(
                "Roupas: " + roupas
        );

        System.out.println(
                "Lavadas: " + lavadas
        );

        System.out.println(
                "Pagamento: " + pagamento
        );


        // ==========================================
        // TELEGRAM
        // ==========================================

        TelegramService telegram =
                new TelegramService();


        String mensagem =
                "🧺 NOVO PEDIDO - LAVANDERIA FRESH\n\n"
                + "👤 Cliente: " + cliente + "\n"
                + "👕 Roupas: " + roupas + "\n"
                + "🧼 Lavadas: " + lavadas + "\n"
                + "💰 Pagamento: " + pagamento;


        telegram.enviarMensagem(
                mensagem
        );


        // Resposta para o site

        enviarResposta(
                exchange,
                200,
                "Pedido recebido com sucesso!"
        );
    }


    private static String obterValor(
            String corpo,
            String chave
    ) {

        String[] partes =
                corpo.split("&");


        for (
                String parte : partes
        ) {

            String[] campo =
                    parte.split(
                            "=",
                            2
                    );


            if (
                    campo.length == 2
                    && campo[0].equals(chave)
            ) {

                return URLDecoder.decode(
                        campo[1],
                        StandardCharsets.UTF_8
                );
            }
        }


        return "";
    }


    private static void enviarResposta(
            HttpExchange exchange,
            int codigo,
            String mensagem
    ) throws IOException {

        byte[] resposta =
                mensagem.getBytes(
                        StandardCharsets.UTF_8
                );


        exchange.getResponseHeaders().set(
                "Content-Type",
                "text/plain; charset=UTF-8"
        );


        exchange.sendResponseHeaders(
                codigo,
                resposta.length
        );


        try (
                OutputStream saida =
                        exchange.getResponseBody()
        ) {

            saida.write(
                    resposta
            );
        }
    }
}