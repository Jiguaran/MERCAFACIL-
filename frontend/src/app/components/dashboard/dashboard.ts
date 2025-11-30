import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart'; // Si instalaste chart.js

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ButtonModule, ChartModule],
  templateUrl: './dashboard.html'
})
export class Dashboard {
  // Datos simulados para las tarjetas de resumen (KPIs)
  kpis = [
    { title: 'Ventas del Mes', value: '$12.500.000', icon: 'pi pi-dollar', color: 'bg-green-500', trend: '+15%' },
    { title: 'Pedidos Nuevos', value: '150', icon: 'pi pi-shopping-cart', color: 'bg-blue-500', trend: '+5%' },
    { title: 'Clientes Activos', value: '340', icon: 'pi pi-users', color: 'bg-orange-500', trend: '+12%' },
    { title: 'Productos Bajos', value: '12', icon: 'pi pi-exclamation-triangle', color: 'bg-red-500', trend: '-2' }
  ];

  // Datos simulados para la tabla de órdenes recientes
  recentOrders = [
    { id: 'ORD-001', client: 'Juan Perez', total: '$120.000', status: 'Completado' },
    { id: 'ORD-002', client: 'Maria Gomez', total: '$450.000', status: 'Pendiente' },
    { id: 'ORD-003', client: 'Carlos Ruiz', total: '$89.000', status: 'Enviado' },
    { id: 'ORD-004', client: 'Ana Torres', total: '$210.000', status: 'Completado' }
  ];

  // Configuración básica para un gráfico (si usas chart.js)
  chartData: any;
  chartOptions: any;

  constructor() {
    this.initChart();
  }

  initChart() {
    this.chartData = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
      datasets: [
        {
          label: 'Ingresos',
          data: [65, 59, 80, 81, 56, 55],
          fill: true,
          borderColor: '#6ee7b7',
          backgroundColor: 'rgba(110, 231, 183, 0.2)',
          tension: 0.4
        }
      ]
    };

    this.chartOptions = {
        plugins: { legend: { labels: { color: '#fff' } } },
        scales: {
            x: { ticks: { color: '#d1d5db' }, grid: { color: 'rgba(255,255,255,0.1)' } },
            y: { ticks: { color: '#d1d5db' }, grid: { color: 'rgba(255,255,255,0.1)' } }
        }
    };
  }

  getStatusColor(status: string) {
      switch(status) {
          case 'Completado': return 'bg-green-100 text-green-800';
          case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
          case 'Enviado': return 'bg-blue-100 text-blue-800';
          default: return 'bg-gray-100 text-gray-800';
      }
  }
}