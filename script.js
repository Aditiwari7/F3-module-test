var locationData;
var POdata;
var postalCard;

const key = "992de068c67218";

async function displayData() {
  document.getElementById("buttonBox").style.display = "none";
  var info = document.getElementById("infoDiv");
  info.style.display = "block";

  var IPadd;
  await $.getJSON("https://api.ipify.org?format=json", function(data){
    IPadd = data.ip;
  });

  console.log(IPadd)

  await fetch(`https://ipinfo.io/${IPadd}?token=${key}`).then(response => response.json()).then(response => locationData=response).catch(()=>{alert("Issue while fetching")});

  var position = locationData.loc.split(",");
  let lat = position[0].trim();
  let long = position[1].trim();

  info.innerHTML += `<div class="infoBox" id="infoBox1">
      <div>
        <div>Lat : ${lat}</div>
        <div>Long : ${long}</div>
      </div>

      <div>
        <div>City : ${locationData.city}</div>
        <div>Region : ${locationData.region}</div>
      </div>

      <div>
        <div>Organisation : ${locationData.org}</div>
        <div>Hostname : ${"ipInfo"}</div>
      </div>
    </div>

    <div id="mapBox">
      <iframe src="https://maps.google.com/maps?q=${lat}, ${long}&z=15&output=embed" frameborder="0" id="mapFrame"></iframe>
    </div>
  `;
  console.log(locationData);

  let dateTime = new Date().toLocaleString("en-US",{
    timeZone: `${locationData.timezone}`,
  });

  await fetch(`https://api.postalpincode.in/pincode/${locationData.postal}`).then(response => response.json()).then(response => response[0]).then(response => {
    console.log(response);

    info.innerHTML += `<div class="infoBox" id="infoBox2">
        <div>TimeZone : ${locationData.timezone}</div>
        <div>Date And Time : ${dateTime}</div>
        <div>Pincode : ${locationData.postal}</div>
        <div>Message : <p>${response.Message}</p>
        </div>
      </div>
      
      <div id="postalInfo">
        <div id="searchBar">
          <span><img src="icon.png" alt="search_icon"/></span>
          <input type="text" placeholder="filter" onkeyup="searchPO()" id="searchBox" />
        </div>
      <div id="postalCard"></div>
    `;
    
    postalCard = document.getElementById("postalCard");

    return response.PostOffice;
  }).then(data => {
    console.log(data);
    POdata = data;

    data.forEach(element => {
      console.log(element);

      postalCard.innerHTML += `<div class="cards">
        <div>Name : ${element.Name}</div>
        <div>Branch Type : ${element.BranchType}</div>
        <div>Delivery Status : ${element.DeliveryStatus}</div>
        <div>District : ${element.District}</div>
        <div>Division : ${element.Division}</div>
      </div>`;

    });
  }).catch(() => {alert("Issue while fetching")})
}

function searchPO(){
  postalCard.innerHTML="";

  var searchItem = document.getElementById("searchBox").value;

  var filterPO = POdata.filter(item => {
    var stringifiedData = JSON.stringify(item);

    return stringifiedData.toLowerCase().includes(searchItem.toLowerCase());
  })

  filterPO.forEach(element => {
    postalCard.innerHTML += `<div class="cards">
      <div>Name : ${element.Name}</div>
      <div>Branch Type : ${element.BranchType}</div>
      <div>Delivery Status : ${element.DeliveryStatus}</div>
      <div>District : ${element.District}</div>
      <div>Division : ${element.Division}</div>
    </div>`;
  });
}