const defaultItem = {
    type: "tshirt",
    gender: "female",
    size: "large",
    color: "blue",
    image: "img/blue_t.png",
};

const state = {
    data: [],
    newItem: defaultItem,
    selected: undefined
};

// Fetch the items from the JSON file
// data.json에 있는 데이터를 읽어와서 item을 전달
function loadItems() {
    // 1. 데이터 받아옴
    return (
        fetch("data/data.json")
            // 2. 받아온 데이터가 성공적이면 json으로 변환
            .then((response) => response.json())
            // 3. json안에 있는 items를 return
            .then((json) =>
                json.items.map((item, index) => ({
                    key: index,
                    ...item,
                }))
            )
    );
}

// Update the list with the given items
function displayItems(state) {
    const {
        data,
        selected
    } = state;

    // clear
    const container = document.querySelector(".items");
    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }

    // Select data 
    const items = state.selected ?
        data.filter((item) => item[selected.key] === selected.value) :
        data;

    // Add data
    for (const item of items) {
        container.append(makeList(item));
    }
}

// Create list item from the given data item
function makeItem(tag, item, money) {
    const element = document.createElement(tag);
    const img = document.createElement("img");
    const span = document.createElement("span");
    const delBtn = document.createElement("button");

    element.classList.add("item");

    img.src = `${item.image}`;
    img.alt = `${item.type}`;
    img.classList.add("item__thumbnail");

    span.innerText = `${item.gender}, ${item.size}`;
    span.classList.add("item__description");

    element.append(img);
    element.append(span);

    if (money) {
        delBtn.innerText = `💸`;
        delBtn.classList.add("delBtn");
        delBtn.addEventListener("click", () => onDeleteButtonClick(state, item.key));
        element.append(delBtn);
    }

    return element;
}
function makeList(item) {
    return makeItem("li", item, true);
}
function makeDiv(item) {
    return makeItem("div", item);
}

// Handle logo click
function onLogoClick(state) {
    state.selected = undefined;
    displayItems(state);
}

// Handle button click
function onButtonClick(event, state) {
    const target = event.target;
    const key = target.dataset.key;
    const value = target.dataset.value;
    if (key == null || value == null) {
        return;
    }
    state.selected = {
        key,
        value,
    };
    displayItems(state);
}

function onDeleteButtonClick(state, key) {
    state.data = state.data.filter((d) => d.key !== key);
    displayItems(state);
}

function onAddClick() {
    const addContainer = document.querySelector(".add-container");
    showNewItemChoice();
    addContainer.classList.remove("hide");
}

function onCloseAddClick() {
    const addContainer = document.querySelector(".add-container");
    addContainer.classList.add("hide");
}

function onAddMenuIconClickFactory(keys) {
    function onAddMenuIconClick(event) {
        const { target } = event;
        if (!Object.keys(target.dataset).length) return;

        for (const key of keys) {
            // extract values to state
            const value = target.dataset[key];
            state.newItem[key] = value;
        }

        const images = document.querySelectorAll(".imgBtn.addImgBtn");
        const { color } = state.newItem;
        for (const image of images) {
            const newImage = image.dataset.image.replace(/\/.+_/, `/${color}_`);
            image.dataset.image = newImage;
            image.src = newImage;
        }

        showNewItemChoice()
    }

    return onAddMenuIconClick;
}

function showNewItemChoice() {
    const newDiv = makeDiv(state.newItem);
    const container = document.querySelector(".add-values");

    // clear
    while (container.lastChild) {
        container.removeChild(container.lastChild);
    }

    // add
    container.append(newDiv);
}

function onAddItemButtonClick() {
    const newItem = state.newItem
    state.data.push(newItem);
    state.newItem = defaultItem;
    const container = document.querySelector(".items");
    container.append(makeList(newItem));

    onCloseAddClick();
}


function setEventListreners(state) {
    const logo = document.querySelector(".logo");
    const buttons = document.querySelector(".buttons");
    const addButton = document.querySelector(".add");
    const closeAddButton = document.querySelector(".add-close");
    const addItemButton = document.querySelector(".add-item > button");
    logo.addEventListener("click", () => onLogoClick(state));
    buttons.addEventListener("click", (event) => onButtonClick(event, state));
    addButton.addEventListener("click", onAddClick);
    closeAddButton.addEventListener("click", onCloseAddClick);
    addItemButton.addEventListener("click", onAddItemButtonClick);

    const keysList = [["color"], ["image", "type"], ["size"], ["gender"]];

    for (const keys of keysList) {
        const listener = onAddMenuIconClickFactory(keys);
        const element = document.querySelector(`.add-${keys[0]}`);
        console.log(element);
        element.addEventListener("click", listener);
    }
}

function init() {
    loadItems()
        .then((items) => {
            state.data = items;
            displayItems(state);
            setEventListreners(state);
        })
        .catch(console.log);
}

init();

// 추가하고 싶은 기능
// 1. 삭제 - O
// 2. 입력