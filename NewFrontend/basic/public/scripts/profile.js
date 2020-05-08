(function () {

  "use strict";

  function updateProfile(){
      const Name = document.getElementById("inputNewName").value;
      const password = document.getElementById("inputNewPassword").value;
      const reinputpassword = document.getElementById("reinputNewPassword").value;
      const email = document.getElementById("inputNewEmail").value;
      const picture = document.getElementById("inputNewProfilePic").value;
      $("#profilePhoto").url = picture;
      $.ajax ({
          url: `${apiUrl}username/${localStorage.getItem("username")}/`,
          type: "PUT",
          data: {"name": Name, "username": localStorage.getItem("username"), "password": password, "email": email, "picture":picture}, 
          dataType: "JSON",
          success: (data) => {
              if (data) {
                  console.log("update succeed");
                  window.location = "./profile.html";
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


  $(document).ready(function () {
    let displaySection = $("#profileContainer");
    const profileName = document.createElement("h2");
    profileName.innerHTML = `${localStorage.getItem("NameLogin")}`;
    displaySection.append(profileName);
    const profileUsername = document.createElement("p");
    profileUsername.innerHTML = 'Username: ' + `${localStorage.getItem("UsernameLogin")}`;
    displaySection.append(profileUsername);
    const profileEmail = document.createElement("p");
    profileEmail.innerHTML = 'Email:  ' + `${localStorage.getItem("EmailLogin")}`;
    displaySection.append(profileEmail);
    const profilePhone = document.createElement("p");
    profilePhone.innerHTML = 'Phone:  ' + `${localStorage.getItem("PhoneLogin")}`;
    displaySection.append(profilePhone);
    $("#submitUpdateProfile").on("click", updateProfile);
  });
})();