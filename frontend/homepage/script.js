document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("searchButton");

    searchButton.addEventListener("click", function () {
        const movieInput = document.getElementById("movieInput").value;
        if (movieInput) {
            // Redirect to the recommendations page with the selected movie/TV show
            window.location.href = `recommendations.html?movie=${movieInput}`;
        }
    });

    const loginLink = document.getElementById("loginLink");
    loginLink.addEventListener("click", function () {
        // Handle login logic
        alert("Login functionality coming soon!");
    });
});
