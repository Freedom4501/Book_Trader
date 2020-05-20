(function () {
    "use strict";
  
    const driver = neo4j.driver('bolt://lim5.csse.rose-hulman.edu:7687', neo4j.auth.basic('neo4j', '000201'));
    const session = driver.session();
    const apiUrl = `http://137.112.104.119:3000/db/books/`;
    var couchdb = new PouchDB('http://lim5:000201@137.112.104.118:5984/users');
  
    function cancelOrder(){
      console.log("canceling order!");
      const isbn = document.getElementById("cancelISBN").value;
      const username = localStorage.getItem("UsernameLogin");
      if(username == '' || username == null){
        console.log("Please login before canceling");
        // alert("Please login before canceling!")
        return;
      }
      else if(isbn == '' || isbn == null){
        console.log("No book order isbn input");
        alert("Please select which book order to cancel");
        return;
      }
      else {
        session.run(`MATCH (b:Book{ISBN:{isbn}})<-[r:PURCHASE]-(u:User{username:{username}}) DELETE r RETURN count(r) AS num`, {isbn, username}).then((result) => {
          if(result.records[0].get("num")== 0){
            alert("Successfully canceled book order "+isbn+" from "+username+"'s cart!");
            console.log("Cancel succeeded");
          }
        });
        console.log("delete complete")
      }
    }
    

    function findOrderAndDisplay(username){
      if(username == null || username == ''){
        console.log("Login before user order");
        return;
      } else {
        session.run(`MATCH (u1:User)-[r1:SELL]->(b:Book)<-[r:PURCHASE]-(u:User{username:{username}}) RETURN count(b) as num, b.ISBN as isbn, u1.username as seller, r.quantity as quant`, {username}).then((result) => {
          if(result.records.length == 0){
            alert("You have not order anything yet!")
            return;
          }
          else if(result.records[0].get('num') == 0){
            console.log("Book not found");
            return;
          } else if(result.records[0].get('seller') == null){
            console.log("Seller not found");
            return;
          } else {
          
          result.records.forEach(element => {
              console.log(element.get('isbn'));
              console.log(element.get('seller'));
              findBookAndDisplay(element.get('isbn'), element.get('seller'), element.get('quant'));
          });
        }
        });
      }
    }
  
    function findBookAndDisplay(isbn, username, quantity){
      $.ajax ({
        url: `${apiUrl}isbn/${isbn}`,
        type: "GET",
        success: (data) => {
            console.log(data);
            displayOrder(data, username, quantity);
        },  
        error: (request, status, error) => {
            window.location = "./404.html";
            console.log(error);
        }
    });
    }
  
    function displayOrder(data, username, quantity) {
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
      var quantityHTML = currRow.insertCell(5);
      quantityHTML.innerHTML = quantity;
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
              alert("You have not order any books yet!")
              return
            } else {
              findOrderAndDisplay(username);
            }
        });
      }
    }
    
    
    $(document).ready(function () {
      console.log("start order");
      const displaySection = document.getElementById("orderList");
      var currRow = displaySection.insertRow(0);
      var titleCell = currRow.insertCell(0);
      titleCell.innerHTML = "Title"; 
      var authorCell = currRow.insertCell(1);
      authorCell.innerHTML = "Author"; 
      var isbnCell = currRow.insertCell(2);
      isbnCell.innerHTML = "ISBN"; 
      var priceCell = currRow.insertCell(3);
      priceCell.innerHTML = "Price";
      var sellerCell = currRow.insertCell(4);
      sellerCell.innerHTML = "Seller"; 
      var quantityCell = currRow.insertCell(5);
      quantityCell.innerHTML = "Quantity";
      searchForOrder();

      $("#cancelPurchase").on("click", cancelOrder);
    });
  })();
  
