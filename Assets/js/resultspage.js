$(document).ready(function () {
  function yelpRequest(zipCode) {
    foodRequest(zipCode);
    eventRequest(zipCode);
    $(".modal").modal();
  }
  // Gets the zip code from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const zipCode = urlParams.get("zip");
  yelpRequest(zipCode);
});

// Function that gets Yelp API request & builds UI content
function foodRequest(zipCode) {
  let yelpAPIKey =
    "nfTUVrFeoPDHChVBIUtbNHnP1lRBrqWO50jNjHHoePVDf4Q2IVoCGIld9YgAq-MX9VDeGBNUb0plvpnIFdfuf7X3huELvNrBDN2YjSEKDf3ANCXhx3-gJb9JnvL9X3Yx";

  // Forced to go through herokuapp proxy since we do not have server setup
  let yelpREST = axios.create({
    baseURL: "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3",
    headers: {
      Authorization: `Bearer ${yelpAPIKey}`,
      "Content-type": "application/json",
    },
  });

  // Function that builds url for Yelp API request & UI content
  yelpREST("/businesses/search", { params: { location: zipCode } }).then(
    ({ data }) => {
      // Get a random number between 0 and legnth of array
      let randomRestIndex = Math.floor(Math.random() * data.businesses.length);
      let restData = data.businesses[randomRestIndex];

      // Creating <img> element and adding image url to src attr.
      let foodImage = $("<img>").attr({
        src: restData?.image_url,
        height: "auto",
        width: "100%",
        fit: "scale",
      });
      foodImage.remove();

      // Puts full address together
      let fullRestAddress = restData.location.display_address.join(" | ");

      // Using IF statements to ensure data is available, if not, dont display
      // Restaurant image
      if (restData.image_url !== undefined || "") {
        $("#restImage").empty();
        $("#restImage").append(foodImage);
      }
      // Restaurant name
      $("#restName").text(`Name: ${restData.name}`);
      // Restaurant type
      if (restData.categories[0].title !== undefined || "") {
        $("#restType").text(`Type: ${restData.categories[0]?.title}`);
      }
      // Restaurant phone number
      if (restData.phone !== undefined || "") {
        $("#restPhone").text(`Phone: ${restData?.phone}`);
      }
      // Restaurant address
      if (restData.location.display_address !== undefined || "") {
        $("#restAddress").text(`Address: ${fullRestAddress}`);
      }
      let newFoodButton = $("<button>")
        .addClass("newFoodBtn btn waves-effect waves-light")
        .text("New Food Option");
      $("#foodBtnHolder").html(newFoodButton);
      $(".newFoodBtn").on("click", function () {
        newFoodButton.prop("disabled", true);
        foodRequest(zipCode);
      });
    }
  );
}

// Function that gets TicketMaster API request & builds UI content
function eventRequest(zipCode) {
  let eventAPIKey = "Fm5l5yKh5aBTmisz5MDUhqCSxcPtyTWL";

  $.ajax({
    type: "GET",
    url: `https://cors-anywhere.herokuapp.com/https://app.ticketmaster.com/discovery/v2/events.json?apikey=${eventAPIKey}&postalCode=${zipCode}`,
    async: true,
    dataType: "json",
    success: function (response) {
      // Error handling if no events are returned.
      if (response?._embedded?.events?.length === undefined) {
        $("#eventError").text(
          "Sorry, there are no upcoming events in this area."
        );
        $("#eventErrorSig").text("Sincerely, COVID-19");
      }
      // If events are found, run the following
      else {
        // Get a random number between 0 and legnth of array
        let randomEventIndex = Math.floor(
          Math.random() * response._embedded.events.length
        );
        let eventData = response._embedded.events[randomEventIndex];

        // Creating <img> element and adding image url to src attr.
        let eventImage = $("<img>").attr({
          src: eventData?.images[0].url,
          height: "auto",
          width: "100%",
          fit: "scale",
        });
        eventImage.remove();

        // Event image
        if (eventData?.images[0].url !== undefined || "") {
          $("#eventImage").empty();
          $("#eventImage").append(eventImage);
        }
        // Event name
        $("#eventName").text(`Name: ${eventData.name}`);
        // Convert date format to MM-DD-YYYY using moment.js
        if (eventData.dates.start.localDate !== undefined || "") {
          $("#eventDate").text(
            `Date: ${moment(eventData?.dates?.start?.localDate).format("L")}`
          );
        }
        // Event description
        if (eventData.info !== undefined || "") {
          $("#eventInfo").text(`Description: ${eventData?.info}`);
        }
        // Link to event
        if (eventData.url !== undefined || "") {
          // Creating anchor element to hold ticket link
          let ticketLink = $("<a>")
            .text("Get Tickets")
            .attr("href", eventData.url);
          $("#eventTickets").text(`Tickets: `);
          $("#eventTickets").append(ticketLink);
        }
        let newEventButton = $("<button>")
          .addClass("newEventBtn btn waves-effect waves-light")
          .text("New Event Option");
        $("#eventBtnHolder").html(newEventButton);
        $(".newEventBtn").on("click", function () {
          newEventButton.prop("disabled", true);;
          eventRequest(zipCode);
        });
      }
    },
    error: function (xhr, status, err) {
      console.log("ERROR == ", xhr.status);
    },
  });
}

$("#emailBtn").on("click", function () {
  localStorage.clear();
  let choicesArr = JSON.parse(localStorage.getItem("choices")) || [];
  choicesArr.push({
    food: $("#restName").text(),
    event: $("#eventName").text(),
  });
  localStorage.setItem("choices", JSON.stringify(choicesArr));
  choicesArr = JSON.parse(localStorage.getItem("choices"));
  $("#foodChoice").text(choicesArr[0].food);
  if (choicesArr[0].event === "") {
    $("#eventChoiceInfo").text("No events available");
  } else {
    $("#eventChoice").text(choicesArr[0].event);
  }
});
