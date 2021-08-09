const Player = document.querySelector(`.player`)
const Dealer = document.querySelector(`.dealer`)
const MyTotalScreen = document.querySelector(`.myTotal`)
const HisTotalScreen = document.querySelector(`.hisTotal`)
const hitButton = document.querySelector(`.hit`)

myTotal = 0
dealerTotal = 0
dealerSecret = 0

let newDeck = async function () {
  let response = await axios.get(
    `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`
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
      hisItem.style.opacity = 0
      hisItem.innerHTML = `<img class="card" src=${cardsArr[card].image}>`
      Dealer.append(hisItem)
      if (cardsArr[card].value === 'ACE') {
        dealerSecret = dealerTotal + 11
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
  hitButton.addEventListener(`click`, async function () {
    let newCard = await axios.get(
      `https://deckofcardsapi.com/api/deck/${currentDeckID}/draw/?count=1`
    )
    let hitCard = newCard.data.cards
    const hitItem = document.createElement('div')
    hitItem.innerHTML = `<img class="card" src=${hitCard['0'].image}>`
    Player.append(hitItem)
    if (hitCard['0'].value === 'ACE') {
      myTotal += 11
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
  })
}
mainGame()
