$(document).ready(async function () {
    const urlClientes = "http://localhost:8000/api/v1/clientes/";
    const urlContratos = "http://localhost:8000/api/v1/contratos/";
    const token = "Bearer 1|deaIfTdWdXr9z15pHmmYIQnV8CYrkml4pUTThHD78a04886d";
    const $element = $('#cliente-details');
    const clientId = $element.data('id');
    const $table = $('#table-contratos tbody'); // jQuery selecciona el tbody
    const $btnSave = $('#btn-save');
    const $formulario = $('#formContrato');
    const $formEdit = $('#formEditContrato');
    const $btnUpdate = $('#btn-update');


    async function getCliente() {
        $table.empty(); // limpiar tabla antes de pintar
        const response = await fetch(urlClientes + clientId + '?includeContratos=true', {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": token
            },
        });
        const result = await response.json();
        const cliente = result.data;

        //console.log(cliente);

        // Llenar datos del cliente en el DOM
        $.each(cliente, function (key, value) {
            $('#' + key).html(value);
        });

        if (cliente.hasOwnProperty('contratos') && Array.isArray(cliente.contratos) && cliente.contratos.length > 0) {

            $.each(cliente.contratos, function (_, contrato) {
                const row = `
                <tr id="client-${contrato.id}">
                    <th scope="row">${contrato.id}</th>
                    <td>${contrato.numero_contrato}</td>
                    <td>${contrato.monto}</td>
                    <td>${contrato.fecha_inicio}</td>
                    <td>${contrato.fecha_fin ? contrato.fecha_fin : "Activo"}</td>
                    <td>
                        <div class="btn-group">
                            <button type="button" class="btn btn-danger btn-delete" data-id="${contrato.id}">Delete</button>
                            <button type="button" class="btn btn-warning btn-edit" data-id="${contrato.id}">Edit</button>
                        </div>
                    </td>
                </tr>
            `;
                $table.append(row);
            });
        } else {
            $table.append(`<tr><td colspan="6" class="text-center">No tiene contratos</td></tr>`);
        }
    }

    // Delegar evento para eliminar contrato
    $table.on('click', '.btn-delete', async function () {
        const id = $(this).data('id');
        const url = urlContratos + id;
        console.log(url);

        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: "El contrato se eliminará definitivamente",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonColor: '#d33',
        });

        if (confirm.isConfirmed) {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    "Accept": "application/json",
                    "Authorization": token
                }
            });

            if (response.ok) {
                Swal.fire({
                    title: 'Eliminado!',
                    text: 'El contrato ha sido eliminado.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                getCliente();
            } else {
                Swal.fire('Error', 'No se pudo eliminar el contrato.', 'error');
            }
        }
    });

    $btnSave.on('click', async () => {
        const formData = Object.fromEntries(new FormData($formulario[0]).entries());
        const data = { ...formData, 'cliente_id': clientId };
         console.log(data);

        const $ms = $('#error');
        const response = await fetch(urlContratos, {
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
            console.log(error);
            $ms.addClass("alert alert-danger").text(Object.values(error.errors).flat().join(" | "));
            return;
        }
        const error = await response.json();
        console.log(error);


        const myModal = bootstrap.Modal.getInstance($('#contratoModal')[0]);
        myModal.hide();
        $formulario.trigger('reset');
        $ms.removeClass("alert alert-danger").empty();

        getCliente();

    });
    //editar 
    $table.on('click', '.btn-edit', async function () {
        const id = $(this).data('id');
        const url = urlContratos + id;
        console.log(url);

        const response = await fetch(url, {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        });

        const { data: result } = await response.json();
        if (!response.ok) {
            return Swal.fire('Error', 'No se pudo cargar el cliente.', 'error');
        }
        console.log(result);
        $('#edit-id').val(result.id);
        $('#monto').val(result.monto);
        $('#fecha_inicio').val(result.fecha_inicio);
        $('#fecha_fin').val(result.fecha_fin);

        new bootstrap.Modal($('#contatoEditModal')[0]).show();
    });

    $btnUpdate.on('click', async () => {
        const data = Object.fromEntries(new FormData($formEdit[0]).entries());
        console.log(data.id);
        const response = await fetch(urlContratos + data.id, {
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
        bootstrap.Modal.getInstance($('#contatoEditModal')[0]).hide();
        getCliente();

    });

    getCliente();
});
