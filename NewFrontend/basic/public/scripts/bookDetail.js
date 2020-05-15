(function () {

    "use strict";
    const apiUrl = `http://137.112.104.119:3000/db/books/`;
    
    function updateBook() {
        const title = document.getElementById("updateTitle").value;
        const author = document.getElementById("updateAuthor").value;
        $.ajax ({
            url: `${apiUrl}isbn/${localStorage.getItem("isbn")}/`,
            type: "PUT",
            data: {"title": title, "author": author, "isbn": localStorage.getItem("isbn")}, 
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
                window.location = "./index.html";
            },
            error: (request, status, error) => {
                window.location = "./404.html";
                console.log(error);
            }
        });
    }

    function getCart(){
        window.location = "./cart.html";
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
        $("#submitUpdate").on("click", updateBook);
        $("#deleterBtn").on("click", deleteBook);
    });
})();