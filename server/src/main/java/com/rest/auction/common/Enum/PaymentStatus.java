package com.rest.auction.common.Enum;



public enum PaymentStatus {
    PAID("PAID"), UNPAID("UNPAID");

    private final String status;

    private PaymentStatus(String status) {
        this.status = status;
    }

    public String getType() {
        return status;
    }
}
