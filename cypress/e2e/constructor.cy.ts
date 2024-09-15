import { SELECTORS } from '../support/selectors';

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    // Используем более общий путь для перехвата
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('/');

    // Проверяем, что приложение загрузилось
    cy.get('body').should('not.be.empty');

    // Увеличиваем время ожидания до 10 секунд
    cy.wait('@getIngredients', { timeout: 10000 });
  });

  it('должна загрузить ингредиенты', () => {
    cy.get(SELECTORS.BURGER_INGREDIENTS).should('exist');
    cy.get(SELECTORS.INGREDIENT).should('have.length.gt', 0);
  });

  it('должна добавить булку в конструктор', () => {
    cy.get(SELECTORS.INGREDIENT)
      .contains('Краторная булка N-200i')
      .parent()
      .find(SELECTORS.ADD_BUTTON)
      .click();
    cy.get(SELECTORS.BUN_TOP)
      .contains('Краторная булка N-200i (верх)')
      .should('exist');
    cy.get(SELECTORS.BUN_BOTTOM)
      .contains('Краторная булка N-200i (низ)')
      .should('exist');
  });

  it('должна добавить начинку в конструктор', () => {
    cy.get(SELECTORS.INGREDIENT)
      .contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find(SELECTORS.ADD_BUTTON)
      .click();
    cy.get(SELECTORS.CONSTRUCTOR_ELEMENTS)
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
  });

  it('должна обновить общую стоимость при добавлении ингредиентов', () => {
    cy.get(SELECTORS.INGREDIENT)
      .contains('Краторная булка N-200i')
      .parent()
      .find(SELECTORS.ADD_BUTTON)
      .click();
    cy.get(SELECTORS.INGREDIENT)
      .contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find(SELECTORS.ADD_BUTTON)
      .click();
    cy.get(SELECTORS.ORDER_TOTAL).should('not.have.text', '0');
  });

  describe('Модальные окна', () => {
    it('должна открыть модальное окно ингредиента', () => {
      cy.get(SELECTORS.INGREDIENT).first().click();
      cy.get(SELECTORS.MODAL).should('be.visible');
      cy.get(SELECTORS.INGREDIENT_DETAILS).should('exist');
    });

    it('должна закрыть модальное окно по клику на крестик', () => {
      cy.get(SELECTORS.INGREDIENT).first().click();
      cy.get(SELECTORS.MODAL).should('be.visible');
      cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
      cy.get(SELECTORS.MODAL).should('not.exist');
    });

    it('должна закрыть модальное окно по клику на оверлей', () => {
      cy.get(SELECTORS.INGREDIENT).first().click();
      cy.get(SELECTORS.MODAL).should('be.visible');
      cy.get(SELECTORS.MODAL_OVERLAY).click('topLeft', { force: true });
      cy.get(SELECTORS.MODAL).should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      // Устанавливаем токены
      window.localStorage.setItem('refreshToken', 'fake-refresh-token');
      cy.setCookie('accessToken', 'Bearer fake-access-token');

      // Перехватываем запросы
      cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
      cy.intercept('POST', '**/api/orders', { fixture: 'orders.json' }).as('createOrder');
      
      // Посещаем страницу
      cy.visit('/');

      // Ждем ответа от сервера и проверяем, что запрос успешен
      cy.wait('@getUser').its('response.statusCode').should('eq', 200);
    });

    afterEach(() => {
      // Очищаем localStorage и куки после каждого теста
      cy.clearLocalStorage();
      cy.clearCookies();
    });

    it('должен создать заказ и проверить его детали', () => {
      // Собираем бургер
      cy.get(SELECTORS.INGREDIENT).first().find(SELECTORS.ADD_BUTTON).click();
      cy.get(SELECTORS.INGREDIENT).eq(5).find(SELECTORS.ADD_BUTTON).click();
      cy.get(SELECTORS.INGREDIENT).last().find(SELECTORS.ADD_BUTTON).click();

      // Проверяем, что ингредиенты добавлены в конструктор
      cy.get(SELECTORS.CONSTRUCTOR_ELEMENTS)
        .children()
        .should('have.length.at.least', 1);
      cy.get(SELECTORS.BUN_TOP).should('exist');
      cy.get(SELECTORS.BUN_BOTTOM).should('exist');

      // Проверяем, что кнопка заказа активна
      cy.get(SELECTORS.ORDER_BUTTON).should('be.enabled');

      // Нажимаем кнопку "Оформить заказ"
      cy.get(SELECTORS.ORDER_BUTTON).click();

      // Проверяем, что модальное окно открылось и номер заказа верный
      cy.wait('@createOrder', { timeout: 10000 });
      cy.get(SELECTORS.ORDER_NUMBER)
        .should('be.visible')
        .and('have.text', '52930');

      // Добавляем небольшую задержку
      cy.wait(1000);

      // Пытаемся закрыть модальное окно разными способами
      cy.get('body').then(($body) => {
        if ($body.find(SELECTORS.MODAL_CLOSE).length > 0) {
          cy.get(SELECTORS.MODAL_CLOSE).click();
        } else if ($body.find('button:contains("Закрыть")').length > 0) {
          cy.get('button:contains("Закрыть")').click();
        } else if ($body.find('.close-icon').length > 0) {
          cy.get('.close-icon').click();
        } else {
          cy.get('body').click(0, 0);
          cy.get('body').type('{esc}');
        }
      });

      // Ждем немного, чтобы модальное окно успело закрыться
      cy.wait(1000);

      // Проверяем, что модальное окно закрылось
      cy.get(SELECTORS.ORDER_NUMBER).should('not.exist');

      // Проверяем, что конструктор содержит элементы после создания заказа
      cy.get(SELECTORS.CONSTRUCTOR_ELEMENTS)
        .children()
        .should('have.length.at.least', 1);

      // Проверяем, что в конструкторе есть сообщение "Выберите начинку" или "Выберите булки"
      cy.get(SELECTORS.CONSTRUCTOR_ELEMENTS)
        .children()
        .first()
        .should('contain.text', 'Выберите')
        .and('satisfy', ($el) => {
          const text = $el.text();
          return text.includes('начинку') || text.includes('булки');
        });

      // Проверяем, что булочки отсутствуют
      cy.get(SELECTORS.BUN_TOP).should('not.exist');
      cy.get(SELECTORS.BUN_BOTTOM).should('not.exist');
    });
  });
});
