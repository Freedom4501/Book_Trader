(function () {
    "use strict";
    var couchdb = new PouchDB('http://lim5:000201@137.112.104.118:5984/users');
    couchdb.info().then(function (info) {
            console.log(info);
    })
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

    }


    $(document).ready(function () {
        $("#submitRegister").on("click", addUser);
        $("#submitLogin").on("click", login);
    });
})();
