// Get HTML elements

const form = document.getElementById("customerForm");
const customerTable = document.getElementById("customerTable");
const searchInput = document.getElementById("search");

// Load customer records from localStorage

let customers = JSON.parse(
    localStorage.getItem("customers")
) || [];

let nextId = customers.reduce(
    (max, customer) => Math.max(max, Number(customer.id) || 0), 0
) + 1;


// Save records

function saveData() {
    localStorage.setItem(
        "customers",
        JSON.stringify(customers)
    );
}


// Update dashboard

function updateDashboard() {

    document.getElementById("totalCustomers").innerText =
        customers.length;

    document.getElementById("totalOrders").innerText =
        customers.length;

    document.getElementById("pendingOrders").innerText =
        customers.filter(c =>
            c.status === "Pending" ||
            c.status === "In Progress"
        ).length;

    document.getElementById("completedOrders").innerText =
        customers.filter(c =>
            c.status === "Completed"
        ).length;
}


// Display customer records

function displayCustomers(data = customers) {

    customerTable.innerHTML = "";

    if (data.length === 0) {
        customerTable.innerHTML =
            `<tr><td colspan="7">No customer records found.</td></tr>`;
    }

    data.forEach(customer => {

        const row = document.createElement("tr");

        const values = [
            customer.id,
            customer.name,
            customer.phone,
            customer.service,
            customer.orderDate,
            customer.status
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit";
        editButton.onclick = () => editCustomer(customer.id);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete";
        deleteButton.onclick = () => deleteCustomer(customer.id);

        actionCell.append(editButton, deleteButton);
        row.appendChild(actionCell);

        customerTable.appendChild(row);

    });

    updateDashboard();
}


// Add or update customer

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const editId = document.getElementById("editId").value;

    const customer = {

        id: editId ? Number(editId) : nextId,

        name: document.getElementById("name").value.trim(),

        phone: document.getElementById("phone").value.trim(),

        email: document.getElementById("email").value.trim(),

        service: document.getElementById("service").value,

        description: document.getElementById("description").value.trim(),

        orderDate: document.getElementById("orderDate").value,

        status: document.getElementById("status").value

    };

    if (!customer.name || !customer.phone ||
        !customer.service || !customer.orderDate) {

        alert("Please fill all required fields.");
        return;
    }

    if (editId) {

        customers = customers.map(c =>
            c.id === Number(editId) ? customer : c
        );

        alert("Customer updated successfully!");

    } else {

        customers.push(customer);
        nextId++;

        alert("Customer added successfully!");

    }

    saveData();

    form.reset();

    document.getElementById("editId").value = "";
    document.getElementById("saveButton").innerText = "Add Customer";

    displayCustomers();

});


// Edit customer

function editCustomer(id) {

    const customer = customers.find(c => c.id === id);

    if (!customer) return;

    document.getElementById("editId").value = customer.id;

    document.getElementById("name").value = customer.name;

    document.getElementById("phone").value = customer.phone;

    document.getElementById("email").value = customer.email;

    document.getElementById("service").value = customer.service;

    document.getElementById("description").value = customer.description;

    document.getElementById("orderDate").value = customer.orderDate;

    document.getElementById("status").value = customer.status;

    document.getElementById("saveButton").innerText = "Update Customer";

    document.getElementById("addCustomer").scrollIntoView({
        behavior: "smooth"
    });

}


// Delete customer

function deleteCustomer(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this customer?"
    );

    if (confirmDelete) {

        customers = customers.filter(c => c.id !== id);

        saveData();

        displayCustomers();

        alert("Customer deleted successfully!");

    }

}


// Search customer

searchInput.addEventListener("input", function() {

    const searchValue = this.value.toLowerCase();

    const filteredCustomers = customers.filter(customer => {

        return customer.name.toLowerCase().includes(searchValue) ||
               customer.phone.toLowerCase().includes(searchValue);

    });

    displayCustomers(filteredCustomers);

});


// Clear form

form.addEventListener("reset", function() {

    setTimeout(() => {

        document.getElementById("editId").value = "";

        document.getElementById("saveButton").innerText =
            "Add Customer";

    }, 0);

});


// Initial display

displayCustomers();