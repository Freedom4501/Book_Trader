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
            alert("Please enter something for search");
        }
        
    }



    function addBook() {
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
            url: apiUrl,
            type: "POST",
            data: {"title": title, "author": author, "isbn": isbn, "price": price}, 
            dataType: "JSON",
            success: (data) => {
                if (data) {
                    console.log(data);
                    console.log("Put succeed");
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
    }


    function displayBook(data) {
        localStorage.setItem("title",data.title);
        localStorage.setItem("isbn",data.isbn);
        localStorage.setItem("author",data.author);
        localStorage.setItem("price", data.price);      
    }

    function getProfile(){
        window.location="./profile.html";
    }

    function getCart(){
        window.location="./cart.html";
    }

    function getOrder(){
        window.location="./cart.html";
    }

    $(document).ready(function () {
        $("#submitSearch").on("click", searchBook);
        $("#searchAllBooks").on("click", getAllBooks);
        $("#submitAdd").on("click", addBook);
        $("#profileBtn").on("click", getProfile);
        $("#cartBtn").on("click", getCart);
        $("#orderBtn").on("click", getOrder);
    });
})();
