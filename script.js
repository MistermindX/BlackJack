const Player = document.querySelector(`.player`)
const Dealer = document.querySelector(`.dealer`)

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
    myItem.innerHTML = `<img src=${cardsArr[card].image}>`
    Player.append(myItem)
    card++
    const hisItem = document.createElement('div')
    hisItem.innerHTML = `<img src=${cardsArr[card].image}>`
    Dealer.append(hisItem)
  }
}
mainGame()
