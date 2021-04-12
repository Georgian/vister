package com.ggrec.vister.model;

import lombok.Data;
import lombok.experimental.Accessors;

import java.math.BigDecimal;

@Data
@Accessors(fluent = true)
public class PortfolioSummary {

    private BigDecimal totalRON;

}
