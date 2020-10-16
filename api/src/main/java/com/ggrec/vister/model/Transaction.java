package com.ggrec.vister.model;

import lombok.Data;
import lombok.experimental.Accessors;

import java.time.LocalDate;

@Data
@Accessors(fluent = true)
public class Transaction {

    private long id;
    private LocalDate date;
    private String reference;
    private String category;
    private Float amount;
    private String currency;
    private String account;
    private String comment;

}
