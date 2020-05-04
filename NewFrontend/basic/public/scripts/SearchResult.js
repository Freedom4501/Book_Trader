(function () {

    "use strict";
    const apiUrl = `http://137.112.104.119:3000/db/books/`;
    let book;

    function findAll() {
        $.ajax ({
            url: apiUrl,
            type: "GET",
            success: (data) => {
                console.log(data);
                book = data;
                displayBooks(data);
            },  
            error: (request, status, error) => {
                window.location = "./404.html";
                console.log(error);
            }
        });
    }

    function searchTitle() {
        $.ajax ({
            url: `${apiUrl}title/${localStorage.getItem("title")}/`,
            type: "GET",

            success: (data) => {
                console.log(data);
                console.log(data.length);
                book = data;
                displayBooks(data);
            },
            error: (request, status, error) => {
                window.location = "./404.html";
                console.log(error);
            }
        });
    }

    function searchAuthor() {
        $.ajax ({
            url: `${apiUrl}author/${localStorage.getItem("author")}/`,
            type: "GET",

            success: (data) => {
                console.log(data);
                displayBooks(data);
            },
            error: (request, status, error) => {
                window.location = "./404.html";
                console.log(error);
            }
        });
    }

    function displayBooks(data) {
        const displaySection = document.getElementById("bucketList");
        for (var i = 0; i < data.length; i++) {
            var currRow = displaySection.insertRow(i);
            var titleCell = currRow.insertCell(0);
            titleCell.innerHTML = data[i].title; 
            var authorCell = currRow.insertCell(1);
            authorCell.innerHTML = data[i].author; 
            var isbnCell = currRow.insertCell(2);
            isbnCell.innerHTML = data[i].isbn; 
            currRow.onclick = rowClick;
        }
    }

    function rowClick() {
        localStorage.setItem("title",this.cells[0].innerHTML);
        localStorage.setItem("isbn",this.cells[2].innerHTML);
        localStorage.setItem("author",this.cells[1].innerHTML);
        window.location = "./book.html";
    }

    $(document).ready(function () {
        
        if (localStorage.getItem("searchByTitle") == "1") {
            searchTitle();
        } else if (localStorage.getItem("searchByAuthor") == "1") {
            searchAuthor();
        } else if (localStorage.getItem("findAll") == "1") {
            findAll();
        }
        
    });
})();
