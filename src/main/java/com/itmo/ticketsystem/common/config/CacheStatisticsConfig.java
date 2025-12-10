package com.itmo.ticketsystem.common.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "cache.statistics")
public class CacheStatisticsConfig {
    private boolean enabled = false;
    private boolean verbose = false;
}
