const inputName = document.getElementById("nameValueInput");
const addButton = document.getElementById("addButton");
const sortByName = document.getElementById("sortByName");
const sortByValue = document.getElementById("sortByValue");
const buttonDelete = document.getElementById("delete");
const pairList = document.getElementById("pairList");
// витягую з локалі масив з ключем pairList. Додав, щоб при перезагрузці не зникали додані мною рядки
const itemsLocal = JSON.parse(localStorage.getItem("pairList")) || [];

inputName.addEventListener("input", validateInput);
addButton.addEventListener("click", addToList);
// при натисканні кнопок sortByName, або ж sortByValue в функцію sortList передаеться аргумент 0, або ж 1 відповідно, де 0 - це частина рядка до знака "=", та 1 - це частина рядка після знака "="
sortByName.addEventListener("click", () => sortList(0));
sortByValue.addEventListener("click", () => sortList(1));
buttonDelete.addEventListener("click", deleteLine);

// Загружаю всі елементи з localStorage в блок pairList, викликаючи функцію addItemToList, яка для кожного елемента з масиву localStorage створює div в блоці pairList, додаючи йому класс listItem
window.onload = function () {
    // для кожного елемента з масиву itemsLocal за допомогою .forEach викликаю функцію addItemToList, щоб записати то все на сторінці при перезавантаженні сторінки
    itemsLocal.forEach(addItemToList);
};

// Створюю виділення строки по кліку. В даному випадку функція запускається, якщо я клікну десь в межах pairList
pairList.addEventListener("click", (event) => {
    // Перевіряю, чи має частина блоку pairList, яку ми натискаємо мишкою (event.target) клас .listItem (щоб уникнути спрацювання при натисканні на пусте місце в блоці). Де .matches повертає мені true/false
    if (event.target.matches(".listItem")) {
        // Можна ще так написати. Поки не до кінця розумію різницю, коли і що буде краще працювати.
        // if (event.target.className === "listItem") {
        // ну і додаю обраному рядку за класс selected
        event.target.classList.add("selected");
    }
});

// Функція перевірки даних з поля input (тобто ми в любому випадку вписуємо щось там, а ця функція або ж напише нам цей знак, або ж ні)
function validateInput() {
    let value = inputName.value;
    // [...] - область допустимих символі, \p{L} - літери любих мов, \p{N} - цифри, g - глобальний пошук, u - робота не тільки з ASCII (що воно таке ще не повністю розумію). .match розбиває введене value на елементи та зберігає їх в масив acceptableSigns
    const acceptableSigns = value.match(/[\p{L}\p{N}= ]/gu);
    // Якщо символ пройшов перевірку, то .join збере назад в value їх докупи. Інакше він нічого не додасть до value нового
    value = acceptableSigns ? acceptableSigns.join("") : "";

    // Розділяе введен в input (на даному етапі це вже value) за допомогою .split на елементи: до "=" та після нього та вписує його в масив partsEqual (прибираємо можливість зробити два знаки "=")
    const partsEqual = value.split("=");
    // Якщо елементів в масиві partsEqual буде більше, то ми намагаємося ще одне дорівнює написати
    if (partsEqual.length > 2) {
        // Беремо перший елемент (нульовий індекс) з partsEqual, додаємо до нього "=", за допомогою slice обрізаємо усі елементи, що ідуть після нього (знака "=" в масиві вже немає) та за допомогою .join зклеюємо їх докупи без розділювачів (тут .join("") стоїть). Тобто, натискаючи другий раз знак "=" у нас з'являється масив partsEqual з трьома елементами ("щось до =", "щось після =", "та пусте місце")
        value = partsEqual[0] + "=" + partsEqual.slice(1).join("");
    }
    inputName.value = value;
}

function addToList() {
    let value = inputName.value;

    // Перевіряю спочатку на присутність знака = (а то як я цю перевірку в кінці сунув, то в консоль помилка лізла). Потім за допомогою .split розбиваю строку на масив з двома елементами (до знака "=" та після нього). Далі за допомогою .trim() прибираю усі зайві пробіли і якщо після цього хоча б в одному з елементів нічого не залишается, то викликати помилку alert (прибрав можливість додати пару Name/Value Pair не виконавши умови)
    if (value.split("=").length < 2 || value.split("=")[0].trim() === "" || value.split("=")[1].trim() === "") {
        alert("Потрібно виконати умову введеня інформації");
        return;
    }

    // за допомогою .split розбиваю в масив рядок value по знаку =, .map обробляє кожен елемент масиву (space довільна назва, в даному випадку видаляю пробіли, то і назвав так), використовуючи .trim(), який прибирає зайві пробіли, .join(" = ") вже зклеює елементи цього масиву за знаком " = ". Тут навмисно я по краям поставив пробіли, щоб при відображені в pairList було все однаково.
    value = value.split("=").map(space => space.trim()).join(" = ");

    // за допомогою .some перевіряю, чи хоч один елемент з itemsLocal дорівнює value, щоб прибрати можливість додавати в масив однакові строки
    if (itemsLocal.some(item => item === value)) {
        alert("Ця пара вже додана!");
        return;
    }

    itemsLocal[itemsLocal.length] = value;
    // як варіант заміни. Більш зручний, але я навмисно пишу постійно верхнє, щоб звикнути на підсвідомості
    // itemsLocal.push(value);

    // переписую локаль та додаю рядок на сторінку (в pairList)
    localStorage.setItem("pairList", JSON.stringify(itemsLocal));
    addItemToList(value);
    inputName.value = "";
}

// Створює при виклику тег div з вмістом value, яке передається сюди як аргумент з поля input, додаючи йому класс listItem
function addItemToList(value) {
    const div = document.createElement("div");
    div.textContent = value;
    div.classList.add("listItem");
    pairList.appendChild(div);
}

function sortList(index) {
    itemsLocal.sort((a, b) => {
        // .split("=") розбиває наш елемент з масиву itemsLocal на елементи в масив по знаку "=" та [index] ми отрумуємо як аргумент при натисканні кнопок сортування (0, або ж 1). .toLowerCase() робить мені нижній регістр, щоб коректно відсортувати
        const firstLine = a.split("=")[index].toLowerCase();
        const secondLine = b.split("=")[index].toLowerCase();
        return firstLine > secondLine ? 1 : firstLine < secondLine ? -1 : 0;
    });
    // після відсортовування викликаю цю функію, щоб переписати в локалі та на сторінці положення рядків
    updateList();
}

// після сортування переписую рзміщення рядків в локалі та на сторінці
function updateList() {
    localStorage.setItem("pairList", JSON.stringify(itemsLocal));
    // онулюю блок pairList, щоб потім в нього записати оновлене положення рядків
    pairList.innerHTML = "";
    // для кожного елемента з itemsLocal (відсортованого уже) за допомогою .forEach викликаю функцію addItemToList, що створює для нього (цього елемента) div в блоці pairList
    itemsLocal.forEach(addItemToList);
}

function deleteLine() {
    let selectedLine;
    // в selectedLine закидаю усі строки з класом selected, створюючи при цьому з нього масив
    selectedLine = document.querySelectorAll(".selected");
    if (selectedLine) {
        for (let item of selectedLine) {
            const lineValue = item.textContent;
            // шукаю індекс в масиві itemsLocal з текстом елемента item
            const index = itemsLocal.indexOf(lineValue);
            // ну і видаляю елемент з цим індексом з масиву itemsLocal
            itemsLocal.splice(index, 1);
            // перезаписую локаль
            localStorage.setItem("pairList", JSON.stringify(itemsLocal));
            // видаляю цей div з HTML
            item.remove();
        }
    }
}