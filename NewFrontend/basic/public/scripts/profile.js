(function () {
    var couchdb = new PouchDB('http://lim5:000201@137.112.104.118:5984/users');
    function updateProfile(){
      const username = document.getElementById("inputProfileUsername").value;
      const newname = document.getElementById("inputNewName").value;
      const newemail = document.getElementById("inputNewEmail").value;
      if(username == ""){
        console.log("Please enter Username");
        return;
    }else if(newname == ""){
        console.log("Please enter Newname");
        return;
    }else if(newemail == ""){
      console.log("Please enter newemail");
      return;
   }
   var doc = {
    "_id" : username,
    "Name" : newname,
    "Email" : newemail
    }
//Inserting Document
couchdb.put(doc, function(err, response) {
    if (err) {
        return console.log(err);
    } else {
        console.log("Document updated Successfully");
    }
});
    }
    function updatePassword(){
        const oldpassword = document.getElementById("inputOldPassword").value;
        const newpassword = document.getElementById("inputNewPassword").value;
        const reinputpassword = document.getElementById("reinputNewPassword").value;
        if(oldpassword==""){
            console.log("Please enter Old Password");
            return;
        }
        }else if(newpassword == ""){
            console.log("Please enter New Password");
            return;
        }else if(reinputpassword == ""){
            console.log("Please re-enter Password");
            return;
        }else if(newpassword!=reinputpassword){
            console.log("Unmatched new passwords");
            return;
        }
        const username = `${localStorage.getItem("UsernameLogin")}`
        couchdb.get(username).then(function (doc) {
            if(oldpassword!=doc.Password){
                console.log("Wrong old password");
                return;
            }else{
                doc.Password = newpassword;
            }
            return couchdb.put(doc);
        });then(function () {
            return couchdb.get(username);
        }).then(function (doc) {
            console.log(doc);
        });
    }


  $(document).ready(function () {
    let displaySection = $("#profileContainer");
    const profileName = document.createElement("h2");
    profileName.innerHTML = `${localStorage.getItem("NameLogin")}`;
    displaySection.append(profileName);
    const profileEmail = document.createElement("p");
    profileEmail.innerHTML = 'Email:  ' + `${localStorage.getItem("EmailLogin")}`;
    displaySection.append(profileEmail);
    $("#submitUpdateProfile").on("click", updateProfile);
    $("#submitUpdatePassword").on("click", updatePassword);
  });
})();