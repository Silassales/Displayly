import {Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nameValidator = new FormControl('', [Validators.required]);
  emailValidator = new FormControl('', [Validators.required, Validators.email]);
  passwordValidator = new FormControl('', [Validators.required]);
  questionValidator = new FormControl('', [Validators.required]);
  answerValidator = new FormControl('', [Validators.required]);
  // passwordConfirmValidator = new FormControl('', [Validators.required]);
  hide = true;

  getEmailErrorMessage() {
    return this.emailValidator.hasError('required') ? 'You must enter a value' :
      this.emailValidator.hasError('email') ? 'Not a valid emailValidator' :
        '';
  }

  getPasswordErrorMessage() {
    if (this.passwordValidator.hasError('required')) {
      return 'Password is required';
    }
    return null;
  }

  //
  // getConfirmErrorMessage() {
  //   if (this.passwordConfirmValidator.hasError('required')) {
  //     return 'Password is required';
  //   }
  //   //
  //   // const first: string = this.passwordValidator.value;
  //   // const second: string = this.passwordConfirmValidator.value;
  //   //
  //   // console.log(first);
  //   // console.log(second);
  //   // if (this.passwordValidator.value.match(this.passwordConfirmValidator.value) === false) {
  //   //   return 'Passwords must match';
  //   // }
  //   return null;
  // }
  //
  // passwordsDontMatch() {
  //   return this.passwordValidator.value.match(this.passwordConfirmValidator.value) === false;
  // }

  buttonDisabled() {
    return this.emailValidator.hasError('required') ||
      this.emailValidator.hasError('emailValidator') ||
      this.passwordValidator.hasError('required') ||
      this.nameValidator.hasError('required') ||
      this.questionValidator.hasError('required') ||
      this.answerValidator.hasError('required');
  }
}
