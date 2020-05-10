(function () {
  "use strict";

  const driver = neo4j.driver(
    'bolt://lim5.csse.rose-hulman.edu:7687',
    neo4j.auth.basic('neo4j', '000201')
  )
  const session = driver.session();


  function addToCart(){
    console.log("Adding to cart!");
    const isbn = document.getElementById("inputCartISBN").value;
    const username = localStorage.getItem("UsernameLogin");
    const record = session.run(`MATCH (n:Cart) WHERE n.isbn={isbn} AND n.username={username} RETURN count(n) as num`,{isbn, username});
    if(record[0] == 0){
      console.log("You have already added this item to your cart.");
      return;
    }
    
    if(username == ''){
      console.log("Please login before using shopping cart");
      return;
    }
    else if(isbn == ''){
      console.log("Please select which book to add to cart");
      return;
    }
    else {
      session.run(`CREATE (n:Cart {ISBN:{isbn}, username:{username}})`, {isbn, username});
      console.log("Add complete!");
    }
  }

  function deleteFromCart(){
    console.log("Deleting from cart!");
    const isbn = document.getElementById("deleteCartISBN").value;
    const username = localStorage.getItem("UsernameLogin");
    const record = session.run(`MATCH (n:Cart) WHERE n.isbn={isbn} AND n.username={username} RETURN count(n) as num`,{isbn, username});
    
    if(record[0] == 0){
      console.log("This item does not exist in your cart");
      return;
    }
    if(username == ''){
      console.log("Please login before using shopping cart");
      return;
    }
    else if(isbn == ''){
      console.log("Please select which book to delete from cart");
      return;
    }
    else {
      session.run(`MATCH (n:Cart) WHERE n.isbn={isbn} AND n.username={username} DELETE n`, {isbn, username});
      console.log("delete complete")
    }
  }

  
  $(document).ready(function () {
    console.log("In cart!");
    // $("#submitRegister").on("click", addUser());
    // $("#submitLogin").on("click", login());
    $("#submitAddCartItem").on("click", addToCart);
    $("#submitDeleteCartItem").on("click", deleteFromCart);
  });
})();
