(function () {

    "use strict";
    let book;
    const apiUrl = `http://137.112.104.119:3000/db/books/`;
    function getAllBooks() {
        $.ajax ({
            url: apiUrl,
            type: "GET",
            success: (data) => {
                console.log(data);
                book = data;
                // displayBook(data);
            },  
            error: (request, status, error) => {
                window.location = "./404.html";
                console.log(error);
            }
        });
    }

    function searchBookByISBN() {

        const isbn = document.getElementById("searchISBN").value;
        $.ajax ({
            url: `${apiUrl}${isbn}/`,
            type: "GET",

            success: (data) => {
                console.log(data);
                book = data;
                window.location = "./book.html";
                displayBook(data);
            },
            error: (request, status, error) => {
                window.location = "./404.html";
                console.log(error);
            }
        });
    }

    function addBook() {

        const isbn = document.getElementById("addISBN").value;
        const title = document.getElementById("addTitle").value;
        const author = document.getElementById("addAuthor").value;

        $.ajax ({
            url: apiUrl,
            type: "POST",
            data: {"title": title, "author": author, "isbn": isbn}, 
            dataType: "JSON",
            success: (data) => {
                if (data) {
                    console.log("Put succeed");
                    window.location = "./index.html";
                } else {
                    console.log("book does not exist");
                }
            },  
            error: (request, status, error) => {
                window.location = "./404.html";
                console.log(error);
            }
        });
    }

    function displayBook(data) {
        localStorage.setItem("title",data.title);
        localStorage.setItem("isbn",data.isbn);
        localStorage.setItem("author",data.author);
        
    }

    $(document).ready(function () {
        $("#submitSearch").on("click", searchBookByISBN);
        $("#searchAllBooks").on("click", getAllBooks);
        $("#submitAdd").on("click", addBook);
    });
})();
