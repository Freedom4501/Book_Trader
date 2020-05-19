(function () {
  "use strict";

  const driver = neo4j.driver('bolt://lim5.csse.rose-hulman.edu:7687', neo4j.auth.basic('neo4j', '000201'));
  const session = driver.session();
  const apiUrl = `http://137.112.104.119:3000/db/books/`;
  var couchdb = new PouchDB('http://lim5:000201@137.112.104.118:5984/users');

 function addToCart(){
    console.log("Adding to cart!");
    var isbn = document.getElementById("inputCartISBN").value;
    var username = localStorage.getItem("UsernameLogin");

    if(username == '' || username == null){
      console.log("Not logged in");
      alert("Please login before using the shopping cart!")
      return;
    }
    else if(isbn == ''|| isbn ==null){
      console.log("Please select which book to add to cart");
      alert("Please select which book to add to cart!")
      return;
    } else {
      trackBook(isbn, username);
    }
  }

  function deleteFromCart(){
    console.log("Deleting from cart!");
    const isbn = document.getElementById("deleteCartISBN").value;
    const username = localStorage.getItem("UsernameLogin");
    if(username == ''){
      console.log("Please login before using shopping cart");
      alert("Please login before using the shopping cart!")
      return;
    }
    else if(isbn == ''){
      console.log("Please select which book to delete from cart");
      alert("Please select which book to delete from cart");
      return;
    }
    else {
      session.run(`MATCH (b:Book{ISBN:{isbn}})-[r:IN_CART]->(u:User{username:{username}}) DELETE r RETURN count(r) AS num`, {isbn, username}).then((result) => {
        if(result.records[0].get("num")== 0){
          console.log("Successfully deleted book "+isbn+" from "+username+"'s cart!");
        }
      });
      console.log("delete complete")
    }
  }
  
  function findBookAndDisplay(isbn){
    $.ajax ({
      url: `${apiUrl}isbn/${isbn}`,
      type: "GET",
      success: (data) => {
          console.log(isbn);  
          console.log(data);
          displayCart(data);
      },  
      error: (request, status, error) => {
          window.location = "./404.html";
          console.log(error);
      }
  });
  }

  function trackBook(isbn, username){
    $.ajax ({
      url: `${apiUrl}isbn/${isbn}`,
      type: "GET",
      success: (data) => {
        if(data != null){
          trackUser(isbn,username);
        } else {
          alert("Can not get ISBN");
          console.log("This book does not exist");
        }
      },  
      error: (request, status, error) => {
          window.location = "./404.html";
          console.log(error);
      }
  });
  }
  
  function trackUser(isbn, username){
    couchdb.get(username, function(error, result) {
      if(error){
        console.log("No such user");
        return;
      }
      else {
        console.log("Found user");
        console.log(isbn);
        console.log(username);
        console.log(result);
        executeAddBook(isbn, username);
      }
    });
  }
  
  function executeAddBook(isbn, username){
    session.run(`MATCH (u:User{username:{username}}),(b:Book{ISBN:{isbn}}) CREATE (b)-[r:IN_CART]->(u) RETURN count(r) AS num`, {username, isbn}).then((result) => {
      if(result.records[0].get("num")> 1){
        console.log("Successfully added book "+isbn+" to "+username+"'s cart!");
      }
    });
  }

  function displayCart(data) {
    const displaySection = document.getElementById("cartList");
      var currRow = displaySection.insertRow();
      var titleCell = currRow.insertCell(0);
      titleCell.innerHTML = data.title; 
      var authorCell = currRow.insertCell(1);
      authorCell.innerHTML = data.author; 
      var isbnCell = currRow.insertCell(2);
      isbnCell.innerHTML = data.isbn; 
      var priceCell = currRow.insertCell(3);
      priceCell.innerHTML = data.price;
      currRow.onclick = rowClick;
  }
  

  function rowClick() {
    localStorage.setItem("title",this.cells[0].innerHTML);
    localStorage.setItem("isbn",this.cells[2].innerHTML);
    localStorage.setItem("author",this.cells[1].innerHTML);
    localStorage.setItem("price", this.cells[3].innerHTML);
    window.location = "./book.html";
  }


  function searchForISBN(){
    console.log("Searching for ISBN");
    const username = localStorage.getItem("UsernameLogin");
    if(username == ''){
      console.log("empty username");
      return;
    }
    else if(username == null){
      console.log("user has logged out");
      return;
    }
    else{
      session.run(`MATCH (b:Book)-[r:IN_CART]->(u:User{username:{username}}) RETURN b.ISBN as isbn, count(r) as num`, {username}).then((result) => {
          if(result.records[0].get("isbn") == ''){
            console.log("No book in cart");
          } else {
              result.records.forEach(element => {
                findBookAndDisplay(element.get('isbn'));
              });
          }
      });
    }
  }

  function buyBook(){
    console.log("Buying book!");
    var username = localStorage.getItem("UsernameLogin");
    var isbn = document.getElementById("inputBuyBook").value;
    var quantity = document.getElementById("inputBuyQuantity").value;
    var address = document.getElementById("inputBuyAddress").value;
    if(username == '' || username == null){
      console.log("user not logged in");
      return;
    } else if(isbn == '' || isbn == null){
      alert("ISBN can not be empty!");
      console.log("Empty ISBN");
      return;
    } else if(quantity == '' || quantity < 1){
      alert("Quantity can not be empty or less than 1!");
      console.log("Invalid Quantity");
      return;
    } else if(address == ""){
      alert("Address can not be empty!");
      console.log("Invalid Address");
      return;
    } else {
      session.run(`MATCH (b:Book{ISBN:{isbn}})-[r:IN_CART]->(u:User{username:{username}}) RETURN count(r) as num`, {isbn,username}).then((result) => {
        if(result.records[0].get("num") < 1){
          console.log("Book not in cart for purchase");
          alert("This book is not in the cart!")
          return;
        } else {
          checkOut(username, isbn, quantity, address);
        }
      });
    }
  }

  function checkOut(username, isbn, quantity, address){
    session.run(`MATCH (b:Book{ISBN:{isbn}}), (u:User{username:{username}}) CREATE (b)<-[r:PURCHASE{quantity:{quantity}, address:{address}}]-(u) RETURN count(r) as num`,{isbn, username, quantity, address}).then((result) => {
      if(result.records[0].get("num")<1){
        console.log("Failed to purchase");
      } else {
        alert("Successfully purchased book "+ isbn+"!");
        deleteAfterPurchase(username, isbn);
      }
    });
  }

  function deleteAfterPurchase(username, isbn){
    session.run(`MATCH (b:Book{ISBN:{isbn}})-[r:IN_CART]->(u:User{username:{username}}) DELETE r RETURN count(r) AS num`, {isbn, username}).then((result) => {
      if(result.records[0].get("num")== 0){
        console.log("Successfully deleted book "+isbn+" from "+username+"'s cart!");
      }
    });
  }
  
  $(document).ready(function () {
    console.log("In cart!");
    searchForISBN();
    $("#submitAddCartItem").on("click", addToCart);
    $("#submitDeleteCartItem").on("click", deleteFromCart);
    $("#submitBuy").on("click", buyBook);
  });
})();
