package com.ggrec.vister.service;

import com.ggrec.vister.entity.TransactionEntity;
import com.ggrec.vister.repository.TransactionRepository;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.Streams;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.MessageFormat;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static com.google.common.collect.ImmutableList.toImmutableList;

@Service
@AllArgsConstructor(onConstructor_ = @Autowired)
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public List<TransactionEntity> getAll() {
        return Streams.stream(transactionRepository.findAll()).collect(toImmutableList());
    }

    public TransactionEntity addTransaction(LocalDate date) {
        TransactionEntity newTransactionEntity = new TransactionEntity();
        newTransactionEntity.date(date);
        return transactionRepository.save(newTransactionEntity);
    }

    public TransactionEntity updateTransaction(Long id, LocalDate date) {
        Optional<TransactionEntity> transactionEntityOptional = transactionRepository.findById(id);
        if (transactionEntityOptional.isPresent()) {
            TransactionEntity transactionEntity = transactionEntityOptional.get();
            transactionEntity.date(date);
            return transactionRepository.save(transactionEntity);
        }

        throw new IllegalArgumentException(MessageFormat.format("Transaction {0} not found.", id));
    }

}
