import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { OrderI } from '../../../models/order';
import { ShipmentService   } from '../../../services/shipment';
import { ShipmentI } from '../../../models/shipment';

@Component({
  selector: 'app-shipment-getall',
  imports: [TableModule, CommonModule, ButtonModule, RouterModule, ConfirmDialogModule, ToastModule],
  templateUrl: './getall.html',
  styleUrls: ['./getall.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class Getall implements OnInit {
  shipments: ShipmentI[] = [];
  loading: boolean = false;

  constructor(
    private shipmentService: ShipmentService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {

    this.loadShipments();
    
  }

  loadShipments(): void {
    this.loading = true;
    this.shipmentService.getAllShipments().subscribe({
      next: (shipments) => {
        this.shipments = shipments;
        this.shipmentService.updateLocalShipments(shipments);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading shipments:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los envíos'
        });
        this.loading = false;
      }
    });
  }

  deleteShipment(shipment: ShipmentI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar el envío #${shipment.id}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (shipment.id) {
          this.shipmentService.deleteShipment(shipment.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Envío eliminado correctamente'
              });
              this.loadShipments();
            },
            error: (error) => {
              console.error('Error deleting shipment:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el envío'
              });
            }
          });
        }
      }
    });
  }
}