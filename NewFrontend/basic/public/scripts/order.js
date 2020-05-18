(function () {
    "use strict";
  
    const driver = neo4j.driver('bolt://lim5.csse.rose-hulman.edu:7687', neo4j.auth.basic('neo4j', '000201'));
    const session = driver.session();
    const apiUrl = `http://137.112.104.119:3000/db/books/`;
    var couchdb = new PouchDB('http://lim5:000201@137.112.104.118:5984/users');
  
   function addOrder(){
      console.log("Adding order");
      var isbn = document.getElementById("inputISBN").value;
      var username = localStorage.getItem("UsernameLogin");
  
      if(username == '' || username == null){
        console.log("Not logged in");
        alert("Please login before adding!")
        return;
      }
      else if(isbn == ''|| isbn ==null){
        console.log("Please select which book to purchase");
        alert("Please select which book to purchase!")
        return;
      } else {
        trackBook(isbn, username);
      }
    }
  
    function cancelOrder(){
      console.log("CANCEL ORDER ");
      const isbn = document.getElementById("cancelISBN").value;
      const username = localStorage.getItem("UsernameLogin");
      if(username == ''){
        console.log("Please login before canceling");
        alert("Please login before canceling!")
        return;
      }
      else if(isbn == ''){
        console.log("Please select which book to cancel");
        alert("Please select which book to cancel");
        return;
      }
      else {
        
        session.run(`MATCH (u:User{username:{username}})-[r:Orders]->(b:Book{ISBN:{isbn}}) DELETE r RETURN count(r) AS num`, {username, isbn}).then((result) => {
          if(result.records[0].get("num")== 0){
            console.log("Successfully cancel book order"+isbn+" from "+username+"'s cart!");
          }
        });
        console.log("delete complete")
      }
    }
    
  
    function trackBook(isbn, username){
      $.ajax ({
        url: `${apiUrl}isbn/${isbn}`,
        type: "GET",
        success: (data) => {
          if(data != null){
            trackUser(username);
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
    
    function trackUser(username){
      couchdb.get(username).then((result) => {
        if(result != null){
          executeAddBook(isbn, username);
        }
        console.log("Invalid username");
      }).catch((err) => {
        window.location = "./404.html";
        console.log(err);
      });
    }
    
    function executeAddBook(isbn, username){
      session.run(`MATCH (u:User{username:{username}}),(b:Book{ISBN:{isbn}}) CREATE (u)-[r:Orders]->(b) RETURN count(r) AS num`, {username, isbn}).then((result) => {
        if(result.records[0].get("num")> 1){
          console.log("Successfully added book "+isbn+" to "+username+"'s order!");
        }
      });
    }

    function findOrderAndDisplay(username){
      if(username == null || username == ''){
        console.log("Login before user order");
        return;
      } else {
        session.run(`MATCH (u1:User)-[r1:SELL]->(b:Book)<-[r:PURCHASE]-(u:User{username:{username}}) RETURN count(b) as num, b.ISBN as isbn, u1.username as seller`, {username}).then((result) => {
          if(result.records[0].get('num') == 0){
            console.log("Book not found");
            return;
          } else if(result.records[0].get('seller') == null){
            console.log("Seller not found");
            return;
          } else {
            result.records.forEach(element => {
              console.log(element.get('isbn'));
              console.log(element.get('seller'));
              findBookAndDisplay(element.get('isbn'), element.get('seller'));
            });
          }
        });
      }
    }
  
    function findBookAndDisplay(isbn, username){
      $.ajax ({
        url: `${apiUrl}isbn/${isbn}`,
        type: "GET",
        success: (data) => {
            console.log(data);
            displayOrder(data, username);
        },  
        error: (request, status, error) => {
            window.location = "./404.html";
            console.log(error);
        }
    });
    }
  
    function displayOrder(data, username) {
      const displaySection = document.getElementById("orderList");
      var currRow = displaySection.insertRow();
      var titleCell = currRow.insertCell(0);
      titleCell.innerHTML = data.title; 
      var authorCell = currRow.insertCell(1);
      authorCell.innerHTML = data.author; 
      var isbnCell = currRow.insertCell(2);
      isbnCell.innerHTML = data.isbn; 
      var priceCell = currRow.insertCell(3);
      priceCell.innerHTML = data.price;
      var sellerCell = currRow.insertCell(4);
      sellerCell.innerHTML = username;
    }
  
    function searchForOrder(){
      console.log("Searching for Order");
      const username = localStorage.getItem("UsernameLogin");
      if(username == ''){
        console.log("empty username");
        alert("Invalid Username!")
        return;
      }
      else if(username == null){
        console.log("user has logged out");
        alert("Log in before use order!")
        return;
      }
      else {
        session.run(`MATCH (b:Book)<-[r:PURCHASE]-(u:User{username:{username}}) RETURN count(r) as num`, {username}).then((result) => {
            if(result.records[0].get("num") == 0){
              console.log("No Order exists");
              alarm("You have not yet ordered any book!")
              window.location = './index.html';
              return
            } else {
              findOrderAndDisplay(username);
              
            }
        });
      }
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
        session.run(`MATCH (u:User{username:{username}})-[r:Orders]->(b:Book) RETURN b.ISBN as isbn, count(r) as num`, {username}).then((result) => {
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
    
    $(document).ready(function () {
      console.log("start order");
      searchForOrder();

      $("#submitPurchase").on("click", addOrder);
      $("#cancelPurchase").on("click", cancelOrder);
    });
  })();
  
