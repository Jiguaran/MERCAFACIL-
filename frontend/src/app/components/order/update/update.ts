import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DatePicker } from 'primeng/datepicker';

import { OrderService } from '../../../services/order';
import { ClientService } from '../../../services/client';

@Component({
  selector: 'app-order-update',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    Select,
    ToastModule,
    DatePicker
  ],
  templateUrl: './update.html',
  providers: [MessageService]
})
export class Update implements OnInit {
  form!: FormGroup;
  loading = false;

  id!: number;
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
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private messageService: MessageService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadClients();

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOrder();
  }

  initForm(): void {
    this.form = this.fb.group({
      id_client: ['', Validators.required],
      status: ['', Validators.required],
      status_general: ['', Validators.required],
      total: ['', Validators.required],
      fecha: ['', Validators.required]
    });
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe(data => {
      this.clients = data.map(cl => ({
        label: cl.name,
        value: cl.id
      }));
    });
  }

loadOrder(): void {
  this.orderService.getOrderById(this.id).subscribe(order => {
    this.form.patchValue({
      id_client: order.id_client,
      status: order.status,
      status_general: order.statuss,
      total: order.total,
      fecha: order.fecha ? new Date(order.fecha) : null
    });
  });
}


  submit(): void {
    if (!this.form.valid) {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos requeridos'
      });
      return;
    }

    this.loading = true;

    const payload = {
      ...this.form.value,
      statuss: this.form.value.status_general
    };

    delete payload.status_general;

    this.orderService.updateOrder(this.id, payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Orden actualizada correctamente'
        });

        setTimeout(() => this.router.navigate(['/orders']), 1000);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al actualizar la orden'
        });
        this.loading = false;
      }
    });
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
    if (field?.invalid && field.touched) {
      return 'Campo obligatorio';
    }
    return '';
  }
}
