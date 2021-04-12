package com.ggrec.vister.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class TransactionPatch {

    private TransactionEditInput input;
    private Map<String, Object> arguments;

}
