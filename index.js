const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

// Serve os arquivos estáticos da pasta "public"
app.use(express.static('public'));

// Configura o parser JSON (built-in do Express)
app.use(express.json());

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Criação das tabelas com tratamento de erros individuais
db.serialize(() => {
    // Tabela aluno
    db.run(`
        CREATE TABLE IF NOT EXISTS aluno (
            id_aluno INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            telefone TEXT,
            email TEXT,
            cpf TEXT NOT NULL UNIQUE,
            rg TEXT NOT NULL UNIQUE,
            genero TEXT,
            data_de_nascimento DATE,
            cep TEXT,
            logradouro TEXT,
            numero INTEGER,
            complemento TEXT,
            cidade TEXT,
            bairro TEXT,
            estado TEXT,
            cgm TEXT UNIQUE,
            curso TEXT NOT NULL,
            turno TEXT NOT NULL,
            turma TEXT,
            nome_responsavel TEXT,
            parentesco_responsavel TEXT,
            cpf_responsavel TEXT NOT NULL UNIQUE,
            telefone_responsavel TEXT,
            email_responsavel TEXT
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela aluno:', err.message);
        else console.log('Tabela aluno criada com sucesso.');
    });

    // Tabela funcionario
    db.run(`
        CREATE TABLE IF NOT EXISTS funcionario (
            id_funcionario INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            data_de_nascimento DATE,
            cpf TEXT NOT NULL UNIQUE,
            rg TEXT NOT NULL UNIQUE,
            genero TEXT,
            estado_civil TEXT,
            email TEXT,
            email_institucional TEXT,
            telefone TEXT,
            telefone_alternativo TEXT,
            cep TEXT,
            logradouro TEXT,
            numero INTEGER,
            complemento TEXT,
            bairro TEXT,
            cidade TEXT,
            estado TEXT,
            data_admissao DATE,
            cargo TEXT,
            carga_horaria INTEGER,
            contrato TEXT
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela funcionario:', err.message);
        else console.log('Tabela funcionario criada com sucesso.');
    });

    // Tabela fo
    db.run(`
        CREATE TABLE IF NOT EXISTS fo (
            id_fo INTEGER PRIMARY KEY AUTOINCREMENT,
            turma TEXT,
            data DATE,
            tipo_fato TEXT,
            obs TEXT,
            monitor TEXT
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela fo:', err.message);
        else console.log('Tabela fo criada com sucesso.');
    });

    // Tabela ata
    db.run(`
        CREATE TABLE IF NOT EXISTS ata (
            id_ata INTEGER PRIMARY KEY AUTOINCREMENT,
            aluno TEXT,
            dia DATE NOT NULL,
            assunto TEXT NOT NULL,
            monitor TEXT,
            conteudo TEXT,
            encaminhamento TEXT,
            cgm TEXT NOT NULL UNIQUE,
            prof TEXT
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela ata:', err.message);
        else console.log('Tabela ata criada com sucesso.');
    });

    // Tabela encaminhamento
    db.run(`
        CREATE TABLE IF NOT EXISTS encaminhamento (
            id_encaminhamento INTEGER PRIMARY KEY AUTOINCREMENT,
            data DATE,
            destino TEXT,
            destinatario TEXT,
            obs TEXT,
            aluno TEXT
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela encaminhamento:', err.message);
        else console.log('Tabela encaminhamento criada com sucesso.');
    });

    // Tabela frequencia
    db.run(`
        CREATE TABLE IF NOT EXISTS frequencia (
            id_frequencia INTEGER PRIMARY KEY AUTOINCREMENT,
            aluno TEXT NOT NULL,
            turma TEXT NOT NULL,
            ausencias INTEGER NOT NULL,
            data_aula DATE NOT NULL,
            cgm TEXT NOT NULL,
            materia TEXT,
            justificativa TEXT
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela frequencia:', err.message);
        else console.log('Tabela frequencia criada com sucesso.');
    });
});

// ///////////////////////////// Rotas para aluno /////////////////////////////
// POST: Cadastrar aluno
app.post('/aluno', (req, res) => {
    const { nome, telefone, email, cpf, rg, genero, data_de_nascimento, cep, logradouro, numero, complemento, cidade, bairro, estado, cgm, curso, turno, turma, nome_responsavel, parentesco_responsavel, cpf_responsavel, telefone_responsavel, email_responsavel } = req.body;

    if (!nome || !cpf || !rg || !cpf_responsavel || !curso || !turno) {
        return res.status(400).json({ error: 'Nome, CPF, RG, CPF responsável, curso e turno são obrigatórios.' });
    }

    const query = `INSERT INTO aluno (nome, telefone, email, cpf, rg, genero, data_de_nascimento, cep, logradouro, numero, complemento, cidade, bairro, estado, cgm, curso, turno, turma, nome_responsavel, parentesco_responsavel, cpf_responsavel, telefone_responsavel, email_responsavel) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    db.run(query, [nome, telefone, email, cpf, rg, genero, data_de_nascimento, cep, logradouro, numero, complemento, cidade, bairro, estado, cgm, curso, turno, turma, nome_responsavel, parentesco_responsavel, cpf_responsavel, telefone_responsavel, email_responsavel], function (err) {
        if (err) {
            console.error('Erro no INSERT aluno:', err.message);
            return res.status(500).json({ error: 'Erro ao cadastrar aluno.' });
        }
        res.status(201).json({ id: this.lastID, message: 'Aluno cadastrado com sucesso.' });
    });
});

// GET: Listar alunos (filtro por CGM)
app.get('/alunos', (req, res) => {
    const cgm = req.query.cgm || '';

    if (cgm) {
        const query = `SELECT * FROM aluno WHERE cgm LIKE ?`;
        db.all(query, [`%${cgm}%`], (err, rows) => {
            if (err) {
                console.error('Erro no SELECT aluno:', err.message);
                return res.status(500).json({ error: 'Erro ao buscar alunos.' });
            }
            res.json(rows);
        });
    } else {
        const query = `SELECT * FROM aluno`;
        db.all(query, (err, rows) => {
            if (err) {
                console.error('Erro no SELECT aluno:', err.message);
                return res.status(500).json({ error: 'Erro ao buscar alunos.' });
            }
            res.json(rows);
        });
    }
});

// PUT: Atualizar aluno por CGM
app.put('/aluno/cgm/:cgm', (req, res) => {
    const { cgm } = req.params;
    const { nome, telefone, email, cpf, rg, genero, data_de_nascimento, cep, logradouro, numero, complemento, cidade, bairro, estado, curso, turma, turno, nome_responsavel, telefone_responsavel, parentesco_responsavel, cpf_responsavel, email_responsavel } = req.body;

    const query = `UPDATE aluno SET nome = ?, telefone = ?, email = ?, cpf = ?, rg = ?, genero = ?, data_de_nascimento = ?, cep = ?, logradouro = ?, numero = ?, complemento = ?, cidade = ?, bairro = ?, estado = ?, curso = ?, turma = ?, turno = ?, nome_responsavel = ?, telefone_responsavel = ?, parentesco_responsavel = ?, cpf_responsavel = ?, email_responsavel = ? WHERE cgm = ?`;

    db.run(query, [nome, telefone, email, cpf, rg, genero, data_de_nascimento, cep, logradouro, numero, complemento, cidade, bairro, estado, curso, turma, turno, nome_responsavel, telefone_responsavel, parentesco_responsavel, cpf_responsavel, email_responsavel, cgm], function (err) {
        if (err) {
            console.error('Erro no UPDATE aluno:', err.message);
            return res.status(500).json({ error: 'Erro ao atualizar aluno.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Aluno não encontrado.' });
        }
        res.json({ message: 'Aluno atualizado com sucesso.' });
    });
});

// ///////////////////////////// Rotas para funcionario /////////////////////////////
// POST: Cadastrar funcionario
app.post('/funcionario', (req, res) => {
    const { nome, data_de_nascimento, cpf, rg, genero, estado_civil, email, email_institucional, telefone, telefone_alternativo, cep, logradouro, numero, complemento, bairro, cidade, estado, data_admissao, cargo, carga_horaria, contrato } = req.body;

    if (!nome || !cpf || !rg) {
        return res.status(400).json({ error: 'Nome, CPF e RG são obrigatórios.' });
    }

    const query = `INSERT INTO funcionario (nome, data_de_nascimento, cpf, rg, genero, estado_civil, email, email_institucional, telefone, telefone_alternativo, cep, logradouro, numero, complemento, bairro, cidade, estado, data_admissao, cargo, carga_horaria, contrato) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    db.run(query, [nome, data_de_nascimento, cpf, rg, genero, estado_civil, email, email_institucional, telefone, telefone_alternativo, cep, logradouro, numero, complemento, bairro, cidade, estado, data_admissao, cargo, carga_horaria, contrato], function (err) {
        if (err) {
            console.error('Erro no INSERT funcionario:', err.message);
            return res.status(500).json({ error: 'Erro ao cadastrar funcionário.' });
        }
        res.status(201).json({ id: this.lastID, message: 'Funcionário cadastrado com sucesso.' });
    });
});

// GET: Listar funcionarios (filtro por CPF)
app.get('/funcionario', (req, res) => {
    const cpf = req.query.cpf || '';

    if (cpf) {
        const query = `SELECT * FROM funcionario WHERE cpf LIKE ?`;
        db.all(query, [`%${cpf}%`], (err, rows) => {
            if (err) {
                console.error('Erro no SELECT funcionario:', err.message);
                return res.status(500).json({ error: 'Erro ao buscar funcionários.' });
            }
            res.json(rows);
        });
    } else {
        const query = `SELECT * FROM funcionario`;
        db.all(query, (err, rows) => {
            if (err) {
                console.error('Erro no SELECT funcionario:', err.message);
                return res.status(500).json({ error: 'Erro ao buscar funcionários.' });
            }
            res.json(rows);
        });
    }
});

// PUT: Atualizar funcionario por CPF
app.put('/funcionario/nome/:nome', (req, res) => {
    const { nome } = req.params;
    const { cep, numero,complemento,bairro,cidade,estado, email, telefone } = req.body;

    const query = `UPDATE funcionario SET nome = ?, cep = ?, numero = ?,complemento = ?,bairro = ?,cidade = ?,estado = ?, email = ?, telefone = ?`;

    db.run(query, [nome, cep, numero,complemento,bairro,cidade,estado, email, telefone], function (err) {
        if (err) {
            console.error('Erro no UPDATE funcionario:', err.message);
            return res.status(500).json({ error: 'Erro ao atualizar funcionário.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Funcionário não encontrado.' });
        }
        res.json({ message: 'Funcionário atualizado com sucesso.' });
    });
});

// ///////////////////////////// Rotas para fo /////////////////////////////
// POST: Cadastrar fo
app.post('/fo', (req, res) => {
    const { turma, data, tipo_fato, obs, monitor } = req.body;

    if (!data || !turma || !tipo_fato || !monitor) {
        return res.status(400).json({ error: 'Data, turma, tipo_fato e monitor são obrigatórios.' });
    }

    const query = `INSERT INTO fo (turma, data, tipo_fato, obs, monitor) VALUES (?,?,?,?,?)`;
    db.run(query, [turma, data, tipo_fato, obs, monitor], function (err) {
        if (err) {
            console.error('Erro no INSERT fo:', err.message);
            return res.status(500).json({ error: 'Erro ao cadastrar FO.' });
        }
        res.status(201).json({ id: this.lastID, message: 'FO cadastrado com sucesso.' });
    });
});

// GET: Listar fos (filtro por data)
app.get('/fo', (req, res) => {
    const data = req.query.data || '';

    if (data) {
        const query = `SELECT * FROM fo WHERE data LIKE ?`;
        db.all(query, [`%${data}%`], (err, rows) => {
            if (err) {
                console.error('Erro no SELECT fo:', err.message);
                return res.status(500).json({ error: 'Erro ao buscar FOs.' });
            }
            res.json(rows);
        });
    } else {
        const query = `SELECT * FROM fo`;
        db.all(query, (err, rows) => {
            if (err) {
                console.error('Erro no SELECT fo:', err.message);
                return res.status(500).json({ error: 'Erro ao buscar FOs.' });
            }
            res.json(rows);
        });
    }
});

// PUT: Atualizar fo por ID
app.put('/fo/:id', (req, res) => {
    const { id } = req.params;
    const { turma, data, tipo_fato, obs, monitor } = req.body;

    const query = `UPDATE fo SET turma = ?, data = ?, tipo_fato = ?, obs = ?, monitor = ? WHERE id_fo = ?`;
    db.run(query, [turma, data, tipo_fato, obs, monitor, id], function (err) {
        if (err) {
            console.error('Erro no UPDATE fo:', err.message);
            return res.status(500).json({ error: 'Erro ao atualizar FO.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'FO não encontrado.' });
        }
        res.json({ message: 'FO atualizado com sucesso.' });
    });
});

// ///////////////////////////// Rotas para ata /////////////////////////////
// POST: Cadastrar ata
app.post('/ata', (req, res) => {
    const { aluno, dia, assunto, monitor, conteudo, encaminhamento, cgm, prof } = req.body;

    if (!prof || !monitor || !aluno || !assunto || !dia || !cgm) {
        return res.status(400).json({ error: 'Prof, monitor, aluno, assunto, dia e CGM são obrigatórios.' });
    }

    const query = `INSERT INTO ata (aluno, dia, assunto, monitor, conteudo, encaminhamento, cgm, prof) VALUES (?,?,?,?,?,?,?,?)`;
    db.run(query, [aluno, dia, assunto, monitor, conteudo, encaminhamento, cgm, prof], function (err) {
        if (err) {
            console.error('Erro no INSERT ata:', err.message);
            return res.status(500).json({ error: 'Erro ao cadastrar ata.' });
        }
        res.status(201).json({ id: this.lastID, message: 'Ata cadastrada com sucesso.' });
    });
});

// GET: Listar atas (filtro por dia)
app.get('/ata', (req, res) => {
    const dia = req.query.dia || '';

    if (dia) {
        const query = `SELECT * FROM ata WHERE dia LIKE ?`;
        db.all(query, [`%${dia}%`], (err, rows) => {
            if (err) {
                console.error('Erro no SELECT ata:', err.message);
                return res.status(500).json({ error: 'Erro ao buscar atas.' });
            }
            res.json(rows);
        });
    } else {
        const query = `SELECT * FROM ata`;
        db.all(query, (err, rows) => {
            if (err) {
                console.error('Erro no SELECT ata:', err.message);
                return res.status(500).json({ error: 'Erro ao buscar atas.' });
            }
            res.json(rows);
        });
    }
});

// PUT: Atualizar ata por ID
app.put('/ata/:id', (req, res) => {
    const { id } = req.params;
    const { aluno, dia, assunto, monitor, conteudo, encaminhamento, cgm, prof } = req.body;

    const query = `UPDATE ata SET aluno = ?, dia = ?, assunto = ?, monitor = ?, conteudo = ?, encaminhamento = ?, cgm = ?, prof = ? WHERE id_ata = ?`;
    db.run(query, [aluno, dia, assunto, monitor, conteudo, encaminhamento, cgm, prof, id], function (err) {
        if (err) {
            console.error('Erro no UPDATE ata:', err.message);
            return res.status(500).json({ error: 'Erro ao atualizar ata.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Ata não encontrada.' });
        }
        res.json({ message: 'Ata atualizada com sucesso.' });
    });
});

// ///////////////////////////// Rotas para encaminhamento /////////////////////////////
// POST: Cadastrar encaminhamento
app.post('/encaminhamento', (req, res) => {
    const { data, destino, destinatario, obs, aluno } = req.body;

    if (!destinatario || !data) {
        return res.status(400).json({ error: 'Destinatário e data são obrigatórios.' });
    }

    const query = `INSERT INTO encaminhamento (data, destino, destinatario, obs, aluno) VALUES (?,?,?,?,?)`;
    db.run(query, [data, destino, destinatario, obs, aluno], function (err) {
        if (err) {
            console.error('Erro no INSERT encaminhamento:', err.message);
            return res.status(500).json({ error: 'Erro ao cadastrar encaminhamento.' });
        }
        res.status(201).json({ id: this.lastID, message: 'Encaminhamento cadastrado com sucesso.' });
    });
});

// GET: Listar encaminhamentos (filtro por data)
app.get('/encaminhamento', (req, res) => {
    const data = req.query.data || '';

    if (data) {
        const query = `SELECT * FROM encaminhamento WHERE data LIKE ?`;
        db.all(query, [`%${data}%`], (err, rows) => {
            if (err) {
                console.error('Erro no SELECT encaminhamento:', err.message);
                return res.status(500).json({ error: 'Erro ao buscar encaminhamentos.' });
            }
            res.json(rows);
        });
    } else {
        const query = `SELECT * FROM encaminhamento`;
        db.all(query, (err, rows) => {
            if (err) {
                console.error('Erro no SELECT encaminhamento:', err.message);
                return res.status(500).json({ error: 'Erro ao buscar encaminhamentos.' });
            }
            res.json(rows);
        });
    }
});

// PUT: Atualizar encaminhamento por ID
app.put('/encaminhamento/:id', (req, res) => {
    const { id } = req.params;
    const { data, destino, destinatario, obs, aluno } = req.body;

    const query = `UPDATE encaminhamento SET data = ?, destino = ?, destinatario = ?, obs = ?, aluno = ? WHERE id_encaminhamento = ?`;
    db.run(query, [data, destino, destinatario, obs, aluno, id], function (err) {
        if (err) {
            console.error('Erro no UPDATE encaminhamento:', err.message);
            return res.status(500).json({ error: 'Erro ao atualizar encaminhamento.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Encaminhamento não encontrado.' });
        }
        res.json({ message: 'Encaminhamento atualizado com sucesso.' });
    });
});

// ///////////////////////////// Rotas para frequencia /////////////////////////////
// POST: Cadastrar frequencia
app.post('/frequencia', (req, res) => {
    const { aluno, turma, ausencias, data_aula, cgm, materia, justificativa } = req.body;

    if (!aluno || !turma || ausencias === undefined || !data_aula || !cgm) {
        return res.status(400).json({ error: 'Aluno, turma, ausências, data da aula e CGM são obrigatórios.' });
    }

    const query = `INSERT INTO frequencia (aluno, turma, ausencias, data_aula, cgm, materia, justificativa) VALUES (?,?,?,?,?,?,?)`;
    db.run(query, [aluno, turma, ausencias, data_aula, cgm, materia, justificativa], function (err) {
        if (err) {
            console.error('Erro no INSERT frequencia:', err.message);
            return res.status(500).json({ error: 'Erro ao cadastrar frequência.' });
        }
        res.status(201).json({ id: this.lastID, message: 'Frequência cadastrada com sucesso.' });
    });
});

// GET: Listar frequencias (filtro por aluno ou turma)
app.get('/frequencia', (req, res) => {
    const aluno = req.query.aluno || '';
    const turma = req.query.turma || '';

    if (aluno) {
        const query = `SELECT * FROM frequencia WHERE aluno LIKE ?`;
        db.all(query, [`%${aluno}%`], (err, rows) => {
            if (err) {
                console.error('Erro no SELECT frequencia:', err.message);
                return res.status(500).json({ error: 'Erro ao buscar frequências.' });
            }
            res.json(rows);
        });
    } else if (turma) {
        const query = `SELECT * FROM frequencia WHERE turma LIKE ?`;
        db.all(query, [`%${turma}%`], (err, rows) => {
            if (err) {
                console.error('Erro no SELECT frequencia:', err.message);
                return res.status(500).json({ error: 'Erro ao buscar frequências.' });
            }
            res.json(rows);
        });
    } else {
        const query = `SELECT * FROM frequencia`;
        db.all(query, (err, rows) => {
            if (err) {
                console.error('Erro no SELECT frequencia:', err.message);
                return res.status(500).json({ error: 'Erro ao buscar frequências.' });
            }
            res.json(rows);
        });
    }
});

// PUT: Atualizar frequencia por ID
app.put('/frequencia/:id', (req, res) => {
    const { id } = req.params;
    const { aluno, turma, ausencias, data_aula, cgm, materia, justificativa } = req.body;

    const query = `UPDATE frequencia SET aluno = ?, turma = ?, ausencias = ?, data_aula = ?, cgm = ?, materia = ?, justificativa = ? WHERE id_frequencia = ?`;
    db.run(query, [aluno, turma, ausencias, data_aula, cgm, materia, justificativa, id], function (err) {
        if (err) {
            console.error('Erro no UPDATE frequencia:', err.message);
            return res.status(500).json({ error: 'Erro ao atualizar frequência.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Frequência não encontrada.' });
        }
        res.json({ message: 'Frequência atualizada com sucesso.' });
    });
});

// Rota raiz de teste
app.get('/', (req, res) => {
    res.send('Servidor está rodando e tabelas criadas!');
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
