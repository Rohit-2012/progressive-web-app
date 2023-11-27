import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://playground-c6cbb-default-rtdb.asia-southeast1.firebasedatabase.app/",
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputEl = document.getElementById("input-el");
const addBtnEl = document.getElementById("add-btn");
const shoppingListEl = document.getElementById("shopping-list");

addBtnEl.addEventListener("click", function () {
  let inputValue = inputEl.value;

  if (inputValue) {
    push(shoppingListInDB, inputValue);
  }

  clearInputField();
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearShoppingList();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItemData = itemsArray[i];
      appendItemsToList(currentItemData);
    }
  } else {
    shoppingListEl.innerHTML = "There are no items yet....";
  }
});

function clearInputField() {
  inputEl.value = "";
}

function clearShoppingList() {
  shoppingListEl.innerHTML = "";
}

function appendItemsToList(items) {
  let itemID = items[0];
  let itemName = items[1];

  let newItem = document.createElement("li");
  newItem.textContent = itemName;
  newItem.addEventListener("dblclick", function () {
    let itemLocationInDB = ref(database, `shoppingList/${itemID}`);
    remove(itemLocationInDB);
  });

  shoppingListEl.append(newItem);
}
