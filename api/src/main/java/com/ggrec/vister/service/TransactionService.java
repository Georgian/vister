package com.ggrec.vister.service;

import com.ggrec.vister.entity.TransactionEntity;
import com.ggrec.vister.model.TransactionPatch;
import com.ggrec.vister.repository.TransactionRepository;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.Streams;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.MessageFormat;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.google.common.collect.ImmutableList.toImmutableList;
import static java.util.Optional.ofNullable;

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

    public List<TransactionEntity> updateTransactions(List<TransactionPatch> patches) {
        return patches.stream()
                .map(patch -> {
                    Map<String, Object> args = patch.getArguments();
                    Object idObj = args.get("id");

                    TransactionEntity entity = ofNullable(idObj)
                            .map(String::valueOf)
                            .map(Long::parseLong)
                            .map(id -> transactionRepository.findById(id)
                                    .orElseThrow(() -> new IllegalArgumentException(MessageFormat.format("Entity with ID {0} not found", idObj))))
                            .orElseGet(TransactionEntity::new);

                    patchTransactionEntity(args, entity);

                    if (entity.shouldBeDeleted())
                        transactionRepository.delete(entity);
                    else
                        entity = transactionRepository.save(entity);

                    return entity;
                })
                .collect(ImmutableList.toImmutableList());
    }

    private void patchTransactionEntity(Map<String, Object> args, TransactionEntity entity) {
        args.forEach((k, v) -> {
            String valueAsString = ofNullable(v).map(String::valueOf).orElse(null);
            switch(k) {
                case "id":
                    break;
                case "date":
                    entity.date(ofNullable(valueAsString).map(LocalDate::parse).orElse(null));
                    break;
                case "reference":
                    entity.reference(valueAsString);
                    break;
                case "category":
                    entity.category(valueAsString);
                    break;
                case "amount":
                    entity.amount(ofNullable(valueAsString).map(Float::parseFloat).orElse(null));
                    break;
                case "currency":
                    entity.currency(valueAsString);
                    break;
                case "account":
                    entity.account(valueAsString);
                    break;
                case "comment":
                    entity.comment(valueAsString);
                    break;
                default:
                    throw new IllegalArgumentException("Unknown arg " + k);
            }
        });
    }

}
