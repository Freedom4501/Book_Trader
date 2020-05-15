(function () {

    "use strict";
    const apiUrl = `http://137.112.104.119:3000/db/books/`;
    const driver = neo4j.driver('bolt://lim5.csse.rose-hulman.edu:7687', neo4j.auth.basic('neo4j', '000201'));
    const session = driver.session();
    function updateBook() {
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
                window.location = "./index.html";
            },
            error: (request, status, error) => {
                console.log(error);
                alert("Update fails");
            }
        });
    }

    function deleteBook() {
        $.ajax({
            url: `${apiUrl}isbn/${localStorage.getItem("isbn")}/`,
            type: "DELETE",
            success: (data) => {
                console.log(data);
                session.run(`MATCH (b:Book {ISBN:{isbn}} ) DETACH DELETE b RETURN count(b) AS num`, {isbn}).then((result) => {
                    if(result.records[0].get("num")== 0){
                      console.log("Successfully deleted book "+ isbn);
                    }
                  });
                window.location = "./index.html";
            },
            error: (request, status, error) => {
                window.location = "./404.html";
                console.log(error);
            }
        });
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
    });
})();