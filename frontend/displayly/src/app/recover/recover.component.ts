import {Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {RecoveryService} from '../recovery.service';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.css']
})
export class RecoverComponent {
  emailValidator = new FormControl('', [Validators.required, Validators.email]);
  answerValidator = new FormControl('', [Validators.required]);
  passwordValidator = new FormControl('', [Validators.required]);
  error = '';
  loading = false;
  question: string;
  step1 = true;
  step2 = false;
  step3 = false;
  hide = true;

  constructor(private recovery: RecoveryService, private snakcbar: MatSnackBar, private router: Router) { }


  getErrorMessage() {
    return this.emailValidator.hasError('required') ? 'You must enter a value' :
      this.emailValidator.hasError('emailValidator') ? 'Not a valid emailValidator' :
        '';
  }

  recoverDisabled() {
    return this.emailValidator.hasError('required') ||
      this.emailValidator.hasError('emailValidator') ||
      this.loading;
  }

  forgotButton() {
    this.error = '';
    this.loading = true;
    this.recovery.getQuestion(this.emailValidator.value).subscribe(
      data => {
        this.loading = false;
        this.question = data['question'];
        this.gotoStep2();
      }, err => {
        this.loading = false;
        // If authentication was not successful, display the error. If no error was provided, show a generic error
        this.error = (err.error.error) ? err.error.error : 'There was an error with the system, try again later';
      }
    );
  }

  submitDisabled() {
    return this.answerValidator.hasError('required') ||
      this.loading;
  }

  answerQuestion() {
    this.error = '';
    this.loading = true;
    this.recovery.attemptRecovery(this.emailValidator.value, this.answerValidator.value).subscribe(
      data => {
        this.loading = false;
        this.gotoStep3();
      }, err => {
        this.loading = false;
        // If authentication was not successful, display the error. If no error was provided, show a generic error
        this.error = (err.error.error) ? err.error.error : 'There was an error with the system, try again later';
      }
    );
  }

  gotoStep2() {
    this.step1 = false;
    this.step2 = true;
    this.step3 = false;
  }

  gotoStep3() {
    this.step1 = false;
    this.step2 = false;
    this.step3 = true;
  }

  resetDisabled() {
    return this.passwordValidator.hasError('required') ||
      this.loading;
  }

  resetPassword() {
    this.error = '';
    this.loading = true;
    const router = this.router;
    this.recovery.resetPassword(this.passwordValidator.value).subscribe(
      data => {
        const ref = this.snakcbar.open('Success! Redirecting...', 'OK', {
          duration: 2000
        });

        ref.afterDismissed().subscribe(() => router.navigate(['/login']));
      }, err => {
        this.loading = false;
        // If authentication was not successful, display the error. If no error was provided, show a generic error
        this.error = (err.error.error) ? err.error.error : 'There was an error with the system, try again later';
      }
    );
  }
}
