import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProductTagService } from '../../../services/productTag'; 
import { ProductService } from '../../../services/product'; // <-- IMPORTANTE, para poder crear un puente para editar y crear
import { TagService } from '../../../services/tag'; // <-- IMPORTANTE, para poder crear un puente para editar y crear
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

  products: any[] = [];   // <-- AQUÍ SE GUARDAN EN UN ARRAY LAS OPCIONES DE PRODUCTOS
  tags: any[] = [];   // <-- AQUÍ SE GUARDAN EN UN ARRAY LAS OPCIONES DE EQTIQUETAS

  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productTagService: ProductTagService,
    private messageService: MessageService,
    private productService: ProductService,   // <-- INYECTAMOS SERVICIO
    private tagService: TagService    // <-- INYECTAMOS SERVICIO
  ) {
    this.form = this.fb.group({
      id_seller: ['', [Validators.required]],
      id_category: ['', [Validators.required]],
      status: ['ACTIVE', Validators.required]
    });
  }

  ngOnInit(): void { //ponemos el ngOnInit para cargar los productos
    this.productService.getAllProducts().subscribe((data) => {
      this.products = data.map(p => ({
        label: p.name,
        value: p.id
      }));
    });
  
    this.tagService.getAllTags().subscribe((data) => { //ponemos el servicio para cargar las etiquetas
      this.tags = data.map(t => ({
        label: t.name,
        value: t.id
      }));
    });
  }
  
  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const productTagData = this.form.value;

      this.productTagService.createProductTag(productTagData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Etiqueta de producto creada correctamente'
          });
          setTimeout(() => {
            this.router.navigate(['/productTags']);
          }, 1000);
        },
        error: (error) => {
          console.error('Error creating productTag:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear la etiqueta de producto'
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
    this.router.navigate(['/productTags']);
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