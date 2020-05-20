(function () {

    "use strict";
    const apiUrl = `http://137.112.104.119:3000/db/books/`;
    const driver = neo4j.driver('bolt://lim5.csse.rose-hulman.edu:7687', neo4j.auth.basic('neo4j', '000201'));
    const session = driver.session();
    var couchdb = new PouchDB('http://lim5:000201@137.112.104.118:5984/users');

    function updateBook() {
        const username = localStorage.getItem("UsernameLogin");
        if(username==null || username == ""){
          alert("Please Login First");
          return
        }
        const isbn = localStorage.getItem("isbn");
        session.run(`MATCH (b:Book{ISBN:{isbn}})<-[r:SELL]-(u:User{username:{username}}) RETURN count(r) as num`, {isbn, username}).then((result) => {
          if(result.records[0].get("num") == 0){
            alert("You are not the seller of this book and you cannot update it");
            return;
          }else{
            executeUpdateBook();
          }
        });
        
    }
    function executeUpdateBook(){
      const title = document.getElementById("updateTitle").value;
      const author = document.getElementById("updateAuthor").value;
      const price = document.getElementById("updatePrice").value;
      $.ajax ({
            url: `${apiUrl}isbn/${localStorage.getItem("isbn")}/`,
            type: "PUT",
            data: {"title": title, "author": author, "isbn": localStorage.getItem("isbn"), "price": price}, 
            dataType: "JSON",
            success: (data) => {
                console.log(data);
                localStorage.setItem("title", title);
                localStorage.setItem("author", author);
                localStorage.setItem("price", price);  
                window.location = "./profile.html";
                alert("Successfully Update");
            },
            error: (request, status, error) => {
                console.log(error);
                alert("Update fails");
            }
        });
    }

    function deleteBook() {
      const username = localStorage.getItem("UsernameLogin");
      if(username==null || username == ""){
        alert("Please Login First");
        return
      }
      const isbn = localStorage.getItem("isbn");
      session.run(`MATCH (b:Book{ISBN:{isbn}})<-[r:SELL]-(u:User{username:{username}}) RETURN count(r) as num`, {isbn, username}).then((result) => {
        if(result.records[0].get("num") == 0){
          alert("You are not the seller of this book and you cannot update it");
          return;
        }else{
          executeDeleteBook();
        }
      });
    }
    function executeDeleteBook(){
      $.ajax({
            url: `${apiUrl}isbn/${localStorage.getItem("isbn")}/`,
            type: "DELETE",
            success: (data) => {
                console.log(data);
                const isbn = localStorage.getItem("isbn");
                session.run(`MATCH (b:Book {ISBN:{isbn}} ) DETACH DELETE b RETURN count(b) AS num`, {isbn}).then((result) => {
                    if(result.records[0].get("num")== 0){
                      console.log("Successfully deleted book "+ isbn);
                    }
                  });
                window.location = "./profile.html";
                alert("Successfully deleted book "+ isbn);
            },
            error: (request, status, error) => {
                window.location = "./404.html";
                console.log(error);
            }
        });
    }
    function addToCart(){
        var isbn = localStorage.getItem("isbn");
        var username = localStorage.getItem("UsernameLogin");
    
        if(username == '' || username == null){
          console.log("Not logged in");
          alert("Please login before using the shopping cart!")
          return;
        }
        else if(isbn == ''|| isbn == null){
          console.log("Please select which book to add to cart");
          alert("Please select which book to add to cart!")
          return;
        } else {
          session.run(`MATCH (b:Book{ISBN:{isbn}})-[r:IN_CART]->(u:User{username:{username}}) RETURN count(r) as num`, {isbn, username}).then((result) => {
            if(result.records[0].get("num") >= 1){
              alert("This book is already in your cart!");
              return;
            } else {
              trackBook(isbn, username);
            }
          });
        }
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
              return;
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
            alert("No such user");
            return;
          }
          else {
            console.log("Found user");
            console.log(isbn);
            console.log(username);
            console.log(result);
            executeAddBookInCart(isbn, username);
          }
        });
    }
      
    function executeAddBookInCart(isbn, username){
        session.run(`MATCH (u:User{username:{username}}),(b:Book{ISBN:{isbn}}) CREATE (b)-[r:IN_CART]->(u) RETURN count(r) AS num`, {username, isbn}).then((result) => {
          console.log("Successfully added book "+isbn+" to "+username+"'s cart!");
          alert("Successfully added book "+isbn+" to "+username+"'s cart!");
        });
    }
    function buyBook(){
        console.log("Buying book!");
        var username = localStorage.getItem("UsernameLogin");
        var isbn = localStorage.getItem("isbn");
        var quantity = document.getElementById("inputBuyQuantity").value;
        var address = document.getElementById("inputBuyAddress").value;
        if(username == '' || username == null){
          console.log("user not logged in");
          alert("Please login first");
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
            session.run(`MATCH (b:Book{ISBN:{isbn}}), (u:User{username:{username}}) CREATE (b)<-[r:PURCHASE{quantity:{quantity}, address:{address}}]-(u) RETURN count(r) as num`,{isbn, username, quantity, address}).then((result) => {
                if(result.records[0].get("num")<1){
                    console.log("Failed to purchase");
                } else {
                    alert("Successfully purchased book "+ isbn+"!");
            }
            });
        }
      }
    

    $(document).ready(function () {
        let displaySection = $("#titleContainer");
        const bookTitle = document.createElement("h2");
        bookTitle.innerHTML = `${localStorage.getItem("title")}`;
        displaySection.append(bookTitle);
        const bookAuthor = document.createElement("p");
        bookAuthor.innerHTML = "Author:  " + `${localStorage.getItem("author")}`;
        displaySection.append(bookAuthor);
        const bookisbn = document.createElement("p");
        bookisbn.innerHTML = "ISBN:  " + `${localStorage.getItem("isbn")}`;
        displaySection.append(bookisbn);
        const bookprice = document.createElement("p");
        bookprice.innerHTML = "Price:  " + `${localStorage.getItem("price")}`;
        displaySection.append(bookprice);
        document.getElementById("updateISBN").textContent = localStorage.getItem("isbn");
        document.getElementById("updateAuthor").value = localStorage.getItem("author");
        document.getElementById("updateTitle").value = localStorage.getItem("title");
        document.getElementById("updatePrice").value = localStorage.getItem("price");
        $("#submitUpdate").on("click", updateBook);
        $("#deleterBtn").on("click", deleteBook);
        $("#submitAddCartItem").on("click", addToCart);
        $("#submitBuy").on("click", buyBook);
    });
})();