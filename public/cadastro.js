async function cadastrarAluno(event) {
    event.preventDefault();

    const aluno = {
        nome: document.getElementById("aluno-nome").value,
        telefone: document.getElementById("aluno-telefone").value,
        email: document.getElementById("aluno-email").value,
        cpf: document.getElementById("aluno-cpf").value,
        rg: document.getElementById("aluno-rg").value,
        genero: document.getElementById("aluno-genero").value,
        data_de_nascimento: document.getElementById("aluno-data-nascimento").value,
        cep: document.getElementById("aluno-cep").value,
        logradouro: document.getElementById("aluno-logradouro").value,
        numero: document.getElementById("aluno-numero").value,
        complemento: document.getElementById("aluno-complemento").value,
        cidade: document.getElementById("aluno-cidade").value,
        bairro: document.getElementById("aluno-bairro").value,
        estado: document.getElementById("aluno-estado").value,
        cgm: document.getElementById("aluno-matricula").value,
        curso: document.getElementById("aluno-curso").value,
        turma: document.getElementById("aluno-turma").value,
        turno: document.getElementById("aluno-turno").value,
        nome_responsavel: document.getElementById("resp0-nome").value,
        telefone_responsavel: document.getElementById("resp0-telefone").value,
        parentesco_responsavel: document.getElementById("resp0-parentesco").value,
        cpf_responsavel: document.getElementById("resp0-cpf").value,
        email_responsavel: document.getElementById("resp0-email").value,
    };

    try {
        const respo = await fetch("/aluno", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(aluno),
        });

        const result = await respo.json();
        if (respo.ok) {
            alert("Aluno cadastrado com sucesso!");
            // document.getElementById('aluno-form').reset(); // Descomente se necessário
        } else {
            alert(`Erro: ${result.message || "Erro desconhecido"}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar aluno.");
    }
}

// Função para listar todos os alunos ou buscar alunos por CPF
async function listarAlunos() {
    // const cpf = document.getElementById('cpf').value.trim();  // Pega o valor do CPF digitado no input
    //const nome = document.getElementById('aluno-nome').value.trim();
    const cgm = document.getElementById("aluno-matricula").value.trim();
    //const email = document.getElementById('aluno-email').value.trim();
    //const telefone_responsavel = document.getElementById('resp0-telefone').value.trim();

    let url = "/alunos"; // URL padrão para todos os alunos

    if (cgm) {
        // Se CPF foi digitado, adiciona o parâmetro de consulta
        url += `?cgm=${cgm}`;
    }

    try {
        const response = await fetch(url);
        const alunos = await response.json();

        const tabela = document.getElementById("tabela-aluno");
        tabela.innerHTML = ""; // Limpa a tabela antes de preencher

        if (alunos.length === 0) {
            alert("asdfasdf");
            // Caso não encontre aluno, exibe uma mensagem
            tabela.innerHTML =
                '<tr><td colspan="6">Nenhum aluno encontrado.</td></tr>';
        } else {
            alert("ate aqui vaiggd");
            alunos.forEach((aluno) => {
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${aluno.nome}</td>
                    <td>${aluno.cgm}</td>
                    <td>${aluno.cpf}</td>
                    <td>${aluno.email}</td>
                     <td>${aluno.turma}</td>
                    <td>${aluno.telefone}</td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error("Erro ao listar alunos:", error);
    }
}

// Função para atualizar as informações do aluno
async function atualizarAluno() {
    const nome = document.getElementById("aluno-nome").value;
    const cgm = document.getElementById("aluno-cgm").value;
    const cpf = document.getElementById("aluno-cpf").value;
    const email = document.getElementById("aluno-email").value;
    const turma = document.getElementById("aluno-turma").value;
    const telefone_responsavel =
        document.getElementById("resp0-telefone").value;

    const alunoAtualizado = {
        nome,
        cgm,
        cpf,
        email,
        turma,
        telefone_responsavel,
    };

    try {
        const respo = await fetch(`/alunos/cpf/${cpf}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(alunoAtualizado),
        });

        if (respo.ok) {
            alert("Aluno atualizado com sucesso!");
        } else {
            const errorMessage = await respo.text();
            alert("Erro ao atualizar aluno: " + errorMessage);
        }
    } catch (error) {
        console.error("Erro ao atualizar aluno:", error);
        alert("Erro ao atualizar aluno.");
    }
}
