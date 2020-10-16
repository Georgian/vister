package com.ggrec.vister.resolver;

import com.ggrec.vister.service.StatementService;
import graphql.kickstart.tools.GraphQLMutationResolver;
import graphql.schema.DataFetchingEnvironment;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.Part;

@Component
@AllArgsConstructor(onConstructor_ = @Autowired)
public class StatementMutationResolver implements GraphQLMutationResolver {

    private StatementService statementService;

    public String uploadStatement(Part statement, DataFetchingEnvironment env) {
        // Part actualStatement = env.getArgument("statement");
        statementService.uploadStatement(statement);
        return "OK";
    }

}
