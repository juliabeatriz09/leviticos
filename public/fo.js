async function cadastrarfo(event) {
    event.preventDefault();

    alert("ate aqui vai ")
    const fo = {
        turma: document.getElementById('aluno-turma').value,
        data: document.getElementById('data').value,
        tipo_fato: document.getElementById('tipoFato').value,
        obs: document.getElementById('observacao').value,
        monitor: document.getElementById('monitor').value
    };
     alert("ate ")
    try {
        const response = await fetch('/fo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fo),
        });
         alert("ate aqui  ")
        const result = await response.json();
        if (response.ok) {
            alert('Foi cadastrado com sucesso!');
            //document.getElementById('fo-form').reset();
        } else {
            alert(`Erro: ${result.message}`);
        }
        } catch (err) {
            console.error('Erro na solicitação:', err);
            alert('Erro ao cadastrar fo.1');
        }
}

// Função para listar todos os F.O
async function listarfo() {
    const turma = document.getElementById('turma').value.trim();
    let url = "/fo";

    if (turma) {
        url += `?turma=${turma}`;
    }

    try {
        const respo = await fetch(url);
        if (!respo.ok) throw new Error(`Erro HTTP: ${respo.status}`);
        const fo = await respo.json();

        const tabela = document.getElementById('tabela-fo');
        tabela.innerHTML = '';

        if (!Array.isArray(fo) || fo.length === 0) {
            tabela.innerHTML = '<tr><td colspan="5">Nenhum F.O encontrado.</td></tr>';
        } else {
            fo.forEach((foItem) => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${foItem.aluno_turma}</td>
                    <td>${foItem.data}</td>
                    <td>${foItem.monitor}</td>
                    <td>${foItem.tipo_fato}</td>
                    <td>${foItem.obs}</td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error('Erro ao listar F.O:', error);
    }
}

// Função para atualizar as informações do F.O
async function atualizarfo() {
    const turma = document.getElementById('aluno-turma').value;
    const data = document.getElementById('data').value;
    const obs = document.getElementById('observacao').value;
    const tipo_fato = document.getElementById('tipoFato').value;
    const monitor = document.getElementById('monitor').value;

    if (!turma) {
        alert('Informe a turma para atualizar o F.O.');
        return;
    }

    const foAtualizado = { turma, data, obs, tipo_fato, monitor };

    try {
        const respo = await fetch(`/fo/turma/${turma}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(foAtualizado),
        });

        if (respo.ok) {
            alert('F.O atualizado com sucesso!');
        } else {
            const errorMessage = await respo.text();
            alert('Erro ao atualizar F.O: ' + errorMessage);
        }
    } catch (error) {
        console.error('Erro ao atualizar F.O:', error);
        alert('Erro ao atualizar F.O.');
    }
}
