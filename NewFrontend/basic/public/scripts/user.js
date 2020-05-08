(function () {
    const NodeCouchDb = require('node-couchdb');
 
    // node-couchdb instance with default options
    const couch = new NodeCouchDb();
    
    // node-couchdb instance with Memcached
    const MemcacheNode = require('node-couchdb-plugin-memcached');
    const couchWithMemcache = new NodeCouchDb({
        cache: new MemcacheNode
    });
    
    // node-couchdb instance talking to external service
    const couchExternal = new NodeCouchDb({
        host: '137.112.104.118',
        protocol: 'https',
        port: 5984
    });
    
    // not admin party
    const couchAuth = new NodeCouchDb({
        auth: {
            user: 'login',
            pass: 'secret'
        }
    });


    "use strict";
    let User;
    const apiUrl = `http://137.112.104.119:3000/db/users/`;
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

   

    function login() {

        const username = document.getElementById("inputUsername").value;
        const password = document.getElementById("inputPassword").value;
        
        
    }



    function addUser() {

        const username = document.getElementById("inputUsername").value;
        const Name = document.getElementById("inputName").value;
        const password = document.getElementById("inputPassword").value;
        const reinputpassword = document.getElementById("reinputPassword").value;
        const email = document.getElementById("inputEmail").value;
        $.ajax ({
            url: apiUrl,
            type: "POST",
            data: {"name": Name, "username": username, "password": password, "email": email}, 
            dataType: "JSON",
            success: (data) => {
                if (data) {
                    console.log("add succeed");
                    window.location = "./welcome.html";
                } else {
                    console.log("type in again");
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
        $("#submitRegister").on("click", searchBook);
        $("#submitLogin").on("click", login);
        $("#submitAdd").on("click", addBook);
    });
})();
