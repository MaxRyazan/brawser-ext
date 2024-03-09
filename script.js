const btn = document.querySelector('.my-ext__btn')
const btn2 = document.querySelector('.my-ext__btn2')
const extension = document.querySelector('.my-ext__container')
const allContainer = document.querySelector('.my-ext__rendered-links')
const hideButton = document.querySelector('.my-ext__btn-hide-menu')
const showButton = document.querySelector('.my-ext__btn-show-menu')

const filter = document.querySelector('.my-ext__filter-by-category')

let isRendered = false;
let DB;
let allLinks = [];
createDB();
setHeight();


function setHeight() {
    const height = extension.clientHeight;
    const myExt = document.querySelector('.my-ext');
    myExt.style.minHeight = height + 'px'
}

function createDB() {
    const request = indexedDB.open("Links_DB");
    request.onupgradeneeded = function (event) {
        DB = event.target.result
        DB.createObjectStore('links', {
            keyPath: 'url'
        })
    }
    request.onsuccess = function (event) {
        DB = event.target.result
        console.log('DB created !!!');
        allLinks = findAll();
    }
}


btn2.addEventListener("click", () => {
    if (!isRendered) {
        renderAllLinks(allLinks);
        isRendered = true;
    }
})

btn.addEventListener("click", async (event) => {
    const lang = document.querySelector('.my-ext__lang');
    const theme = document.querySelector('.my-ext__theme');
    const description = document.querySelector('.my-ext__textarea');
    let url = await getCurrentTab()
    if (lang.value.length && theme.value.length && description.value.length && url.url.length) {
        const newLink = {
            lang: lang.value,
            theme: theme.value,
            description: description.value,
            url: url.url,
        }
        const transaction = DB.transaction(['links'], "readwrite");
        const objectStore = transaction.objectStore('links');
        const request = objectStore.add({url: newLink.url, newLink})
        request.onsuccess = () => {
            console.log('SUCCESS!')
        }
        request.onerror = () => {
            console.log('ERROR!')
        }
    } else {
        alert('Введены некорректные данные!')
    }
})


async function getCurrentTab() {
    let queryOptions = {active: true, lastFocusedWindow: true};
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

function findAll() {
    const result = [];
    const transaction = DB.transaction(['links'], "readonly");
    const objectStore = transaction.objectStore('links');
    const request = objectStore.openCursor();
    request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            result.push(cursor.value);
            cursor.continue();
        }
    }
    return result
}

function renderAllLinks(links) {

    links.forEach((link, idx) => {
        const div = document.createElement("div");
        const aHref = document.createElement("a");
        const langSpan = document.createElement("span");
        const themeSpan = document.createElement("span");
        const descSpan = document.createElement("span");

        descSpan.title = link.newLink.description;


        aHref.href = link.newLink.url;
        aHref.addEventListener('click', () => {
            window.open(link.newLink.url);
        })

        aHref.classList.add('my-ext__item-inner');
        langSpan.classList.add('my-ext__item-inner');
        themeSpan.classList.add('my-ext__item-inner');
        descSpan.classList.add('my-ext__item-inner');

        aHref.classList.add('my-href');
        langSpan.classList.add('my-lang');
        themeSpan.classList.add('my-theme');
        descSpan.classList.add('my-desc');

        aHref.innerText = 'Ссылка';
        langSpan.innerText = link.newLink.lang;
        themeSpan.innerText = link.newLink.theme;
        descSpan.innerText = link.newLink.description;


        div.classList.add('my-ext__item');
        if (idx % 2 === 0) {
            div.style.backgroundColor = 'rgb(45, 0, 0)'
        }
        div.append(aHref)
        div.append(langSpan)
        div.append(themeSpan)
        div.append(descSpan)
        allContainer.append(div);
    })
}

hideButton.addEventListener("click", () => {
    extension.classList.add('my-ext-hide');
    hideButton.classList.add('my-ext-hide');
    showButton.classList.remove('my-ext-hide');
})
showButton.addEventListener("click", () => {
    extension.classList.remove('my-ext-hide')
    showButton.classList.add('my-ext-hide');
    hideButton.classList.remove('my-ext-hide');
})

function clearRenderedLinks() {
    while (allContainer.firstChild) {
        allContainer.removeChild(allContainer.firstChild);
    }
}


filter.addEventListener("change", () => {
    const filterString = filter.value;
    const matchesLinks = allLinks.filter(link => link.newLink.lang.includes(filterString));
    clearRenderedLinks();
    renderAllLinks(matchesLinks);
})