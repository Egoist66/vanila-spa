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
 * @typedef {Object} ReactiveStoreOptions
 * @property {boolean} [deep=false] - Включить глубокую реактивность для вложенных объектов
 */

/**
 * Создает реактивное хранилище с возможностью подписки на изменения свойств
 *
 * @template {object} T - Тип состояния хранилища
 * @param {T} initialState - Начальное состояние хранилища
 * @param {ReactiveStoreOptions} [options={}] - Опции хранилища
 * @returns {T & ReactiveStore<T>} Прокси-объект хранилища с добавленным методом subscribe
 *
 * @example
 *  Поверхностная реактивность (по умолчанию)
 * const store = createReactiveStore({
 *   user: { name: 'Анна', age: 25 },
 *   count: 0
 * });
 *
 * store.subscribe('user', (user) => console.log('user изменен:', user));
 * store.user = { name: 'Иван', age: 30 }; // Вызовет колбэк
 * store.user.name = 'Мария'; // НЕ вызовет колбэк (поверхностная реактивность)
 *
 * @example
 *  Глубокая реактивность
 * const deepStore = createReactiveStore({
 *   user: { name: 'Анна', age: 25 },
 *   count: 0
 * }, { deep: true });
 *
 * deepStore.subscribe('user', (user) => console.log('user изменен:', user));
 * deepStore.user.name = 'Иван'; // Вызовет колбэк (глубокая реактивность)
 * deepStore.user.age = 30; // Тоже вызовет колбэк
 */
export function reactive(initialState, options = {}) {
  const { deep = false } = options;

  const subscribers = new Map();
  const proxyCache = new WeakMap();

  /**
   * Уведомляет подписчиков указанного свойства
   * @param {string} prop - Имя свойства верхнего уровня
   * @param {*} value - Текущее значение свойства
   */
  function notifySubscribers(prop, value) {
    if (subscribers.has(prop)) {
      subscribers.get(prop).forEach((callback) => callback(value));
    }
  }

  /**
   * Создает глубокий реактивный прокси для вложенного объекта
   * @param {object} obj - Объект для оборачивания
   * @param {string} rootProp - Имя свойства верхнего уровня для уведомлений
   * @returns {Proxy} Реактивный прокси
   */
  function createDeepProxy(obj, rootProp) {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }

    if (proxyCache.has(obj)) {
      return proxyCache.get(obj);
    }

    const proxy = new Proxy(obj, {
      get(target, prop) {
        const value = target[prop];
        if (deep && value !== null && typeof value === "object") {
          return createDeepProxy(value, rootProp);
        }
        return value;
      },

      set(target, prop, value) {
        target[prop] = value;
        notifySubscribers(rootProp, initialState[rootProp]);
        return true;
      },
    });

    proxyCache.set(obj, proxy);
    return proxy;
  }

  const handler = {
    get(target, prop) {
      if (prop === "subscribe") {
        return target[prop];
      }

      const value = target[prop];

      if (deep && value !== null && typeof value === "object") {
        return createDeepProxy(value, prop);
      }

      return value;
    },

    set(target, prop, value) {
      if (prop === "subscribe") {
        target[prop] = value;
        return true;
      }

      target[prop] = value;
      notifySubscribers(prop, value);
      return true;
    },
  };

  const store = new Proxy(initialState, handler);

  /**
   * Подписывается на изменения указанного свойства
   *
   * @param {string} prop - Имя свойства для отслеживания
   * @param {SubscriberCallback} callback - Функция, вызываемая при изменении свойства
   * @returns {UnsubscribeFn} Функция для отписки от изменений
   */
  store.subscribe = (prop, callback) => {
    if (!subscribers.has(prop)) {
      subscribers.set(prop, new Set());
    }

    subscribers.get(prop).add(callback);

    return () => {
      const propertySubscribers = subscribers.get(prop);
      if (propertySubscribers) {
        propertySubscribers.delete(callback);

        if (propertySubscribers.size === 0) {
          subscribers.delete(prop);
        }
      }
    };
  };

  return store;
}
