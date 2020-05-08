(function () {
  "use strict";

  const neo4j = require('neo4j-driver')
  const uri = "bolt://lim5.csse.rose-hulman.edu:7687";

  const driver = neo4j.driver(uri, neo4j.auth.basic("lim5", "000201"));
  const session = driver.session();

  function addToCart(){
    window.location="./cart.html";
    console.log("Adding to cart!");
    const isbn = localStorage.getItem("isbn");
    const username = localStorage.getItem("UsernameLogin");
    if(username == ''){
      console.log("Please login before using shopping cart");
      return;
    }
    else if(isbn == ''){
      console.log("Please select which book to add to cart");
    }
    else {
      session.run("CREATE (n:Cart {ISBN:{isbn}, username: {username}})", isbn = isbn, username=username);
    }
  }

  $(document).ready(function () {
    console.log("In cart!");
    $("#submitRegister").on("click", addUser);
    $("#submitLogin").on("click", login);
    $("#submitAddToCart").on("click", addToCart);
  });
})();
