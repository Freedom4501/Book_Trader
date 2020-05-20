(function () {
  "use strict";

  const driver = neo4j.driver('bolt://lim5.csse.rose-hulman.edu:7687', neo4j.auth.basic('neo4j', '000201'));
  const session = driver.session();
  const apiUrl = `http://137.112.104.119:3000/db/books/`;
  var couchdb = new PouchDB('http://lim5:000201@137.112.104.118:5984/users');
  

  function findSellAndDisplay(username){
    if(username == null || username == ''){
      console.log("Login before user order");
      return;
    } else {
      session.run(`MATCH (u1:User{username:{username}})-[r1:SELL]->(b:Book)<-[r:PURCHASE]-(u:User) RETURN count(b) as num, b.ISBN as isbn, u.username as buyer, r.quantity as quant`, {username}).then((result) => {
        if(result.records.length == 0){
          alert("You have not sold any books yet!");
          return;
        }
        else if(result.records[0].get('num') == 0){
          console.log("Book not found");
          alert("You have not sold any books yet!");
          return;
        } else if(result.records[0].get('buyer') == null){
          console.log("Buyer not found");
          return;
        } else {
        
        result.records.forEach(element => {
            console.log(element.get('isbn'));
            console.log(element.get('buyer'));
            findAndDisplay(element.get('isbn'), element.get('buyer'), element.get('quant'));
        });
      }
      });
    }
  }

  function findAndDisplay(isbn, username, quantity){
    $.ajax ({
      url: `${apiUrl}isbn/${isbn}`,
      type: "GET",
      success: (data) => {
          console.log(data);
          displaySell(data, username, quantity);
      },  
      error: (request, status, error) => {
          window.location = "./404.html";
          console.log(error);
      }
  });
  }

  function displaySell(data, username, quantity) {
    const displaySection = document.getElementById("sellList");
    var currRow = displaySection.insertRow();
    var titleCell = currRow.insertCell(0);
    titleCell.innerHTML = data.title; 
    var authorCell = currRow.insertCell(1);
    authorCell.innerHTML = data.author; 
    var isbnCell = currRow.insertCell(2);
    isbnCell.innerHTML = data.isbn; 
    var priceCell = currRow.insertCell(3);
    priceCell.innerHTML = data.price;
    var buyerCell = currRow.insertCell(4);
    buyerCell.innerHTML = username;
    var quantityHTML = currRow.insertCell(5);
    quantityHTML.innerHTML = quantity;
  }

  function searchForSell(){
    console.log("Searching for Sell");
    const username = localStorage.getItem("UsernameLogin");
    if(username == ''){
      console.log("empty username");
      alert("Invalid Username!")
      return;
    }
    else if(username == null){
      console.log("user has logged out");
      alert("Log in before use sell!")
      return;
    }
    else {
      session.run(`MATCH (u:User{username:{username}})-[r:SELL]->(b:Book) RETURN count(r) as num`, {username}).then((result) => {
          if(result.records[0].get("num") == 0){
            console.log("No books sold");
            alert("No books have been sold!")
            return
          } else {
            findSellAndDisplay(username);
          }
      });
    }
  }
  
  
  $(document).ready(function () {
    console.log("start sell");
    const displaySection = document.getElementById("sellList");
    var currRow = displaySection.insertRow(0);
    var titleCell = currRow.insertCell(0);
    titleCell.innerHTML = "Title"; 
    var authorCell = currRow.insertCell(1);
    authorCell.innerHTML = "Author"; 
    var isbnCell = currRow.insertCell(2);
    isbnCell.innerHTML = "ISBN"; 
    var priceCell = currRow.insertCell(3);
    priceCell.innerHTML = "Price";
    var buyerCell = currRow.insertCell(4);
    buyerCell.innerHTML = "Buyer"; 
    var quantityCell = currRow.insertCell(5);
    quantityCell.innerHTML = "Quantity";
    searchForSell();
  });
})();

