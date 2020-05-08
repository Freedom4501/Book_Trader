(function () {

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


  $(document).ready(function () {
    let displaySection = $("#profileContainer");
    const profileName = document.createElement("h2");
    profileName.innerHTML = `${localStorage.getItem("NameLogin")}`;
    displaySection.append(profileName);
    const profileEmail = document.createElement("p");
    profileEmail.innerHTML = 'Email:  ' + `${localStorage.getItem("EmailLogin")}`;
    displaySection.append(profileEmail);
    $("#submitUpdateProfile").on("click", updateProfile);
  });
})();