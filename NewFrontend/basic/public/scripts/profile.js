(function () {

    function updateProfile(){
        
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