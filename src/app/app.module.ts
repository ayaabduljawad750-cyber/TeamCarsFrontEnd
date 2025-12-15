import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/* ===================== PAGES ===================== */
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ProductsComponent } from './pages/products/products.component';
import { AllProductsComponent } from './pages/all-products/all-products.component';

/* ===================== COMPONENTS ===================== */
import { OurNavComponent } from './components/our-nav/our-nav.component';
import { HeaderComponent } from './components/header/header.component';
// import { FooterComponent } from './components/footer/footer.component';

import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { DashboardUserComponent } from './components/dashboard-user/dashboard-user.component';
import { DashboardSellerComponent } from './components/dashboard-seller/dashboard-seller.component';
import { DashboardMaintenanceCenterComponent } from './components/dashboard-maintenance-center/dashboard-maintenance-center.component';

import { ContactUsComponent } from './components/contactus/contactus.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CartComponent } from './components/cart/cart.component';

import { CardComponent } from './pages/home/card/card.component';
import { Section4Component } from './pages/home/section4/section4.component';
import { FooterComponent } from './components/footer/footer.component';
// import { DashboardMaintenanceCenterComponent } from './components/dashboard-maintenance-center/dashboard-maintenance-center.component';
import { Section2Component } from './pages/home/section2/section2.component';
import { ProductCardComponent } from './pages/home/section2/product-card/product-card.component';
import { SelectFormComponent } from './pages/home/section2/select-form/select-form.component';
// import { MyOrdersComponent } from './components/my-orders/my-orders.component';

@NgModule({
  declarations: [
    AppComponent,

    /* Pages */
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    DashboardComponent,
    ForgotPasswordComponent,
   ProductsComponent,
   AllProductsComponent,

    /* Components */
    OurNavComponent,
    HeaderComponent,
    FooterComponent,


    DashboardAdminComponent,
    DashboardUserComponent,
    DashboardSellerComponent,
    DashboardMaintenanceCenterComponent,

    ContactUsComponent,
    AboutusComponent,
    MyOrdersComponent,
    CheckoutComponent,
    CartComponent,

    CardComponent,
// <<<<<<< HEAD
    DashboardSellerComponent,
    ForgotPasswordComponent,
    Section4Component,
    FooterComponent,
    DashboardMaintenanceCenterComponent,
    Section2Component,
    ProductCardComponent,
    SelectFormComponent,
    // MyOrdersComponent
// =======
    Section4Component
// >>>>>>> 153688ed5861b7a491cada6189e5d40fe7318c57
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,

    FormsModule,
    ReactiveFormsModule,

    BrowserAnimationsModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
