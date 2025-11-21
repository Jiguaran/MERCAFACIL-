import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DatePicker } from 'primeng/datepicker';

import { OrderService } from '../../../services/order';
import { ClientService } from '../../../services/client';

@Component({
  selector: 'app-order-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    Select,
    ToastModule,
    DatePicker
  ],
  templateUrl: './create.html',
  styleUrl: './create.css',
  providers: [MessageService]
})
export class Create {
  form: FormGroup;
  loading = false;

  clients: any[] = [];

  statusorderOptions = [
    { label: 'Pendiente', value: 'PENDING' },
    { label: 'Pagado', value: 'PAID' },
    { label: 'Enviado', value: 'SHIPPED' }
  ];

  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private orderService: OrderService,
    private messageService: MessageService,
    private clientService: ClientService
  ) {
    this.form = this.fb.group({
      id_client: ['', Validators.required],
      status: ['', Validators.required],             // Estado del pedido
      status_general: ['ACTIVE', Validators.required], // Estado general del registro
      total: [0, Validators.required],
      fecha: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.clientService.getAllClients().subscribe(data => {
      this.clients = data.map(cl => ({
        label: cl.name,
        value: cl.id
      }));
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const orderData = this.form.value;

      this.orderService.createOrder(orderData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Orden creada correctamente'
          });

          setTimeout(() => this.router.navigate(['/orders']), 1000);
        },
        error: err => {
          console.error('Error creating order:', err);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear la orden'
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
    this.router.navigate(['/orders']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors && field?.touched) {
      return 'Campo obligatorio';
    }
    return '';
  }
}
