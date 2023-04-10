/// <reference types="cypress" />

describe('Pairs game', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/', {
      onBeforeLoad(win) {
        cy.stub(win, 'prompt').returns('4');
      },
    });
  });

  it('В начальном состоянии игра должна иметь поле четыре на четыре клетки, в каждой клетке цифра должна быть невидима.', () => {
    cy.get('.row-cols-4 .card')
      .should('have.length', 16)
      .each(($card) => {
        expectInvisible($card);
      });
  });

  it('Нажать на одну произвольную карточку. Убедиться, что она осталась открытой.', () => {
    const picked = Math.ceil(Math.random() * 15);
    cy.get(`.row-cols-4 :nth-child(${picked}) .card`)
      .click()
      .then(($card) => {
        expectVisible($card);
      });
  });

  it('Нажать на левую верхнюю карточку, затем на следующую. Если это не пара, то повторять со следующей карточкой, пока не будет найдена пара. Проверить, что найденная пара карточек осталась видимой.', () => {
    cy.get('.row-cols-4 .card')
      .then((cards) => {
        const $cards = Array.from(cards);
        const $firstCard = $cards[0];
        const firstNumber = $firstCard.textContent;
        let pairPos;

        for (let i = 1; i < $cards.length; i++) {
          cy.wrap($cards[i]).click();
          cy.wrap($firstCard).click();
          if ($cards[i].textContent === firstNumber) {
            pairPos = i;
            cy.wrap($cards[1]).click();
            cy.wrap($cards[2]).click();
            break;
          }
        }

        return cy.wrap($cards[pairPos]);
      })
      .then(($pairCard) => {
        expectVisible($pairCard);
      });

      cy.get('.row-cols-4 .card')
      .first()
      .then(($firstCard) => {
        expectVisible($firstCard);
      })
  });

  it('Нажать на левую верхнюю карточку, затем на следующую. Если это пара, то повторять со следующими двумя карточками, пока не найдутся непарные карточки. Проверить, что после нажатия на вторую карточку обе становятся невидимыми.', () => {
    cy.get('.row-cols-4 .card')
      .then((cards) => {
        const $cards = Array.from(cards);
        let firstCardPos;
        let secondCardPos;

        for (let i = 0; i < $cards.length - 1; i + 2) {
          const $firstCard = $cards[i];
          const $secondCard = $cards[i + 1];
          const firstNumber = $firstCard.textContent;
          const secondNumber = $secondCard.textContent;
          cy.wrap($firstCard).click();
          cy.wrap($secondCard).click();
          if (secondNumber !== firstNumber) {
            firstCardPos = i;
            secondCardPos = i + 1;
            cy.wrap(i < $cards.length - 2 ? $cards[i + 2] : $cards[0]).click();
            break;
          }
        }

        return cy.wrap([$cards[firstCardPos], $cards[secondCardPos]]);
      })
      .each(($card) => {
        expectInvisible($card);
      });
  });

  function expectInvisible($card) {
    const backgroundColor = $card.css('backgroundColor');
    const color = $card.css('color');
    expect(backgroundColor).to.equal(color);
  }

  function expectVisible($card) {
    const backgroundColor = $card.css('backgroundColor');
    const color = $card.css('color');
    expect(backgroundColor).to.not.equal(color);
  }
});
