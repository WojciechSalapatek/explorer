import {Injectable} from "@angular/core";

@Injectable()
export class TokenDefinitionService {
  private readonly _definedTokens: Array<TokenDefinition> = [
    new TokenDefinition(Token.SQUID, 'SQUID', 'SQUID Token', '0x87230146E138d3F296a9a77e497A2A83012e9Bc5'),
    new TokenDefinition(Token.TABOO, 'TABOO', 'TABOO Token', '0x9abdba20edfba06b782126b4d8d72a5853918fd0', true),
    new TokenDefinition(Token.GHC, 'GHC', 'Galaxy Heroes Coin', '0x683fae4411249Ca05243dfb919c20920f3f5bfE0'),
    new TokenDefinition(Token.BABYDOGEZILLA, 'BABYDOGEZILLA', 'BABYDOGEZILLA', '0x0fbc08905c1d683cf7530bb2a70bb0bde231e5b9', true),
    new TokenDefinition(Token.SHIBAZILLA, 'SHIBAZILLA', 'ShibaZilla', '0x68810a6f5bb0491cb9ccf8c52735a1acf5f28009', true),
    new TokenDefinition(Token.COCK, 'COCK', 'ShibaCock', '0x9fdce4bafccfc9e9dac362be6bb5fb5d2aba3a58'),
    new TokenDefinition(Token.SQUIDGAMES, 'SQUIDGAMES', 'International Squid Games', '0x7c4f83697da7341e2e6766fede02f3b685343551'),
  ]

  public getTokenDefinition(name: Token): TokenDefinition {
    const def = this._definedTokens.find(d => d.name === name);
    if (!def) {
      throw Error(`Definition not found for ${name}`)
    }
    return def
  }

  get definedTokens(): Array<TokenDefinition> {
    return this._definedTokens;
  }
}

export class TokenDefinition {
  constructor(private _name: Token,
              private _symbol: string,
              private _fullName: string,
              private _contractAddress: string,
              private _reservesInverted: boolean = false) {
  }


  get name(): Token {
    return this._name;
  }

  get symbol(): string {
    return this._symbol;
  }

  get fullName(): string {
    return this._fullName;
  }

  get contractAddress(): string {
    return this._contractAddress;
  }

  get reservesInverted(): boolean {
    return this._reservesInverted;
  }
}

export enum Token {
  SQUID = 'SQUID',
  TABOO = 'TABOO',
  GHC = 'GHC',
  COCK = 'COCK',
  SHIBAZILLA = 'SHIBAZILLA',
  BABYDOGEZILLA = 'BABYDOGEZILLA',
  SQUIDGAMES = 'SQUIDGAMES',
}
