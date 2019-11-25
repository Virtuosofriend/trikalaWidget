const api = "https://mobile.envi4all.com/";
const local = "json/response.json";
const stations = [
  {
    id: "PUR84F3EB7BCB5",
    location: "Αντλιοστασιο",
    image: "antlia.jpg"
  },
  {
    id: "PUR84F3EB7BC99F",
    location: "Δημαρχειο",
    image: "dimarxeio.jpg"
  },
  {
    id: "PUR807D3A2FBE5A",
    location: "Μουσειο Τσιτσανη",
    image: "tsitsani.jpg"
  }
];

const indexes = {
  "bad": "Κακη",
  "medium": "Μετρια",
  "good": "Καλη",
  "verygood": "Πολυ Καλη"
};
const faces = {
  "bad": "<i class='far fa-frown-open'></i>",
  "medium": "<i class='far fa-meh'></i>",
  "good": "<i class='far fa-grin'></i>",
  "verygood": "<i class='far fa-grin-beam'></i>"
};

let measurements = [];

$( document ).ready(function() {
  for(let i = 0; i < 3; i++ ) {   
    $.ajax({
      url: api + `v1/sensor/latest?access_key=${stations[i].id}&latest=1`,
      dataType: "json",
      method: "GET",
    })
    .done(response => {
      if (response.data.status === "success") {
        let envi_index = response.data.data.envi_index.replace(" ", "").toLowerCase();
        measurements.push(
          {
            indexes: indexes[envi_index],
            icons: faces[envi_index],
            backgroundColor: envi_index,
            location: stations[i].location,
            image: stations[i].image
          }
          );
        if (i == 2) {
          createTheSlider(measurements);
        } 
      }
    })
    .fail(failed);
  }
});

let createTheSlider = (measurements) => {
  let html = ``;
  
    for(let value of measurements) {
      html += `<div class="slide">
        <div class="outer-box" style="background-image: url('lib/img/${value.image}');">
          <div class="overlay ${value.backgroundColor}"></div>
          <div class="widget-body">
            <div class="widget-body-heading">
              <h2>Η ποιότητα του αέρα τώρα, στο <span>${value.location}</span></h2>
            </div>
            <div class="widget-body-main">
              <div>
                <a href="#previous"><i class="fas fa-angle-left"></i></a>
              </div>
              <div>
                ${value.icons}
                <h3 class="value">${value.indexes}</h3>
              </div>
              <div>
                <a href="#next"><i class="fas fa-angle-right"></i></a>
              </div>

            </div>
            <div class="widget-footer">
              <div class="footer">
                <div>
                  <a href="http://multimap.envi4all.com:8000/home/Trikala" target="_blank">περισσοτερα <i class="fas fa-chevron-right"></i></a>
                </div>
                <div>
                  <img src="lib/img/logo.png" class="logo" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`
    }
    
    $(".slider").append(html);
    $(".slider").simpleSlider({
      pauseOnHover: true,
      magneticSwipe: false,
      animateDuration: 1000,
      animationEasing: "cubic-bezier(.25,.8,.25,1)c"
    });

    let slider = $(".slider").data("simpleslider");
    $("a[href='#previous']").click(function (ev) {
      slider.prevSlide();
    });
    $("a[href='#next']").click(function (ev) {
      slider.nextSlide();
    });
};

function failed() {
  $(".slider").html(` <h3>No data!</h3> `);
}
