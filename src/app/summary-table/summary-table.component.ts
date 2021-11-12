import {Component, OnDestroy, OnInit} from '@angular/core';
import {BalanceSummary, TokenBalanceService} from "../token/token-balance";
import {TokenApiService, TokenHoldingData} from "../service/token-api-service";
import {Token, TokenDefinitionService} from "../token/token-definition";
import {combineLatest, Observable, of, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {SmartContractService} from "../service/smartcontract/smart-contract-service";

@Component({
  selector: 'app-summary-table',
  templateUrl: './summary-table.component.html',
  styleUrls: ['./summary-table.component.css']
})
export class SummaryTableComponent implements OnInit, OnDestroy {

  TOKENS = Token

  data: Array<Observable<TokenSummary>> = [];
  plainData: Array<TokenSummary> = [];
  smartData: Array<TokenSummary> = [];
  smartDataObservables: Array<Observable<TokenSummary>> = [];
  subscriptions: Array<Subscription> = [];

  constructor(private tokenBalanceService: TokenBalanceService,
              private tokenApiService: TokenApiService,
              private smartContractService: SmartContractService,
              private tokenDefinitionService: TokenDefinitionService) {
  }

  ngOnInit(): void {
    this.data = Object.keys(this.TOKENS)
      .map(k => this.TOKENS[k as Token])
      .map(t => this.constructSummary(t))
    this.data.forEach(o => {
      const sub = o.subscribe(d => {
        this.plainData.push(d)
        this.plainData = this.plainData.sort((d1, d2) => d2.valueUSD - d1.valueUSD)
      })
      this.subscriptions.push(sub)
    })
    this.smartDataObservables = Object.keys(this.TOKENS)
      .map(k => this.TOKENS[k as Token])
      .map(t => this.constructSmartSummary(t))
    this.smartDataObservables.forEach((o, i) => {
      setTimeout(() => {
        const sub = o.subscribe(summary => this.smartData.push(summary))
        this.subscriptions.push(sub)
      }, i * 1200)
    })
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  constructSummary(token: Token): Observable<TokenSummary> {
    const balance = this.tokenBalanceService.getBalance(token)
    return this.tokenApiService.getTokenHoldingData(token)
      .pipe(map(data => this.summaryOf(token, balance, data)))
  }

  constructSmartSummary(token: Token): Observable<TokenSummary> {
    const balance = this.tokenBalanceService.getBalance(token)
    const tokenDef = this.tokenDefinitionService.getTokenDefinition(token)
    if (!tokenDef.contractAddress) {
      return of({} as TokenSummary)
    }
    return this.smartContractService.tokenToUSD(tokenDef)
      .pipe(map(price => this.summaryOf(token, balance, {
        price: price,
        symbol: tokenDef.symbol,
        name: tokenDef.name
      })))
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

  isProfit(v: number | undefined | null): boolean {
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

  calculateTotalSpending(): number {
    if (!this.plainData) return 0
    return this.plainData
        .map(s => s.totalSpendingPLN)
        .reduce((b1, b2) => b1 + b2, 0);
  }

  calculateTotalValue(): number {
    if (!this.plainData) return 0
    return this.plainData
        .map(s => s.valuePLN)
        .filter(v => v)
        .reduce((b1, b2) => b1 + b2, 0)
  }

  isLoading(): boolean {
    return this.plainData.length < this.data.length
  }

  isSmartDataLoading(): boolean {
    return this.smartData.length < this.smartDataObservables.length
  }

  calculateTotal(): number {
    return this.calculateTotalValue() - this.calculateTotalSpending();
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
