# Lavanderia-Processo
Aplicação de terminal desenvolvida em Java para controle de roupas e clientes de uma lavanderia, com acompanhamento de pagamentos, status das roupas e integração com a API do Telegram.

🧺 Sistema de Controle de Lavanderia

Projeto desenvolvido para a disciplina de Projeto e Engenharia de Software, utilizando o conceito de Desenvolvimento Iterativo e Vibe Coding.

📋 Escopo do Projeto

Uma aplicação de terminal (CLI) para auxiliar no controle de uma marca de lavanderia, permitindo contabilizar e acompanhar as roupas dos clientes durante o processo de lavagem e entrega.

A aplicação deverá controlar as roupas recebidas pela lavanderia, separando-as entre roupas sujas e roupas lavadas. As roupas deverão estar relacionadas aos seus respectivos clientes.

O sistema também deverá controlar a situação dos clientes, verificando se o pagamento foi realizado e se as roupas estão disponíveis para entrega.

A entrega das roupas somente deverá prosseguir quando as condições necessárias forem atendidas: a roupa deverá estar lavada e o cliente deverá ter efetuado o pagamento.

Além disso, a aplicação utilizará a API pública do GitHub como parte da integração com uma API externa.

🎯 Objetivo

O objetivo do projeto é desenvolver uma aplicação simples para auxiliar no controle das roupas e dos clientes de uma lavanderia, permitindo acompanhar o processo desde o recebimento das roupas até a liberação para entrega.

O sistema deverá permitir:

Contabilizar as roupas recebidas pela lavanderia;
Identificar a quantidade de roupas sujas;
Identificar a quantidade de roupas lavadas;
Associar as roupas aos respectivos clientes;
Verificar a situação dos clientes;
Identificar clientes que efetuaram o pagamento;
Identificar clientes com pagamento pendente;
Verificar se o cliente pode receber suas roupas;
Informar quando a entrega não pode prosseguir;
Consumir informações de uma API pública.

🚀 MVP — Produto Mínimo Viável

A primeira versão da aplicação deverá possuir as funcionalidades essenciais para o controle básico da lavanderia.

Controle das roupas

O sistema deverá permitir registrar e contabilizar as roupas, identificando seu estado:

Suja: roupa recebida pela lavanderia que ainda não passou pelo processo de lavagem;
Lavada: roupa que já passou pelo processo de lavagem e está disponível para as próximas etapas.
Controle dos clientes

O sistema deverá permitir relacionar as roupas aos respectivos clientes e verificar a situação de cada cliente.

O cliente poderá possuir uma das seguintes situações de pagamento:

Pagamento realizado;
Pagamento pendente.
Liberação da entrega

Para determinar se uma roupa poderá ser entregue, o sistema deverá verificar:

Se a roupa está lavada;
Se o cliente realizou o pagamento.

Quando as duas condições forem atendidas, a entrega poderá prosseguir.

Caso alguma condição não seja atendida, o sistema deverá informar que a entrega não poderá prosseguir.

🔗 API Pública
GitHub API

A aplicação utilizará a API pública do GitHub como parte do projeto.

A API será utilizada para realizar uma comunicação com um serviço externo e obter informações públicas de usuários do GitHub.

O desenvolvimento será realizado de forma iterativa, permitindo analisar a evolução do código ao longo do projeto.
