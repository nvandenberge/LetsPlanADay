$("#searchBtn").on("click", function (event) {
  event.preventDefault();
  let zipCode = $("#zipInput").val();
  // Validate that the zipInput is exactly 5 numbers
  if (zipCode.length !== 5) {
    $("#inputError").empty();
    $("#inputError").text("Zip code must be 5 numbers, please try again");
    $("#zipInput").val("");
  } else {
    $("#inputError").empty();
    $("#zipInput").val("");
    window.location = "resultspage.html?zip=" + zipCode;
  }
});