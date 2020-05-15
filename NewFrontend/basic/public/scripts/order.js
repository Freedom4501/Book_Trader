(function () {
  "use strict";

  const driver = neo4j.driver('bolt://lim5.csse.rose-hulman.edu:7687', neo4j.auth.basic('neo4j', '000201'));
  const session = driver.session();
  const apiUrl = `http://137.112.104.119:3000/db/books/`;

  var in_cart_books = [];

 function addToCart(){
    console.log("Adding to cart!");
    var isbn = document.getElementById("inputCartISBN").value;
    var username = localStorage.getItem("UsernameLogin");

    if(username == '' || username == null){
      console.log("Not logged in");
      alert("Please login before using the shopping cart!")
      return;
    }
    else if(isbn == ''||isbn ==null){
      console.log("Please select which book to add to cart");
      alert("Please select which book to add to cart!")
      return;
    } else {
      session.run(`CREATE (b:Book{ISBN:{isbn}})-[r:IN_CART]->(u:User{username:{username}}) RETURN count(r) AS num`, {isbn, username}).then((result) => {
        if(result.records[0].get("num")> 1){
          console.log("Successfully added book "+isbn+" to "+username+"'s cart!");
        }
        in_cart_books.push(isbn);
        localStorage.setItem("in_cart_isbn", in_cart_books);
      });
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
      url: `${apiUrl}isbn/${localStorage.getItem("isbn")}`,
      // url:  `${apiUrl}isbn/${localStorage.getItem("in_cart_isbn")}/`,
      type: "GET",
      success: (data) => {
          console.log(data);
          displayCart(data);
      },  
      error: (request, status, error) => {
          window.location = "./404.html";
          console.log(error);
      }
  });
  }
  
  function displayCart(data) {
    const displaySection = document.getElementById("cartList");
    for (var i = 0; i < data.length; i++) {
      var currRow = displaySection.insertRow(i);
      var titleCell = currRow.insertCell(0);
      titleCell.innerHTML = data[i].title + "  "; 
      var authorCell = currRow.insertCell(1);
      authorCell.innerHTML = data[i].author + "  "; 
      var isbnCell = currRow.insertCell(2);
      isbnCell.innerHTML = data[i].isbn  + "  "; 
      var priceCell = currRow.insertCell(3);
      priceCell.innerHTML = data[i].price;
      currRow.onclick = rowClick;
    }
  }

  function rowClick() {
    localStorage.setItem("title",this.cells[0].innerHTML);
    localStorage.setItem("isbn",this.cells[2].innerHTML);
    localStorage.setItem("author",this.cells[1].innerHTML);
    localStorage.setItem("price", this.cells[3].innerHTML);
    window.location = "./book.html";
  }


  
  $(document).ready(function () {
    console.log("In cart!");
    for(isbn in in_cart_books){
      findBookAndDisplay(isbn);
    }
    $("#submitAddCartItem").on("click", addToCart);
    $("#submitDeleteCartItem").on("click", deleteFromCart);
  });
})();
