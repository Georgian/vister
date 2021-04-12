package com.ggrec.vister.resolver;

import com.ggrec.vister.entity.TransactionEntity;
import com.ggrec.vister.model.PortfolioSummary;
import com.ggrec.vister.model.Transaction;
import com.ggrec.vister.service.TransactionService;
import graphql.kickstart.tools.GraphQLQueryResolver;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
@AllArgsConstructor(onConstructor_ = @Autowired)
public class PortfolioQueryResolver implements GraphQLQueryResolver {

    private static final BigDecimal RON_TO_EUR = BigDecimal.valueOf(4.88);

    private final TransactionService transactionService;

    public PortfolioSummary portfolioSummary() {
        PortfolioSummary summary = new PortfolioSummary();
        summary.totalRON(transactionService.getAll().stream()
                .map(transactionEntity -> {
                    String currency = transactionEntity.currency();
                    Float amount = transactionEntity.amount();
                    if (currency != null && amount != null) {
                        BigDecimal amountBD = BigDecimal.valueOf(amount);
                        switch (currency) {
                            case "RON":
                                return amountBD;
                            case "EUR":
                                return amountBD.multiply(RON_TO_EUR);
                        }
                    }
                    return BigDecimal.ZERO;
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        return summary;
    }

}
