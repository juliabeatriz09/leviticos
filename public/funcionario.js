async function cadastrarfuncionario(event) {
    event.preventDefault();

    const funcionario = {
        nome: document.getElementById('func-nome').value,
        data_de_nascimento: document.getElementById('func-data-nascimento').value,
        cpf:document.getElementById('func-cpf').value,
        rg: document.getElementById('func-rg').value,
        genero: document.getElementById('func-genero').value,
        estado_civil: document.getElementById('func-estado-civil').value,
        email: document.getElementById('func-email').value,
        email_institucional: document.getElementById('func-email-institucional').value,
        telefone: document.getElementById('func-telefone').value,
        telefone_alternativo: document.getElementById('func-telefone-alternativo').value,
        cep: document.getElementById('func-cep').value,
        logradouro: document.getElementById('func-logradouro').value,
        numero: document.getElementById('func-numero').value,
        complemento: document.getElementById('func-complemento').value,
        bairro: document.getElementById('func-bairro').value,
        cidade: document.getElementById('func-cidade').value,
        estado: document.getElementById('func-estado').value,
        data_adimissão: document.getElementById('func-data-admissao').value,
        cargo: document.getElementById('func-cargo').value,
        carga_horaria: document.getElementById('func-carga-horaria').value,
        contrato: document.getElementById('func-tipo-contrato').value,
    };
       
    try {
        const response = await fetch('/funcionario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(funcionario)
        });

        const result = await response.json();
        if (response.ok) {
            alert('Funcionario cadastrado com sucesso!');
            //document.getElementById('funcionario-form').reset();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error('Erro na solicitação:', err);
        alert('Erro ao cadastrar cliente.');
    }
}

// Função para listar todos os funcionario ou buscar funcionario por CPF
async function listarfuncionario() {
    const cpf = document.getElementById('func-cpf').value.trim();
    let url = '/funcionario';

    if (cpf) {
        url += `?cpf=${cpf}`;
    }

    try {
        const respo = await fetch(url);
        if (!respo.ok) throw new Error(`Erro HTTP: ${respo.status}`);
        const funcionario = await respo.json();

        const tabela = document.getElementById('tabela-funcionario');
        tabela.innerHTML = '';

        if (!Array.isArray(funcionario) || funcionario.length === 0) {
            tabela.innerHTML = '<tr><td colspan="4">Nenhum funcionario encontrado.</td></tr>';
        } else {
            funcionario.forEach(item => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${item.nome}</td>
                    <td>${item.cpf}</td>
                    <td>${item.email}</td>
                    <td>${item.telefone}</td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error('Erro ao listar funcionario:', error);
    }
}

async function atualizarfuncionario() {
    const nome = document.getElementById('func-nome').value;
    const cep= document.getElementById('func-cep').value;
    const numero= document.getElementById('func-numero').value;
    const complemento= document.getElementById('func-complemento').value;
    const bairro= document.getElementById('func-bairro').value;
    const cidade= document.getElementById('func-cidade').value;
    const estado = document.getElementById('func-estado').value;
    const email = document.getElementById('func-email').value;
    const telefone = document.getElementById('func-telefone').value;

    if (!cpf) {
        alert('Informe o CPF do funcionário para atualizar.');
        return;
    }

    const funcionarioAtualizado = { nome, cep, numero,complemento,bairro,cidade,estado, email, telefone };

    try {
        const respo = await fetch(`/funcionario/cpf/${cpf}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(funcionarioAtualizado)
        });

        if (respo.ok) {
            alert('Funcionário atualizado com sucesso!');
        } else {
            const errorMessage = await respo.text();
            alert('Erro ao atualizar funcionario: ' + errorMessage);
        }
    } catch (error) {
        console.error('Erro ao atualizar funcionario:', error);
        alert('Erro ao atualizar funcionario.');
    }
}
