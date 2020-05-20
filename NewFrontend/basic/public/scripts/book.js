(function () {
    "use strict";
    let book;
    const apiUrl = `http://137.112.104.119:3000/db/books/`;
    const driver = neo4j.driver('bolt://lim5.csse.rose-hulman.edu:7687', neo4j.auth.basic('neo4j', '000201'));
    const session = driver.session();
    var couchdb = new PouchDB('http://lim5:000201@137.112.104.118:5984/users');
    function getAllBooks() {
        localStorage.setItem("searchByAuthor","0");
        localStorage.setItem("searchByTitle","0");
        localStorage.setItem("findAll","1");
        window.location = "./searchpage.html";
    }


    function searchBook() {

        const isbn = document.getElementById("searchISBN").value;
        const title = document.getElementById("searchTitle").value;
        const author = document.getElementById("searchAuthor").value;
        const gt = document.getElementById("searchPriceGreaterThan").value;
        const lt = document.getElementById("searchPriceLessThan").value;
        
        if(isbn != ""){
            $.ajax ({
                url: `${apiUrl}isbn/${isbn}/`,
                type: "GET",
    
                success: (data) => {
                    console.log(data);
                    book = data;
                    if(data!=null){
                        window.location = "./book.html";
                        displayBook(data);
                    }
                    else{
                        alert("cannot get isbn");
                    }
                    
                },
                error: (request, status, error) => {
                    window.location = "./404.html";
                    console.log(error);
                }
            });
        }
        else if(title != ""){
            localStorage.setItem("title",title);
            localStorage.setItem("searchByAuthor","0");
            localStorage.setItem("searchByTitle","1");
            localStorage.setItem("findAll","0");
            window.location = "./searchpage.html";
        }else if(author != ""){
            localStorage.setItem("author",author);
            localStorage.setItem("searchByAuthor","1");
            localStorage.setItem("searchByTitle","0");
            localStorage.setItem("findAll","0");
            window.location = "./searchpage.html";   
        }else{
            localStorage.setItem("gt",gt);
            localStorage.setItem("lt",lt);
            localStorage.setItem("searchByAuthor","0");
            localStorage.setItem("searchByTitle","0");
            localStorage.setItem("findAll","0");
            window.location = "./searchpage.html";   
        }
        
    }



    function addBook() {
        const username = localStorage.getItem("UsernameLogin");
        if(username==null){
            alert("Login First Please");
        }
        const isbn = document.getElementById("addISBN").value;
        const title = document.getElementById("addTitle").value;
        const author = document.getElementById("addAuthor").value;
        const price = document.getElementById("addPrice").value;
        if(isbn == "" || isbn==null){
            console.log("Please enter ISBN");
            alert("Please enter ISBN");
            return;
        }else if(title == ""||title==null){
            console.log("Please enter Name");
            alert("Please enter Name");
            return;
        }else if(author == ""||author==null){
            console.log("Please enter author");
            alert("Please enter author");
            return;
        }else if(price == ""||price==null){
            console.log("Please enter price");
            alert("Please enter price");
            return;
        }

        $.ajax ({
            url: `${apiUrl}isbn/${isbn}/`,
            type: "GET",

            success: (data) => {
                console.log(data);
                if (data == null) {
                    $.ajax ({
                        url: apiUrl,
                        type: "POST",
                        data: {"title": title, "author": author, "isbn": isbn, "price": price}, 
                        dataType: "JSON",
                        success: (data2) => {
                            if (data2) {
                                console.log(data2);
                                console.log("Put succeed");
                                session.run(`Match (n:User {username: {username}}) Create(b:Book{ISBN: {isbn}}) Create (n)-[:SELL]->(b) return count(b) as num`, {username,isbn}).then((result) => {
                                    if(result.records[0].get("num") > 0){
                                        console.log("Successfully add book to sell");
                                    }else{
                                        alert("Failed to add book node in neo4j");
                                    }
                                  });
                            } else {
                                console.log("cannot put");
                                alert("add book fails");
                            }
                        },  
                        error: (request, status, error) => {
                            console.log(error);
                            alert("Add error");
                        }
                    });
                } else {
                    alert("isbn already exists");
                }
            }
        });
    }


    function displayBook(data) {
        localStorage.setItem("title",data.title);
        localStorage.setItem("isbn",data.isbn);
        localStorage.setItem("author",data.author);
        localStorage.setItem("price", data.price);      
    }



   
    $(document).ready(function () {
        $("#submitSearch").on("click", searchBook);
        $("#searchAllBooks").on("click", getAllBooks);
        $("#submitAdd").on("click", addBook);
        $("#profileBtn").on("click", getProfile);
    });
})();
