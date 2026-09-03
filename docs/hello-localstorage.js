console.log("Hello Tom and Jerry!");

localStorage.setItem("myCat", "Tom");
localStorage.setItem("myMouse", "Jerry");

const cat = localStorage.getItem("myCat");
const mouse = localStorage.getItem("myMouse");

console.log(cat);
console.log(mouse);

// localStorage.removeItem("myCat");

// localStorage.clear();
