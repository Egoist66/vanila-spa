/**
 * Модуль для создания реактивного хранилища состояния
 * Позволяет подписываться на изменения конкретных свойств объекта
 */

/**
 * @template T
 * @callback SubscriberCallback
 * @param {T} value - Новое значение свойства
 * @returns {void}
 */

/**
 * @callback UnsubscribeFn
 * @returns {void}
 */

/**
 * @template T
 * @typedef {Object} ReactiveStore
 * @property {function(string, SubscriberCallback): UnsubscribeFn} subscribe - Подписаться на изменения свойства
 */

/**
 * Создает реактивное хранилище с возможностью подписки на изменения свойств
 *
 * @template {object} T - Тип состояния хранилища
 * @param {T} initialState - Начальное состояние хранилища
 * @returns {T & ReactiveStore<T>} Прокси-объект хранилища с добавленным методом subscribe
 *
 * @example
 * const store = createReactiveStore({
 *   user: { name: 'Анна', age: 25 },
 *   count: 0
 * });
 *
 * const unsubscribe = store.subscribe('user', (user) => {
 *   console.log('Пользователь обновлен:', user);
 * });
 *
 * store.user = { name: 'Иван', age: 30 }; // Вызовет колбэк
 * unsubscribe(); // Отписка
 * store.user = { name: 'Мария', age: 28 }; // Колбэк не вызовется
 */
export function createReactiveStore(initialState) {
  // Хранилище подписчиков: для каждого свойства хранится Set с колбэками
  const subscribers = new Map();

  /**
   * Обработчик прокси для перехвата операций чтения и записи
   */
  const handler = {
    /**
     * Перехватывает чтение свойств
     * @param {object} target - Исходный объект
     * @param {string|symbol} prop - Имя свойства
     * @returns {*} Значение свойства
     */
    get(target, prop) {
      return target[prop];
    },

    /**
     * Перехватывает запись свойств и уведомляет подписчиков
     * @param {object} target - Исходный объект
     * @param {string|symbol} prop - Имя свойства
     * @param {*} value - Новое значение
     * @returns {boolean} - Успешность операции
     */
    set(target, prop, value) {
      // Обновляем значение в исходном объекте
      target[prop] = value;

      // Уведомляем всех подписчиков этого свойства
      if (subscribers.has(prop)) {
        subscribers.get(prop).forEach((callback) => callback(value));
      }

      return true;
    },
  };

  // Создаем прокси для исходного состояния
  const store = new Proxy(initialState, handler);

  /**
   * Подписывается на изменения указанного свойства
   *
   * @param {string} prop - Имя свойства для отслеживания
   * @param {SubscriberCallback} callback - Функция, вызываемая при изменении свойства
   * @returns {UnsubscribeFn} Функция для отписки от изменений
   */
  store.subscribe = (prop, callback) => {
    // Создаем Set для свойства, если его еще нет
    if (!subscribers.has(prop)) {
      subscribers.set(prop, new Set());
    }

    // Добавляем колбэк в Set подписчиков
    subscribers.get(prop).add(callback);

    // Возвращаем функцию для отписки
    return () => {
      const propertySubscribers = subscribers.get(prop);
      if (propertySubscribers) {
        propertySubscribers.delete(callback);

        // Опционально: удаляем пустой Set для оптимизации памяти
        if (propertySubscribers.size === 0) {
          subscribers.delete(prop);
        }
      }
    };
  };

  return store;
}
