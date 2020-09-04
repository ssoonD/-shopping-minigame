const state = {
    data: [],
    selected: undefined,
};

// Fetch the items from the JSON file
// data.json에 있는 데이터를 읽어와서 item을 전달
function loadItems() {
    // 1. 데이터 받아옴 
    return fetch('data/data.json')
        // 2. 받아온 데이터가 성공적이면 json으로 변환 
        .then(response => response.json())
        // 3. json안에 있는 items를 return 
        .then(json => json.items.map((item, index) => ({
            key: index,
            ...item
        })));
}

// Update the list with the given items
function displayItems(state) {
    const {
        data,
        selected,
    } = state;

    // clear
    const container = document.querySelector(".items");
    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }
    const items = state.selected ? data.filter(item => item[selected.key] === selected.value) : data;

    for (const item of items) {
        container.append(makeList(item));
    }
}

// Create list item from the given data item
function makeList(item) {
    const li = document.createElement("li");
    const img = document.createElement("img");
    const span = document.createElement("span");
    const delBtn = document.createElement("button");

    li.classList.add("item");

    img.src = `${item.image}`;
    img.alt = `${item.type}`;
    img.classList.add("item__thumbnail");

    span.innerText = `${item.gender}, ${item.size}`;
    span.classList.add("item__description");

    delBtn.innerText = `💸`;
    delBtn.classList.add("delBtn");
    delBtn.addEventListener('click', () => onDeleteButtonClick(state, item.key));

    li.append(img);
    li.append(span);
    li.append(delBtn);

    return li;
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
        value
    };
    displayItems(state);
}

function onAddClick() {
    const addContainer = document.querySelector('.add-container');
    addContainer.classList.remove('hide');
}

function onCloseAddClick() {
    const addContainer = document.querySelector('.add-container');
    addContainer.classList.add('hide');
}

function onDeleteButtonClick(state, key) {
    state.data = state.data.filter(d => d.key !== key);
    displayItems(state);
}

function setEventListreners(state) {
    const logo = document.querySelector('.logo');
    const buttons = document.querySelector('.buttons');
    const addButton = document.querySelector('.add');
    const closeAddButton = document.querySelector('.add-close');
    logo.addEventListener('click', () => onLogoClick(state));
    buttons.addEventListener('click', event => onButtonClick(event, state));
    addButton.addEventListener('click', onAddClick);
    closeAddButton.addEventListener('click', onCloseAddClick);
}

// main
loadItems()
    .then(items => {
        state.data = items;
        displayItems(state);
        setEventListreners(state);
    })
    .catch(console.log);


// 추가하고 싶은 기능
// 1. 삭제
// 2. 입력