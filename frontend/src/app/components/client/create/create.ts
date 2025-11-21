import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ClientService } from '../../../services/client';

@Component({
  selector: 'app-client-create',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, Select, ToastModule],
  templateUrl: './create.html',
  styleUrl: './create.css',
  providers: [MessageService]
})
export class Create {
  form: FormGroup;
  loading: boolean = false;
  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private clientService: ClientService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      code: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      status: ['ACTIVE', Validators.required]
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const clientData = this.form.value;

      this.clientService.createClient(clientData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cliente creado correctamente'
          });
          setTimeout(() => {
            this.router.navigate(['/clients']);
          }, 1000);
        },
        error: (error) => {
          console.error('Error creating client:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear el cliente'
          });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos requeridos'
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/clients']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['email']) return 'Email no válido';
      if (field.errors['minlength']) return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) return 'Formato no válido';
      if (field.errors['maxlength']) return 'Maximo 10 DIGITOS';
      if (field.errors['minlength']) return 'minimo 10 DIGITOS';
    }
    return '';
  }
}