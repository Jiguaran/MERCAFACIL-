import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { OrderI } from '../../../models/order';
import { PaymentService   } from '../../../services/payment';
import { PaymentI } from '../../../models/payment';

@Component({
  selector: 'app-payment-getall',
  imports: [TableModule, CommonModule, ButtonModule, RouterModule, ConfirmDialogModule, ToastModule],
  templateUrl: './getall.html',
  styleUrls: ['./getall.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class Getall implements OnInit {
  payments: PaymentI[] = [];
  loading: boolean = false;

  constructor(
    private paymentService: PaymentService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {

    this.loadPayments();
    
  }

  loadPayments(): void {
    this.loading = true;
    this.paymentService.getAllPayments().subscribe({
      next: (payments) => {
        this.payments = payments;
        this.paymentService.updateLocalPayments(payments);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los pagos'
        });
        this.loading = false;
      }
    });
  }

  deletePayment(payment: PaymentI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar el pago #${payment.id}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (payment.id) {
          this.paymentService.deletePayment(payment.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Pago eliminado correctamente'
              });
              this.loadPayments();
            },
            error: (error) => {
              console.error('Error deleting payment:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el pago'
              });
            }
          });
        }
      }
    });
  }
}