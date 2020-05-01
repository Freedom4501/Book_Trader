(function () {

    "use strict";
    $(document).ready(function () {
        let displaySection = $("#titleContainer");
        const bookTitle = document.createElement("h2");
        bookTitle.innerHTML = `${localStorage.getItem("title")}`;
        displaySection.append(bookTitle);
        const bookAuthor = document.createElement("p");
        bookAuthor.innerHTML = `${localStorage.getItem("author")}`;
        displaySection.append(bookAuthor);
        const bookisbn = document.createElement("p");
        bookisbn.innerHTML = `${localStorage.getItem("isbn")}`;
        displaySection.append(bookisbn);

    });
})();