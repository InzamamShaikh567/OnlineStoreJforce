package com.onlinestsore.storebackend.dto;

import com.onlinestsore.storebackend.entity.OrderStatus;
import lombok.Data;

@Data
public class StatusUpdateRequest {
    private OrderStatus status;
}
