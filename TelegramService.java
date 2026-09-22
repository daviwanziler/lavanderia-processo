import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

public class TelegramService {

    public void enviarMensagem(String mensagem) {

        String token = System.getenv("TELEGRAM_BOT_TOKEN");
        String chatId = System.getenv("TELEGRAM_CHAT_ID");

        if (token == null || token.isEmpty()
                || chatId == null || chatId.isEmpty()) {

            System.out.println(
                    "[Telegram] Token ou Chat ID não configurado."
            );

            return;
        }

        try {

            String textoCodificado = URLEncoder.encode(
                    mensagem,
                    StandardCharsets.UTF_8
            );

            String endereco =
                    "https://api.telegram.org/bot"
                    + token
                    + "/sendMessage?chat_id="
                    + chatId
                    + "&text="
                    + textoCodificado;

            HttpClient clienteHttp = HttpClient.newHttpClient();

            HttpRequest requisicao = HttpRequest.newBuilder()
                    .uri(URI.create(endereco))
                    .GET()
                    .build();

            HttpResponse<String> resposta =
                    clienteHttp.send(
                            requisicao,
                            HttpResponse.BodyHandlers.ofString()
                    );

            if (resposta.statusCode() == 200) {

                System.out.println(
                        "[Telegram] Mensagem enviada com sucesso!"
                );

            } else {

                System.out.println(
                        "[Telegram] Erro ao enviar mensagem."
                );

                System.out.println(
                        "Código HTTP: " + resposta.statusCode()
                );
            }

        } catch (Exception e) {

            System.out.println(
                    "[Telegram] Não foi possível enviar a mensagem."
            );

            System.out.println(
                    "Erro: " + e.getMessage()
            );
        }
    }
}