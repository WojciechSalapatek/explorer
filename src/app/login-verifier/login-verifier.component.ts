import { Component, OnInit } from '@angular/core';
const shajs = require('sha.js')

@Component({
  selector: 'app-login-verifier',
  templateUrl: './login-verifier.component.html',
  styleUrls: ['./login-verifier.component.css']
})
export class LoginVerifierComponent implements OnInit {

  readonly hash = 'f6746aa0c20c602dbfe5eb56e4419b8042046804237e6c302e6e2caf02258a4a'
  static readonly COOKIE_NAME = 'DEXP-ID'
  verified: boolean = false;
  inputPassword = '';

  constructor() { }

  verify(): void {
    const hashedInput = shajs('sha256').update(this.inputPassword).digest('hex');
    this.verified = this.verifyHash(hashedInput);
    if (this.verified) {
      let expDate = new Date()
      expDate.setFullYear(expDate.getFullYear()+1)
      document.cookie = `${LoginVerifierComponent.COOKIE_NAME}=${hashedInput}; expires=${expDate.toUTCString()};`;
    }
  }

  verifyHash(h: string):boolean {
    return h === this.hash;
  }

  ngOnInit(): void {
    this.verified = false;
    let idCookie = document.cookie.split(';')
      .map(a => a.trim())
      .find(a => a.startsWith(LoginVerifierComponent.COOKIE_NAME))
    if (idCookie) {
      const h = idCookie.replace(`${LoginVerifierComponent.COOKIE_NAME}=`, '')
      this.verified = this.verifyHash(h);
    }
  }

}
