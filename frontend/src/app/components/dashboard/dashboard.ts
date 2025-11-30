import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { forkJoin } from 'rxjs';

// Importar Servicios
import { OrderService } from '../../services/order';
import { ClientService } from '../../services/client';
import { ProductService } from '../../services/product';

// Importar Modelos
import { OrderI } from '../../models/order';
import { ClientI } from '../../models/client';
import { ProductI } from '../../models/product';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ButtonModule, ChartModule],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  
  // Datos para la vista
  kpis: any[] = [];
  recentOrders: any[] = []; 
  chartData: any;
  chartOptions: any;
  
  loading: boolean = true;

  constructor(
    private orderService: OrderService,
    private clientService: ClientService,
    private productService: ProductService
  ) {
    this.initSkeletonData();
  }

  ngOnInit() {
    this.initChartOptions();
    this.loadRealData();
  }

  initSkeletonData() {
    this.kpis = [
      { title: 'Ingresos Totales', value: 'Cargando...', icon: 'pi pi-dollar', color: 'bg-gray-700', trend: '...' },
      { title: 'Pedidos Totales', value: '...', icon: 'pi pi-shopping-cart', color: 'bg-gray-700', trend: '...' },
      { title: 'Clientes Activos', value: '...', icon: 'pi pi-users', color: 'bg-gray-700', trend: '...' },
      { title: 'Productos Activos', value: '...', icon: 'pi pi-box', color: 'bg-gray-700', trend: '...' }
    ];
  }

  loadRealData() {
    this.loading = true;

    forkJoin({
      orders: this.orderService.getAllOrders(),
      clients: this.clientService.getAllClients(),
      products: this.productService.getAllProducts()
    }).subscribe({
      next: (data) => {
        // Pasamos 'orders' y 'clients' para poder cruzar el ID con el Nombre
        this.calculateKPIs(data.orders, data.clients, data.products);
        this.processRecentOrders(data.orders, data.clients);
        this.processChartData(data.orders);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando dashboard', err);
        this.loading = false;
      }
    });
  }

  calculateKPIs(orders: OrderI[], clients: ClientI[], products: ProductI[]) {
    // 1. Ingresos Totales
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
    
    // 2. Pedidos Totales
    const totalOrders = orders.length;

    // 3. Clientes Activos (Usando el status del cliente)
    const activeClients = clients.filter(c => c.status === 'ACTIVE').length;

    // 4. Productos Activos (Usando el status del producto)
    const activeProducts = products.filter(p => p.status === 'ACTIVE').length;

    this.kpis = [
      { 
        title: 'Ingresos Totales', 
        value: `$${totalRevenue.toLocaleString()}`, 
        icon: 'pi pi-dollar', 
        color: 'bg-green-500', 
        trend: '+100%' 
      },
      { 
        title: 'Pedidos Totales', 
        value: totalOrders.toString(), 
        icon: 'pi pi-shopping-cart', 
        color: 'bg-blue-500', 
        trend: 'Total histórico' 
      },
      { 
        title: 'Clientes Activos', 
        value: activeClients.toString(), 
        icon: 'pi pi-users', 
        color: 'bg-orange-500', 
        trend: `${clients.length} registrados` 
      },
      { 
        title: 'Productos Activos', 
        value: activeProducts.toString(), 
        icon: 'pi pi-box', 
        color: 'bg-purple-500', 
        trend: 'En catálogo' 
      }
    ];
  }

  // Ahora recibimos también la lista de clientes para buscar el nombre por ID
  processRecentOrders(orders: OrderI[], clients: ClientI[]) {
    const sortedOrders = [...orders].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 5);

    this.recentOrders = sortedOrders.map(order => {
      // BÚSQUEDA DEL CLIENTE: Cruzamos id_client con la lista de clientes
      const clientFound = clients.find(c => c.id === order.id_client);
      
      return {
        id: `ORD-${order.id}`,
        client: clientFound ? clientFound.name : 'Cliente Desconocido', // Usamos el nombre encontrado
        total: `$${order.total}`,
        status: order.status // Usamos el estado del pedido (PENDING, PAID, etc.)
      };
    });
  }

  processChartData(orders: OrderI[]) {
    const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
    const dataPoints = [0, 0, 0, 0, 0, 0];

    // Lógica simulada de distribución
    if (orders.length > 0) {
        dataPoints[0] = orders.length * 10;
        dataPoints[1] = orders.length * 25;
        dataPoints[2] = orders.reduce((sum, o) => sum + Number(o.total), 0) / 4; 
        dataPoints[3] = orders.reduce((sum, o) => sum + Number(o.total), 0) / 2;
        dataPoints[4] = orders.reduce((sum, o) => sum + Number(o.total), 0) / 1.5;
        dataPoints[5] = orders.reduce((sum, o) => sum + Number(o.total), 0);
    }

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Ingresos Acumulados ($)',
          data: dataPoints,
          fill: true,
          borderColor: '#6ee7b7',
          backgroundColor: 'rgba(110, 231, 183, 0.1)',
          tension: 0.4,
          pointBackgroundColor: '#6ee7b7',
          pointBorderColor: '#fff'
        }
      ]
    };
  }

  initChartOptions() {
    this.chartOptions = {
        plugins: { 
            legend: { 
                labels: { color: '#9ca3af' } 
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            x: { 
                ticks: { color: '#9ca3af' }, 
                grid: { color: 'rgba(255,255,255,0.05)' } 
            },
            y: { 
                ticks: { color: '#9ca3af' }, 
                grid: { color: 'rgba(255,255,255,0.05)' } 
            }
        },
        maintainAspectRatio: false,
        responsive: true
    };
  }

  getStatusColor(status: string) {
      switch(status) {
          case 'PAID': 
          case 'SHIPPED': 
          case 'COMPLETED': 
            return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
          
          case 'PENDING': 
            return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
          
          case 'CANCELLED': 
            return 'bg-red-500/10 text-red-400 border border-red-500/20';
          
          default: 
            return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
      }
  }
}