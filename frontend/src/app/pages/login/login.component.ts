import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { AuthService } from 'src/app/services/auth.service';
import { matFormFieldDefaultOptions } from 'src/app/utils/config';
import { AppRoutes } from 'src/app/utils/enums/app-routes';
import { SharedModule } from 'src/app/utils/material/material.module';
import { AuthGoBackBtnComponent } from '../../components/auth-go-back-btn/auth-go-back-btn.component';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <header app-header>
      <app-auth-go-back-btn leftSlot></app-auth-go-back-btn>
    </header>
    <div class="page-container">
      <form (ngSubmit)="onSubmit()">
        <mat-form-field class="example-full-width">
          <mat-label>Email</mat-label>
          <input matInput [formControl]="formGroup.controls.email" />
          <mat-error
            *ngIf="formGroup.controls.email.hasError('email') && !formGroup.controls.email.hasError('required')"
          >
            Wpisz poprawny adres e-mail
          </mat-error>
          <mat-error *ngIf="formGroup.controls.email.hasError('required')"> Pole jest wymagane </mat-error>
        </mat-form-field>
        <mat-form-field class="example-full-width">
          <mat-label>Hasło</mat-label>
          <input matInput type="password" [formControl]="formGroup.controls.password" />
          <mat-error *ngIf="formGroup.controls.password.hasError('required')"> Pole jest wymagane </mat-error>
        </mat-form-field>
        <div *ngIf="isShowLoginError" style="color: red">Email i/lub hasło są nieprawidłowe</div>
        <button mat-raised-button type="submit" [disabled]="isButtonDisabled" color="primary">Zaloguj</button>
      </form>
    </div>
  `,
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule, HeaderComponent, AuthGoBackBtnComponent],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { ...matFormFieldDefaultOptions, subscriptSizing: 'fixed' } as MatFormFieldDefaultOptions,
    },
  ],
})
export class LoginComponent {
  formGroup = new FormGroup({
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    password: new FormControl<string | null>(null, [Validators.required]),
  });
  isButtonDisabled = false;
  isShowLoginError = false;

  constructor(
    private authService: AuthService,
    private destroyRef: DestroyRef,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.formGroup.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.isShowLoginError = false;
    });
  }

  onSubmit() {
    if (this.formGroup.invalid) return;
    this.isButtonDisabled = true;

    this.authService
      .login(this.formGroup.value as any)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate([AppRoutes.Home]);
        },
        error: (err) => {
          // if (err.error.status === 401) {
          this.isShowLoginError = true;
          // }
        },
      })
      .add(() => {
        this.isButtonDisabled = false;
        this.cd.markForCheck();
      });
  }
}
