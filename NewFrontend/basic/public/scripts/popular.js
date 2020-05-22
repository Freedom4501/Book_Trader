(function () {
  "use strict";

  const driver = neo4j.driver('bolt://lim5.csse.rose-hulman.edu:7687', neo4j.auth.basic('neo4j', '000201'));
  const session = driver.session();
  const apiUrl = `http://137.112.104.119:3000/db/books/`;
  var couchdb = new PouchDB('http://lim5:000201@137.112.104.118:5984/users');
  

  function findBookAndDisplay(isbn, amount){
    $.ajax ({
      url: `${apiUrl}isbn/${isbn}`,
      type: "GET",
      success: (data) => {
          console.log(data);
          displayPopular(data, amount);
      },  
      error: (request, status, error) => {
          window.location = "./404.html";
          console.log(error);
      }
  });
  }

  function displayPopular(data, amount) {
    const displaySection = document.getElementById("popularList");
      var currRow = displaySection.insertRow();
      var titleCell = currRow.insertCell(0);
      titleCell.innerHTML = data.title; 
      var authorCell = currRow.insertCell(1);
      authorCell.innerHTML = data.author; 
      var isbnCell = currRow.insertCell(2);
      isbnCell.innerHTML = data.isbn; 
      var priceCell = currRow.insertCell(3);
      priceCell.innerHTML = data.price;
      var amountCell = currRow.insertCell(4);
      amountCell.innerHTML = amount;
      currRow.onclick = rowClick;
  }
  

  function rowClick() {
    localStorage.setItem("title",this.cells[0].innerHTML);
    localStorage.setItem("isbn",this.cells[2].innerHTML);
    localStorage.setItem("author",this.cells[1].innerHTML);
    localStorage.setItem("price", this.cells[3].innerHTML);
    window.location = "./book.html";
  }


  function searchForPopular(){
    console.log("Searching for Most Popular Books");
    session.run(`MATCH (b:Book)<-[r:PURCHASE]-(u:User) RETURN count(r) AS num`).then((result) => {
      if(result.records[0].get("num") == 0){
        alert("No books have been purchased yet, failed to list popular books!");
        return;
      } else {
          executeFindPopular();
      }
    });
    
  }

  function executeFindPopular(){
    session.run(`match (b:Book) match p=(b)<-[:PURCHASE]-(u:User) return distinct b.ISBN AS ISBN, count(p) AS num order by count(p) DESC limit 3`).then((result) => {
      result.records.forEach(element => {
        findBookAndDisplay(element.get('ISBN'), element.get('num'));
      });
    }).catch((err) => {
      alert("Neo4j find popular error!");
    });
  }
  
  $(document).ready(function () {
    console.log("In popular!");
    const displaySection = document.getElementById("popularList");
    var currRow = displaySection.insertRow(0);
    var titleCell = currRow.insertCell(0);
    titleCell.innerHTML = "Title"; 
    var authorCell = currRow.insertCell(1);
    authorCell.innerHTML = "Author"; 
    var isbnCell = currRow.insertCell(2);
    isbnCell.innerHTML = "ISBN"; 
    var priceCell = currRow.insertCell(3);
    priceCell.innerHTML = "Price";
    var amountCell = currRow.insertCell(4);
    amountCell.innerHTML = "Amount Sold";
    searchForPopular();
  });
})();
