$(document).ready(function () {
    const urlApi = "http://localhost:8000/api/v1/clientes/";
    const $table = $('#table-clients tbody');
    const $formulario = $('#formulario');
    const $formEdit = $('#formEdit');
    const $btnSave = $('#btn-save');
    const $btnUpdate = $('#btn-update');
    const token = "Bearer 1|deaIfTdWdXr9z15pHmmYIQnV8CYrkml4pUTThHD78a04886d";

    async function getClientes() {
        $table.empty();
        const response = await fetch(urlApi, { headers: { "Accept": "application/json" } });
        const data = await response.json();

        $.each(data.data, function (_, cliente) {
            const row = `
                <tr id="client-${cliente.id}">
                    <th scope="row">${cliente.id}</th>
                    <td>${cliente.name}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.phone}</td>
                    <td>${cliente.status}</td>
                    <td>${cliente.created_at}</td>
                    <td>
                        <div class="btn-group">
                            <button class="btn btn-danger btn-delete" data-id="${cliente.id}">Delete</button>
                            <button class="btn btn-warning btn-edit" data-id="${cliente.id}">Edit</button>
                            <a href="/clientes/details/${cliente.id}" class="btn btn-success">View</a>
                        </div>
                    </td>
                </tr>
            `;
            $table.append(row);
        });
    }

    // Guardar cliente
    $btnSave.on('click', async () => {
        const data = Object.fromEntries(new FormData($formulario[0]).entries());
        const $ms = $('#error');

        const response = await fetch(urlApi, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            $ms.addClass("alert alert-danger").text(Object.values(error.errors).flat().join(" | "));
            return;
        }

        const myModal = bootstrap.Modal.getInstance($('#exampleModal')[0]);
        myModal.hide();
        $formulario.trigger('reset');
        $ms.removeClass("alert alert-danger").empty();

        getClientes();
    });

    // Eliminar cliente
    $table.on('click', '.btn-delete', async function () {
        const id = $(this).data('id');
        const url = urlApi + id;

        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: "El cliente se eliminará definitivamente",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonColor: '#d33',
        });

        if (confirm.isConfirmed) {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: { "Accept": "application/json", "Authorization": token }
            });

            if (response.ok) {
                Swal.fire({ title: 'Eliminado!', text: 'El cliente ha sido eliminado.', icon: 'success', timer: 1500, showConfirmButton: false });
                getClientes();
            } else {
                Swal.fire('Error', 'No se pudo eliminar el cliente.', 'error');
            }
        }
    });

    // Editar cliente → llenar modal
    $table.on('click', '.btn-edit', async function () {
        const id = $(this).data('id');
        const response = await fetch(urlApi + id, {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        });

        if (!response.ok) {
            return Swal.fire('Error', 'No se pudo cargar el cliente.', 'error');
        }

        const { data: cliente } = await response.json();
        $('#edit-id').val(cliente.id);
        $('#edit-name').val(cliente.name);
        $('#edit-email').val(cliente.email);
        $('#edit-phone').val(cliente.phone);

        new bootstrap.Modal($('#modalEdit')[0]).show();
    });

    // Actualizar cliente
    $btnUpdate.on('click', async () => {
        const data = Object.fromEntries(new FormData($formEdit[0]).entries());
        const response = await fetch(urlApi + data.id, {
            method: 'PUT',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            return Swal.fire('Error', 'Error al editar.\n' + Object.values(error.errors).flat().join(", "), 'error');
        }

        Swal.fire({ title: 'Editado!', text: 'El cliente ha sido editado.', icon: 'success', timer: 1000, showConfirmButton: false });
        bootstrap.Modal.getInstance($('#modalEdit')[0]).hide();

        getClientes();
    });

    getClientes();
});
