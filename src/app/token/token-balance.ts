import {Injectable} from "@angular/core";
import {Token} from "./token-definition";

@Injectable()
export class TokenBalanceService {
  private readonly balances: Map<Token, BalanceSummary> = new Map<Token, BalanceSummary>([
    [Token.SQUID, balanceSummaryOf(10.84, 21.082)],
    [Token.GHC, balanceSummaryOf(5.25, 100526545.096)],
    [Token.TABOO, balanceSummaryOf(10.84, 930.484)],
    [Token.COCK, balanceSummaryOf(5.25, 455810527.889)],
    [Token.ONE, balanceSummaryOf(11.17, 38.084)],
    [Token.SANTA, balanceSummaryOf(27.91, 178035754)],
    // [Token.SHIBAZILLA, balanceSummaryOf(5.25, 15818950039070965.033)],
    // [Token.BABYDOGEZILLA, balanceSummaryOf(5.25, 134093203035316501.109)],
    [Token.SQUIDGAMES, balanceSummaryOf(5.25, 5144.824)],
    [Token.SOL, balanceSummaryOf(55.7, 0.24)],
    [Token.XRP, balanceSummaryOf(27.49, 23)],
    [Token.ADA, balanceSummaryOf(51.88, 25.1)],
    [Token.HBAR, balanceSummaryOf(40.6, 89)]
  ])

  public getBalances() {
    return this.balances
  }

  public getBalance(token: Token): BalanceSummary {
    if (!this.balances.get(token)) {
      return balanceSummaryOf(0, 0)
    }
    return <BalanceSummary>this.balances.get(token)
  }
}

export interface BalanceSummary {
  totalSpendingUSD: number,
  balance: number,
}

export function balanceSummaryOf(totalSpendingUSD: number, balance: number): BalanceSummary {
  return {
    totalSpendingUSD: totalSpendingUSD,
    balance: balance
  } as BalanceSummary
}
