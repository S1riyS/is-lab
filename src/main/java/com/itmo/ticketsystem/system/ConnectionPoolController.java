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

        if (dataSource instanceof BasicDataSource) {
            BasicDataSource dbcp2DataSource = (BasicDataSource) dataSource;

            status.put("type", "Apache Commons DBCP2");

            // Pool params
            Map<String, Object> params = new HashMap<>();
            params.put("maxTotal", dbcp2DataSource.getMaxTotal());
            params.put("maxIdle", dbcp2DataSource.getMaxIdle());
            params.put("minIdle", dbcp2DataSource.getMinIdle());
            params.put("initialSize", dbcp2DataSource.getInitialSize());
            status.put("params", params);

            // Current state
            Map<String, Object> currentState = new HashMap<>();
            currentState.put("numActive", dbcp2DataSource.getNumActive());
            currentState.put("numIdle", dbcp2DataSource.getNumIdle());
            currentState.put("utilizationPercent", calculateUtilization(dbcp2DataSource));
            status.put("currentState", currentState);

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
