let pedidos = [];

// ==========================================
// CADASTRAR PEDIDO
// ==========================================

function cadastrarPedido() {

    const nome = document.getElementById("nomeCliente").value.trim();

    const quantidade = Number(
        document.getElementById("quantidadeRoupas").value
    );

    const lavadas = Number(
        document.getElementById("roupasLavadasInput").value
    );

    const pagamento =
        document.getElementById("pagamento").value === "sim";


    // Validação do cliente

    if (nome === "") {

        alert("Digite o nome do cliente.");

        return;
    }


    // Validação da quantidade

    if (quantidade <= 0) {

        alert("A quantidade de roupas deve ser maior que zero.");

        return;
    }


    // Validação das roupas lavadas

    if (lavadas < 0 || lavadas > quantidade) {

        alert(
            "A quantidade de roupas lavadas deve estar entre 0 e "
            + quantidade
            + "."
        );

        return;
    }


    const sujas = quantidade - lavadas;


    const pedido = {

        id: Date.now(),

        cliente: nome,

        quantidade: quantidade,

        lavadas: lavadas,

        sujas: sujas,

        pagamento: pagamento
    };


    // Adiciona o pedido no site

    pedidos.push(pedido);


    // ==========================================
    // ENVIA O PEDIDO PARA O JAVA
    // ==========================================

    fetch("http://localhost:8080/pedido", {

        method: "POST",

        headers: {
            "Content-Type":
                "application/x-www-form-urlencoded"
        },

        body:
            "cliente=" + encodeURIComponent(nome)
            + "&roupas=" + encodeURIComponent(quantidade)
            + "&lavadas=" + encodeURIComponent(lavadas)
            + "&pagamento=" + encodeURIComponent(
                pagamento ? "Pago" : "Pendente"
            )
    })

    .then(function(resposta) {

        if (!resposta.ok) {

            throw new Error(
                "Erro ao enviar o pedido para o servidor Java."
            );
        }

        return resposta.text();
    })

    .then(function(mensagem) {

        console.log(
            "[Java] " + mensagem
        );

    })

    .catch(function(erro) {

        console.error(
            "[Java] Erro:",
            erro
        );

        alert(
            "Pedido cadastrado no site, " +
            "mas não foi possível enviar a notificação " +
            "para o Telegram."
        );

    });


    // Atualiza a tela

    atualizarTela();

    limparFormulario();
}


// ==========================================
// ATUALIZAR PEDIDOS
// ==========================================

function atualizarTela() {

    const lista =
        document.getElementById("listaPedidos");

    lista.innerHTML = "";


    if (pedidos.length === 0) {

        lista.innerHTML = `
            <p class="nenhum-pedido">
                Nenhum pedido cadastrado.
            </p>
        `;

        atualizarDashboard();

        return;
    }


    pedidos.forEach(function(pedido) {

        const podeEntregar =
            pedido.lavadas === pedido.quantidade
            && pedido.pagamento;


        const div =
            document.createElement("div");

        div.classList.add("pedido");


        div.innerHTML = `

            <div class="pedido-cabecalho">

                <div>

                    <h3>👤 ${pedido.cliente}</h3>

                    <small>
                        Pedido #${pedido.id}
                    </small>

                </div>


                <div>

                    ${
                        podeEntregar

                        ? `
                            <span class="status-pronto">
                                🟢 Liberado para entrega
                            </span>
                        `

                        : `
                            <span class="status-pendente">
                                🔴 Não pode ser entregue
                            </span>
                        `
                    }

                </div>

            </div>


            <div class="informacoes-pedido">

                <div>

                    <strong>👕 Total</strong>

                    <span>
                        ${pedido.quantidade}
                    </span>

                </div>


                <div>

                    <strong>🧼 Lavadas</strong>

                    <span>
                        ${pedido.lavadas}
                    </span>

                </div>


                <div>

                    <strong>🧺 Sujas</strong>

                    <span>
                        ${pedido.sujas}
                    </span>

                </div>


                <div>

                    <strong>💰 Pagamento</strong>

                    <span>

                        ${
                            pedido.pagamento

                            ? "🟢 Pago"

                            : "🔴 Pendente"
                        }

                    </span>

                </div>

            </div>


            <div class="acoes-pedido">

                <button
                    class="botao-editar"
                    onclick="editarPedido(${pedido.id})"
                >
                    ✏️ Editar
                </button>


                <button
                    class="botao-excluir"
                    onclick="excluirPedido(${pedido.id})"
                >
                    🗑️ Excluir
                </button>

            </div>

        `;


        lista.appendChild(div);

    });


    atualizarDashboard();
}


// ==========================================
// DASHBOARD
// ==========================================

function atualizarDashboard() {

    document.getElementById(
        "totalPedidos"
    ).textContent = pedidos.length;


    document.getElementById(
        "totalRoupas"
    ).textContent = pedidos.reduce(
        function(total, pedido) {

            return total + pedido.quantidade;

        },
        0
    );


    document.getElementById(
        "roupasLavadas"
    ).textContent = pedidos.reduce(
        function(total, pedido) {

            return total + pedido.lavadas;

        },
        0
    );


    document.getElementById(
        "pagamentosPendentes"
    ).textContent = pedidos.filter(
        function(pedido) {

            return !pedido.pagamento;

        }
    ).length;
}


// ==========================================
// EDITAR PEDIDO
// ==========================================

function editarPedido(id) {

    const pedido = pedidos.find(
        function(pedido) {

            return pedido.id === id;
        }
    );


    if (!pedido) {

        return;
    }


    document.getElementById(
        "nomeCliente"
    ).value = pedido.cliente;


    document.getElementById(
        "quantidadeRoupas"
    ).value = pedido.quantidade;


    document.getElementById(
        "roupasLavadasInput"
    ).value = pedido.lavadas;


    document.getElementById(
        "pagamento"
    ).value =
        pedido.pagamento
        ? "sim"
        : "nao";


    excluirPedido(id, false);


    document.querySelector(
        ".formulario"
    ).scrollIntoView({
        behavior: "smooth"
    });
}


// ==========================================
// EXCLUIR PEDIDO
// ==========================================

function excluirPedido(
    id,
    confirmar = true
) {

    if (confirmar) {

        const confirmarExclusao =
            confirm(
                "Deseja realmente excluir este pedido?"
            );


        if (!confirmarExclusao) {

            return;
        }
    }


    pedidos = pedidos.filter(
        function(pedido) {

            return pedido.id !== id;
        }
    );


    atualizarTela();
}


// ==========================================
// LIMPAR FORMULÁRIO
// ==========================================

function limparFormulario() {

    document.getElementById(
        "nomeCliente"
    ).value = "";


    document.getElementById(
        "quantidadeRoupas"
    ).value = "";


    document.getElementById(
        "roupasLavadasInput"
    ).value = "";


    document.getElementById(
        "pagamento"
    ).value = "nao";
}


// ==========================================
// BUSCAR CLIENTE
// ==========================================

document
    .getElementById("buscarCliente")
    .addEventListener(
        "input",
        function() {

            const busca =
                this.value.toLowerCase();


            const pedidosVisiveis =
                pedidos.filter(
                    function(pedido) {

                        return pedido.cliente
                            .toLowerCase()
                            .includes(busca);
                    }
                );


            const lista =
                document.getElementById(
                    "listaPedidos"
                );


            lista.innerHTML = "";


            pedidosVisiveis.forEach(
                function(pedido) {

                    const podeEntregar =
                        pedido.lavadas ===
                        pedido.quantidade
                        && pedido.pagamento;


                    const div =
                        document.createElement(
                            "div"
                        );


                    div.classList.add(
                        "pedido"
                    );


                    div.innerHTML = `

                        <div class="pedido-cabecalho">

                            <div>

                                <h3>
                                    👤 ${pedido.cliente}
                                </h3>

                                <small>
                                    Pedido #${pedido.id}
                                </small>

                            </div>


                            ${
                                podeEntregar

                                ? `
                                    <span class="status-pronto">
                                        🟢 Liberado para entrega
                                    </span>
                                `

                                : `
                                    <span class="status-pendente">
                                        🔴 Não pode ser entregue
                                    </span>
                                `
                            }

                        </div>


                        <div class="informacoes-pedido">

                            <div>

                                <strong>
                                    👕 Total
                                </strong>

                                <span>
                                    ${pedido.quantidade}
                                </span>

                            </div>


                            <div>

                                <strong>
                                    🧼 Lavadas
                                </strong>

                                <span>
                                    ${pedido.lavadas}
                                </span>

                            </div>


                            <div>

                                <strong>
                                    🧺 Sujas
                                </strong>

                                <span>
                                    ${pedido.sujas}
                                </span>

                            </div>


                            <div>

                                <strong>
                                    💰 Pagamento
                                </strong>

                                <span>

                                    ${
                                        pedido.pagamento
                                        ? "🟢 Pago"
                                        : "🔴 Pendente"
                                    }

                                </span>

                            </div>

                        </div>


                        <div class="acoes-pedido">

                            <button
                                class="botao-editar"
                                onclick="editarPedido(${pedido.id})"
                            >
                                ✏️ Editar
                            </button>


                            <button
                                class="botao-excluir"
                                onclick="excluirPedido(${pedido.id})"
                            >
                                🗑️ Excluir
                            </button>

                        </div>

                    `;


                    lista.appendChild(div);

                }
            );

        }
    );


// ==========================================
// NAVEGAÇÃO DO MENU
// ==========================================

document
    .querySelectorAll(".menu-item")
    .forEach(function(item) {

        item.addEventListener(
            "click",
            function(event) {

                event.preventDefault();


                document
                    .querySelectorAll(
                        ".menu-item"
                    )
                    .forEach(
                        function(menu) {

                            menu.classList.remove(
                                "ativo"
                            );

                        }
                    );


                item.classList.add(
                    "ativo"
                );


                const texto =
                    item.innerText.trim();


                if (
                    texto.includes("Pedidos")
                ) {

                    document
                        .querySelector(".pedidos")
                        .scrollIntoView({
                            behavior: "smooth"
                        });


                } else if (
                    texto.includes("Clientes")
                ) {

                    document
                        .querySelector(".clientes")
                        .scrollIntoView({
                            behavior: "smooth"
                        });


                } else if (
                    texto.includes("Início")
                ) {

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });


                } else {

                    alert(
                        "A área de "
                        + texto
                        + " será implementada "
                        + "nas próximas etapas."
                    );

                }

            }
        );

    });


// ==========================================
// CLIENTES
// ==========================================

let clientes = [];


function abrirCadastroCliente() {

    const formulario =
        document.getElementById(
            "clienteFormulario"
        );


    formulario.style.display =
        "block";


    document
        .getElementById(
            "nomeNovoCliente"
        )
        .focus();
}


function cadastrarCliente() {

    const campoNome =
        document.getElementById(
            "nomeNovoCliente"
        );


    const nome =
        campoNome.value.trim();


    if (nome === "") {

        alert(
            "Digite o nome do cliente."
        );

        return;
    }


    clientes.push({
        nome: nome
    });


    campoNome.value = "";


    atualizarClientes();
}


function atualizarClientes() {

    const lista =
        document.getElementById(
            "listaClientes"
        );


    if (clientes.length === 0) {

        lista.innerHTML = `

            <p class="nenhum-pedido">
                Nenhum cliente cadastrado.
            </p>

        `;

        return;
    }


    lista.innerHTML = "";


    clientes.forEach(
        function(cliente, index) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "cliente-card";


            card.innerHTML = `

                <div class="cliente-info">

                    <div class="cliente-icone">
                        👤
                    </div>


                    <div>

                        <h3>
                            ${cliente.nome}
                        </h3>

                        <p>
                            Cliente cadastrado
                            na Lavanderia Fresh
                        </p>

                    </div>

                </div>


                <button
                    class="botao-excluir"
                    onclick="excluirCliente(${index})"
                >
                    Excluir
                </button>

            `;


            lista.appendChild(card);

        }
    );
}


function excluirCliente(index) {

    if (
        !confirm(
            "Deseja realmente excluir este cliente?"
        )
    ) {

        return;
    }


    clientes.splice(
        index,
        1
    );


    atualizarClientes();
}