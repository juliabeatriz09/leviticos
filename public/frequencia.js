async function cadastrarfreq(event) {
    event.preventDefault();

    const frequencia= {
        aluno : document.getElementById('student').value,
        turma : document.getElementById('student').value,
        ausencias: document.getElementById('ausencias'),
        data_aula: document.getElementById('date').value,
        justificativa: document.getElementById('justified').value,
        cgm: document.getElementById('student').value,
        materia: document.getElementById('subject').value,
       
    };
       
    try {

        const response = await fetch('/frequencia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(frequencia)
        });

        const result = await response.json();
        if (response.ok) {
            alert('frequencia cadastrado com sucesso!');
            //document.getElementById('fo-form').reset();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error('Erro na solicitação:', err);
        alert('Erro ao cadastrar cliente.');
    }
}

// Função para listar todos os frequencias 
async function listarfrequencia() {
        const aluno = document.getElementById('student').value.trim();
        const turma = document.getElementById('student').value.trim();
        const ausencias = document.getElementById('ausencias').value.trim();
        const data_aula = document.getElementById('date').value.trim ();
        const cgm = document.getElementById('student').value.trim ();
        const justificativa = document.getElementById('justified').value.trim();
        const materia = document.getElementById('subject').value.trim(); 

    let url = '/frequencia';  // URL padrão para todos os funcionario

    if (cgm) {
        // Se turma foi digitado, adiciona o parâmetro de consulta
        url += `?cgm=${cgm}`;
    }

    try {
        const respo = await fetch(url);
        const frequencia = await respo.json();

        const tabela = document.getElementById('tabela-frequencia');
        tabela.innerHTML = ''; // Limpa a tabela antes de preencher

        if (!Array.isArray(frequencia) || frequencia.length === 0) {
            // Caso não encontre frequencia, exibe uma mensagem
            tabela.innerHTML = '<tr><td colspan="6">Nenhum frequencia encontrado.</td></tr>';
        } else {
            frequencia.forEach(frequenciaItem => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${frequenciaItem.aluno  }</td>
                    <td>${frequenciaItem.justificativa}</td>
                    <td>${frequenciaItem.ausencias}</td>
                    <td>${frequenciaItem.data_aula}</td>
                    <td>${frequenciaItem.cgm }</td>
                    <td>${frequenciaItem.materia }</td>
                     <td>${frequenciaItem.turma }</td>

                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error('Erro ao listar frequencia:', error);
    }
}

// Função para atualizar as informações do frequencia
async function atualizarfrequencia() {
    const aluno = document.getElementById('syudent').value.trim();
    const ausencias = document.getElementById('ausencias').value.trim();
    const data_aula = document.getElementById('date').value.trim ();
    const cgm = document.getElementById('student').value.trim ();
    const justificativa = document.getElementById('justified').value.trim();
    const materia = document.getElementById('subject').value.trim(); 
    const turma = document.getElementById('student').value.trim();

    const frequenciaAtualizado = {
        turma,
        aluno,
        justificativa,
        data_aula,
        cgm,
        ausencias,
        materia
        
          
    };

    try {
        const respo = await fetch(`/frequencia/cgm/${cgm}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(frequenciaAtualizado)
        });

        if (respo.ok) {
            alert('frequencia atualizado com sucesso!');
        } else {
            const errorMessage = await respo.text();
            alert('Erro ao atualizar frequencia: ' + errorMessage);
        }
    } catch (error) {
        console.error('Erro ao atualizar frequencia:', error);
        alert('Erro ao atualizar frequencia.');
    }
}