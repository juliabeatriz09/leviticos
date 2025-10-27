async function cadastrarata(event) {
    event.preventDefault();

    const ata = {
        aluno: document.getElementById("ataAluno").value,
        cgm: document.getElementById("ataAluno").value,
        dia: document.getElementById("ataData").value,
        assunto: document.getElementById("ataAssunto").value,
        conteudo: document.getElementById("ataConteudo").value,
        encaminhamento: document.getElementById("ataEncaminhamentos").value,
        monitor: document.getElementById("ataMonitor").value,
        prof: document.getElementById("ataProfessor").value,
    };

    try {
        const response = await fetch("/turma", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(turma),
        });

        const result = await response.json();
        if (response.ok) {
            alert("turma cadastrado com sucesso!");
            //document.getElementById('ata-atarm').reset();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar turma");
    }
}

// Função para listar todos as turmas
async function listarturma() {
    const nome_turma = document.getElementById("turma-nome").value.trim();
    const codigo = document.getElementById("turma-codigo").value.trim();
    const turno = document.getElementById("turma-turno").value.trim();
    const curso = document.getElementById("turma-curso").value.trim();
    const ano = document.getElementById("turma-ano").value.trim();
    const capacidade = document.getElementById("turma-capacidade").value.trim();
    const sala = document.getElementById("turma-sala").value.trim();
    const coordenador = document.getElementById("turma-coordenandor").value.trim();

    let url = "/turma"; // URL padrão

    if (codigo) {
        url += `?codigo=${codigo}`;
    }

    try {
        const respo = await fetch(url);
        if (!respo.ok) throw new Error(`Erro HTTP: ${respo.status}`);
        const turma = await respo.json();

        const tabela = document.getElementById("tabela-turma");
        tabela.innerHTML = "";

        if (!Array.isArray(turma) || turma.length === 0) {
            tabela.innerHTML = '<tr><td colspan="8">Nenhum turma encontrado.</td></tr>';
        } else {
            ata.forEach((turmaItem) => {
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${turmaItem.nome_turma}</td>
                    <td>${turmaItem.codigo}</td>
                    <td>${turmaItem.turno}</td>
                    <td>${turmaItem.curso}</td>
                    <td>${turmaItem.ano}</td>
                    <td>${turmaItem.capacidade}</td>
                    <td>${turmaItem.sala}</td>
                     <td>${turmaItem.coordenador}</td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error("Erro ao listar ata:", error);
    }
}

// Função para atualizar as informações da ata
async function atualizarturma() {
    const nome_turma = document.getElementById("turma-nome").value;
    const codigo = document.getElementById("turma-codigo").value;
    const turno = document.getElementById("turma-turno").value;
    const curso = document.getElementById("turma-curso").value;
    const ano = document.getElementById("turma-ano").value;
    const capacidade = document.getElementById("turma-capacidade").value;
    const sala = document.getElementById("turma-sala").value;
    const coordenador = document.getElementById("turma-coordenandor").value;

    if (!codigo) {
        alert("Informe o Codigo para atualizar a turma.");
        return;
    }

    const turmaAtualizado = {  };

    try {
        const respo = await fetch(`/turma/codigo/${codigo}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(turmaAtualizado),
        });

        if (respo.ok) {
            alert("turma atualizada com sucesso!");
        } else {
            const errorMessage = await respo.text();
            alert("Erro ao atualizar ata: " + errorMessage);
        }
    } catch (error) {
        console.error("Erro ao atualizar turma:", error);
        alert("Erro ao atualizar turma.");
    }
}
