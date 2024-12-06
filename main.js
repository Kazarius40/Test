const inputName = document.getElementById("nameValueInput");
const addButton = document.getElementById("addButton");
const sortByName = document.getElementById("sortByName");
const sortByValue = document.getElementById("sortByValue");
const buttonDelete = document.getElementById("delete");
const pairList = document.getElementById("pairList");
const itemsLocal = JSON.parse(localStorage.getItem("pairList")) || [];

inputName.addEventListener("input", validateInput);
addButton.addEventListener("click", addToList);
sortByName.addEventListener("click", () => sortList(0));
sortByValue.addEventListener("click", () => sortList(1));
buttonDelete.addEventListener("click", deleteLine);

window.onload = function () {
    itemsLocal.forEach(addItemToList);
};

function addItemToList(value) {
    const div = document.createElement("div");
    div.textContent = value;
    div.classList.add("listItem");

    div.addEventListener("click", () => {
        const ItemsOfListItem = pairList.querySelectorAll(".listItem");
        ItemsOfListItem.forEach(item => item.classList.remove("selected"));
        div.classList.add("selected");
    });

    pairList.appendChild(div);
}

function validateInput() {
    let value = inputName.value;
    const acceptableSigns = value.match(/[\p{L}\p{N}= ]/gu);
    value = acceptableSigns ? acceptableSigns.join("") : "";

    const partsEqual = value.split("=");
    if (partsEqual.length > 2) {
        value = partsEqual[0] + "=" + partsEqual.slice(1).join("");
    }
    inputName.value = value;
}

function addToList() {
    let value = inputName.value;

    if (value.split("=")[0].trim() === "" || value.split("=")[1].trim() === "") {
        alert("Потрібно виконати умову введеня інформації");
        return;
    }

    value = value.split("=").map(space => space.trim()).join(" = ");

    if (itemsLocal.some(item => item === value)) {
        alert("Ця пара вже додана!");
        return;
    }

    itemsLocal[itemsLocal.length] = value;
    localStorage.setItem("pairList", JSON.stringify(itemsLocal));
    addItemToList(value);
    inputName.value = "";
}

function sortList(index) {
    itemsLocal.sort((a, b) => {
        const firstLine = a.split("=")[index].toLowerCase();
        const secondLine = b.split("=")[index].toLowerCase();
        return firstLine > secondLine ? 1 : firstLine < secondLine ? -1 : 0;
    });
    updateList();
}

function updateList() {
    localStorage.setItem("pairList", JSON.stringify(itemsLocal));
    pairList.innerHTML = "";
    itemsLocal.forEach(addItemToList);
}

function deleteLine() {
    const selectedLine = document.querySelector(".selected");
    if (selectedLine) {
        const LineValue = selectedLine.textContent;
        const index = itemsLocal.indexOf(LineValue);

        itemsLocal.splice(index, 1);
        localStorage.setItem("pairList", JSON.stringify(itemsLocal));
        selectedLine.remove();
    }
}