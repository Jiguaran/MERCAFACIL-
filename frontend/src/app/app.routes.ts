import { Routes } from '@angular/router';

// Client components with aliases
import { Getall as ClientGetall } from './components/client/getall/getall';
import { Create as ClientCreate } from './components/client/create/create';
import { Update as ClientUpdate } from './components/client/update/update';
import { Delete as ClientDelete } from './components/client/delete/delete';

// Category components with aliases
import { Getall as CategoryGetall } from './components/category/getall/getall';
import { Create as CategoryCreate } from './components/category/create/create';
import { Update as CategoryUpdate } from './components/category/update/update';
import { Delete as CategoryDelete } from './components/category/delete/delete';

// order components with aliases
import { Getall as OrderGetall } from './components/order/getall/getall';
import { Create as OrderCreate } from './components/order/create/create';
import { Update as OrderUpdate } from './components/order/update/update';
import { Delete as OrderDelete } from './components/order/delete/delete';    

//orderDetail components with aliases

import { Getall as OrderDetailGetall } from './components/orderDetail/getall/getall';
import { Create as OrderDetailCreate } from './components/orderDetail/create/create';
import { Update as OrderDetailUpdate } from './components/orderDetail/update/update';
import { Delete as OrderDetailDelete } from './components/orderDetail/delete/delete';

//payment components with aliases
import { Getall as PaymentGetall } from './components/payment/getall/getall';
import { Create as PaymentCreate } from './components/payment/create/create';
import { Update as PaymentUpdate } from './components/payment/update/update';
import { Delete as PaymentDelete } from './components/payment/delete/delete';  

//product components with aliases
import { Getall as ProductGetall } from './components/product/getall/getall';
import { Create as ProductCreate } from './components/product/create/create';
import { Update as ProductUpdate } from './components/product/update/update';
import { Delete as ProductDelete } from './components/product/delete/delete';

// productTag components with aliases
import { Getall as ProductTagGetall } from './components/productTag/getall/getall';
import { Create as ProductTagCreate } from './components/productTag/create/create';
import { Update as ProductTagUpdate } from './components/productTag/update/update';
import { Delete as ProductTagDelete } from './components/productTag/delete/delete';

// review components with aliases
import { Getall as ReviewGetall } from './components/review/getall/getall';
import { Create as ReviewCreate } from './components/review/create/create';
import { Update as ReviewUpdate } from './components/review/update/update';
import { Delete as ReviewDelete } from './components/review/delete/delete';

// seller components with aliases
import { Getall as SellerGetall } from './components/seller/getall/getall';
import { Create as SellerCreate } from './components/seller/create/create';
import { Update as SellerUpdate } from './components/seller/update/update';
import { Delete as SellerDelete } from './components/seller/delete/delete';

//shipment components with aliases
import { Getall as ShipmentGetall } from './components/shipment/getall/getall';
import { Create as ShipmentCreate } from './components/shipment/create/create';
import { Update as ShipmentUpdate } from './components/shipment/update/update';
import { Delete as ShipmentDelete } from './components/shipment/delete/delete';

//tag components with aliases
import { Getall as TagGetall } from './components/tag/getall/getall';
import { Create as TagCreate } from './components/tag/create/create';
import { Update as TagUpdate } from './components/tag/update/update';
import { Delete as TagDelete } from './components/tag/delete/delete';

// Auth components with aliases
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';

// Auth Guard
import { AuthGuard } from './guards/authguard';

// Dashboard component
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
    { 
        path: '', 
        redirectTo: '/dashboard', // CORREGIDO: Redirige al dashboard, no a la raíz '/'
        pathMatch: 'full' 
    },
    {
        path: 'dashboard',       // NUEVA RUTA: Aquí registramos el componente
        component: Dashboard,
        canActivate: [AuthGuard] // Protegido por login
    },
    {
        path: "login",
        component: Login
    },
    {
        path: "register",
        component: Register
    },
    {
        path: "clients",
        component: ClientGetall,
        canActivate: [AuthGuard]
    },
    {
        path: "clients/new",
        component: ClientCreate,
        canActivate: [AuthGuard]
    },
    {
        path: "clients/edit/:id",
        component: ClientUpdate,
        canActivate: [AuthGuard]
    },
    {
        path: "clients/delete/:id",
        component: ClientDelete,
        canActivate: [AuthGuard]
    },
    {
        path: "categories",
        component: CategoryGetall,
        canActivate: [AuthGuard]
    },
    {
        path: "categories/new",
        component: CategoryCreate,
        canActivate: [AuthGuard]
    },
    {
        path: "categories/edit/:id",
        component: CategoryUpdate,
        canActivate: [AuthGuard]
    },
    {
        path: "categories/delete/:id",
        component: CategoryDelete,
        canActivate: [AuthGuard]
    },
    {
        path: "orders",
        component: OrderGetall,
        canActivate: [AuthGuard]
    },
    {
        path: "orders/new",
        component: OrderCreate,
        canActivate: [AuthGuard]
    },
    {
        path: "orders/edit/:id",
        component: OrderUpdate,
        canActivate: [AuthGuard]
    },
    {
        path: "orders/delete/:id",
        component: OrderDelete,
        canActivate: [AuthGuard]
    },
    {
        path: "orderDetails",
        component: OrderDetailGetall,
        canActivate: [AuthGuard]
    },
    {
        path: "orderDetails/new",
        component: OrderDetailCreate,
        canActivate: [AuthGuard]
    },
    {
        path: "orderDetails/edit/:id",
        component: OrderDetailUpdate,
        canActivate: [AuthGuard]
    },
    {
        path: "orderDetails/delete/:id",
        component: OrderDetailDelete,
        canActivate: [AuthGuard]
    },
    {
        path: "payments",
        component: PaymentGetall,
        canActivate: [AuthGuard]
    },
    {
        path: "payments/new",
        component: PaymentCreate,
        canActivate: [AuthGuard]
    },
    {
        path: "payments/edit/:id",
        component: PaymentUpdate,
        canActivate: [AuthGuard]
    },
    {
        path: "payments/delete/:id",
        component: PaymentDelete,
        canActivate: [AuthGuard]
    },
    {
        path: "products",
        component: ProductGetall,
        canActivate: [AuthGuard]
    },
    {
        path: "products/new",
        component: ProductCreate,
        canActivate: [AuthGuard]
    },
    {
        path: "products/edit/:id",
        component: ProductUpdate,
        canActivate: [AuthGuard]
    },
    {
        path: "products/delete/:id",
        component: ProductDelete,
        canActivate: [AuthGuard]
    },
    {
        path: "productTags",
        component: ProductTagGetall,
        canActivate: [AuthGuard]
    },
    {
        path: "productTags/new",
        component: ProductTagCreate,
        canActivate: [AuthGuard]
    },
    {
        path: "productTags/edit/:id",
        component: ProductTagUpdate,
        canActivate: [AuthGuard]
    },
    {
        path: "productTags/delete/:id",
        component: ProductTagDelete,
        canActivate: [AuthGuard]
    },
    {
        path: "reviews",
        component: ReviewGetall,
        canActivate: [AuthGuard]
    },
    {
        path: "reviews/new",
        component: ReviewCreate,
        canActivate: [AuthGuard]
    },
    {
        path: "reviews/edit/:id",
        component: ReviewUpdate,
        canActivate: [AuthGuard]
    },
    {
        path: "reviews/delete/:id",
        component: ReviewDelete,
        canActivate: [AuthGuard]
    },
    {
        path: "sellers",
        component: SellerGetall,
        canActivate: [AuthGuard]
    },
    {
        path: "sellers/new",
        component: SellerCreate,
        canActivate: [AuthGuard]
    },
    {
        path: "sellers/edit/:id",
        component: SellerUpdate,
        canActivate: [AuthGuard]
    },
    {
        path: "sellers/delete/:id",
        component: SellerDelete,
        canActivate: [AuthGuard]
    },
    {
        path: "shipments",
        component: ShipmentGetall,
        canActivate: [AuthGuard]
    },
    {
        path: "shipments/new",
        component: ShipmentCreate,
        canActivate: [AuthGuard]
    },
    {
        path: "shipments/edit/:id",
        component: ShipmentUpdate,
        canActivate: [AuthGuard]
    },
    {
        path: "shipments/delete/:id",
        component: ShipmentDelete,
        canActivate: [AuthGuard]
    },
    {
        path: "tags",
        component: TagGetall,
        canActivate: [AuthGuard]
    },
    {
        path: "tags/new",
        component: TagCreate,
        canActivate: [AuthGuard]
    },
    {
        path: "tags/edit/:id",
        component: TagUpdate,
        canActivate: [AuthGuard]
    },
    {
        path: "tags/delete/:id",
        component: TagDelete,
        canActivate: [AuthGuard]
    },
    {
        path: "**",
        redirectTo: "login",
        pathMatch: "full"
    }
];