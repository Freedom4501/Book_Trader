(function () {
    "use strict";
    var couchdb = new PouchDB('http://lim5:000201@137.112.104.118:5984/users');
    couchdb.info().then(function (info) {
            console.log(info);
    })
    function login() {
        const username = document.getElementById("inputUsername").value;
        const password = document.getElementById("inputPassword").value;
        if(username == ""){
            console.log("Please enter Username");
            return;
        }else if(password == ""){
            console.log("Please enter Password");
            return;
        }
        couchdb.get(username).then(function (doc) {
            console.log(doc);
            if(doc.Password!=password){
                console.log("Login Failed");
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



    function addUser() {
        const username = document.getElementById("ReginputUsername").value;
        const Name = document.getElementById("inputName").value;
        const password = document.getElementById("ReginputPassword").value;
        const reinputpassword = document.getElementById("reinputPassword").value;
        const email = document.getElementById("inputEmail").value;
        const phone = document.getElementById("inputPhone").value;
        if(username == ""){
            console.log("Please enter Username");
            return;
        }else if(Name == ""){
            console.log("Please enter Name");
            return;
        }else if(password == ""){
            console.log("Please enter Password");
            return;
        }else if(reinputpassword == ""){
            console.log("Please re-enter Password");
            return;
        }else if(email == ""){
            console.log("Please enter Email");
            return;
        }else if(phone == ""){
            console.log("Please enter phone number");
            return;
        }else if(password != reinputpassword){
            console.log("Please check two passwords");
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
                } else {
                    console.log("Document created Successfully");
                }
            });
        }
    }


    $(document).ready(function () {
        $("#submitRegister").on("click", addUser);
        $("#submitLogin").on("click", login);
    });
})();
