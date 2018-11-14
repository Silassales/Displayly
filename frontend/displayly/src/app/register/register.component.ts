import {Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AuthenticationService} from '../authentication.service';
import {Router} from '@angular/router';

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
  loading = false;
  error: string = null;

  constructor(private auth: AuthenticationService, private router: Router) {
  }

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

  submit() {
    this.loading = true;
    this.auth.register(this.emailValidator.value,
      this.passwordValidator.value,
      this.questionValidator.value,
      this.answerValidator.value,
      this.nameValidator.value).subscribe(data => {
      console.log(data);
      this.router.navigate(['/login']);
    }, err => {
      console.log(err);
      this.loading = false;
      // If authentication was not successful, display the error. If no error was provided, show a generic error
      this.error = (err.error.error) ? err.error.error : 'There was an error with the system, try again later';
    });
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
      this.answerValidator.hasError('required') ||
      this.loading;
  }
}
