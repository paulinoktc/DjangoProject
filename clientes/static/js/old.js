document.addEventListener('DOMContentLoaded', function () {

    const urlApi = "http://localhost:8000/api/v1/clientes/";

    const table = document.getElementById('table-clients').querySelector('tbody');
    const formulario = document.getElementById('formulario');
    const formEdit = document.getElementById('formEdit');
    const btnSave = document.getElementById('btn-save');
    const btnUpdate = document.getElementById('btn-update');

    async function getClientes() {
        table.innerHTML = '';
        const response = await fetch("http://localhost:8000/api/v1/clientes", {
            /*
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer TU_TOKEN" 
            }
            */
        });
        const data = await response.json();
        console.log(data);

        data.data.forEach(response => {
            console.log(response.name);
            const row = document.createElement("tr");
            row.id = `client-${response.id}`;
            row.innerHTML = `
                <th  scope="row">${response.id}</th>
                <td>${response.name}</td>
                <td>${response.email}</td>
                <td>${response.phone}</td>
                <td>${response.status}</td>
                <td>${response.created_at}</td>
                <td>

                    <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                    <button type="button" class="btn btn-danger btn-delete" data-id="${response.id}">Delete</button>
                    <button type="button" class="btn btn-warning" onclick="editarCliente(${response.id})">Edit</button>
                    <a href="/clientes/details/${response.id}" class="btn btn-success">View</a>
                    </div>
                </td>
            `;

            table.appendChild(row);
        });
    }

    btnSave.addEventListener('click', async () => {
        const formData = new FormData(formulario);
        const ms = document.getElementById('error');

        const data = Object.fromEntries(formData.entries());

        const response = await fetch('http://localhost:8000/api/v1/clientes', {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer 1|deaIfTdWdXr9z15pHmmYIQnV8CYrkml4pUTThHD78a04886d"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            ms.classList.add("alert", "alert-danger");
            ms.textContent = Object.values(error.errors)
                .flat() // aplana los arrays
                .join(" | "); // une con separador

            console.log(error.errors);


            return;
        } else {
            const result = await response.json();
            const myModal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
            ms.classList.remove("alert", "alert-danger");
            ms.textContent = '';
            //document.getElementById("form-edit").reset();
            myModal.hide();
            getClientes();
        }
    });

    table.addEventListener('click', async (e) => {

        if (e.target.classList.contains('btn-delete')) {
            const id = e.target.dataset.id;
            const url = urlApi + id;
            console.log(url);

            const confirm = await Swal.fire({
                title: '¿Estás seguro?',
                text: "El cliente se eliminará definitivamente",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar!'
            });

            if (confirm.isConfirmed) {
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        "Accept": "application/json",
                        "Authorization": "Bearer 1|deaIfTdWdXr9z15pHmmYIQnV8CYrkml4pUTThHD78a04886d"
                    }
                });

                if (response.ok) {
                    Swal.fire({
                        title: 'Eliminado!',
                        text: 'El cliente ha sido eliminado.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    getClientes();
                } else {
                    Swal.fire('Error', 'No se pudo eliminar el cliente.', 'error');
                }
            }
        }

    });

    window.editarCliente = async function (id) {
        const url = urlApi + id;
        console.log(url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer 1|deaIfTdWdXr9z15pHmmYIQnV8CYrkml4pUTThHD78a04886d"
            }
        });

        if (!response.ok) {
            Swal.fire('Error', 'No se pudo cargar el cliente.', 'error');
            return;
        }

        const result = await response.json();
        const cliente = result.data;
        console.log(cliente);

        // Llenar modal
        document.getElementById('edit-id').value = cliente.id;
        document.getElementById('edit-name').value = cliente.name;
        document.getElementById('edit-email').value = cliente.email;
        document.getElementById('edit-phone').value = cliente.phone;

        // Mostrar modal
        const modalEdit = new bootstrap.Modal(document.getElementById('modalEdit'));
        modalEdit.show();
    }


    btnUpdate.addEventListener('click', async () => {
        const formData = new FormData(formEdit);
        const data = Object.fromEntries(formData.entries()); // convierte FormData → objeto plano
        console.log(data.id);
        const response = await fetch(urlApi + data.id, {
            method: 'PUT',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer 1|deaIfTdWdXr9z15pHmmYIQnV8CYrkml4pUTThHD78a04886d"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.text();
            Swal.fire('Error', 'No se pudo editar el cliente.' + error, 'error');

            return;
        } else {
            //const result = await response.json();
            Swal.fire('Editado!', 'El cliente ha sido editado.', 'success');
            const myModal = bootstrap.Modal.getInstance(document.getElementById('modalEdit'));
            myModal.hide();
            getClientes();
        }
    });

    getClientes();



});
