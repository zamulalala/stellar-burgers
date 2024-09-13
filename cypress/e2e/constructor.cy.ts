describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    // Используем более общий путь для перехвата
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('http://localhost:4000/');
    
    // Проверяем, что приложение загрузилось
    cy.get('body').should('not.be.empty');
    
    // Увеличиваем время ожидания до 10 секунд
    cy.wait('@getIngredients', { timeout: 10000 });
  });

  it('должна загрузить ингредиенты', () => {
    cy.get('[data-cy="burger-ingredients"]').should('exist');
    cy.get('[data-cy="ingredient"]').should('have.length.gt', 0);
  });

  it('должна добавить булку в конструктор', () => {
    cy.get('[data-cy="ingredient"]').contains('Краторная булка N-200i')
      .parent().find('button').contains('Добавить').click();
    cy.get('[data-cy="bun-top"]').contains('Краторная булка N-200i (верх)').should('exist');
    cy.get('[data-cy="bun-bottom"]').contains('Краторная булка N-200i (низ)').should('exist');
  });

  it('должна добавить начинку в конструктор', () => {
    cy.get('[data-cy="ingredient"]').contains('Биокотлета из марсианской Магнолии')
      .parent().find('button').contains('Добавить').click();
    cy.get('[data-cy="constructor-elements"]').contains('Биокотлета из марсианской Магнолии').should('exist');
  });

  it('должна обновить общую стоимость при добавлении ингредиентов', () => {
    cy.get('[data-cy="ingredient"]').contains('Краторная булка N-200i')
      .parent().find('button').contains('Добавить').click();
    cy.get('[data-cy="ingredient"]').contains('Биокотлета из марсианской Магнолии')
      .parent().find('button').contains('Добавить').click();
    cy.get('[data-cy="order-total"]').should('not.have.text', '0');
  });

  describe('Модальные окна', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
      cy.visit('http://localhost:4000/');
      cy.wait('@getIngredients', { timeout: 10000 });
    });

    it('должна открыть модальное окно ингредиента', () => {
      cy.get('[data-cy="ingredient"]').first().click();
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="ingredient-details"]').should('exist');
    });

    it('должна закрыть модальное окно по клику на крестик', () => {
      cy.get('[data-cy="ingredient"]').first().click();
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="modal-close-button"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('должна закрыть модальное окно по клику на оверлей', () => {
      cy.get('[data-cy="ingredient"]').first().click();
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="modal-overlay"]').click('topLeft', { force: true });
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });
  
  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
      cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
      cy.intercept('POST', '**/api/orders', { fixture: 'orders.json' }).as('createOrder');

      cy.visit('http://localhost:4000/');
      cy.wait('@getIngredients');

      // Подставляем моковые токены авторизации
      window.localStorage.setItem('refreshToken', 'fake-refresh-token');
      cy.setCookie('accessToken', 'fake-access-token');
    });

    it('должен создать заказ и проверить его детали', () => {
      // Собираем бургер
      cy.get('[data-cy="ingredient"]').first().find('button').contains('Добавить').click();
      cy.get('[data-cy="ingredient"]').eq(5).find('button').contains('Добавить').click();
      cy.get('[data-cy="ingredient"]').last().find('button').contains('Добавить').click();

      // Проверяем, что ингредиенты добавлены в конструктор
      cy.get('[data-cy="constructor-elements"]').children().should('have.length.at.least', 1);
      cy.get('[data-cy="bun-top"]').should('exist');
      cy.get('[data-cy="bun-bottom"]').should('exist');

      // Нажимаем кнопку "Оформить заказ"
      cy.get('[data-cy="order-button"]').click();

      // Проверяем, что модальное окно открылось и номер заказа верный
      cy.wait('@createOrder');
      cy.get('[data-cy="order-number"]').should('be.visible').and('have.text', '52930');

      // Добавляем небольшую задержку
      cy.wait(1000);

      // Пытаемся закрыть модальное окно разными способами
      cy.get('body').then($body => {
        if ($body.find('[data-cy="modal-close"]').length > 0) {
          cy.get('[data-cy="modal-close"]').click();
        } else if ($body.find('button:contains("Закрыть")').length > 0) {
          cy.get('button:contains("Закрыть")').click();
        } else if ($body.find('.close-icon').length > 0) {
          cy.get('.close-icon').click();
        } else {
          // Пробуем кликнуть вне модального окна
          cy.get('body').click(0, 0);
          // Если это не сработает, пробуем нажать клавишу Escape
          cy.get('body').type('{esc}');
        }
      });

      // Ждем немного, чтобы модальное окно успело закрыться
      cy.wait(1000);

      // Проверяем, что модальное окно закрылось
      cy.get('[data-cy="order-number"]').should('not.exist');

      // Проверяем, что конструктор содержит элементы после создания заказа
      cy.get('[data-cy="constructor-elements"]').children().should('have.length.at.least', 1);

      // Проверяем, что в конструкторе есть сообщение "Выберите начинку" или "Выберите булки"
      cy.get('[data-cy="constructor-elements"]').children().first()
        .should('contain.text', 'Выберите')
        .and('satisfy', ($el) => {
          const text = $el.text();
          return text.includes('начинку') || text.includes('булки');
        });

      // Проверяем, что булочки отсутствуют
      cy.get('[data-cy="bun-top"]').should('not.exist');
      cy.get('[data-cy="bun-bottom"]').should('not.exist');
    });
  });
});
