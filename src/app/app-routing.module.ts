import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { ProductsComponent } from './pages/products/products.component';
import { AllProductsComponent } from './pages/all-products/all-products.component';
// import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
// import { OrderDetailsComponent } from './pages/order-details/order-details.component';
import { OrderComponent } from './components/order/order.component';
import { ContactUsComponent } from './components/contactus/contactus.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { CartComponent } from './components/cart/cart.component';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
  path: 'MyProducts',
  component: ProductsComponent
  },
  {
  path: 'products',
  component: AllProductsComponent
  },
  {
    path:"Home",
    component: HomeComponent
  },
    {
    path:"cart",
    component: CartComponent
  },
    {
    path: "order",
    component: OrderComponent
  },
  {
   path: 'checkout', 
   component: CheckoutComponent 
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "contactus",
    component: ContactUsComponent
  },
  {
    path: "aboutus",
    component: AboutusComponent
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
