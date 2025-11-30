# Лабораторная работа №2

## Формат файла импорта

- Тип: `json`
- Формат файла: 
    ```json
    {
        "entityType": "ENTITY_TYPE",
        "data": [
            {
                "score": 100,
                "grade": "5A",
                "details": {...}
            },
            ...
        ]
    }
    ```

## Ограничения уникальности, проверяемые на программном уровне 

1. Location Name
2. Venue Name

## Конфликты при одновременной работе

### UPDATE
```text
Row was updated or deleted by another transaction (or unsaved-value mapping was incorrect)
```

Решение:
- Optimistic Lock
- Isolation level `REPEATABLE_READ`
- Reties

### CREATE with app-level constraints:
- Валидация при помощи `@Valid`
- Isolation level `SERIALIZABLE`