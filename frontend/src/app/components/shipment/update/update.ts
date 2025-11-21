import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ShipmentService } from '../../../services/shipment';
import { ClientI } from '../../../models/client';
import { OrderService } from '../../../services/order'; 
import { SelectModule } from 'primeng/select'; //importamos el selectModule para poder elegir lo que quiero usar y poner
import { DatePicker } from 'primeng/datepicker';


@Component({
  selector: 'app-shipment-update',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, Select, ToastModule,DatePicker],
  templateUrl: './update.html',
  styleUrl: './update.css',
  providers: [MessageService]
})

export class Update implements OnInit {
  form: FormGroup;
  loading: boolean = false;

  orders: any[] = [];   // <-- AQUÍ SE GUARDAN EN UN ARRAY LAS OPCIONES DE PRODUCTOS

  shipmentId: number = 0;
  
  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private shipmentService: ShipmentService,
    private messageService: MessageService,
    private orderService: OrderService,   // <-- INYECTAMOS SERVICIO

  ) {
    this.form = this.fb.group({
      id_order: ['', [Validators.required,]],
      tracking_number: ['', [Validators.required,]],
      fecha_envio: ['', [Validators.required,]],
      status: ['ACTIVE', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.shipmentId = parseInt(id);
      this.loadShipment();
    }


    this.orderService.getAllOrders().subscribe((data) => { //ponemos el servicio para cargar los productos
      this.orders = data.map(p => ({
        label: p.id,
        value: p.id
      }));
    });
  }

  loadShipment(): void {
    this.loading = true;
    this.shipmentService.getShipmentById(this.shipmentId).subscribe({
      next: (shipment) => {
        this.form.patchValue(shipment);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading shipment:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el envío'
        });
        this.loading = false;
      }
    });
  }

   submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const shipmentData = this.form.value;

      this.shipmentService.updateShipment(this.shipmentId, shipmentData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Envío actualizado correctamente'
          });
          setTimeout(() => {
            this.router.navigate(['/shipments']);
          }, 1000);
        },
        error: (error) => {
          console.error('Error updating shipment:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el envío'
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
    this.router.navigate(['/shipments']);
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
