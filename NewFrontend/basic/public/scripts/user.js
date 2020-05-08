
(function () {
    "use strict";
    let User;
    function login() {
        const username = document.getElementById("inputUsername").value;
        const password = document.getElementById("inputPassword").value;
        
        
    }



    function addUser() {
        couchdb.info().then(function (info) {
            console.log(info);
        })
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
