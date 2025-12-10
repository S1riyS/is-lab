package com.itmo.ticketsystem.common.aspect;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.hibernate.SessionFactory;
import org.hibernate.stat.Statistics;
import org.springframework.stereotype.Component;

import com.itmo.ticketsystem.common.config.CacheStatisticsConfig;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManagerFactory;

/**
 * AOP Aspect для логирования статистики L2 JPA Cache
 * Перехватывает вызовы методов сервисов и собирает статистику
 * об использовании кэша (hits, misses, puts)
 */
@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class CacheStatisticsAspect {

    private final CacheStatisticsConfig config;
    private final EntityManagerFactory entityManagerFactory;
    private Statistics statistics;

    @PostConstruct
    public void init() {
        try {
            SessionFactory sessionFactory = entityManagerFactory.unwrap(SessionFactory.class);
            this.statistics = sessionFactory.getStatistics();

            if (config.isEnabled()) {
                if (statistics == null || !statistics.isStatisticsEnabled()) {
                    log.warn("Cache statistics logging is enabled, but Hibernate statistics are disabled! " +
                            "Please set 'hibernate.generate_statistics=true' in application.yml");
                } else {
                    log.info("CacheStatisticsAspect initialized. Statistics enabled: {}",
                            statistics.isStatisticsEnabled());
                }
            }
        } catch (Exception e) {
            log.error("Failed to initialize CacheStatisticsAspect", e);
        }
    }

    @Around("execution(* com.itmo.ticketsystem..*Service.*(..))")
    public Object logCacheStatistics(ProceedingJoinPoint joinPoint) throws Throwable {

        // Если логирование выключено, просто выполняем метод
        if (!config.isEnabled()) {
            return joinPoint.proceed();
        }

        // Проверяем, что статистика доступна
        if (statistics == null || !statistics.isStatisticsEnabled()) {
            // Если статистика не включена, просто выполняем метод
            return joinPoint.proceed();
        }

        // Собираем статистику ДО выполнения метода
        long hitsBefore = statistics.getSecondLevelCacheHitCount();
        long missesBefore = statistics.getSecondLevelCacheMissCount();
        long putsBefore = statistics.getSecondLevelCachePutCount();
        long queryHitsBefore = statistics.getQueryCacheHitCount();
        long queryMissesBefore = statistics.getQueryCacheMissCount();

        // Выполняем метод
        long startTime = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long executionTime = System.currentTimeMillis() - startTime;

        // Собираем статистику ПОСЛЕ выполнения метода
        long hitsAfter = statistics.getSecondLevelCacheHitCount();
        long missesAfter = statistics.getSecondLevelCacheMissCount();
        long putsAfter = statistics.getSecondLevelCachePutCount();
        long queryHitsAfter = statistics.getQueryCacheHitCount();
        long queryMissesAfter = statistics.getQueryCacheMissCount();

        // Вычисляем разницу
        long hitsDelta = hitsAfter - hitsBefore;
        long missesDelta = missesAfter - missesBefore;
        long putsDelta = putsAfter - putsBefore;
        long queryHitsDelta = queryHitsAfter - queryHitsBefore;
        long queryMissesDelta = queryMissesAfter - queryMissesBefore;

        // Логируем, если были обращения к кэшу ИЛИ включен verbose режим
        boolean hasActivity = (hitsDelta > 0 || missesDelta > 0 || putsDelta > 0
                || queryHitsDelta > 0 || queryMissesDelta > 0);

        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        // Логируем всегда, если включен verbose, или если была активность
        if (hasActivity || config.isVerbose()) {
            // Формируем сообщение
            StringBuilder message = new StringBuilder();
            message.append("L2 Cache [").append(className).append(".").append(methodName).append("()]");

            // Entity cache статистика
            if (hitsDelta > 0 || missesDelta > 0 || putsDelta > 0) {
                message.append(" | Entity: Hits=+").append(hitsDelta)
                        .append(", Misses=+").append(missesDelta)
                        .append(", Puts=+").append(putsDelta);

                // Вычисляем hit rate для этого вызова
                long totalRequests = hitsDelta + missesDelta;
                if (totalRequests > 0) {
                    double hitRate = (double) hitsDelta / totalRequests * 100;
                    message.append(", HitRate=").append(String.format("%.1f%%", hitRate));
                }
            }

            // Query cache статистика
            if (queryHitsDelta > 0 || queryMissesDelta > 0) {
                message.append(" | Query: Hits=+").append(queryHitsDelta)
                        .append(", Misses=+").append(queryMissesDelta);

                long totalQueryRequests = queryHitsDelta + queryMissesDelta;
                if (totalQueryRequests > 0) {
                    double queryHitRate = (double) queryHitsDelta / totalQueryRequests * 100;
                    message.append(", HitRate=").append(String.format("%.1f%%", queryHitRate));
                }
            }

            // Добавляем время выполнения в verbose режиме
            if (config.isVerbose()) {
                message.append(" | Time=").append(executionTime).append("ms");
            }

            // Если была активность, логируем как INFO, иначе как DEBUG
            if (hasActivity) {
                log.info(message.toString());
            } else if (config.isVerbose()) {
                log.debug("{} | No cache activity", message.toString());
            }
        }

        return result;
    }

    /**
     * ТЕСТОВЫЙ pointcut для проверки работы AOP
     * Перехватывает ВСЕ методы в контроллерах
     */
    @Around("execution(* com.itmo.ticketsystem..controller..*.*(..))")
    public Object testAspect(ProceedingJoinPoint joinPoint) throws Throwable {
        log.warn("=== TEST ASPECT: {}.{}() ===",
                joinPoint.getTarget().getClass().getSimpleName(),
                joinPoint.getSignature().getName());
        return joinPoint.proceed();
    }
}
