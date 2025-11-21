import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ReviewService } from '../../../services/review';
import { ClientService } from '../../../services/client'; // <-- IMPORTANTE, para poder crear un puente para editar y crear
import { ProductService } from '../../../services/product';  // <-- IMPORTANTE, para poder crear un puente para editar y crear
import { SelectModule } from 'primeng/select'; //importamos el selectModule para poder elegir lo que quiero usar y poner



@Component({
  selector: 'app-product-create',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, Select, ToastModule,SelectModule,], //importamos el SelectModule
  templateUrl: './create.html',
  styleUrls: ['./create.css'],
  providers: [MessageService]
})
export class Create {
  form: FormGroup;
  loading: boolean = false;

  clients: any[] = [];   // <-- AQUÍ SE GUARDAN EN UN ARRAY LAS OPCIONES DE CLIENTES
  products: any[] = [];   // <-- AQUÍ SE GUARDAN EN UN ARRAY LAS OPCIONES DE PRODUCTOS

  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reviewService: ReviewService,
    private messageService: MessageService,
    private clientService: ClientService,   // <-- INYECTAMOS SERVICIO
    private productService: ProductService    // <-- INYECTAMOS SERVICIO
  ) {
    this.form = this.fb.group({
      rating: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1), Validators.pattern("^[0-9]+$")]],
      comment: ['', [Validators.required]],
      id_product: ['', [Validators.required]],
      id_client: ['', [Validators.required]],
      status: ['ACTIVE', Validators.required]
    });
  }

  ngOnInit(): void { //ponemos el ngOnInit para cargar las categorias
    this.clientService.getAllClients().subscribe((data) => {
      this.clients = data.map(c => ({
        label: c.name,
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
  
  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const reviewData = this.form.value;

      this.reviewService.createReview(reviewData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Reseña creada correctamente'
          });
          setTimeout(() => {
            this.router.navigate(['/reviews']);
          }, 1000);
        },
        error: (error) => {
          console.error('Error creating review:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear la reseña'
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
    this.router.navigate(['/reviews']);
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
      if (field.errors['minlength']) return 'Valor demasiado bajo';
      if (field.errors['maxlength']) return 'Valor demasiado alto';
      if (field.errors['pattern']) return 'Formato no válido, debe ser un número entero del 0 - 10';
    }
    return '';
  }
}