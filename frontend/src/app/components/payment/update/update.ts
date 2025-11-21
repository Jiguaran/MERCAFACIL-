import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PaymentService } from '../../../services/payment';
import { ClientI } from '../../../models/client';
import { OrderService } from '../../../services/order'; 
import { SelectModule } from 'primeng/select'; //importamos el selectModule para poder elegir lo que quiero usar y poner
import { DatePicker } from 'primeng/datepicker';


@Component({
  selector: 'app-payment-update',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, Select, ToastModule,DatePicker],
  templateUrl: './update.html',
  styleUrl: './update.css',
  providers: [MessageService]
})

export class Update implements OnInit {
  form: FormGroup;
  loading: boolean = false;

  orders: any[] = [];   // <-- AQUÍ SE GUARDAN EN UN ARRAY LAS OPCIONES DE PRODUCTOS

  paymentId: number = 0;
  
  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private messageService: MessageService,
    private orderService: OrderService,   // <-- INYECTAMOS SERVICIO

  ) {
    this.form = this.fb.group({
      id_order: ['', [Validators.required,]],
      method: ['', [Validators.required,]],
      amount: ['', [Validators.required,]],
      payment_date: ['', [Validators.required,]],
      status: ['ACTIVE', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.paymentId = parseInt(id);
      this.loadPayment();
    }


    this.orderService.getAllOrders().subscribe((data) => { //ponemos el servicio para cargar los productos
      this.orders = data.map(p => ({
        label: p.id,
        value: p.id
      }));
    });
  }

  loadPayment(): void {
    this.loading = true;
    this.paymentService.getPaymentById(this.paymentId).subscribe({
      next: (payment) => {
        this.form.patchValue(payment);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payment:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el pago'
        });
        this.loading = false;
      }
    });
  }

   submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const paymentData = this.form.value;

      this.paymentService.updatePayment(this.paymentId, paymentData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Pago actualizado correctamente'
          });
          setTimeout(() => {
            this.router.navigate(['/payments']);
          }, 1000);
        },
        error: (error) => {
          console.error('Error updating payment:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el pago'
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
    this.router.navigate(['/payments']);
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
