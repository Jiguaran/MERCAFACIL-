import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProductService } from '../../../services/product';
import { ClientI } from '../../../models/client';
import { OrderService } from '../../../services/order'; // <-- IMPORTANTE, para poder crear un puente para editar y crear
import { OrderDetailService } from '../../../services/orderDetail'; 
import { SelectModule } from 'primeng/select'; //importamos el selectModule para poder elegir lo que quiero usar y poner

@Component({
  selector: 'app-orderDetail-update',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, Select, ToastModule],
  templateUrl: './update.html',
  styleUrl: './update.css',
  providers: [MessageService]
})
export class Update implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  
  orders: any[] = [];   // <-- AQUÍ SE GUARDAN EN UN ARRAY LAS OPCIONES DE CATEGORIAS
  products: any[] = [];   // <-- AQUÍ SE GUARDAN EN UN ARRAY LAS OPCIONES DE VENDEDORES

  orderDetailId: number = 0;
  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private orderDetailService: OrderDetailService,
    private messageService: MessageService,
    private orderService: OrderService,   // <-- INYECTAMOS SERVICIO
    private productService: ProductService    // <-- INYECTAMOS SERVICIO

  ) {
    this.form = this.fb.group({
      // id_order: ['', [Validators.required, Validators.minLength(2)]],
      // id_product: ['', [Validators.required,]],
      // status: ['ACTIVE', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderDetailId = parseInt(id);
      this.loadOrderDetail();
    }
    
    this.orderService.getAllOrders().subscribe((data) => {
      this.orders = data.map(c => ({
        label: c.id,
        value: c.id
      }));
    });
  
    this.productService.getAllProducts().subscribe((data) => { //ponemos el servicio para cargar los vendedores
      this.products = data.map(s => ({
        label: s.name,
        value: s.id
      }));
    });
  }

  loadOrderDetail(): void {
    this.loading = true;
    this.orderDetailService.getOrderDetailById(this.orderDetailId).subscribe({
      next: (orderDetail) => {
        this.form.patchValue(orderDetail);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order detail:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el detalle de la orden'
        });
        this.loading = false;
      }
    });
  }

   submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const orderDetailData = this.form.value;

      this.orderDetailService.updateOrderDetail(this.orderDetailId, orderDetailData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Detalle de orden actualizado correctamente'
          });
          setTimeout(() => {
            this.router.navigate(['/orderDetails']);
          }, 1000);
        },
        error: (error) => {
          console.error('Error updating order detail:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el detalle de la orden'
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
      if (field.errors['email']) return 'Email no válido';
      if (field.errors['minlength']) return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) return 'Formato no válido';
      if (field.errors['maxlength']) return 'debe ser como máximo 10 caracteres';
    }
    return '';
  }
}
