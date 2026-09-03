const TEST_KEY = "hello";

const setLocalStorageButton = document.getElementById("setToLocalStorage");
setLocalStorageButton.addEventListener("click", () => {
  localStorage.setItem(TEST_KEY, "world");
  console.log(`Set key "${TEST_KEY}" to localStorage.`);
});

const getLocalStorageButton = document.getElementById("getFromLocalStorage");
getLocalStorageButton.addEventListener("click", () => {
  const value = localStorage.getItem(TEST_KEY);
  if (value) {
    console.log(`Got value from localStorage. \n\nGot value: "${value}"`);
  } else {
    console.log(`Not founded key "${TEST_KEY}" in localStorage`);
  }
});

const removeLocalStorageButton = document.getElementById("removeLocalStorage");
removeLocalStorageButton.addEventListener("click", () => {
  if (localStorage.getItem(TEST_KEY)) {
    localStorage.removeItem(TEST_KEY);
    console.log(`Removed key: "${TEST_KEY}" from localStorage.`);
  } else {
    console.log(`Not founded key "${TEST_KEY}" in localStorage`);
  }
});

const clearLocalStorageButton = document.getElementById("clearLocalStorage");
clearLocalStorageButton.addEventListener("click", () => {
  localStorage.clear();
  console.log("Cleared localStorage.");
});
