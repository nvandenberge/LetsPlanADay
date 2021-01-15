$("#searchBtn").on("click", function (event) {
    event.preventDefault();
    let zipCode = $("#zipInput").val();
    window.location = "resultspage.html?zip=" + zipCode;
  });