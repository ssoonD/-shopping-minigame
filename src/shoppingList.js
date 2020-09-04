// Fetch the items from the JSON file
// data.json에 있는 데이터를 읽어와서 item을 전달
function loadItems() {
    // 1. 데이터 받아옴 
    return fetch('data/data.json')
        // 2. 받아온 데이터가 성공적이면 json으로 변환 
        .then(response => response.json())
        // 3. json안에 있는 items를 return 
        .then(json => json.items);
}

// Update the list with the given items
function displayItems(items) {
    const container = document.querySelector(".items");
    // innerHTML 안좋음?
    container.innerHTML = items.map(item => createHTMLString(item)).join('');
}

// Create HTML list item from the given data item
function createHTMLString(item) {
    return `
    <li class="item">
        <img src="${item.image}" alt="${item.type}" class="item__thumbnail" />
        <span class="item__description">${item.gender}, ${item.size}</span>
    </li>
    `;
}

// Handle button click
function onButtonClick(event, items) {
    const target = event.target;
    const key = target.dataset.key;
    const value = target.dataset.value;
    if (key == null || value == null) {
        return;
    }
    displayItems(items.filter(item => item[key] === value));
    // upDateItems(items, key, value);
}

// Make the items matching {key: value} insivible
function upDateItems(items, key, value) {
    items.forEach(item => {
        if (item.dataset[key] === value) {
            item.classList.remove('invisible');
        } else {
            item.classList.add('invisible');
        }
    });
    displayItems(items.filter(item => item[key] === value));
}

function setEventListreners(items) {
    const logo = document.querySelector('.logo');
    const buttons = document.querySelector('.buttons');
    logo.addEventListener('click', () => displayItems(items));
    buttons.addEventListener('click', event => onButtonClick(event, items));
}

// main
loadItems()
    .then(items => {
        displayItems(items);
        setEventListreners(items);
    })
    .catch(console.log);


// 추가하고 싶은 기능
// 1. 삭제
// 2. 입력