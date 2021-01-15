$(document).ready(function () {
  function yelpRequest(zipCode) {
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

    // Function that builds url for API request
    yelpREST("/businesses/search", { params: { location: zipCode } }).then(
      ({ data }) => {
        // Get a random number between 0 and legnth of array
        let randomRestIndex = Math.floor(
          Math.random() * data.businesses.length
        );
        let restData = data.businesses[randomRestIndex];

        // Creating <img> element and adding image url to src attr.
        let image = $("<img>").attr({
          src: restData.image_url,
          height: "auto",
          width: "100%",
          fit: "scale",
        });
        image.empty();

        // Puts full address together
        let fullRestAddress = restData.location.display_address.join(" | ");

        // Using IF statements to ensure data is available, if not, dont display
        if (restData.image_url !== undefined || "") {
          $("#restImage").append(image);
        }
        $("#restName").text(`Name: ${restData.name}`);
        if (restData.categories[0].title !== undefined || "") {
          $("#restType").text(`Type: ${restData.categories[0]?.title}`);
        }
        if (restData.phone !== undefined || "") {
          $("#restPhone").text(`Phone: ${restData?.phone}`);
        }
        if (restData.location.display_address !== undefined || "")
          $("#restAddress").text(`Address: ${fullRestAddress}`);
      }
    );
  }
  // Gets the zip code from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const zipCode = urlParams.get("zip");
  yelpRequest(zipCode);
});
