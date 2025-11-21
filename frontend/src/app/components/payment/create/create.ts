import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { OrderService } from '../../../services/order'; // <-- IMPORTANTE, para poder crear un puente para editar y crear
import { SelectModule } from 'primeng/select'; //importamos el selectModule para poder elegir lo que quiero usar y poner
import { PaymentService } from '../../../services/payment';
import { DatePicker } from 'primeng/datepicker';


@Component({
  selector: 'app-payment-create',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, Select, ToastModule,SelectModule,DatePicker], //importamos el SelectModule
  templateUrl: './create.html',
  styleUrls: ['./create.css'],
  providers: [MessageService]
})
export class Create {
  form: FormGroup;
  loading: boolean = false;

  orders: any[] = [];   // <-- AQUÍ SE GUARDAN EN UN ARRAY LAS OPCIONES DE CATEGORIAS

  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private paymentService: PaymentService,
    private orderService: OrderService,   // <-- INYECTAMOS SERVICIO
  ) {
    this.form = this.fb.group({
      id_order: ['', [Validators.required]],
      method: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      payment_date: ['', [Validators.required]],
      status: ['ACTIVE', Validators.required]
    });
  }

  ngOnInit(): void { //ponemos el ngOnInit para cargar las categorias
    this.orderService.getAllOrders().subscribe((data) => {
      this.orders = data.map(c => ({
        label: c.id,
        value: c.id
      }));
    });
  }
  
  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const paymentData = this.form.value;

      this.paymentService.createPayment(paymentData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Pago creado correctamente'
          });
          setTimeout(() => {
            this.router.navigate(['/payments']);
          }, 1000);
        },
        error: (error) => {
          console.error('Error creating payment:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear el pago'
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
      if (field.errors['minlength']) return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) return 'Formato no válido';
      if (field.errors['minlength']) return 'minimo 10 DIGITOS';
    }
    return '';
  }
}