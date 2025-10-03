async function cadastrarFreq(event) {
    event.preventDefault();

    const frequencia= {
        aluno : document.getElementById('student').value,
        turma : document.getElementById('student').value,
        ausencias: document.getElementById('ausencias').value,
        data_aula: document.getElementById('date').value,
        justificativa: document.getElementById('justificada').value,
        // cgm: document.getElementById('student').value,
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
// async function listarfrequencia() {
//         const aluno = document.getElementById('student').value.trim();
//         const turma = document.getElementById('student').value.trim();
//         const ausencias = document.getElementById('ausencias').value.trim();
//         const data_aula = document.getElementById('date').value.trim ();
//         const cgm = document.getElementById('student').value.trim ();
//         const justificativa = document.getElementById('justificada').value.trim();
//         const materia = document.getElementById('subject').value.trim(); 

//     let url = '/frequencia';  // URL padrão para todos os funcionario

//     if (cgm) {
//         // Se turma foi digitado, adiciona o parâmetro de consulta
//         url += `?cgm=${cgm}`;
//     }

//     try {
//         const respo = await fetch(url);
//         const frequencia = await respo.json();

//         const tabela = document.getElementById('tabela-frequencia');
//         tabela.innerHTML = ''; // Limpa a tabela antes de preencher

//         if (!Array.isArray(frequencia) || frequencia.length === 0) {
//             // Caso não encontre frequencia, exibe uma mensagem
//             tabela.innerHTML = '<tr><td colspan="6">Nenhum frequencia encontrado.</td></tr>';
//         } else {
//             frequencia.forEach(frequenciaItem => {
//                 const linha = document.createElement('tr');
//                 linha.innerHTML = `
//                     <td>${frequenciaItem.aluno  }</td>
//                     <td>${frequenciaItem.justificativa}</td>
//                     <td>${frequenciaItem.ausencias}</td>
//                     <td>${frequenciaItem.data_aula}</td>
//                     <td>${frequenciaItem.cgm }</td>
//                     <td>${frequenciaItem.materia }</td>
//                      <td>${frequenciaItem.turma }</td>

//                 `;
//                 tabela.appendChild(linha);
//             });
//         }
//     } catch (error) {
//         console.error('Erro ao listar frequencia:', error);
//     }
// }

// // Função para atualizar as informações do frequencia
// async function atualizarfrequencia() {
//     const aluno = document.getElementById('syudent').value.trim();
//     const ausencias = document.getElementById('ausencias').value.trim();
//     const data_aula = document.getElementById('date').value.trim ();
//     const cgm = document.getElementById('student').value.trim ();
//     const justificativa = document.getElementById('justificada').value.trim();
//     const materia = document.getElementById('subject').value.trim(); 
//     const turma = document.getElementById('student').value.trim();

//     const frequenciaAtualizado = {
//         turma,
//         aluno,
//         justificativa,
//         data_aula,
//         cgm,
//         ausencias,
//         materia
          
//     };

//     try {
//         const respo = await fetch(`/frequencia/cgm/${cgm}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(frequenciaAtualizado)
//         });

//         if (respo.ok) {
//             alert('frequencia atualizado com sucesso!');
//         } else {
//             const errorMessage = await respo.text();
//             alert('Erro ao atualizar frequencia: ' + errorMessage);
//         }
//     } catch (error) {
//         console.error('Erro ao atualizar frequencia:', error);
//         alert('Erro ao atualizar frequencia.');
//     }
// }






// Função para listar as informações de frequência
async function listarfrequencia() {
    // Captura apenas os campos necessários para o filtro (apenas CGM é usado no código original)
    // Removidas variáveis não utilizadas (aluno, turma, ausencias, justificativa, materia) para simplificar
    const cgm = document.getElementById('cgm').value.trim();  // Assumindo ID específico para CGM; ajuste se necessário

    let url = '/frequencia';  // URL padrão para listar todas as frequências

    if (cgm) {
        // Se CGM foi digitado, adiciona o parâmetro de consulta
        url += `?cgm=${cgm}`;
    }

    try {
        const response = await fetch(url);
        const frequencia = await response.json();

        const tabela = document.getElementById('tabela-frequencia');
        tabela.innerHTML = ''; // Limpa a tabela antes de preencher

        if (!Array.isArray(frequencia) || frequencia.length === 0) {
            // Caso não encontre frequência, exibe uma mensagem
            tabela.innerHTML = '<tr><td colspan="7">Nenhuma frequência encontrada.</td></tr>';  // Corrigido colspan para 7 colunas
        } else {
            frequencia.forEach(frequenciaItem => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${frequenciaItem.aluno}</td>
                    <td>${frequenciaItem.justificativa}</td>
                    <td>${frequenciaItem.ausencias}</td>
                    <td>${frequenciaItem.data_aula}</td>
                    <td>${frequenciaItem.cgm}</td>
                    <td>${frequenciaItem.materia}</td>
                    <td>${frequenciaItem.turma}</td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error('Erro ao listar frequência:', error);
        alert('Erro ao listar frequência. Verifique a conexão.');  // Adicionado feedback para o usuário
    }
}

// Função para atualizar as informações da frequência
async function atualizarfrequencia() {
    const aluno = document.getElementById('student').value.trim();  // Corrigido ID de 'syudent' para 'student'
    const ausencias = document.getElementById('ausencias').value.trim();
    const data_aula = document.getElementById('date').value.trim();  // Removido espaço extra em .trim()
    const cgm = document.getElementById('cgm').value.trim();         // ID específico para CGM (não reutilizar 'student')
    const justificativa = document.getElementById('justificada').value.trim();
    const materia = document.getElementById('subject').value.trim(); 
    const turma = document.getElementById('turma').value.trim();     // ID específico para turma (não reutilizar 'student')

    // Validação básica para campos obrigatórios (recomendado para evitar envios inválidos)
    if (!aluno || !cgm || !turma) {
        alert('Preencha os campos obrigatórios (aluno, CGM e turma).');
        return;
    }

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
        const response = await fetch(`/frequencia/cgm/${cgm}`, {  // Corrigido nome da variável para 'response'
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(frequenciaAtualizado)
        });

        if (response.ok) {
            alert('Frequência atualizada com sucesso!');  // Corrigida ortografia e acentos
        } else {
            const errorMessage = await response.text();
            alert(`Erro ao atualizar frequência: ${errorMessage} (Status: ${response.status})`);  // Melhorado com status
        }
    } catch (error) {
        console.error('Erro ao atualizar frequência:', error);
        alert('Erro ao atualizar frequência. Verifique a conexão.');  // Melhorado feedback
    }
}
