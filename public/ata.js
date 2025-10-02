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
        const response = await fetch("/ata", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(ata),
        });

        const result = await response.json();
        if (response.ok) {
            alert("ata cadastrado com sucesso!");
            //document.getElementById('ata-atarm').reset();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar ata");
    }
}

// Função para listar todos as atas
async function listarata() {
    const aluno = document.getElementById("ataAluno").value.trim();
    const cgm = document.getElementById("ataCgm").value.trim();
    const prof = document.getElementById("ataProfessor").value.trim();
    const monitor = document.getElementById("ataMonitor").value.trim();
    const encaminhamento = document.getElementById("ataEncaminhamentos").value.trim();
    const assunto = document.getElementById("ataAssunto").value.trim();
    const dia = document.getElementById("ataData").value.trim();
    const conteudo = document.getElementById("ataConteudo").value.trim();

    let url = "/ata"; // URL padrão

    if (cgm) {
        url += `?cgm=${cgm}`;
    }

    try {
        const respo = await fetch(url);
        if (!respo.ok) throw new Error(`Erro HTTP: ${respo.status}`);
        const ata = await respo.json();

        const tabela = document.getElementById("tabela-ata");
        tabela.innerHTML = "";

        if (!Array.isArray(ata) || ata.length === 0) {
            tabela.innerHTML = '<tr><td colspan="8">Nenhum ata encontrado.</td></tr>';
        } else {
            ata.forEach((ataItem) => {
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${ataItem.aluno}</td>
                    <td>${ataItem.cgm}</td>
                    <td>${ataItem.monitor}</td>
                    <td>${ataItem.prof}</td>
                    <td>${ataItem.encaminhamento}</td>
                    <td>${ataItem.assunto}</td>
                    <td>${ataItem.dia}</td>
                    <td>${ataItem.conteudo}</td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error("Erro ao listar ata:", error);
    }
}

// Função para atualizar as informações da ata
async function atualizarata() {
    const aluno = document.getElementById("ataAluno").value;
    const cgm = document.getElementById("ataCgm").value;
    const dia = document.getElementById("ataData").value;
    const assunto = document.getElementById("ataAssunto").value;
    const conteudo = document.getElementById("ataConteudo").value;
    const monitor = document.getElementById("ataMonitor").value;
    const prof = document.getElementById("ataProfessor").value;

    if (!cgm) {
        alert("Informe o CGM para atualizar a ata.");
        return;
    }

    const ataAtualizado = { aluno, cgm, dia, conteudo, assunto, prof, monitor };

    try {
        const respo = await fetch(`/ata/cgm/${cgm}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ataAtualizado),
        });

        if (respo.ok) {
            alert("Ata atualizada com sucesso!");
        } else {
            const errorMessage = await respo.text();
            alert("Erro ao atualizar ata: " + errorMessage);
        }
    } catch (error) {
        console.error("Erro ao atualizar ata:", error);
        alert("Erro ao atualizar ata.");
    }
}
