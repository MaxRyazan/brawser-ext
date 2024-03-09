// chrome.runtime.onMessage.addEventListener((request, sender, sendResponse) => {
//     if(request.message === 'insert') {
//         insertRecord(request.payload)
//     } else if (request.message === 'get') {
//         getRecord(request.payload)
//     }
// });
//
// let DB;
// createDB();
// function createDB(){
//     const request = indexedDB.open("Links_DB");
//     request.onupgradeneeded = function (event) {
//         DB = event.target.result
//         DB.createObjectStore('links', {
//             keyPath: 'url'
//         })
//     }
//     request.onsuccess = function (event) {
//         DB = event.target.result
//         console.log('DB created !!!')
//     }
// }
//
// function insertRecord(record) {
//     if(DB) {
//         const transaction = DB.transaction("links", "readwrite");
//         const store = transaction.objectStore('links');
//         store.add(record)
//     }
// }
// function getRecord(url) {
//     if(DB) {
//         const transaction = DB.transaction("links", "readonly");
//         const store = transaction.objectStore('links');
//         return store.get(url)
//     }
// }
