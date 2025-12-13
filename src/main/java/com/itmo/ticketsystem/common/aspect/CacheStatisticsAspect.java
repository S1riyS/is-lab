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
                    log.warn("Cache statistics logging is enabled, but Hibernate statistics are disabled!");
                } else {
                    log.info("CacheStatisticsAspect initialized. Statistics enabled: {}",
                            statistics.isStatisticsEnabled());
                }
            }
        } catch (Exception e) {
            log.error("Failed to initialize CacheStatisticsAspect", e);
        }
    }

    // All methods in all services
    @Around("execution(* com.itmo.ticketsystem..*Service.*(..))")
    public Object logCacheStatistics(ProceedingJoinPoint joinPoint) throws Throwable {

        if (!config.isEnabled()) {
            return joinPoint.proceed();
        }

        if (statistics == null || !statistics.isStatisticsEnabled()) {
            return joinPoint.proceed();
        }

        // Stats before
        long hitsBefore = statistics.getSecondLevelCacheHitCount();
        long missesBefore = statistics.getSecondLevelCacheMissCount();
        long putsBefore = statistics.getSecondLevelCachePutCount();
        long queryHitsBefore = statistics.getQueryCacheHitCount();
        long queryMissesBefore = statistics.getQueryCacheMissCount();

        // Execute
        Object result = joinPoint.proceed();

        // Stats after
        long hitsAfter = statistics.getSecondLevelCacheHitCount();
        long missesAfter = statistics.getSecondLevelCacheMissCount();
        long putsAfter = statistics.getSecondLevelCachePutCount();
        long queryHitsAfter = statistics.getQueryCacheHitCount();
        long queryMissesAfter = statistics.getQueryCacheMissCount();

        // Delta
        long hitsDelta = hitsAfter - hitsBefore;
        long missesDelta = missesAfter - missesBefore;
        long putsDelta = putsAfter - putsBefore;
        long queryHitsDelta = queryHitsAfter - queryHitsBefore;
        long queryMissesDelta = queryMissesAfter - queryMissesBefore;

        boolean hasActivity = (hitsDelta > 0 || missesDelta > 0 || putsDelta > 0 || queryHitsDelta > 0
                || queryMissesDelta > 0);

        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        if (hasActivity || config.isVerbose()) {
            StringBuilder message = new StringBuilder();
            message.append("L2 Cache [").append(className).append(".").append(methodName).append("()]");

            if (hitsDelta > 0 || missesDelta > 0 || putsDelta > 0) {
                message
                        .append(" | Entity: Hits=+").append(hitsDelta)
                        .append(", Misses=+").append(missesDelta)
                        .append(", Puts=+").append(putsDelta);

                long totalRequests = hitsDelta + missesDelta;
                if (totalRequests > 0) {
                    double hitRate = (double) hitsDelta / totalRequests * 100;
                    message.append(", HitRate=").append(String.format("%.1f%%", hitRate));
                }
            }

            if (queryHitsDelta > 0 || queryMissesDelta > 0) {
                message.append(" | Query: Hits=+").append(queryHitsDelta)
                        .append(", Misses=+").append(queryMissesDelta);

                long totalQueryRequests = queryHitsDelta + queryMissesDelta;
                if (totalQueryRequests > 0) {
                    double queryHitRate = (double) queryHitsDelta / totalQueryRequests * 100;
                    message.append(", HitRate=").append(String.format("%.1f%%", queryHitRate));
                }
            }

            if (hasActivity) {
                log.info(message.toString());
            } else if (config.isVerbose()) {
                log.debug("{} | No cache activity", message.toString());
            }
        }

        return result;
    }
}
