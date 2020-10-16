package com.ggrec.vister.entity;

import lombok.Data;
import lombok.experimental.Accessors;
import org.hibernate.annotations.Generated;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.time.LocalDate;

@Data
@Accessors(fluent = true)
@Entity(name = "transaction")
public class TransactionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private LocalDate date;
    private String reference;
    private String category;
    private Float amount;
    private String currency;
    private String account;
    private String comment;

}
