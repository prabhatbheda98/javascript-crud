
const form = document.querySelector("#itemForm");
const itemInput = document.querySelector("#itemInput");
const itemList = document.querySelector("#itemList");
const messageDiv = document.querySelector("#message");
const clearButton = document.querySelector("#clear-list");
const toggleBtn = document.querySelector("#toggleBtn");
const filters = document.querySelectorAll(".nav-item");

let todoItems = [];

const showAlert = function (message, msgClass) {
  messageDiv.innerHTML = message;
  messageDiv.classList.add(msgClass , "show");
  messageDiv.classList.remove("hide");
  setTimeout(() => {
    messageDiv.classList.remove("show");
    messageDiv.classList.add("hide");
  }, 1000);
  return;
};
const getItemsFilter = function (type) {
  let filterItems = [];
  switch (type) {
    case "todo":
      filterItems = todoItems.filter((item) => !item.isDone);
      break;
    case "done":
      filterItems = todoItems.filter((item) => item.isDone);
      break;
    default:
      filterItems = todoItems;
  }
  getList(filterItems);
};

const removeItem = function (item) {
  const removeIndex = todoItems.indexOf(item);
  todoItems.splice(removeIndex, 1);
  
};

clearButton.addEventListener("click", function () {
  todoItems = [];
  console.log(todoItems);
  getList(todoItems);
  showAlert("All item has been clear.", "alert-warning");
});

toggleBtn.addEventListener("click", () => {
  if (itemList.style.display === "none") {
    itemList.style.display = "block";
  } else {
    itemList.style.display = "none";
  }
});

const handleItem = function (itemData) {
  const items = document.querySelectorAll(".list-group-item");
  items.forEach((item) => {
    if (
      item.querySelector(".title").getAttribute("data-time") == itemData.addedAt
    ) {
      item.querySelector("[data-done]").addEventListener("click", function (e) {
        e.preventDefault();
        const itemIndex = todoItems.indexOf(itemData);
        const currentItem = todoItems[itemIndex];
        const currentClass = currentItem.isDone
          ? "bi-check-circle-fill"
          : "bi-check-circle";
        currentItem.isDone = currentItem.isDone ? false : true;
        todoItems.splice(itemIndex, 1, currentItem);
        const iconClass = currentItem.isDone
          ? "bi-check-circle-fill"
          : "bi-check-circle";
        this.firstElementChild.classList.replace(currentClass, iconClass);
        const filterType = document.querySelector("#filterType").value;
        getItemsFilter(filterType);
      });
 
      item.querySelector("[data-delete]").addEventListener("click", function (e) {
          e.preventDefault();
          if (confirm("Are you sure want to delete?")) {
            itemList.removeChild(item);
            removeItem(item);
            document.getElementById("demo1").innerHTML = todoItems.length;
            showAlert("Item has been deleted.", "alert-success");
            return todoItems.filter((item) => item != itemData);
          }
        });
    }
  });
};
const getList = function (todoItems) {
  itemList.innerHTML = "";
  if (todoItems.length > 0) {
    todoItems.forEach((item) => {
      const iconClass = item.isDone
        ? "bi-check-circle-fill"
        : "bi-check-circle";
      itemList.insertAdjacentHTML(
        "beforeend",
        `<li class="list-group-item d-flex justify-content-between align-items-center  p-3 list-gp">
          <span class="title"  "style="color: #777777;" data-time="${item.addedAt}">${item.name}</span> 
          <span>
              <a href="#" data-done class="icon position-absolute"><i class="bi ${iconClass} green"></i></a>
              <a href="#" data-delete><i class="bi bi-x-circle red"></i></a>
          </span>
        </li>`
      );
      handleItem(item);
    });
  } else {
    itemList.insertAdjacentHTML(
      "beforeend",
      `<li class="list-group-item d-flex justify-content-between align-items-center">
        No record found.
      </li>`
    );
  }
  document.getElementById("demo1").innerHTML = todoItems.length + " "+ "item left";
};
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const itemName = itemInput.value;
  if (itemName.length === 0) {
    showAlert("Please enter name.", "alert-danger");
  }
  else {
    const itemObj = {
      name: itemName,
      isDone: false,
      addedAt: new Date().getTime(),
    };
    todoItems.push(itemObj);
    showAlert("New item has been added.", "alert-success");
  }
  getList(todoItems);
  console.log(todoItems);
  itemInput.value = "";
});
filters.forEach((tab) => {
  tab.addEventListener("click", function (e) {
    e.preventDefault();
    const tabType = this.getAttribute("data-type");
    document.querySelectorAll(".nav-link").forEach((nav) => {
      nav.classList.remove("active");
    });
    this.firstElementChild.classList.add("active");
    document.querySelector("#filterType").value = tabType;
    getItemsFilter(tabType);
  });
});

