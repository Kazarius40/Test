const inputName = document.getElementById("nameValueInput");
const addButton = document.getElementById("addButton");
const pairList = document.getElementById("pairList");
const ItemsLocal = JSON.parse(localStorage.getItem("pairList")) || [];

inputName.addEventListener("input", validateInput);
addButton.addEventListener("click", addToList);

window.onload = function () {
    ItemsLocal.forEach(value => {
        const div = document.createElement("div");
        div.textContent = value + "";
        pairList.appendChild(div);
    });
};

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

    if (ItemsLocal.some(item => item === value)) {
        alert("Ця пара вже додана!");
        return;
    }

    ItemsLocal[ItemsLocal.length] = value;
    localStorage.setItem("pairList", JSON.stringify(ItemsLocal));

    const div = document.createElement("div");
    div.textContent = value;
    pairList.appendChild(div);

    inputName.value = "";
}