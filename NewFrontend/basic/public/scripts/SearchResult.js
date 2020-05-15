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

    function findAll2(sortBy) {
        $.ajax ({
            url: `${apiUrl}sort/${sortBy}/`,
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
    function searchTitle2(sortBy) {
        $.ajax ({
            url: `${apiUrl}title/${localStorage.getItem("title")}/sort/${sortBy}`,
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

    function searchPrice() {
        var gt = localStorage.getItem("gt");
        var lt = localStorage.getItem("lt");
        if (gt == "") {
            gt = 0;
        }
        if (lt == "") {
            lt = Number.MAX_SAFE_INTEGER;
        }
        $.ajax ({
            url: `${apiUrl}gt/${gt}/lt/${lt}/`,
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


    function searchPrice2(sortBy) {
        var gt = localStorage.getItem("gt");
        var lt = localStorage.getItem("lt");
        if (gt == "") {
            gt = 0;
        }
        if (lt == "") {
            lt = Number.MAX_SAFE_INTEGER;
        }
        $.ajax ({
            url: `${apiUrl}gt/${gt}/lt/${lt}/sort/${sortBy}/`,
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

    function searchAuthor2(sortBy) {
        $.ajax ({
            url: `${apiUrl}author/${localStorage.getItem("author")}/sort/${sortBy}`,
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


    function sortByTitle() {
        const displaySection = document.getElementById("bucketList");
        displaySection.innerHTML = '';
        if (localStorage.getItem("searchByTitle") == "1") {
            searchTitle2("title");
        } else if (localStorage.getItem("searchByAuthor") == "1") {
            searchAuthor2("title");
        } else if (localStorage.getItem("findAll") == "1") {
            findAll2("title");
        } else {
            searchPrice2("title");
        }
    }

    function sortByPrice() {
        const displaySection = document.getElementById("bucketList");
        displaySection.innerHTML = '';
        if (localStorage.getItem("searchByTitle") == "1") {
            searchTitle2("price");
        } else if (localStorage.getItem("searchByAuthor") == "1") {
            searchAuthor2("price");
        } else if (localStorage.getItem("findAll") == "1") {
            findAll2("price");
        } else {
            searchPrice2("price");
        }
    }

    function displayBooks(data) {
        const displaySection = document.getElementById("bucketList");
        var currRow = displaySection.insertRow(0);
        var titleCell = currRow.insertCell(0);
        titleCell.innerHTML = "Title"; 
        var authorCell = currRow.insertCell(1);
        authorCell.innerHTML = "Author"; 
        var isbnCell = currRow.insertCell(2);
        isbnCell.innerHTML = "ISBN"; 
        var priceCell = currRow.insertCell(3);
        priceCell.innerHTML = "Price";
        for (var i = 0; i < data.length; i++) {
            var currRow = displaySection.insertRow(i+1);
            var titleCell = currRow.insertCell(0);
            titleCell.innerHTML = data[i].title; 
            var authorCell = currRow.insertCell(1);
            authorCell.innerHTML = data[i].author; 
            var isbnCell = currRow.insertCell(2);
            isbnCell.innerHTML = data[i].isbn; 
            var priceCell = currRow.insertCell(3);
            priceCell.innerHTML = data[i].price;
            currRow.onclick = rowClick;
        }
    }

    function rowClick() {
        localStorage.setItem("title",this.cells[0].innerHTML);
        localStorage.setItem("isbn",this.cells[2].innerHTML);
        localStorage.setItem("author",this.cells[1].innerHTML);
        localStorage.setItem("price", this.cells[3].innerHTML);
        window.location = "./book.html";
    }

    $(document).ready(function () {
        $("#sortByTitle").on("click", sortByTitle);
        $("#sortByPrice").on("click", sortByPrice);
        if (localStorage.getItem("searchByTitle") == "1") {
            searchTitle();
        } else if (localStorage.getItem("searchByAuthor") == "1") {
            searchAuthor();
        } else if (localStorage.getItem("findAll") == "1") {
            findAll();
        } else {
            searchPrice();
        }
        
    });
})();
