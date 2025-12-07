package com.itmo.ticketsystem.system;

import lombok.RequiredArgsConstructor;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/system/connection-pool")
@RequiredArgsConstructor
public class ConnectionPoolController {

    private final DataSource dataSource;

    @GetMapping("/status")
    public Map<String, Object> getConnectionPoolStatus() {
        Map<String, Object> status = new HashMap<>();

        // Проверяем, что используется Apache Commons DBCP2
        if (dataSource instanceof BasicDataSource) {
            BasicDataSource dbcp2DataSource = (BasicDataSource) dataSource;

            status.put("type", "Apache Commons DBCP2");

            // Основные параметры пула
            status.put("paramMaxTotal", dbcp2DataSource.getMaxTotal());
            status.put("paramMaxIdle", dbcp2DataSource.getMaxIdle());
            status.put("paramMinIdle", dbcp2DataSource.getMinIdle());
            status.put("paramInitialSize", dbcp2DataSource.getInitialSize());

            // Текущее состояние
            status.put("currentNumActive", dbcp2DataSource.getNumActive());
            status.put("currentNumIdle", dbcp2DataSource.getNumIdle());

            // Статистика использования
            status.put("utilizationPercent", calculateUtilization(dbcp2DataSource));

        } else {
            status.put("type", dataSource.getClass().getName());
            status.put("message", "Not using Apache Commons DBCP2");
        }

        return status;
    }

    private double calculateUtilization(BasicDataSource dataSource) {
        int numActive = dataSource.getNumActive();
        int maxTotal = dataSource.getMaxTotal();

        if (maxTotal == 0) {
            return 0.0;
        }

        return Math.round((double) numActive / maxTotal * 10000.0) / 100.0;
    }
}
