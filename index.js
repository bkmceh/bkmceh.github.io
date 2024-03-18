var savedChoice; // user's choice about price
var lastBtcPrice; // last price that user see
var chosenButton; // button that user choice
var isFirstTimeOpenedPage = true // is first time page shows to user or not
var userPoints = 100
var eqWin = 100
var win = 50
var lose = 25

document.addEventListener('DOMContentLoaded', function() {
    getData();
    showUserPoints();
  }
);

document.getElementById('getDataButton').addEventListener('click', getData);

function getData() {
  if (chosenButton == undefined && isFirstTimeOpenedPage == false) {
    alert("СДЕЛАЙ СТАВКУ")
    return;
  }

  isFirstTimeOpenedPage = false
  // Создаем новый объект XMLHttpRequest
  var xhr = new XMLHttpRequest();

  // Устанавливаем метод и URL для GET запроса
  xhr.open('GET', 'https://financialmodelingprep.com/api/v3/quote/BTCUSD?apikey=b061ed3fc4d3da162fcdddd7b53c33ce', true);

  // Устанавливаем обработчик события для загрузки данных
  xhr.onload = function() {
    if (xhr.status === 200) {
      // Парсим полученный JSON
      var data = JSON.parse(xhr.responseText);
      console.log(data[0])

      var result = data[0]['price']

      showUserResult(result);

      lastBtcPrice = data[0]['price']
      // Отображаем значение данных
      document.getElementById('output').innerHTML = result.toLocaleString('ru-RU');
      chosenButton.classList.remove('active')
      chosenButton = undefined
      btcPrices.push(result)
      userTries.push(userCountTries++)
    } else {
      // Если произошла ошибка, отображаем сообщение об ошибке
      document.getElementById('output').innerHTML = 'Ошибка: ' + xhr.status;
    }
  };

  // Отправляем GET запрос
  xhr.send();
}


function saveChoice(userChoice) {
  savedChoice = userChoice
}

function changeColor(button) {
  if (chosenButton != undefined) {
    chosenButton.classList.remove('active')
  }
  button.classList.add('active'); // Добавляем класс при нажатии
  chosenButton = button;
}

function showUserResult(updatedBtcPrice) {
  if (lastBtcPrice == undefined) {
    return;
  }
  var res;
  if (updatedBtcPrice > lastBtcPrice) {
    res = 1
  } else if (updatedBtcPrice < lastBtcPrice) {
    res = -1
  } else {
    res = 0
  }
  if (res == savedChoice) {
    if (savedChoice == 0) {
      userPoints += eqWin
    } else {
      userPoints += win
    }
    document.getElementById('result').innerHTML = "ТЫ УГАДАЛ, МОЛОДЕЦ!"
  } else {
    userPoints -= lose
    document.getElementById('result').innerHTML = "ТЫ ПРОИГРАЛ!"
  }
  document.getElementById('oldPrice').innerHTML = lastBtcPrice.toLocaleString('ru-RU')
  document.getElementById('newPrice').innerHTML = updatedBtcPrice.toLocaleString('ru-RU')
  showUserPoints()
}

function showUserPoints() {
  if (userPoints <= 0) {
    alert("YOU ARE BROKE! YOU FUCKING POOR!")
    window.location.reload();
  }
  document.getElementById('userPoints').innerHTML = userPoints.toLocaleString('ru-RU')
}

function scamMamont() {
  alert("Для вывода " + userPoints + "$ на свой счет пожалуйста напишите номер своей карты, а также все данные на оборотной стороне. Затем дождитесь смс кода на телефон и пришлите его.")
}


