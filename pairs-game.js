{
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  class Card {
    constructor(cardNumber, flip) {
      this.$element = this.createElement().$card;
      this.number = cardNumber;
      this.flip = flip;
      this.$element.addEventListener('click', () => {
        flip(this);
      });
    }

    createElement() {
      const $card = document.createElement('div');
      $card.classList.add('card', 'py-5', 'fs-5', 'text-center', 'text-secondary', 'bg-secondary', 'user-select-none');
      $card.textContent = this.number;

      return { $card };
    }

    set number(value) {
      this._number = value;
      this.$element.textContent = value;
    }

    get number() {
      return this._number;
    }

    set open(boolean) {
      this._open = boolean;
      this.$element.classList.toggle('bg-light', boolean);
      this.$element.classList.toggle('bg-secondary', !boolean);
    }

    get open() {
      return this._open;
    }

    set success(boolean) {
      this._success = boolean;
      this.$element.classList.toggle('bg-warning', boolean);
      this.$element.classList.toggle('bg-light', !boolean);
    }

    get success() {
      return this._success;
    }
  }

  class AmazingCard extends Card {
    createElement() {
      const $card = document.createElement('div');
      const $img = document.createElement('img');
      $card.classList.add('card', 'fs-5', 'text-center', 'text-secondary', 'bg-secondary', 'user-select-none');
      $card.append($img);
      $img.classList.add('card-img', 'invisible');
      $img.src = `./img/${this.number}.jpg`
      $img.alt = this.number;
      this.$img = $img;

      return { $card, $img };
    }

    set number(value) {
      this._number = value;
      this.$img.src = `/img/${value}.jpg`;
    }

    get number() {
      return this._number;
    }

    set open(boolean) {
      this._open = boolean;
      this.$img.classList.toggle('invisible', !boolean);
    }

    get open() {
      return this._open;
    }
  }

  function createPairsGame(cardsRow) {
    const numArr = [];
    const cardsArr = [];
    let guessCounter = 0;
    let foundPair = false;
    let openedCounter = 0;
    let firstCard;
    let secondCard;
    let playAgainButton = document.getElementById('play-again');

    let rowLength;
    let cardsQuantity;
    let uniqueCardsQuantity;
    rowLength = prompt('Введите число карточек в ряду (2, 4 или 6)');
    if ((rowLength % 2 != 0) || (rowLength < 2) || rowLength > 6) {
      alert('Некорректный ввод, число карточек в ряду сброшено на значение по умолчанию (4)')
      rowLength = 4;
    }
    cardsQuantity = rowLength ** 2;
    uniqueCardsQuantity = cardsQuantity / 2;

    cardsRow.classList.add(`row-cols-${rowLength}`);

    for (let i = 1; i <= uniqueCardsQuantity; i++) {
      numArr.push(i);
      numArr.push(i);
    }

    shuffle(numArr);

    for (const num of numArr) {
      const card = new Card(num, flip);
      const cardWrapper = document.createElement('div');
      cardWrapper.append(card.$element);
      cardsArr.push(card);
      cardsRow.append(cardWrapper);
    }

    playAgainButton.addEventListener('click', () => {
      shuffle(numArr);
      for (let i = 0; i < cardsQuantity; i++) {
        cardsArr[i].success = false;
        cardsArr[i].open = false;
        cardsArr[i].textContent = numArr[i];
      }
      firstCard = null;
      secondCard = null;
      foundPair = false;
      openedCounter = 0;
      playAgainButton.classList.add('visually-hidden');
    })

    function flip(card) {
      if (card.open || card.success) {
        return;
      }
      guessCounter++;
      card.open = true;
      switch (guessCounter) {
        case 1:
          if (firstCard && secondCard) {
            if (!foundPair) {
              firstCard.open = false;
              secondCard.open = false;
            } else {
              firstCard.success = true;
              secondCard.success = true;
              foundPair = false;
            }
          }
          firstCard = card;
          break;
        case 2:
          secondCard = card;
          if (firstCard.number == secondCard.number) {
            foundPair = true;
            openedCounter++;
          };
          if (openedCounter == uniqueCardsQuantity) {
            firstCard.success = true;
            secondCard.success = true;
            playAgainButton.classList.remove('visually-hidden');
          }
          guessCounter = 0;
          break;
      }
    }
  }

  window.createPairsGame = createPairsGame;
}
