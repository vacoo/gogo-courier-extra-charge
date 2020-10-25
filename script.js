var fileInput = document.getElementById('csv'),
  readFile = function() {
    var reader = new FileReader();
    reader.onload = function() {
      let rows = processData(reader.result)

      parseTimes(rows)
      calcWaits(rows)
      
      console.log(rows)
      
      renderWaits(rows)
      
    };
    reader.readAsText(fileInput.files[0]);
  };

fileInput.addEventListener('change', readFile);

function renderWaits(rows) {
  let elRows = document.getElementById("rows")

  for (let rKey in rows) {
    let elRow = document.createElement("tr")
    
    let elTdName = document.createElement("td")
    elTdName.innerText = rows[rKey].company_name
    elRow.appendChild(elTdName)
    
    let elTdPhone = document.createElement("td")
    elTdPhone.innerText = rows[rKey].phone
    elRow.appendChild(elTdPhone)
    
    let elTdCount = document.createElement("td")
    elTdCount.innerText = rows[rKey].count
    elRow.appendChild(elTdCount)
    
    let elTdTxs = document.createElement("td")
    elTdTxs.innerHTML = rows[rKey].txs.join("<br/>")
    elRow.appendChild(elTdTxs)
    
    let elTdOrders = document.createElement("td")
    elTdOrders.innerHTML = rows[rKey].orders_counts.join("<br/>")
    elRow.appendChild(elTdOrders)
    
    elRows.appendChild(elRow)
  }


}

function calcWaits(drivers) {
  for (let dKey in drivers) {
    let driver = drivers[dKey];
    let count = 0;

    for (let txKey in driver.txs) {
      let tx = driver.txs[txKey]

      if (!tx) {
        break;
      }

      let ranges = [];

      let txDate = new Date(tx);

      for (let i = 0; i <= 3; i++) {
        txDate.setHours(txDate.getHours() + (i === 0 ? 0 : 1))
        ranges.push(formatDate(txDate))
      }

      // Попадание в диапазон
      for (let i = 0; i <= ranges.length; i++) {
        if (ranges[i + 1]) {
          let rangeFrom = ranges[i];
          let rangeTo = ranges[i + 1];
          let is = false

          for (let oKey in driver.orders_counts) {
            let orderCount = driver.orders_counts[oKey]
            if (rangeFrom <= orderCount && orderCount <= rangeTo) {
              is = true
              break
            }
          }

          if (!is) {
            count++
          }
        }
      }

    }

    drivers[dKey].count = count
  }
}

function parseTimes(arr) {
  for (let key in arr) {
    arr[key].txs = arr[key].txs.split(" / ")
    arr[key].orders_counts = arr[key].orders_counts.split(" / ")
  }
}

function processData(allText) {
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(',');
  var lines = [];

  for (var i = 1; i < allTextLines.length; i++) {
    var data = allTextLines[i].split(',');
    if (data.length == headers.length) {

      var tarr = {};
      for (var j = 0; j < headers.length; j++) {
        tarr[headers[j]] = data[j]
      }
      lines.push(tarr);
    }
  }

  return lines
}

function zero(num) {
  return num >= 10 ? String(num) : '0' + num;
}

function formatDate(txDate) {
  return `${txDate.getFullYear()}-${zero(txDate.getMonth()+1)}-${zero(txDate.getDate())} ${zero(txDate.getHours())}:${zero(txDate.getMinutes())}`
}
