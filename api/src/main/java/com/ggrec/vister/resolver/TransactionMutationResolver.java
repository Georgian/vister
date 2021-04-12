package com.ggrec.vister.resolver;

import com.ggrec.vister.model.Transaction;
import com.ggrec.vister.model.TransactionEditInput;
import com.ggrec.vister.model.TransactionPatch;
import com.ggrec.vister.service.TransactionService;
import com.google.common.collect.ImmutableList;
import graphql.kickstart.tools.GraphQLMutationResolver;
import graphql.schema.DataFetchingEnvironment;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

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

    public List<Transaction> updateTransactions(List<TransactionEditInput> input, DataFetchingEnvironment env) {
        if (CollectionUtils.isEmpty(input))
            return ImmutableList.of();
        List<LinkedHashMap<String, Object>> objects = env.getArgument("objects");
        List<TransactionPatch> patches = IntStream.range(0, input.size())
                .mapToObj(idx -> new TransactionPatch(input.get(idx), objects.get(idx)))
                .collect(Collectors.toList());
        return transactionService.updateTransactions(patches).stream()
                .map(TransactionQueryResolver::entityToModel)
                .collect(ImmutableList.toImmutableList());
    }

}
