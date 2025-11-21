import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { OrderDetailI } from '../../../models/orderDetail';
import { OrderDetailService } from '../../../services/orderDetail';

@Component({
  selector: 'app-orderDetail-getall',
  imports: [TableModule, CommonModule, ButtonModule, RouterModule, ConfirmDialogModule, ToastModule],
  templateUrl: './getall.html',
  styleUrls: ['./getall.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class Getall implements OnInit {
  orderDetails: OrderDetailI[] = [];
  loading: boolean = false;
  
  constructor(
    private orderDetailService: OrderDetailService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadOrderDetails();
  }

  loadOrderDetails(): void {
    this.loading = true;
    this.orderDetailService.getAllOrderDetails().subscribe({
      next: (orderDetails) => {
        this.orderDetails = orderDetails;
        this.orderDetailService.updateLocalOrderDetails(orderDetails);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order details:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las órdenes'
        });
        this.loading = false;
      }
    });
  }

  deleteOrderDetail(orderDetail: OrderDetailI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar la orden #${orderDetail.id}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (orderDetail.id) {
          this.orderDetailService.deleteOrderDetail(orderDetail.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Orden eliminada correctamente'
              });
              this.loadOrderDetails();
            },
            error: (error) => {
              console.error('Error deleting order detail:', error);
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