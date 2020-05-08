(function () {
    var couchdb = new PouchDB('http://lim5:000201@137.112.104.118:5984/users');
    function updateProfile(){
        const username = `${localStorage.getItem("UsernameLogin")}`
      const newphone = document.getElementById("inputNewPhone").value;
      const newname = document.getElementById("inputNewName").value;
      const newemail = document.getElementById("inputNewEmail").value;
      couchdb.get(username).then(function (doc) {
      if(newname != ""){
        doc.Name = newname;
        localStorage.setItem("NameLogin",newname);
    } if(newemail != ""){
        doc.Email = newemail;
        localStorage.setItem("EmailLogin",newemail);
   }if(newphone != ""){
    doc.Phone = Number(newphone);
    localStorage.setItem("PhoneLogin",newphone);
}
    
    return couchdb.put(doc);
});then(function () {
    return couchdb.get(username);
}).then(function (doc) {
    console.log(doc);
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
    const profileUsername= document.createElement("p");
    profileUsername.innerHTML = 'Username:  ' + `${localStorage.getItem("UsernameLogin")}`;
    displaySection.append(profileUsername);
    const profileEmail = document.createElement("p");
    profileEmail.innerHTML = 'Email:  ' + `${localStorage.getItem("EmailLogin")}`;
    displaySection.append(profileEmail);
    const profilePhone = document.createElement("p");
    profilePhone.innerHTML = 'Phone:  ' + `${localStorage.getItem("PhoneLogin")}`;
    displaySection.append(profilePhone);
    $("#submitUpdateProfile").on("click", updateProfile);
    $("#submitUpdatePassword").on("click", updatePassword);
  });
})();