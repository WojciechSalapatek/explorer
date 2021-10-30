import {Component, OnInit} from '@angular/core';
import {BalanceSummary, TokenBalanceService} from "../token/token-balance";
import {TokenApiService, TokenHoldingData} from "../service/token-api-service";
import {Token} from "../token/token-definition";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-summary-table',
  templateUrl: './summary-table.component.html',
  styleUrls: ['./summary-table.component.css']
})
export class SummaryTableComponent implements OnInit {

  TOKENS = Token

  data: Array<Observable<TokenSummary>> = [];

  constructor(private tokenBalanceService: TokenBalanceService,
              private tokenApiService: TokenApiService) {
  }

  ngOnInit(): void {
    this.data = Object.keys(this.TOKENS)
      .map(k => this.TOKENS[k as Token])
      .map(t => this.constructSummary(t))
    console.log(this.data)
  }

  constructSummary(token: Token): Observable<TokenSummary> {
    const balance = this.tokenBalanceService.getBalance(token)
    return this.tokenApiService.getTokenHoldingData(token)
      .pipe(map(data => this.summaryOf(token, balance, data)))
  }

  summaryOf(token: Token, balanceSummary: BalanceSummary, data: TokenHoldingData): TokenSummary {
    return {
      symbol: token,
      balance: balanceSummary.balance,
      totalSpendingUSD: balanceSummary.totalSpendingUSD,
      totalSpendingPLN: this.toPLN(balanceSummary.totalSpendingUSD),
      currentPriceUSD: data.price,
      currentPricePLN: this.toPLN(data.price),
      valueUSD: balanceSummary.balance * data.price,
      valuePLN: this.toPLN(balanceSummary.balance * data.price),
      diffPLN: this.toPLN(balanceSummary.balance * data.price - balanceSummary.totalSpendingUSD),
      diffPercent: (balanceSummary.balance * data.price - balanceSummary.totalSpendingUSD) * 100 / balanceSummary.totalSpendingUSD
    }
  }

  toPLN(usd: number) {
    return 4 * usd;
  }

  isProfit(v: number | undefined): boolean {
    if (!v) {
      return false
    }
    return v > 0
  }

  format(v: number | undefined): string {
    if (!v) {
      return ''
    }
    return v?.toFixed(2)
  }
}

export interface TokenSummary {
  symbol: string,
  balance: number,
  totalSpendingUSD: number,
  totalSpendingPLN: number,
  currentPriceUSD: number,
  currentPricePLN: number,
  valueUSD: number,
  valuePLN: number,
  diffPLN: number,
  diffPercent: number,
}
