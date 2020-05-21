(function () {
  "use strict";

  const driver = neo4j.driver('bolt://lim5.csse.rose-hulman.edu:7687', neo4j.auth.basic('neo4j', '000201'));
  const session = driver.session();
  const apiUrl = `http://137.112.104.119:3000/db/books/`;
  var couchdb = new PouchDB('http://lim5:000201@137.112.104.118:5984/users');

  function addResponse(){
    const username = localStorage.getItem("UsernameLogin");
    const isbn = localStorage.getItem("isbn");
    const response = document.getElementById("inputResponse").value;
    if(response == '' || response == null){
      alert("Response can not be empty!");
      return;
    } else if(username == '' || username == null){
      alert("user is not logged in");
      return;    
    } else if(isbn == '' || isbn == null){
      alert("book not found");
      return;
    } else {
      session.run(`MATCH (u:User{username:{username}}), (b:Book{ISBN:{isbn}}) MATCH (u)-[r:SELL]->(b) RETURN count(r) as num`,{username, isbn}).then((result) => {
        if(result.records[0].get("num") == 0){
          alert("You are not the seller of this book, failed to add response!");
          return;
        } else{
          executeAddResponse(username, isbn, response);
        }
      }).catch((err) => {
        alert("Neo4j error");
      });
    }
  }

  function executeAddResponse(username, isbn, response){
    session.run(`MATCH(u:User{username:{username}}), (b:Book{ISBN:{isbn}}) CREATE (u)-[r:RESPONDED{response:{response}}]->(b)`, {username, isbn, response}).then((result) => {
      alert("Successfully added response!");
    }).catch((err) => {
      alert("Neo4j error when adding response");
    });
  }

  function displayResponse(response){
    const displaySection = document.getElementById("responseList");
    var currRow = displaySection.insertRow();
    var responseCell = currRow.insertCell(0);
    responseCell.innerHTML = response; 
  }

  function searchForResponse(){
    console.log("Searching for Response");
    const isbn = localStorage.getItem("isbn");
    if(isbn == null || isbn == ''){
      alert("ISBN not exist!")
      return;
    }
    else {
      session.run(`MATCH (b:Book{ISBN:{isbn}})<-[r:RESPONDED]-(u:User) RETURN count(r) as num, r.response as response`, {isbn}).then((result) => {
          if(result.records[0].get("num") == 0){
            alert("No response from this seller!")
            return;
          } else {
            result.records.forEach(element => {
              displayResponse(element.get("response"));
            });
          }
      });
    }
  }

  function displayComment(rate, comment, username) {
    const displaySection = document.getElementById("commentList");
    var currRow = displaySection.insertRow();
    var rateCell = currRow.insertCell(0);
    rateCell.innerHTML = rate; 
    var commentCell = currRow.insertCell(1);
    commentCell.innerHTML = comment; 
    var raterCell = currRow.insertCell(2);
    raterCell.innerHTML = username; 
  }

  function searchForComment(){
    console.log("Searching for Comment");
    const isbn = localStorage.getItem("isbn");

    if(isbn == null || isbn == ''){
      alert("ISBN not exist!")
      return;
    }
    else {
      session.run(`MATCH (b:Book{ISBN:{isbn}})<-[r:RATED]-(u:User) RETURN count(r) as num, u.username as username, r.rate as rate, r.comment as comment`, {isbn}).then((result) => {
        searchForResponse();
          if(result.records[0].get("num") == 0){
            alert("No comment on this book yet!")
            return;
          } else {
            result.records.forEach(element => {
              displayComment(element.get("rate"), element.get("comment"), element.get("username"));
            });
          }
      });
    }
  }
  
  
  $(document).ready(function () {
    console.log("start comment");
    document.getElementById("commentTitleContent").innerHTML = "Comments for book "+ `${localStorage.getItem("isbn")}`;
    const displaySection = document.getElementById("commentList");
    var currRow = displaySection.insertRow(0);
    var rateCell = currRow.insertCell(0);
    rateCell.innerHTML = "Rate"; 
    var commentCell = currRow.insertCell(1);
    commentCell.innerHTML = "Comment"; 
    var raterCell = currRow.insertCell(2);
    raterCell.innerHTML = "Rater"; 
    $("#submitAddResponse").on("click", addResponse);
    searchForComment();
  });
})();

