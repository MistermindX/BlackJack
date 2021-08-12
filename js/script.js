const Player = document.querySelector(`.player`)
const Dealer = document.querySelector(`.dealer`)
const MyTotalScreen = document.querySelector(`.myTotal`)
const HisTotalScreen = document.querySelector(`.hisTotal`)
const hitButton = document.querySelector(`.hit`)
const standButton = document.querySelector(`.stand`)
const resetButton = document.querySelector(`.reset`)
const result = document.querySelector(`.result`)
const rulesButton = document.querySelector(`.rules`)

let myTotal = 0
let dealerTotal = 0
let dealerSecret = 0
let aces = 0
let myAcesOne = 0
let dealerAces = 0
let dealerAcesOne = 0
let gameOn = true

let newDeck = async function () {
  let response = await axios.get(
    `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6`
  )
  return response.data.deck_id
}

async function mainGame() {
  let currentDeckID = await newDeck()
  let newDeal = await axios.get(
    `https://deckofcardsapi.com/api/deck/${currentDeckID}/draw/?count=4`
  )
  const cardsArr = newDeal.data.cards
  for (let card = 0; card < cardsArr.length; card++) {
    const myItem = document.createElement('div')
    myItem.innerHTML = `<img class="card" src=${cardsArr[card].image}>`
    Player.append(myItem)
    if (cardsArr[card].value === 'ACE') {
      myTotal += 11
      aces += 1
      if (aces > 1) {
        myTotal -= 10
      }
      MyTotalScreen.innerHTML = `Total: ${myTotal}`
    } else if (
      cardsArr[card].value === 'KING' ||
      cardsArr[card].value === 'QUEEN' ||
      cardsArr[card].value === 'JACK'
    ) {
      myTotal += 10
      MyTotalScreen.innerHTML = `Total: ${myTotal}`
    } else {
      myTotal += parseInt(cardsArr[card].value)
      MyTotalScreen.innerHTML = `Total: ${myTotal}`
    }
    card++
    if (card === 1) {
      const hisItem = document.createElement('div')
      hisItem.innerHTML = `<img class="card" src=${cardsArr[card].image}>`
      Dealer.append(hisItem)
      if (cardsArr[card].value === 'ACE') {
        dealerTotal += 11
        HisTotalScreen.innerHTML = `Total: ${dealerTotal}`
      } else if (
        cardsArr[card].value === 'KING' ||
        cardsArr[card].value === 'QUEEN' ||
        cardsArr[card].value === 'JACK'
      ) {
        dealerTotal += 10
        HisTotalScreen.innerHTML = `Total: ${dealerTotal}`
      } else {
        dealerTotal += parseInt(cardsArr[card].value)
        HisTotalScreen.innerHTML = `Total: ${dealerTotal}`
      }
    } else {
      const hisItem = document.createElement('div')
      hisItem.classList.add('hidden')
      hisItem.style.opacity = 0
      hisItem.innerHTML = `<img class="card" src=${cardsArr[card].image}>`
      Dealer.append(hisItem)
      if (cardsArr[card].value === 'ACE') {
        dealerSecret = dealerTotal + 11
        dealerAces += 1
        if (dealerAces > 1) {
          dealerSecret -= 10
          dealerAcesOne += 1
        }
      } else if (
        cardsArr[card].value === 'KING' ||
        cardsArr[card].value === 'QUEEN' ||
        cardsArr[card].value === 'JACK'
      ) {
        dealerSecret = dealerTotal + 10
      } else {
        dealerSecret = dealerTotal + parseInt(cardsArr[card].value)
      }
    }
  }
  const downCard = document.querySelector(`.hidden`)
  if (myTotal === 21 && dealerSecret != 21) {
    HisTotalScreen.innerHTML = `Total: ${dealerSecret}`
    downCard.style.opacity = 1
    result.innerHTML = 'Blackjack! You Win!'
    gameOn = false
  } else if (dealerSecret === 21 && myTotal != 21) {
    HisTotalScreen.innerHTML = `Total: ${dealerSecret}`
    downCard.style.opacity = 1
    result.innerHTML = 'Dealer Blackjack! You Lose!'
    gameOn = false
  } else if (myTotal === 21 && dealerSecret === 21) {
    HisTotalScreen.innerHTML = `Total: ${dealerSecret}`
    downCard.style.opacity = 1
    result.innerHTML = 'Both Players Blackjack! Push!'
    gameOn = false
  }

  hitButton.addEventListener(`click`, async function () {
    let newCard = await axios.get(
      `https://deckofcardsapi.com/api/deck/${currentDeckID}/draw/?count=1`
    )
    let hitCard = newCard.data.cards
    if (gameOn) {
      const hitItem = document.createElement('div')
      hitItem.innerHTML = `<img class="card" src=${hitCard['0'].image}>`
      Player.append(hitItem)
      if (hitCard['0'].value === 'ACE') {
        myTotal += 11
        aces += 1
        if (aces > 1) {
          myTotal -= 10
          myAcesOne += 1
        }
        MyTotalScreen.innerHTML = `Total: ${myTotal}`
      } else if (
        hitCard['0'].value === 'KING' ||
        hitCard['0'].value === 'QUEEN' ||
        hitCard['0'].value === 'JACK'
      ) {
        myTotal += 10
        MyTotalScreen.innerHTML = `Total: ${myTotal}`
      } else {
        myTotal += parseInt(hitCard['0'].value)
        MyTotalScreen.innerHTML = `Total: ${myTotal}`
      }
      if (aces >= 1 && myTotal > 21 && aces > myAcesOne) {
        myTotal -= 10
        MyTotalScreen.innerHTML = `Total: ${myTotal}`
        myAcesOne += 1
      }

      if (myTotal > 21) {
        downCard.style.opacity = 1
        HisTotalScreen.innerHTML = `Total: ${dealerSecret}`
        gameOn = false
        result.innerHTML = 'You Bust! Dealer Wins!'
      }
    }
  })
  standButton.addEventListener('click', async function () {
    downCard.style.opacity = 1
    HisTotalScreen.innerHTML = `Total: ${dealerSecret}`
    if (gameOn) {
      while (dealerSecret < 17) {
        let newCard = await axios.get(
          `https://deckofcardsapi.com/api/deck/${currentDeckID}/draw/?count=1`
        )
        let hitCard = newCard.data.cards
        const hitItem = document.createElement('div')
        hitItem.innerHTML = `<img class="card" src=${hitCard['0'].image}>`
        Dealer.append(hitItem)
        if (hitCard[0].value === 'ACE') {
          dealerSecret = dealerSecret + 11
          dealerAces += 1
          if (dealerAces > 1) {
            dealerSecret -= 10
          }
          HisTotalScreen.innerHTML = `Total: ${dealerSecret}`
        } else if (
          hitCard[0].value === 'KING' ||
          hitCard[0].value === 'QUEEN' ||
          hitCard[0].value === 'JACK'
        ) {
          dealerSecret = dealerSecret + 10
          HisTotalScreen.innerHTML = `Total: ${dealerSecret}`
        } else {
          dealerSecret = dealerSecret + parseInt(hitCard[0].value)
          HisTotalScreen.innerHTML = `Total: ${dealerSecret}`
        }
        if (
          dealerAces >= 1 &&
          dealerSecret > 21 &&
          dealerAces > dealerAcesOne
        ) {
          dealerSecret -= 10
          HisTotalScreen.innerHTML = `Total: ${dealerSecret}`
          dealerAcesOne += 1
        }
      }
      if (myTotal > dealerSecret || dealerSecret > 21) {
        if (dealerSecret > 21) {
          result.innerHTML = 'Dealer Busts! You Win!'
        } else {
          result.innerHTML = 'You Win!'
        }
      } else if (dealerSecret > myTotal && dealerSecret <= 21) {
        result.innerHTML = 'You Lose!'
      } else {
        result.innerHTML = 'Push!'
      }
      gameOn = false
    }
  })
}
mainGame()

resetButton.addEventListener(`click`, function () {
  location.reload()
})

rulesButton.addEventListener('click', function () {
  window.location.href = 'rules.html'
})
