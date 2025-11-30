# Ответы на теоретические вопросы к Лабораторной работе №2

## 1. Понятие бизнес-логики в программных системах. Уровень бизнес-логики в многоуровневой архитектуре программных систем.

**Бизнес-логика** — это часть программной системы, которая реализует правила и алгоритмы, специфичные для конкретной предметной области. Она определяет, как данные могут быть созданы, отображены, сохранены и изменены, и включает в себя правила валидации, вычисления, бизнес-процессы и рабочие процессы.

### Основные характеристики бизнес-логики:

- **Независимость от представления**: бизнес-логика не должна зависеть от способа представления данных пользователю
- **Независимость от хранения**: бизнес-логика не должна зависеть от конкретного способа хранения данных
- **Переиспользуемость**: бизнес-правила могут быть использованы разными частями приложения

### Многоуровневая архитектура:

В классической **трехуровневой (three-tier) архитектуре**:

1. **Presentation Layer (Уровень представления)**
   - Отвечает за взаимодействие с пользователем
   - Отображение данных и получение ввода
   - REST API контроллеры, веб-интерфейсы, мобильные приложения

2. **Business Logic Layer (Уровень бизнес-логики)**
   - Реализует бизнес-правила и логику предметной области
   - Обработка данных, валидация, вычисления
   - Координация между слоями представления и данных
   - Сервисы (Services), обработчики транзакций

3. **Data Access Layer (Уровень доступа к данным)**
   - Работа с базой данных и внешними источниками данных
   - Repositories, DAO (Data Access Objects)
   - Маппинг между объектами и реляционными данными (ORM)

### Преимущества выделения уровня бизнес-логики:

- **Разделение ответственности (Separation of Concerns)**: каждый уровень решает свои задачи
- **Тестируемость**: бизнес-логику можно тестировать независимо от UI и БД
- **Масштабируемость**: уровни могут масштабироваться независимо
- **Поддерживаемость**: изменения в одном уровне минимально влияют на другие
- **Переиспользование**: одна и та же бизнес-логика может использоваться разными клиентами (веб, мобильные приложения, API)

---

## 2. Jakarta Enterprise Beans (EJB). Виды бинов и их назначение

**Jakarta Enterprise Beans (EJB)** — это серверная компонентная архитектура для модульной разработки бизнес-приложений на Java. EJB является частью спецификации Jakarta EE (ранее Java EE) и предоставляет стандартный способ реализации бизнес-логики на стороне сервера.

### Основные виды EJB бинов:

### 1. **Session Beans (Сессионные бины)**

Реализуют бизнес-логику и могут быть вызваны локально или удаленно. Подразделяются на:

#### a) **Stateless Session Beans (без состояния)**
- Не сохраняют состояние между вызовами
- Высокая производительность благодаря пулированию
- Используются для операций, не требующих сохранения контекста
- Пример: сервис вычислений, валидация данных
```java
@Stateless
public class CalculationService {
    public double calculate(double amount) {
        return amount * 1.2;
    }
}
```

#### b) **Stateful Session Beans (с состоянием)**
- Сохраняют состояние между вызовами для конкретного клиента
- Каждый клиент получает свой экземпляр бина
- Используются для операций с сеансом, например, корзина покупок
- Требуют больше ресурсов
```java
@Stateful
public class ShoppingCart {
    private List<Item> items = new ArrayList<>();
    
    public void addItem(Item item) {
        items.add(item);
    }
}
```

#### c) **Singleton Session Beans (одиночка)**
- Существует в единственном экземпляре на все приложение
- Состояние разделяется между всеми клиентами
- Используются для глобального состояния, кэширования, конфигурации
- Поддерживают конкурентный доступ
```java
@Singleton
public class ConfigurationService {
    private Map<String, String> config = new HashMap<>();
    
    @Lock(LockType.READ)
    public String getConfig(String key) {
        return config.get(key);
    }
}
```

### 2. **Message-Driven Beans (MDB)**

- Обрабатывают асинхронные сообщения из очередей или топиков (JMS)
- Не имеют состояния
- Не имеют интерфейса, доступного клиентам напрямую
- Используются для асинхронной обработки задач
```java
@MessageDriven(mappedName = "jms/OrderQueue")
public class OrderProcessor implements MessageListener {
    public void onMessage(Message message) {
        // Обработка сообщения
    }
}
```

### Основные возможности EJB:

- **Управление транзакциями**: автоматическое управление транзакциями
- **Безопасность**: декларативная безопасность через аннотации
- **Удаленный доступ**: вызов бинов через сеть
- **Пулирование**: контейнер управляет пулом экземпляров
- **Жизненный цикл**: контейнер управляет созданием, активацией, пассивацией и уничтожением бинов

---

## 3. EJB Session beans. Жизненный цикл.

Жизненный цикл Session Beans управляется EJB-контейнером и различается в зависимости от типа бина.

### 1. **Stateless Session Bean (без состояния)**

Жизненный цикл простой, всего два состояния:

**Состояния:**
- **Does Not Exist (не существует)**
- **Method-Ready Pool (готов к вызову методов)**

**Переходы:**
1. **Создание**: контейнер создает экземпляр и вызывает методы с аннотацией `@PostConstruct`
2. **Готовность**: бин находится в пуле и готов обрабатывать запросы клиентов
3. **Уничтожение**: контейнер вызывает методы с аннотацией `@PreDestroy` перед удалением экземпляра

```java
@Stateless
public class MyStatelessBean {
    
    @PostConstruct
    public void init() {
        // Инициализация (вызывается после создания)
    }
    
    public void businessMethod() {
        // Бизнес-логика
    }
    
    @PreDestroy
    public void cleanup() {
        // Очистка ресурсов (вызывается перед уничтожением)
    }
}
```

**Особенности:**
- Контейнер создает пул экземпляров
- После выполнения метода бин возвращается в пул
- Один экземпляр может обслуживать разных клиентов

### 2. **Stateful Session Bean (с состоянием)**

Более сложный жизненный цикл с тремя состояниями:

**Состояния:**
- **Does Not Exist (не существует)**
- **Ready (готов)**
- **Passive (пассивирован)**

**Переходы:**

1. **Создание** → **Ready**:
   - Клиент запрашивает бин
   - Контейнер создает экземпляр
   - Вызывается `@PostConstruct`

2. **Ready** → **Passive** (пассивация):
   - Если бин не используется, контейнер может его пассивировать
   - Состояние сериализуется и сохраняется
   - Вызывается `@PrePassivate`
   - Освобождаются ресурсы памяти

3. **Passive** → **Ready** (активация):
   - При обращении клиента к пассивированному бину
   - Состояние восстанавливается из хранилища
   - Вызывается `@PostActivate`

4. **Ready** → **Does Not Exist** (уничтожение):
   - Клиент завершает работу (вызов метода с `@Remove`)
   - Тайм-аут сессии
   - Вызывается `@PreDestroy`

```java
@Stateful
public class MyStatefulBean {
    
    @PostConstruct
    public void init() {
        // Инициализация после создания
    }
    
    @PrePassivate
    public void prepareForPassivation() {
        // Подготовка к пассивации (закрытие соединений и т.д.)
    }
    
    @PostActivate
    public void afterActivation() {
        // Восстановление после активации
    }
    
    @Remove
    public void finish() {
        // Явное завершение работы с бином
    }
    
    @PreDestroy
    public void cleanup() {
        // Очистка перед уничтожением
    }
}
```

### 3. **Singleton Session Bean (одиночка)**

Жизненный цикл похож на Stateless, но бин существует в единственном экземпляре:

**Состояния:**
- **Does Not Exist (не существует)**
- **Ready (готов)**

**Переходы:**
1. **Создание**: при старте приложения (по умолчанию) или при первом обращении
   - Можно настроить через `@Startup` для создания при старте
2. **Готовность**: бин доступен всему приложению
3. **Уничтожение**: при остановке приложения

```java
@Singleton
@Startup  // Создается при старте приложения
public class MySingletonBean {
    
    @PostConstruct
    public void init() {
        // Инициализация
    }
    
    @PreDestroy
    public void cleanup() {
        // Очистка
    }
    
    @Lock(LockType.READ)
    public String getData() {
        // Метод только для чтения
    }
}
```

**Управление конкурентным доступом:**
- `@Lock(LockType.READ)` — разрешает параллельное чтение
- `@Lock(LockType.WRITE)` — эксклюзивный доступ

---

## 4. Понятие транзакции. Транзакции в БД. ACID

**Транзакция** — это последовательность операций с данными, которая рассматривается как единое целое: либо выполняются все операции, либо ни одна.

### Основные операции транзакции:

1. **BEGIN/START TRANSACTION** — начало транзакции
2. **COMMIT** — успешное завершение, фиксация всех изменений
3. **ROLLBACK** — откат всех изменений в случае ошибки

### ACID — четыре ключевых свойства транзакций:

### **A — Atomicity (Атомарность)**

**Определение**: транзакция выполняется полностью или не выполняется вовсе (принцип "все или ничего").

**Пример**: при переводе денег между счетами должны выполниться обе операции:
```sql
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- Списание
UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- Зачисление
COMMIT;
```
Если произойдет ошибка на второй операции, первая также будет отменена.

**Реализация**: используется журнал транзакций (transaction log), который записывает все изменения. При откате изменения восстанавливаются из журнала.

### **C — Consistency (Согласованность)**

**Определение**: транзакция переводит базу данных из одного согласованного состояния в другое согласованное состояние, не нарушая ограничения целостности.

**Правила согласованности:**
- Ограничения целостности (constraints)
- Проверки (checks)
- Триггеры
- Каскадные операции

**Пример**: сумма балансов всех счетов должна оставаться неизменной после перевода.

```sql
-- До транзакции: account1 = 1000, account2 = 500, total = 1500
-- После транзакции: account1 = 900, account2 = 600, total = 1500
```

### **I — Isolation (Изолированность)**

**Определение**: параллельно выполняющиеся транзакции не должны влиять друг на друга. Результат параллельного выполнения транзакций должен быть таким же, как при их последовательном выполнении.

**Проблемы без изоляции:**
- **Dirty Read (грязное чтение)**: чтение незафиксированных данных
- **Non-repeatable Read (неповторяющееся чтение)**: разные результаты при повторном чтении
- **Phantom Read (фантомное чтение)**: появление новых строк при повторном запросе

**Реализация**: используются механизмы блокировок (locks) и версионирование (MVCC — Multiversion Concurrency Control).

### **D — Durability (Долговечность/Устойчивость)**

**Определение**: после успешного завершения транзакции (COMMIT) её результаты сохраняются постоянно, даже в случае сбоя системы.

**Реализация:**
- Запись в журнал транзакций на диск перед COMMIT
- Использование write-ahead logging (WAL)
- Репликация данных
- Резервное копирование

**Пример**: после подтверждения платежа система гарантирует, что информация о нём не будет потеряна даже при отключении электричества.

### Пример транзакции в SQL:

```sql
BEGIN TRANSACTION;

-- Проверка баланса
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;

-- Если баланса достаточно
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- Запись в журнал операций
INSERT INTO transactions (from_account, to_account, amount, date)
VALUES (1, 2, 100, NOW());

COMMIT;  -- Успешное завершение

-- или

ROLLBACK;  -- Откат в случае ошибки
```

### Значение ACID в современных системах:

- **Банковские системы**: критически важна точность финансовых операций
- **E-commerce**: консистентность инвентаря и заказов
- **Системы бронирования**: предотвращение двойного бронирования
- **Медицинские системы**: целостность данных пациентов

---

## 5. Виды конфликтов при многопользовательской работе с данными. Уровни изоляции транзакций.

### Виды конфликтов (проблем конкурентного доступа):

### 1. **Dirty Read (Грязное чтение)**

**Определение**: транзакция читает данные, которые были изменены другой транзакцией, но ещё не зафиксированы (не выполнен COMMIT).

**Пример:**
```
Время | Транзакция 1                | Транзакция 2
------|----------------------------|------------------
t1    | BEGIN                      |
t2    | UPDATE acc SET bal = 100   |
t3    |                            | BEGIN
t4    |                            | SELECT bal FROM acc
t5    |                            | (читает 100 - грязные данные)
t6    | ROLLBACK                   |
t7    |                            | (использует некорректные данные 100)
```

**Проблема**: транзакция 2 получила данные, которые затем были отменены.

### 2. **Non-Repeatable Read (Неповторяющееся чтение)**

**Определение**: при повторном чтении в рамках одной транзакции данные изменились из-за другой транзакции.

**Пример:**
```
Время | Транзакция 1                | Транзакция 2
------|----------------------------|------------------
t1    | BEGIN                      |
t2    | SELECT bal FROM acc (100)  |
t3    |                            | BEGIN
t4    |                            | UPDATE acc SET bal = 200
t5    |                            | COMMIT
t6    | SELECT bal FROM acc (200)  |
t7    | (разные значения!)         |
```

**Проблема**: одни и те же данные имеют разные значения при повторном чтении в одной транзакции.

### 3. **Phantom Read (Фантомное чтение)**

**Определение**: при повторном выполнении запроса появляются или исчезают строки, добавленные или удаленные другой транзакцией.

**Пример:**
```
Время | Транзакция 1                        | Транзакция 2
------|-------------------------------------|------------------
t1    | BEGIN                               |
t2    | SELECT COUNT(*) FROM orders         |
t3    | WHERE status='NEW' (результат: 5)   |
t4    |                                     | BEGIN
t5    |                                     | INSERT INTO orders (status='NEW')
t6    |                                     | COMMIT
t7    | SELECT COUNT(*) FROM orders         |
t8    | WHERE status='NEW' (результат: 6)   |
t9    | (появилась фантомная строка!)       |
```

**Проблема**: количество строк изменилось между двумя одинаковыми запросами.

### 4. **Lost Update (Потерянное обновление)**

**Определение**: результаты обновления одной транзакции перезаписываются другой транзакцией.

**Пример:**
```
Время | Транзакция 1                | Транзакция 2
------|----------------------------|------------------
t1    | BEGIN                      | BEGIN
t2    | SELECT bal FROM acc (100)  |
t3    |                            | SELECT bal FROM acc (100)
t4    | UPDATE acc SET bal = 150   |
t5    |                            | UPDATE acc SET bal = 120
t6    | COMMIT                     |
t7    |                            | COMMIT (перезаписывает 150→120)
```

**Проблема**: изменения транзакции 1 потеряны.

---

## Уровни изоляции транзакций (по стандарту SQL)

Уровни изоляции определяют степень защиты от конфликтов. Чем выше уровень изоляции, тем меньше конфликтов, но ниже производительность.

### 1. **READ UNCOMMITTED (Чтение незафиксированных данных)**

**Характеристики:**
- Самый низкий уровень изоляции
- Минимальные блокировки
- Максимальная производительность

**Возможные проблемы:**
- ✗ Dirty Read — **возможны**
- ✗ Non-Repeatable Read — **возможны**
- ✗ Phantom Read — **возможны**
- ✗ Lost Update — **возможны**

**Использование**: редко используется, только для приблизительных аналитических запросов, где точность не критична.

```java
@Transactional(isolation = Isolation.READ_UNCOMMITTED)
public void someMethod() { }
```

### 2. **READ COMMITTED (Чтение зафиксированных данных)**

**Характеристики:**
- Уровень по умолчанию во многих СУБД (PostgreSQL, Oracle, SQL Server)
- Транзакция видит только зафиксированные данные

**Возможные проблемы:**
- ✓ Dirty Read — **предотвращены**
- ✗ Non-Repeatable Read — **возможны**
- ✗ Phantom Read — **возможны**
- ✗ Lost Update — **возможны** (без дополнительных механизмов)

**Механизм**: чтение данных блокируется только на время выполнения SELECT, затем блокировка снимается.

```java
@Transactional(isolation = Isolation.READ_COMMITTED)
public void someMethod() { }
```

**Использование**: большинство веб-приложений с умеренными требованиями к консистентности.

### 3. **REPEATABLE READ (Повторяемое чтение)**

**Характеристики:**
- Гарантирует, что повторное чтение вернет те же данные
- Блокировки на чтение удерживаются до конца транзакции

**Возможные проблемы:**
- ✓ Dirty Read — **предотвращены**
- ✓ Non-Repeatable Read — **предотвращены**
- ✗ Phantom Read — **возможны** (в некоторых СУБД предотвращены)
- ✗ Lost Update — **предотвращены** при правильном использовании блокировок

**Механизм**: 
- В PostgreSQL использует MVCC (Multiversion Concurrency Control)
- В MySQL (InnoDB) также предотвращает phantom reads через MVCC

```java
@Transactional(isolation = Isolation.REPEATABLE_READ)
public void someMethod() { }
```

**Использование**: финансовые операции, отчеты, где важна консистентность данных в рамках транзакции.

### 4. **SERIALIZABLE (Сериализуемость)**

**Характеристики:**
- Максимальный уровень изоляции
- Транзакции выполняются так, как если бы они были строго последовательными
- Полная изоляция от других транзакций

**Возможные проблемы:**
- ✓ Dirty Read — **предотвращены**
- ✓ Non-Repeatable Read — **предотвращены**
- ✓ Phantom Read — **предотвращены**
- ✓ Lost Update — **предотвращены**

**Механизм**:
- Блокировки диапазонов (range locks)
- Проверка сериализуемости
- Возможны частые конфликты и откаты

```java
@Transactional(isolation = Isolation.SERIALIZABLE)
public void someMethod() { }
```

**Недостатки:**
- Низкая производительность
- Высокая вероятность deadlock (взаимоблокировок)
- Частые повторные попытки из-за конфликтов

**Использование**: критически важные операции (банковские транзакции, инвентаризация) где абсолютная точность важнее производительности.

---

## Таблица сравнения уровней изоляции:

| Уровень изоляции    | Dirty Read | Non-Repeatable Read | Phantom Read | Производительность |
|---------------------|------------|---------------------|--------------|--------------------|
| READ UNCOMMITTED    | Да         | Да                  | Да           | Максимальная       |
| READ COMMITTED      | Нет        | Да                  | Да           | Высокая            |
| REPEATABLE READ     | Нет        | Нет                 | Да*          | Средняя            |
| SERIALIZABLE        | Нет        | Нет                 | Нет          | Низкая             |

\* В PostgreSQL и MySQL (InnoDB) phantom reads также предотвращаются на уровне REPEATABLE READ.

---

## 6. Особенности реализации транзакций на уровне бизнес-логики, отличия от транзакций на уровне БД.

### Транзакции на уровне БД (Database Transactions)

**Характеристики:**
- Управляются непосредственно СУБД
- Работают с одной базой данных
- Используют native механизмы БД (locks, MVCC)
- Ограничены границами одного соединения с БД

**Пример:**
```sql
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

### Транзакции на уровне бизнес-логики (Application-Level Transactions)

**Характеристики:**
- Управляются приложением или middleware (JTA, Spring)
- Могут охватывать несколько ресурсов
- Более высокоуровневая абстракция
- Интеграция с бизнес-процессами

---

## Основные отличия:

### 1. **Область действия (Scope)**

**БД-уровень:**
- Ограничены одной базой данных
- Одно соединение

**Бизнес-уровень:**
- Могут охватывать несколько баз данных
- Могут включать другие ресурсы (JMS, файловые системы, внешние API)
- Распределенные транзакции (XA transactions)

```java
// Бизнес-уровень: одна транзакция для нескольких операций
@Transactional
public void processOrder(Order order) {
    // 1. Сохранение в основную БД
    orderRepository.save(order);
    
    // 2. Обновление инвентаря в другой БД
    inventoryService.decreaseStock(order.getItems());
    
    // 3. Отправка сообщения в очередь
    messageQueue.send(order);
    
    // 4. Вызов внешнего API
    paymentService.processPayment(order);
}
```

### 2. **Управление жизненным циклом**

**БД-уровень:**
- Явные команды BEGIN, COMMIT, ROLLBACK
- Программист полностью контролирует границы транзакции

```java
Connection conn = dataSource.getConnection();
try {
    conn.setAutoCommit(false);
    // операции
    conn.commit();
} catch (Exception e) {
    conn.rollback();
}
```

**Бизнес-уровень:**
- Декларативное управление (аннотации)
- Контейнер или фреймворк управляет жизненным циклом
- Автоматический rollback при исключениях

```java
@Transactional  // Транзакция управляется автоматически
public void createUser(User user) {
    userRepository.save(user);
    emailService.sendWelcomeEmail(user);
}
```

### 3. **Вложенные транзакции (Nested Transactions)**

**БД-уровень:**
- Ограниченная поддержка savepoints
- Не все СУБД поддерживают

```sql
BEGIN;
SAVEPOINT sp1;
-- операции
ROLLBACK TO sp1;  -- частичный откат
COMMIT;
```

**Бизнес-уровень:**
- Поддержка различных стратегий распространения (propagation)
- Возможность создания независимых транзакций

```java
@Transactional(propagation = Propagation.REQUIRED)
public void outerMethod() {
    // внешняя транзакция
    innerMethod();  // использует ту же транзакцию
}

@Transactional(propagation = Propagation.REQUIRES_NEW)
public void innerMethod() {
    // создает новую независимую транзакцию
}
```

### 4. **Интеграция с бизнес-логикой**

**БД-уровень:**
- Работает только с данными в БД
- Не знает о бизнес-правилах

**Бизнес-уровень:**
- Интеграция с валидацией
- Обработка бизнес-исключений
- Кастомная логика отката

```java
@Transactional(rollbackFor = BusinessException.class)
public void processPayment(Payment payment) {
    // Валидация на уровне бизнес-логики
    if (!paymentValidator.validate(payment)) {
        throw new BusinessException("Invalid payment");
    }
    
    paymentRepository.save(payment);
    
    // Бизнес-правило: если сумма большая, требуется подтверждение
    if (payment.getAmount() > 10000) {
        approvalService.requestApproval(payment);
    }
}
```

### 5. **Производительность и оптимизация**

**БД-уровень:**
- Более низкий overhead
- Прямой доступ к механизмам СУБД
- Меньше абстракций

**Бизнес-уровень:**
- Дополнительный overhead от фреймворка
- Возможность оптимизации через кэширование, batch операции
- Централизованное управление транзакциями

### 6. **Обработка ошибок**

**БД-уровень:**
- SQLException и подобные
- Необходимость явной обработки

```java
try {
    conn.commit();
} catch (SQLException e) {
    conn.rollback();
    throw new RuntimeException(e);
}
```

**Бизнес-уровень:**
- Автоматический rollback на непроверяемых исключениях
- Возможность настройки правил отката

```java
@Transactional(
    rollbackFor = {BusinessException.class},
    noRollbackFor = {IgnoredException.class}
)
public void businessMethod() {
    // При BusinessException будет rollback
    // При IgnoredException будет commit
}
```

### 7. **Распределенные транзакции (Distributed Transactions)**

**БД-уровень:**
- Не поддерживаются (в рамках одной БД)

**Бизнес-уровень:**
- Поддержка двухфазного коммита (2PC)
- JTA (Java Transaction API) для координации
- XA-совместимые ресурсы

```java
@Transactional  // Может координировать несколько ресурсов
public void transferData() {
    database1.update(...);  // Ресурс 1
    database2.update(...);  // Ресурс 2
    jmsQueue.send(...);     // Ресурс 3
    // Все зафиксируются или откатятся вместе
}
```

### 8. **Тестируемость**

**БД-уровень:**
- Требуется реальная БД для тестирования
- Сложнее изолировать

**Бизнес-уровень:**
- Можно использовать транзакционные аннотации в тестах
- Автоматический rollback после тестов

```java
@Test
@Transactional  // Откатывается после теста
public void testBusinessLogic() {
    service.createUser(user);
    // проверки
    // данные автоматически откатятся
}
```

---

## Когда использовать какой уровень:

**БД-уровень:**
- Простые операции с одной БД
- Необходима максимальная производительность
- Работа с legacy кодом без фреймворков

**Бизнес-уровень:**
- Современные enterprise приложения
- Необходима работа с несколькими ресурсами
- Сложная бизнес-логика
- Требуется декларативное управление
- Микросервисная архитектура

---

## 7. Java Transaction API (JTA). Основные принципы и программные интерфейсы.

**Java Transaction API (JTA)** — это спецификация Java для управления распределенными транзакциями. JTA позволяет приложениям работать с транзакциями, охватывающими несколько ресурсов (базы данных, очереди сообщений и т.д.).

### Основные компоненты JTA:

### 1. **Ключевые интерфейсы:**

#### **UserTransaction**
Интерфейс для программного управления транзакциями на уровне приложения.

```java
import javax.transaction.UserTransaction;

public class PaymentService {
    
    @Resource
    private UserTransaction userTransaction;
    
    public void processPayment(Payment payment) throws Exception {
        try {
            // Начало транзакции
            userTransaction.begin();
            
            // Бизнес-операции
            paymentRepository.save(payment);
            accountRepository.updateBalance(payment);
            
            // Фиксация транзакции
            userTransaction.commit();
            
        } catch (Exception e) {
            // Откат транзакции в случае ошибки
            userTransaction.rollback();
            throw e;
        }
    }
}
```

**Основные методы UserTransaction:**
- `begin()` — начать новую транзакцию
- `commit()` — зафиксировать транзакцию
- `rollback()` — откатить транзакцию
- `setRollbackOnly()` — пометить транзакцию только для отката
- `getStatus()` — получить статус текущей транзакции
- `setTransactionTimeout(int seconds)` — установить таймаут

#### **TransactionManager**
Низкоуровневый интерфейс для управления транзакциями. Используется контейнером, редко используется в прикладном коде.

```java
import javax.transaction.TransactionManager;
import javax.transaction.Transaction;

public class TransactionExample {
    
    @Resource
    private TransactionManager transactionManager;
    
    public void complexOperation() throws Exception {
        // Начало транзакции
        transactionManager.begin();
        
        // Получение текущей транзакции
        Transaction transaction = transactionManager.getTransaction();
        
        try {
            // Операции
            doSomething();
            
            // Фиксация
            transactionManager.commit();
        } catch (Exception e) {
            // Откат
            transactionManager.rollback();
            throw e;
        }
    }
}
```

**Основные методы TransactionManager:**
- `begin()` — начать транзакцию
- `commit()` — зафиксировать
- `rollback()` — откатить
- `suspend()` — приостановить текущую транзакцию
- `resume(Transaction tx)` — возобновить транзакцию
- `getTransaction()` — получить текущую транзакцию

#### **Transaction**
Представляет конкретную транзакцию.

```java
import javax.transaction.Transaction;

public void manageTransaction() throws Exception {
    Transaction transaction = transactionManager.getTransaction();
    
    // Проверка статуса
    int status = transaction.getStatus();
    
    // Регистрация синхронизации
    transaction.registerSynchronization(new Synchronization() {
        public void beforeCompletion() {
            // Действия перед завершением
        }
        
        public void afterCompletion(int status) {
            // Действия после завершения
        }
    });
    
    // Пометка для отката
    transaction.setRollbackOnly();
}
```

#### **XAResource**
Интерфейс для ресурсов, поддерживающих распределенные транзакции (2PC - two-phase commit).

```java
import javax.transaction.xa.XAResource;

// Используется для интеграции ресурсов в распределенные транзакции
// Обычно реализуется драйверами СУБД, JMS провайдерами и т.д.
```

### 2. **Статусы транзакций:**

```java
import javax.transaction.Status;

// Основные статусы:
Status.STATUS_ACTIVE       // Транзакция активна
Status.STATUS_COMMITTED    // Зафиксирована
Status.STATUS_ROLLEDBACK   // Откачена
Status.STATUS_NO_TRANSACTION // Нет активной транзакции
Status.STATUS_MARKED_ROLLBACK // Помечена для отката
Status.STATUS_PREPARING    // Подготовка к фиксации
Status.STATUS_PREPARED     // Подготовлена (2PC)
Status.STATUS_COMMITTING   // Процесс фиксации
Status.STATUS_ROLLING_BACK // Процесс отката
```

### 3. **Распределенные транзакции (XA)**

JTA поддерживает распределенные транзакции через протокол **two-phase commit (2PC)**:

#### **Фаза 1: Prepare (Подготовка)**
- Координатор транзакций спрашивает каждый ресурс: "Готов ли ты зафиксировать?"
- Каждый ресурс подготавливает изменения и отвечает "Да" или "Нет"

#### **Фаза 2: Commit (Фиксация)**
- Если все ответили "Да" — координатор отправляет команду COMMIT всем
- Если хотя бы один ответил "Нет" — координатор отправляет ROLLBACK всем

```java
// Пример распределенной транзакции
@Transactional
public void distributedTransaction() {
    // Операции с разными ресурсами в одной транзакции
    
    // 1. База данных 1
    dataSource1.getConnection().prepareStatement(...)
        .executeUpdate();
    
    // 2. База данных 2
    dataSource2.getConnection().prepareStatement(...)
        .executeUpdate();
    
    // 3. JMS очередь
    jmsTemplate.send(queue, message);
    
    // JTA координирует фиксацию всех ресурсов через 2PC
}
```

### 4. **Типы управления транзакциями в JTA:**

#### **Container-Managed Transactions (CMT)**
Контейнер управляет транзакциями автоматически.

```java
@Stateless
@TransactionManagement(TransactionManagementType.CONTAINER)
public class OrderService {
    
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void createOrder(Order order) {
        // Контейнер автоматически начинает и завершает транзакцию
        orderRepository.save(order);
    }
}
```

**Типы TransactionAttribute:**
- `REQUIRED` — использует существующую или создает новую
- `REQUIRES_NEW` — всегда создает новую транзакцию
- `MANDATORY` — требует существующую транзакцию
- `SUPPORTS` — использует существующую, если есть
- `NOT_SUPPORTED` — выполняется без транзакции
- `NEVER` — выбрасывает исключение, если транзакция существует

#### **Bean-Managed Transactions (BMT)**
Бин сам управляет транзакциями через UserTransaction.

```java
@Stateless
@TransactionManagement(TransactionManagementType.BEAN)
public class PaymentService {
    
    @Resource
    private UserTransaction userTransaction;
    
    public void processPayment(Payment payment) throws Exception {
        userTransaction.begin();
        try {
            // Бизнес-логика
            paymentRepository.save(payment);
            userTransaction.commit();
        } catch (Exception e) {
            userTransaction.rollback();
            throw e;
        }
    }
}
```

### 5. **Интеграция с ресурсами:**

```java
// Настройка XA DataSource
@Configuration
public class DataSourceConfig {
    
    @Bean
    public DataSource dataSource() {
        // XA-совместимый DataSource для распределенных транзакций
        AtomikosDataSourceBean dataSource = new AtomikosDataSourceBean();
        dataSource.setXaDataSourceClassName("org.postgresql.xa.PGXADataSource");
        dataSource.setUniqueResourceName("PostgresXADS");
        // ... другие настройки
        return dataSource;
    }
    
    @Bean
    public JtaTransactionManager transactionManager() {
        JtaTransactionManager tm = new JtaTransactionManager();
        // Настройка менеджера транзакций
        return tm;
    }
}
```

### 6. **Обработка исключений:**

```java
public void transactionWithExceptionHandling() {
    try {
        userTransaction.begin();
        
        // Операции
        doBusinessLogic();
        
        // Проверка статуса перед коммитом
        if (userTransaction.getStatus() == Status.STATUS_MARKED_ROLLBACK) {
            userTransaction.rollback();
        } else {
            userTransaction.commit();
        }
        
    } catch (RollbackException e) {
        // Транзакция была откачена
    } catch (HeuristicMixedException e) {
        // Некоторые ресурсы зафиксировались, другие откатились
    } catch (HeuristicRollbackException e) {
        // Все ресурсы откатились эвристически
    } catch (Exception e) {
        try {
            userTransaction.rollback();
        } catch (SystemException se) {
            // Ошибка при откате
        }
    }
}
```

### Преимущества JTA:

1. **Стандартизация**: единый API для разных контейнеров
2. **Распределенные транзакции**: поддержка нескольких ресурсов
3. **Декларативное управление**: через аннотации
4. **Интеграция**: с JPA, JMS, и другими Java EE технологиями

### Недостатки JTA:

1. **Сложность**: особенно распределенные транзакции
2. **Производительность**: overhead от 2PC
3. **Зависимость от контейнера**: требуется application server
4. **Отладка**: сложнее диагностировать проблемы

---

## 8. Реализация управления транзакциями в Jakarta EE. Декларативное и программное управление транзакциями.

Jakarta EE предоставляет два способа управления транзакциями: декларативное (через аннотации) и программное (через код).

---

## Декларативное управление транзакциями (Container-Managed Transactions - CMT)

### Основные аннотации:

### 1. **@TransactionManagement**
Определяет тип управления транзакциями для EJB.

```java
import javax.ejb.TransactionManagement;
import javax.ejb.TransactionManagementType;

@Stateless
@TransactionManagement(TransactionManagementType.CONTAINER)  // По умолчанию
public class OrderService {
    // Контейнер управляет транзакциями
}
```

### 2. **@TransactionAttribute**
Определяет поведение транзакции для метода или класса.

```java
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;

@Stateless
public class ProductService {
    
    // REQUIRED - использует существующую транзакцию или создает новую
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void createProduct(Product product) {
        entityManager.persist(product);
    }
    
    // REQUIRES_NEW - всегда создает новую транзакцию
    @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
    public void logAction(String action) {
        Log log = new Log(action);
        entityManager.persist(log);
        // Логируется независимо от основной транзакции
    }
    
    // MANDATORY - требует существующую транзакцию
    @TransactionAttribute(TransactionAttributeType.MANDATORY)
    public void updateProduct(Product product) {
        entityManager.merge(product);
        // Выбросит исключение, если вызвана вне транзакции
    }
    
    // SUPPORTS - использует транзакцию, если есть
    @TransactionAttribute(TransactionAttributeType.SUPPORTS)
    public Product findProduct(Long id) {
        return entityManager.find(Product.class, id);
    }
    
    // NOT_SUPPORTED - приостанавливает транзакцию
    @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
    public void generateReport() {
        // Выполняется вне транзакции
    }
    
    // NEVER - выбрасывает исключение при наличии транзакции
    @TransactionAttribute(TransactionAttributeType.NEVER)
    public void externalApiCall() {
        // Не должно выполняться в транзакции
    }
}
```

### Типы TransactionAttributeType:

| Тип            | Существующая транзакция | Нет транзакции        | Использование                      |
|----------------|-------------------------|-----------------------|------------------------------------|
| **REQUIRED**   | Использует              | Создает новую         | По умолчанию, большинство случаев  |
| **REQUIRES_NEW**| Приостанавливает, создает новую | Создает новую | Независимые операции (логирование) |
| **MANDATORY**  | Использует              | Исключение            | Вспомогательные методы             |
| **SUPPORTS**   | Использует              | Выполняется без транзакции | Операции чтения             |
| **NOT_SUPPORTED**| Приостанавливает      | Выполняется без транзакции | Долгие операции          |
| **NEVER**      | Исключение              | Выполняется без транзакции | Внешние API               |

### Пример сложного сценария:

```java
@Stateless
public class OrderProcessingService {
    
    @EJB
    private OrderService orderService;
    
    @EJB
    private InventoryService inventoryService;
    
    @EJB
    private AuditService auditService;
    
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void processOrder(Order order) {
        // Транзакция T1 начинается
        
        // Сохранение заказа (в той же транзакции T1)
        orderService.createOrder(order);
        
        // Обновление инвентаря (в той же транзакции T1)
        inventoryService.decreaseStock(order.getItems());
        
        // Логирование (в новой транзакции T2, независимо от T1)
        auditService.logOrderCreation(order);
        
        // Если здесь произойдет ошибка, T1 откатится,
        // но логирование T2 останется зафиксированным
    }
}

@Stateless
public class AuditService {
    
    @PersistenceContext
    private EntityManager em;
    
    @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
    public void logOrderCreation(Order order) {
        AuditLog log = new AuditLog(
            "Order created", 
            order.getId(), 
            new Date()
        );
        em.persist(log);
        // Эта транзакция фиксируется независимо
    }
}
```

### 3. **@Transactional (Jakarta EE 7+)**
CDI-альтернатива EJB транзакциям.

```java
import javax.transaction.Transactional;
import javax.transaction.Transactional.TxType;

@Transactional  // По умолчанию REQUIRED
public class UserService {
    
    @Inject
    private EntityManager em;
    
    public void createUser(User user) {
        em.persist(user);
    }
    
    @Transactional(TxType.REQUIRES_NEW)
    public void sendNotification(User user) {
        // Новая независимая транзакция
    }
    
    @Transactional(
        value = TxType.REQUIRED,
        rollbackOn = {BusinessException.class},
        dontRollbackOn = {OptimisticLockException.class}
    )
    public void updateUser(User user) {
        em.merge(user);
    }
}
```

---

## Программное управление транзакциями (Bean-Managed Transactions - BMT)

### 1. **Использование UserTransaction**

```java
import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.ejb.TransactionManagement;
import javax.ejb.TransactionManagementType;
import javax.transaction.UserTransaction;

@Stateless
@TransactionManagement(TransactionManagementType.BEAN)
public class PaymentService {
    
    @Resource
    private UserTransaction userTransaction;
    
    @PersistenceContext
    private EntityManager em;
    
    public void processPayment(Payment payment) {
        try {
            // Начало транзакции
            userTransaction.begin();
            
            // Бизнес-логика
            em.persist(payment);
            
            Account account = em.find(Account.class, payment.getAccountId());
            account.setBalance(account.getBalance() - payment.getAmount());
            em.merge(account);
            
            // Фиксация транзакции
            userTransaction.commit();
            
        } catch (Exception e) {
            // Откат в случае ошибки
            try {
                userTransaction.rollback();
            } catch (SystemException se) {
                throw new RuntimeException("Rollback failed", se);
            }
            throw new RuntimeException("Payment processing failed", e);
        }
    }
}
```

### 2. **Сложная обработка с несколькими транзакциями**

```java
@Stateless
@TransactionManagement(TransactionManagementType.BEAN)
public class OrderService {
    
    @Resource
    private UserTransaction userTransaction;
    
    @PersistenceContext
    private EntityManager em;
    
    public void processLargeOrder(Order order) throws Exception {
        // Транзакция 1: Валидация и создание заказа
        userTransaction.begin();
        try {
            if (!validateOrder(order)) {
                throw new ValidationException("Invalid order");
            }
            em.persist(order);
            userTransaction.commit();
        } catch (Exception e) {
            userTransaction.rollback();
            throw e;
        }
        
        // Транзакция 2: Обработка позиций (может быть долгой)
        for (OrderItem item : order.getItems()) {
            userTransaction.begin();
            try {
                processOrderItem(item);
                userTransaction.commit();
            } catch (Exception e) {
                userTransaction.rollback();
                // Логируем ошибку, но продолжаем обработку других позиций
                logError(item, e);
            }
        }
        
        // Транзакция 3: Финализация заказа
        userTransaction.begin();
        try {
            order.setStatus(OrderStatus.PROCESSED);
            em.merge(order);
            userTransaction.commit();
        } catch (Exception e) {
            userTransaction.rollback();
            throw e;
        }
    }
}
```

### 3. **Установка таймаута транзакции**

```java
@Stateless
@TransactionManagement(TransactionManagementType.BEAN)
public class ReportService {
    
    @Resource
    private UserTransaction userTransaction;
    
    public void generateComplexReport() throws Exception {
        // Установка таймаута в 300 секунд (5 минут)
        userTransaction.setTransactionTimeout(300);
        
        userTransaction.begin();
        try {
            // Долгая операция генерации отчета
            performComplexCalculations();
            userTransaction.commit();
        } catch (Exception e) {
            userTransaction.rollback();
            throw e;
        }
    }
}
```

### 4. **Проверка статуса транзакции**

```java
@Stateless
@TransactionManagement(TransactionManagementType.BEAN)
public class DataImportService {
    
    @Resource
    private UserTransaction userTransaction;
    
    @PersistenceContext
    private EntityManager em;
    
    public ImportResult importData(List<DataRecord> records) throws Exception {
        userTransaction.begin();
        
        int successCount = 0;
        int errorCount = 0;
        
        try {
            for (DataRecord record : records) {
                try {
                    em.persist(record);
                    successCount++;
                } catch (Exception e) {
                    errorCount++;
                    // Помечаем транзакцию для отката
                    userTransaction.setRollbackOnly();
                    break;
                }
            }
            
            // Проверка статуса перед коммитом
            if (userTransaction.getStatus() == Status.STATUS_MARKED_ROLLBACK) {
                userTransaction.rollback();
                return new ImportResult(successCount, errorCount, false);
            } else {
                userTransaction.commit();
                return new ImportResult(successCount, errorCount, true);
            }
            
        } catch (Exception e) {
            if (userTransaction.getStatus() == Status.STATUS_ACTIVE) {
                userTransaction.rollback();
            }
            throw e;
        }
    }
}
```

---

## Сравнение CMT и BMT:

| Аспект                | CMT (Декларативное)              | BMT (Программное)                |
|-----------------------|----------------------------------|----------------------------------|
| **Управление**        | Контейнер                        | Разработчик                      |
| **Код**               | Минимальный (аннотации)          | Явное управление                 |
| **Гибкость**          | Ограниченная                     | Максимальная                     |
| **Ошибки**            | Автоматический rollback          | Ручная обработка                 |
| **Сложность**         | Простое использование            | Требует аккуратности             |
| **Тестирование**      | Легче тестировать                | Сложнее тестировать              |
| **Производительность**| Оптимизировано контейнером       | Зависит от реализации            |
| **Использование**     | Типичные CRUD операции           | Сложные сценарии, batch обработка|

---

## Рекомендации по выбору:

**Используйте CMT (декларативное), когда:**
- Стандартные CRUD операции
- Простая бизнес-логика
- Нужна простота и читаемость кода
- Хотите меньше ошибок

**Используйте BMT (программное), когда:**
- Сложные транзакционные сценарии
- Необходим детальный контроль
- Несколько независимых транзакций в одном методе
- Долгие операции с разными таймаутами
- Условная фиксация/откат

---

## 9. Реализация управления транзакциями в Spring. Декларативное и программное управление транзакциями в Spring. Аннотация @Transactional.

Spring Framework предоставляет мощную и гибкую систему управления транзакциями, которая абстрагируется от конкретной технологии доступа к данным (JDBC, JPA, Hibernate).

---

## Декларативное управление транзакциями в Spring

### 1. **Аннотация @Transactional**

Основная аннотация для декларативного управления транзакциями.

```java
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional  // Простейшее использование
    public void createUser(User user) {
        userRepository.save(user);
    }
}
```

### 2. **Параметры @Transactional**

#### **a) Propagation (Распространение транзакции)**

Определяет, как транзакция распространяется между методами.

```java
import org.springframework.transaction.annotation.Propagation;

@Service
public class OrderService {
    
    @Autowired
    private AuditService auditService;
    
    // REQUIRED - использует существующую или создает новую (по умолчанию)
    @Transactional(propagation = Propagation.REQUIRED)
    public void createOrder(Order order) {
        orderRepository.save(order);
        auditService.log("Order created");  // В той же транзакции
    }
    
    // REQUIRES_NEW - всегда создает новую транзакцию
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAudit(String message) {
        auditRepository.save(new AuditLog(message));
        // Эта транзакция независима от вызывающей
    }
    
    // NESTED - создает вложенную транзакцию (savepoint)
    @Transactional(propagation = Propagation.NESTED)
    public void processOrderItem(OrderItem item) {
        itemRepository.save(item);
        // Может быть откачена независимо от родительской транзакции
    }
    
    // MANDATORY - требует существующую транзакцию
    @Transactional(propagation = Propagation.MANDATORY)
    public void updateInventory(Product product) {
        // Выбросит исключение, если вызвана вне транзакции
        inventoryRepository.update(product);
    }
    
    // SUPPORTS - выполняется в транзакции, если она есть
    @Transactional(propagation = Propagation.SUPPORTS)
    public Order findOrder(Long id) {
        return orderRepository.findById(id).orElse(null);
    }
    
    // NOT_SUPPORTED - приостанавливает текущую транзакцию
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public void sendEmail(String email) {
        // Выполняется вне транзакции
        emailService.send(email);
    }
    
    // NEVER - выбрасывает исключение, если транзакция существует
    @Transactional(propagation = Propagation.NEVER)
    public void callExternalApi() {
        // Не должно выполняться в транзакции
    }
}
```

**Типы Propagation:**

| Тип             | Описание                                    | Использование                 |
|-----------------|---------------------------------------------|-------------------------------|
| **REQUIRED**    | Использует существующую или создает новую   | По умолчанию                  |
| **REQUIRES_NEW**| Создает новую, приостанавливает текущую     | Независимое логирование       |
| **NESTED**      | Вложенная транзакция (savepoint)            | Частичный откат               |
| **MANDATORY**   | Требует существующую транзакцию             | Вспомогательные методы        |
| **SUPPORTS**    | Опционально использует транзакцию           | Операции чтения               |
| **NOT_SUPPORTED**| Выполняется вне транзакции                 | Отправка email, файлы         |
| **NEVER**       | Не допускает транзакцию                     | Внешние API                   |

#### **b) Isolation (Уровень изоляции)**

```java
import org.springframework.transaction.annotation.Isolation;

@Service
public class AccountService {
    
    // READ_UNCOMMITTED - минимальная изоляция
    @Transactional(isolation = Isolation.READ_UNCOMMITTED)
    public void approximateStats() {
        // Может читать незафиксированные данные
    }
    
    // READ_COMMITTED - по умолчанию в большинстве БД
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void standardOperation() {
        // Читает только зафиксированные данные
    }
    
    // REPEATABLE_READ - предотвращает non-repeatable reads
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public void generateReport() {
        // Повторное чтение дает те же результаты
    }
    
    // SERIALIZABLE - максимальная изоляция
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void criticalFinancialOperation() {
        // Полная изоляция, но низкая производительность
    }
}
```

#### **c) Timeout (Таймаут)**

```java
@Service
public class ReportService {
    
    // Таймаут в секундах
    @Transactional(timeout = 60)  // 60 секунд
    public void generateComplexReport() {
        // Если операция не завершится за 60 сек, будет откат
    }
}
```

#### **d) ReadOnly (Только чтение)**

```java
@Service
public class QueryService {
    
    @Transactional(readOnly = true)
    public List<Product> findAllProducts() {
        // Оптимизация: БД может не создавать write locks
        // Hibernate не делает dirty checking
        return productRepository.findAll();
    }
}
```

#### **e) Rollback правила**

```java
@Service
public class PaymentService {
    
    // Откатить при любом исключении (по умолчанию только unchecked)
    @Transactional(rollbackFor = Exception.class)
    public void processPayment(Payment payment) throws Exception {
        paymentRepository.save(payment);
    }
    
    // Не откатывать при определенных исключениях
    @Transactional(noRollbackFor = {
        NotFoundException.class,
        ValidationException.class
    })
    public void updateOrder(Order order) {
        orderRepository.save(order);
    }
    
    // Комбинированное использование
    @Transactional(
        rollbackFor = {IOException.class, SQLException.class},
        noRollbackFor = {NotFoundException.class}
    )
    public void complexOperation() {
        // Откат при IO/SQL ошибках,
        // но не при NotFoundException
    }
}
```

### 3. **Полный пример с множеством параметров**

```java
@Service
public class OrderProcessingService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private InventoryService inventoryService;
    
    @Autowired
    private NotificationService notificationService;
    
    @Transactional(
        propagation = Propagation.REQUIRED,
        isolation = Isolation.READ_COMMITTED,
        timeout = 30,
        readOnly = false,
        rollbackFor = {BusinessException.class, DataAccessException.class},
        noRollbackFor = {ValidationException.class}
    )
    public Order processOrder(OrderRequest request) throws BusinessException {
        // Валидация
        validateOrder(request);
        
        // Создание заказа
        Order order = new Order(request);
        orderRepository.save(order);
        
        // Обновление инвентаря (в той же транзакции)
        inventoryService.decreaseStock(order.getItems());
        
        // Отправка уведомления (в новой независимой транзакции)
        notificationService.sendOrderConfirmation(order);
        
        return order;
    }
}

@Service
public class NotificationService {
    
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void sendOrderConfirmation(Order order) {
        // Эта транзакция независима
        // Даже если основная транзакция откатится,
        // уведомление будет сохранено
        Notification notification = new Notification(order);
        notificationRepository.save(notification);
        emailService.send(notification);
    }
}
```

---

## Программное управление транзакциями в Spring

### 1. **TransactionTemplate**

Удобный способ программного управления транзакциями.

```java
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {
    
    @Autowired
    private TransactionTemplate transactionTemplate;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    public Payment processPayment(PaymentRequest request) {
        return transactionTemplate.execute(status -> {
            // Код внутри транзакции
            Payment payment = new Payment(request);
            paymentRepository.save(payment);
            
            if (!payment.isValid()) {
                // Пометить для отката
                status.setRollbackOnly();
                return null;
            }
            
            return payment;
        });
    }
}
```

### 2. **Настройка TransactionTemplate**

```java
@Configuration
public class TransactionConfig {
    
    @Autowired
    private PlatformTransactionManager transactionManager;
    
    @Bean
    public TransactionTemplate transactionTemplate() {
        TransactionTemplate template = new TransactionTemplate(transactionManager);
        
        // Настройка параметров
        template.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
        template.setIsolationLevel(TransactionDefinition.ISOLATION_READ_COMMITTED);
        template.setTimeout(30);
        template.setReadOnly(false);
        
        return template;
    }
}
```

### 3. **Использование с разными настройками**

```java
@Service
public class DataImportService {
    
    @Autowired
    private PlatformTransactionManager transactionManager;
    
    public ImportResult importData(List<DataRecord> records) {
        // Создание TransactionTemplate с кастомными настройками
        TransactionTemplate transactionTemplate = new TransactionTemplate(transactionManager);
        transactionTemplate.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);
        transactionTemplate.setTimeout(300);  // 5 минут
        
        return transactionTemplate.execute(status -> {
            int successCount = 0;
            
            for (DataRecord record : records) {
                try {
                    dataRepository.save(record);
                    successCount++;
                } catch (Exception e) {
                    // Откат транзакции
                    status.setRollbackOnly();
                    throw new RuntimeException("Import failed", e);
                }
            }
            
            return new ImportResult(successCount, records.size());
        });
    }
}
```

### 4. **PlatformTransactionManager (низкоуровневое API)**

```java
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

@Service
public class ComplexTransactionService {
    
    @Autowired
    private PlatformTransactionManager transactionManager;
    
    public void complexOperation() {
        // Определение параметров транзакции
        DefaultTransactionDefinition def = new DefaultTransactionDefinition();
        def.setName("ComplexTransaction");
        def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
        def.setIsolationLevel(TransactionDefinition.ISOLATION_REPEATABLE_READ);
        def.setTimeout(60);
        
        // Начало транзакции
        TransactionStatus status = transactionManager.getTransaction(def);
        
        try {
            // Бизнес-логика
            performOperations();
            
            // Фиксация транзакции
            transactionManager.commit(status);
            
        } catch (Exception e) {
            // Откат транзакции
            transactionManager.rollback(status);
            throw new RuntimeException("Operation failed", e);
        }
    }
}
```

### 5. **Множественные транзакции**

```java
@Service
public class BatchProcessingService {
    
    @Autowired
    private PlatformTransactionManager transactionManager;
    
    @Autowired
    private DataRepository dataRepository;
    
    public BatchResult processBatch(List<DataItem> items) {
        int successCount = 0;
        int errorCount = 0;
        
        // Обработка каждого элемента в отдельной транзакции
        for (DataItem item : items) {
            DefaultTransactionDefinition def = new DefaultTransactionDefinition();
            TransactionStatus status = transactionManager.getTransaction(def);
            
            try {
                dataRepository.save(item);
                transactionManager.commit(status);
                successCount++;
                
            } catch (Exception e) {
                transactionManager.rollback(status);
                errorCount++;
                // Продолжаем обработку следующих элементов
            }
        }
        
        return new BatchResult(successCount, errorCount);
    }
}
```

---

## Настройка Spring Transaction Management

### 1. **Конфигурация через Java Config**

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement  // Включение поддержки @Transactional
public class TransactionConfig {
    
    @Bean
    public PlatformTransactionManager transactionManager(
            EntityManagerFactory entityManagerFactory) {
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(entityManagerFactory);
        return transactionManager;
    }
}
```

### 2. **Конфигурация для множественных DataSource**

```java
@Configuration
@EnableTransactionManagement
public class MultiDataSourceConfig {
    
    @Primary
    @Bean(name = "primaryTransactionManager")
    public PlatformTransactionManager primaryTransactionManager(
            @Qualifier("primaryEntityManagerFactory") EntityManagerFactory emf) {
        return new JpaTransactionManager(emf);
    }
    
    @Bean(name = "secondaryTransactionManager")
    public PlatformTransactionManager secondaryTransactionManager(
            @Qualifier("secondaryEntityManagerFactory") EntityManagerFactory emf) {
        return new JpaTransactionManager(emf);
    }
}

@Service
public class MultiDbService {
    
    @Transactional("primaryTransactionManager")
    public void saveToPrimaryDb(Entity entity) {
        primaryRepository.save(entity);
    }
    
    @Transactional("secondaryTransactionManager")
    public void saveToSecondaryDb(Entity entity) {
        secondaryRepository.save(entity);
    }
}
```

---

## Особенности и подводные камни @Transactional

### 1. **Proxy и self-invocation проблема**

```java
@Service
public class UserService {
    
    // НЕ РАБОТАЕТ: вызов из того же класса обходит proxy
    public void publicMethod() {
        this.transactionalMethod();  // Транзакция НЕ начнется!
    }
    
    @Transactional
    public void transactionalMethod() {
        // Этот метод должен вызываться извне класса
    }
}

// РЕШЕНИЕ 1: Разделение на разные бины
@Service
public class UserService {
    @Autowired
    private UserTransactionalService transactionalService;
    
    public void publicMethod() {
        transactionalService.transactionalMethod();  // Работает!
    }
}

@Service
public class UserTransactionalService {
    @Transactional
    public void transactionalMethod() {
        // Транзакция работает
    }
}

// РЕШЕНИЕ 2: Self-injection
@Service
public class UserService {
    @Autowired
    private UserService self;  // Инжектим сами себя
    
    public void publicMethod() {
        self.transactionalMethod();  // Работает!
    }
    
    @Transactional
    public void transactionalMethod() {
        // Транзакция работает
    }
}
```

### 2. **Только public методы**

```java
@Service
public class ProductService {
    
    @Transactional  // Работает
    public void publicMethod() { }
    
    @Transactional  // НЕ РАБОТАЕТ!
    protected void protectedMethod() { }
    
    @Transactional  // НЕ РАБОТАЕТ!
    private void privateMethod() { }
}
```

### 3. **Rollback по умолчанию только для unchecked exceptions**

```java
@Service
public class OrderService {
    
    @Transactional
    public void createOrder() throws IOException {
        orderRepository.save(order);
        throw new IOException();  // НЕ откатит транзакцию!
    }
    
    @Transactional(rollbackFor = Exception.class)  // Правильно
    public void createOrderCorrect() throws IOException {
        orderRepository.save(order);
        throw new IOException();  // Откатит транзакцию
    }
}
```

---

## Лучшие практики:

1. **Используйте @Transactional на service layer**, не на repository или controller
2. **Делайте транзакции короткими** - не включайте медленные операции
3. **Используйте readOnly=true для операций чтения** - повышает производительность
4. **Явно указывайте rollbackFor для checked exceptions**
5. **Избегайте вызова @Transactional методов внутри того же класса**
6. **Используйте REQUIRES_NEW осторожно** - создает дополнительную нагрузку
7. **Тестируйте транзакционное поведение** - убедитесь что rollback работает правильно

---

## Заключение

Управление транзакциями в Spring предоставляет мощные возможности для обеспечения консистентности данных. Декларативный подход с `@Transactional` подходит для большинства случаев, в то время как программное управление через `TransactionTemplate` или `PlatformTransactionManager` даёт больше контроля для сложных сценариев.

