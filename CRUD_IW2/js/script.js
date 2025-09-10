$(function () {
        let usuarios = [];
        let proximoId = 0;

        let on = $('#telefone').on('input', function () {
                let telefone = $(this).val().replace(/\D/g, '');
                if (telefone.length > 11) {
                        telefone = telefone.substring(0, 11);
                } if (telefone.length <= 9) {
                        telefone = telefone.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2$3');
                }
                if (telefone.length == 10) {
                        telefone = telefone.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
                } else {
                        telefone = telefone.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
                } $(this).val(telefone);
        });

        function renderTabela(filtro = '') {
                const tbody = $('#tabelaUsuarios tbody');
                tbody.empty();
                const filtroMinusculo = filtro.toLowerCase();

                usuarios.forEach((usuario, index) => {
                        const idStr = String(usuario.id);
                        const nomeLower = usuario.nome.toLowerCase();
                        if (idStr.includes(filtroMinusculo) || nomeLower.includes(filtroMinusculo)) {
                                tbody.append(`
          <tr>
            <td>${usuario.id}</td>
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
            <td>${usuario.telefone}</td>
            <td>${usuario.endereco}</td>
            <td>${usuario.cidade}</td>
            <td>${usuario.estado}</td>
            <td>
              <button class="btn btn-sm btn-warning btnEditar" data-index="${index}">Editar</button>
              <button class="btn btn-sm btn-danger btnExcluir" data-index="${index}">Excluir</button>
            </td>
          </tr>
        `);
                        }
                });
        }

        function validarEmail(email) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        // Salvar usuário
        $('#formUsuario').on('submit', function (e) {
                e.preventDefault();

                const index = parseInt($('#editIndex').val());
                const nome = $('#nome').val().trim();
                const email = $('#email').val().trim();
                const telefone = $('#telefone').val().trim();
                const endereco = $('#endereco').val().trim();
                const cidade = $('#cidade').val().trim();
                const estado = $('#estado').val();

                if (!nome || !email || !telefone || !endereco || !cidade || !estado) {
                        alert('Preencha todos os campos');
                        return;
                }

                if (!validarEmail(email)) {
                        alert('Email inválido');
                        return;
                }

                if (index === -1) {
                        usuarios.push({ id: proximoId++, nome, email, telefone, endereco, cidade, estado });
                } else {
                        usuarios[index] = { id: usuarios[index].id, nome, email, telefone, endereco, cidade, estado };
                }

                this.reset();
                $('#editIndex').val(-1);
                $('#formulario-itens').modal('hide');
                renderTabela($('#filtro').val());
        });

        // Abrir modal de edição
        $(document).on('click', '.btnEditar', function () {
                const index = $(this).data('index');
                const usuario = usuarios[index];

                $('#editIndexModal').val(index);
                $('#editNome').val(usuario.nome);
                $('#editEmail').val(usuario.email);
                $('#editTelefone').val(usuario.telefone);
                $('#editEndereco').val(usuario.endereco);
                $('#editCidade').val(usuario.cidade);
                $('#editEstado').val(usuario.estado);

                $('#modal-editar').modal('show');
        });

        // Salvar edição
        $('#formEditarUsuario').on('submit', function (e) {
                e.preventDefault();

                const index = parseInt($('#editIndexModal').val());
                usuarios[index] = {
                        id: usuarios[index].id,
                        nome: $('#editNome').val().trim(),
                        email: $('#editEmail').val().trim(),
                        telefone: $('#editTelefone').val().trim(),
                        endereco: $('#editEndereco').val().trim(),
                        cidade: $('#editCidade').val().trim(),
                        estado: $('#editEstado').val()
                };

                $('#modal-editar').modal('hide');
                renderTabela($('#filtro').val());
        });

        // Excluir usuário
        $(document).on('click', '.btnExcluir', function () {
                const index = $(this).data('index');
                if (confirm('Deseja realmente excluir?')) {
                        usuarios.splice(index, 1);
                        renderTabela($('#filtro').val());
                }
        });

        // Filtro ao digitar
        $('#filtro').on('input', function () {
                renderTabela($(this).val());
        });

        // Alternar tema
        let currentTheme = $('body').attr('data-bs-theme') || 'light';
        $('#btnTema').on('click', function () {
                if (currentTheme === 'dark') {
                        $('body').attr('data-bs-theme', 'light');
                        currentTheme = 'light';
                } else {
                        $('body').attr('data-bs-theme', 'dark');
                        currentTheme = 'dark';
                }
        });


        renderTabela();
});
