const input = document.getElementById("itemInput");
const addButton = document.getElementById("addBtn");
const form = document.querySelector("form");
const table = document.getElementById("myTable");

function addItem() {
    const value = input.value.trim();

    if (value === "") {
        alert("Please enter an item");
        return;
    }

    const rows = table.querySelectorAll("tr");
    for (let i = 1; i < rows.length; i++) {
        const existingItem = rows[i].children[0].textContent.trim();
        if (existingItem.toLowerCase() === value.toLowerCase()) {
            alert("This item already exists");
            input.value = "";
            input.focus();
            return;
        }
    }

    const row = document.createElement("tr");

    const itemCell = document.createElement("td");
    itemCell.textContent = value;

    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
        row.remove();
    });

    actionCell.appendChild(deleteButton);
    row.appendChild(itemCell);
    row.appendChild(actionCell);
    table.appendChild(row);

    input.value = "";
    input.focus();
}

addButton.addEventListener("click", addItem);

form.addEventListener("submit", function (event) {
    event.preventDefault();
    addItem();
});
