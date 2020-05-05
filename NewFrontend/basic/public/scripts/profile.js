(function () {

  "use strict";
  const apiUrl = `http://137.112.104.119:3000/db/books/`;

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

  // function updateProfilePhoto(){
  //   $("#fileInput").trigger("click");
  //   $("#fileInput").change((event) => {
  //     const file = event.target.files[0];
	// 		console.log("The file input changed", file.name);
	// 	})
  // }

  $(document).ready(function () {
    $("#submitUpdateProfile").on("click", updateProfile);
    // $("#updateProfilePhoto").on("click", updateProfilePhoto);
  });
})();