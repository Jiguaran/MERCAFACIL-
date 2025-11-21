import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { OrderI } from '../../../models/order';
import { OrderService } from '../../../services/order';

@Component({
  selector: 'app-order-getall',
  imports: [TableModule, CommonModule, ButtonModule, RouterModule, ConfirmDialogModule, ToastModule],
  templateUrl: './getall.html',
  styleUrls: ['./getall.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class Getall implements OnInit {
  orders: OrderI[] = [];
  loading: boolean = false;

  constructor(
    private orderService: OrderService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {

    this.loadOrders();
    
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.orderService.updateLocalOrders(orders);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las órdenes'
        });
        this.loading = false;
      }
    });
  }

  deleteOrder(order: OrderI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar la orden #${order.id}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (order.id) {
          this.orderService.deleteOrder(order.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Orden eliminada correctamente'
              });
              this.loadOrders();
            },
            error: (error) => {
              console.error('Error deleting order:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar la orden'
              });
            }
          });
        }
      }
    });
  }
}