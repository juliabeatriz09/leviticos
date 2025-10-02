alert('1');
async function cadastrarencaminhamento(event) {
    event.preventDefault();
  

    const encaminhamento= {
        aluno: document.getElementById('aluno').value,
        destinatario : document.getElementById('destinatario').value,
        destino: document.getElementById('destino'),
        dia: document.getElementById('encData').value,
        obs:document.getElementById('obs').value,

    };
       alert('2');
    try {

        const response = await fetch('/encaminhamento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(encaminhamento)
        });
        alert('3');
        
        const result = await response.json();
        if (response.ok) {
            alert('encaminhamento cadastrado com sucesso!');
            //document.getElementById('encaminhamento-form').reset();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error('Erro na solicitação:', err);
        alert('Erro ao cadastrar cliente.');
    }
    alert('4');
}
alert('5');
// Função para listar todos os encaminhamentos 
async function listarencaminhamento() {
    const  turma  = document.getElementById('filtroTurma').value.trim();
    // const  destino = document.getElementById('destino').value.trim();
    // const tipo_fo =document.getElementById('filtroTipo').value.trim();
    // const providencia = document.getElementById('acoesSugeridas').value.trim();
    // const prazo  = document.getElementById('prazoResposta').value.trim();
    // const dia = document.getElementById('encData').value.trim();
    alert('6');
    

    let url = '/encaminhamento';  // URL padrão para todos os funcionario

    if (turma) {
        // Se turma foi digitado, adiciona o parâmetro de consulta
        url += `?turma=${turma}`;
    }

    try {
        const respo = await fetch(url);
        const encaminhamento = await respo.json();

        const tabela = document.getElementById('tabela-encaminhamento');
        tabela.innerHTML = ''; // Limpa a tabela antes de preencher

        if (!Array.isArray(encaminhamento) || encaminhamento.length === 0) {
            // Caso não encontre encaminhamento, exibe uma mensagem
            tabela.innerHTML = '<tr><td colspan="6">Nenhum encaminhamento encontrado.</td></tr>';
        } else {
            encaminhamento.forEach(encaminhamentoItem => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${encaminhamentoItem.turma}</td>
                    <td>${encaminhamentoItem.destino}</td>
                    <td>${encaminhamentoItem.prazo}</td>
                    <td>${encaminhamentoItem.tipo_fo}</td>
                    <td>${encaminhamentoItem.justificativa}</td>
                    <td>${encaminhamentoItem.providencia}</td>
                    <td>${encaminhamentoItem.responsavel}</td>
                    <td>${encaminhamentoItem.dia}</td>
                    <td>${encaminhamentoItem.obs}</td>
                    <td>${encaminhamentoItem.funcionario}</td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error('Erro ao listar encaminhamento:', error);
    }
}

// Função para atualizar as informações do encaminhamento
async function atualizarencaminhamento() {
    const  turma  = document.getElementById('filtroTurma').value.trim();
    const  destino = document.getElementById('destino').value.trim();
    const tipo_fato =document.getElementById('filtroTipo').value.trim();
    const providencia = document.getElementById('acoesSugeridas').value.trim();
    const prazo  = document.getElementById('prazoResposta').value.trim();
    const justificativa = document.getElementById('justificativa').value.trim();

    const encaminhamentoAtualizado = {
        turma,
        destino,
        tipo_fato,
        providencia,
        prazo,
       justificativa
          
    };

    try {
        const respo = await fetch(`/encaminhamento/turma/${turma}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(encaminhamentoAtualizado)
        });

        if (respo.ok) {
            alert('encaminhamento atualizado com sucesso!');
        } else {
            const errorMessage = await respo.text();
            alert('Erro ao atualizar encaminhamento: ' + errorMessage);
        }
    } catch (error) {
        console.error('Erro ao atualizar encaminhamento:', error);
        alert('Erro ao atualizar encaminhamento.');
    }
}