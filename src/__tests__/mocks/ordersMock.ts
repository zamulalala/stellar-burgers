import { TOrder, TOrdersData } from '../../utils/types';

export const mockOrder: TOrder = {
  ingredients: [
    "643d69a5c3f7b9001cfa093d",
    "643d69a5c3f7b9001cfa0941",
    "643d69a5c3f7b9001cfa093d"
  ],
  _id: "66e4584f119d45001b506b77",
  status: "done",
  number: 52930,
  createdAt: "2024-09-13T15:20:47.460Z",
  updatedAt: "2024-09-13T15:20:48.108Z",
  name: "Флюоресцентный био-марсианский бургер"
};

export const mockOrders: TOrder[] = [
  mockOrder,
  {
    ...mockOrder,
    _id: "66e4584f119d45001b506b78",
    number: 52931,
    name: "Космический бургер",
    status: "pending"
  },
  {
    ...mockOrder,
    _id: "66e4584f119d45001b506b79",
    number: 52932,
    name: "Астероидный чизбургер",
    status: "created"
  }
];

export const mockOrdersResponse: TOrdersData = {
  orders: mockOrders,
  total: 100,
  totalToday: 10
};

// Экспорт отдельного заказа для использования в тестах
export const singleMockOrder: TOrder = mockOrder;

// Экспорт массива заказов для использования в тестах
export const multipleMockOrders: TOrder[] = mockOrders;
