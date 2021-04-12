package com.ggrec.vister.resolver;

import com.ggrec.vister.entity.TransactionEntity;
import com.ggrec.vister.model.Transaction;
import com.ggrec.vister.service.TransactionService;
import graphql.kickstart.tools.GraphQLQueryResolver;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@AllArgsConstructor(onConstructor_ = @Autowired)
public class TransactionQueryResolver implements GraphQLQueryResolver {

    private final TransactionService transactionService;

    public List<Transaction> transactions() {
        return transactionService.getAll().stream()
                .map(TransactionQueryResolver::entityToModel)
                .collect(Collectors.toList());
    }

    public static Transaction entityToModel(TransactionEntity transactionEntity) {
        return new Transaction()
                .id(transactionEntity.id())
                .date(transactionEntity.date())
                .reference(transactionEntity.reference())
                .category(transactionEntity.category())
                .amount(transactionEntity.amount())
                .currency(transactionEntity.currency())
                .account(transactionEntity.account())
                .comment(transactionEntity.comment());
    }

}
