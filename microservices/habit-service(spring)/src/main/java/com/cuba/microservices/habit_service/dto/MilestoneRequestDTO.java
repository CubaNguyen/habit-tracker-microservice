package com.cuba.microservices.habit_service.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor      // ✅ tạo constructor trống cho Jackson
@AllArgsConstructor 
public class MilestoneRequestDTO {
    private String name;
    private BigDecimal targetAmount;
    private Integer orderIndex;

    // ✅ Constructor đồng bộ kiểu dữ liệu
    public MilestoneRequestDTO(String name, Integer orderIndex, BigDecimal targetAmount) {
        this.name = name;
        this.orderIndex = orderIndex;
        this.targetAmount = targetAmount;
    }
}
