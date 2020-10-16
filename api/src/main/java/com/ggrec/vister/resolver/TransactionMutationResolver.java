package com.ggrec.vister.resolver;

import com.ggrec.vister.model.Transaction;
import com.ggrec.vister.service.TransactionService;
import graphql.kickstart.tools.GraphQLMutationResolver;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

import static com.ggrec.vister.resolver.TransactionQueryResolver.entityToModel;

@Component
@AllArgsConstructor(onConstructor_ = @Autowired)
public class TransactionMutationResolver implements GraphQLMutationResolver {

    private final TransactionService transactionService;

    public Transaction addTransaction(LocalDate date) {
        return entityToModel(transactionService.addTransaction(date));
    }

    public Transaction updateTransaction(String id, LocalDate date) {
        return entityToModel(transactionService.updateTransaction(Long.parseLong(id), date));
    }

}
