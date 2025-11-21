import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { OrderDetailService } from '../../../services/orderDetail';
import { ProductService } from '../../../services/product'; // <-- IMPORTANTE, para poder crear un puente para editar y crear
import { OrderService } from '../../../services/order'; // <-- IMPORTANTE, para poder crear un puente para editar y crear
import { SelectModule } from 'primeng/select'; //importamos el selectModule para poder elegir lo que quiero usar y poner



@Component({
  selector: 'app-order-detail-create',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, Select, ToastModule,SelectModule,], //importamos el SelectModule
  templateUrl: './create.html',
  styleUrls: ['./create.css'],
  providers: [MessageService]
})
export class Create {
  form: FormGroup;
  loading: boolean = false;

  products: any[] = [];   // <-- AQUÍ SE GUARDAN EN UN ARRAY LAS OPCIONES DE CATEGORIAS
  orders: any[] = [];   // <-- AQUÍ SE GUARDAN EN UN ARRAY LAS OPCIONES DE VENDEDORES

  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private orderDetailService: OrderDetailService,
    private messageService: MessageService,
    private orderService: OrderService,   // <-- INYECTAMOS SERVICIO
    private productService: ProductService    // <-- INYECTAMOS SERVICIO
  ) {
    this.form = this.fb.group({
      price: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      id_order: ['', [Validators.required]],
      id_product: ['', [Validators.required]],
      status: ['ACTIVE', Validators.required]
    });
  }

  ngOnInit(): void { //ponemos el ngOnInit para cargar las categorias
    this.orderService.getAllOrders().subscribe((data) => {
      this.orders = data.map(o => ({
        label: o.id,
        value: o.id
      }));
    });
  
    this.productService.getAllProducts().subscribe((data) => { //ponemos el servicio para cargar los vendedores
      this.products = data.map(s => ({
        label: s.name,
        value: s.id
      }));
    });
  }
  
  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const orderDetailData = this.form.value;

      this.orderDetailService.createOrderDetail(orderDetailData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Detalle de orden creado correctamente'
          });
          setTimeout(() => {
            this.router.navigate(['/orderDetails']);
          }, 1000);
        },
        error: (error) => {
          console.error('Error creating order detail:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear el detalle de orden'
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
    this.router.navigate(['/orderDetails']);
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