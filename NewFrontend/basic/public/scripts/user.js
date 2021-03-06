(function () {
    "use strict";
    
    const driver = neo4j.driver('bolt://lim5.csse.rose-hulman.edu:7687', neo4j.auth.basic('neo4j', '000201'));
    const session = driver.session();
    var couchdb = new PouchDB('http://lim5:000201@137.112.104.118:5984/users');
    function login() {
        const username = document.getElementById("inputUsername").value;
        const password = document.getElementById("inputPassword").value;
        if(username == ""){
            console.log("Please enter Username");
            alert("Please enter Username")
            return;
        }else if(password == ""){
            console.log("Please enter Password");
            alert("Please enter Password");
            return;
        }
        couchdb.get(username).then(function (doc) {
            console.log(doc);
            if(doc.Password!=password){
                console.log("Login Failed");
                alert("Login Fails: check your username and password.");
                return;
            }else{
                localStorage.setItem("UsernameLogin", username);
                localStorage.setItem("NameLogin", doc.Name);
                localStorage.setItem("EmailLogin", doc.Email);
                localStorage.setItem("PhoneLogin", doc.Phone);
                window.location = "./profile.html";
            }
        });

        
    }

    function searchUser(){
        const username = document.getElementById("searchUsername").value;
        couchdb.get(username).then(function (doc){
            if(doc !=null){
                
                localStorage.setItem("NameLogin",doc.Name);
                localStorage.setItem("EmailLogin",doc.Email);
                localStorage.setItem("PhoneLogin",doc.Phone);
                localStorage.setItem("UsernameLogin", username);
                window.location = "./profile.html";
                //displayUser(doc,username);
            }
            else{
                window.location = "./warning.html";
            }
                return couchdb.put(doc);
                }).then(function () {
                    return couchdb.get(username);
                }).then(function (doc) {
                    console.log(doc);
                });
            }
            



     
    function displayUser(doc,username){
        localStorage.setItem("NameLogin",doc.Name);
        localStorage.setItem("EmailLogin",doc.Email);
        localStorage.setItem("PhoneLogin",doc.Phone);
        localStorage.setItem("UsernameLogin", username);

    }
    function addUser() {
        const username = document.getElementById("ReginputUsername").value;
        const Name = document.getElementById("inputName").value;
        const password = document.getElementById("ReginputPassword").value;
        const reinputpassword = document.getElementById("reinputPassword").value;
        const email = document.getElementById("inputEmail").value;
        const phone = document.getElementById("inputPhone").value;
        if(username == ""){
            console.log("Please enter Username");
            alert("Please enter Username!");
            return;
        }else if(Name == ""){
            console.log("Please enter Name");
            alert("Please enter Name!");

            return;
        }else if(password == ""){
            console.log("Please enter Password");
            alert("Please enter Password!");

            return;
        }else if(reinputpassword == ""){
            console.log("Please re-enter Password");
            alert("Please re-enter Password!");

            return;
        }else if(email == ""){
            console.log("Please enter Email");
            alert("Please enter Email!");

            return;
        }else if(phone == ""){
            console.log("Please enter phone number");
            alert("Please enter phone number!");

            return;
        }else if(password != reinputpassword){
            console.log("Please check two passwords");
            alert("Please check two passwords!");

            return;
        }else{
            //Preparing the document
            var doc = {
                "_id" : username,
                "Name" : Name,
                "Password" : password,
                "Phone" : Number(phone),
                "Email" : email
                }
            //Inserting Document
            couchdb.put(doc, function(err, response) {
                if (err) {
                    return console.log(err);
                    alert("Cannot Create the user. The Username might be occupied.")
                } else {
                    console.log("Document created Successfully");
                    session.run(`create(n:User {username:{username}}) Return count(n) as num`, {username}).then((result) => {
                        if(result.records[0].get("num") > 0){
                            console.log("Successfully add user");
                        }else{
                            alert("failed to add node in neo4j");
                        }
                      });

                }
            });
        }
    }



    $(document).ready(function () {
        $("#submitRegister").on("click", addUser);
        $("#submitLogin").on("click", login);
        $("#submitSearchuser").on("click", searchUser);
    });
})();
