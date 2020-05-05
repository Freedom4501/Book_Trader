(function () {

    "use strict";
    let book;
    const apiUrl = `http://137.112.104.119:3000/db/books/`;
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
                    }else{
                        window.location = "./warning.html";
                    }
                    
                },
                error: (request, status, error) => {
                    window.location = "./404.html";
                    console.log(error);
                }
            });
        } else if(title != ""){
            localStorage.setItem("title",title);
            localStorage.setItem("searchByAuthor","0");
            localStorage.setItem("searchByTitle","1");
            localStorage.setItem("findAll","0");
            window.location = "./searchpage.html";
        } else if(author != ""){
            localStorage.setItem("author",author);
            localStorage.setItem("searchByAuthor","1");
            localStorage.setItem("searchByTitle","0");
            localStorage.setItem("findAll","0");
            window.location = "./searchpage.html";
        }

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

    function getProfile(){
        window.location="./profile.html";
    }

    $(document).ready(function () {
        $("#submitSearch").on("click", searchBook);
        $("#searchAllBooks").on("click", getAllBooks);
        $("#submitAdd").on("click", addBook);
        $("#profileBtn").on("click", getProfile);
    });
})();
