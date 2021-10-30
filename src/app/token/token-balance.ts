import {Injectable} from "@angular/core";
import {Token} from "./token-definition";

@Injectable()
export class TokenBalanceService {
  private readonly balances: Map<Token, BalanceSummary> = new Map<Token, BalanceSummary>([
    [Token.SQUID, balanceSummaryOf(21.02, 21.082)],
    [Token.GHC, balanceSummaryOf(5.25, 100526545.096)],
    [Token.TABOO, balanceSummaryOf(10.84, 930.484)],
    [Token.COCK, balanceSummaryOf(5.25, 455810527.889)],
    [Token.SHIBAZILLA, balanceSummaryOf(5.25, 15818950039070965.033)],
    [Token.BABYDOGEZILLA, balanceSummaryOf(5.25, 134093203035316501.109)],
    [Token.SQUIDGAMES, balanceSummaryOf(5.25, 5144.824)],
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
