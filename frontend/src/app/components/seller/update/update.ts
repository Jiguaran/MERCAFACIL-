import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SellerService } from '../../../services/seller';
import { SellerI } from '../../../models/seller';

@Component({
  selector: 'app-seller-update',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, Select, ToastModule],
  templateUrl: './update.html',
  styleUrl: './update.css',
  providers: [MessageService]
})
export class Update implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  sellerId: number = 0;
  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private sellerService: SellerService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      status: ['ACTIVE', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.sellerId = parseInt(id);
      this.loadSeller();
    }
  }

  loadSeller(): void {
    this.loading = true;
    this.sellerService.getSellerById(this.sellerId).subscribe({
      next: (seller) => {
        this.form.patchValue(seller);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading seller:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el vendedor'
        });
        this.loading = false;
      }
    });
  }

   submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const sellerData = this.form.value;

      this.sellerService.updateSeller(this.sellerId, sellerData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Vendedor actualizado correctamente'
          });
          setTimeout(() => {
            this.router.navigate(['/sellers']);
          }, 1000);
        },
        error: (error) => {
          console.error('Error updating seller:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el vendedor'
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
    this.router.navigate(['/sellers']);
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
      if (field.errors['maxlength']) return 'debe ser como máximo 10 caracteres';
    }
    return '';
  }
}
