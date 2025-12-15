import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OurNavComponent } from './components/our-nav/our-nav.component';
import { RegisterComponent } from './pages/register/register.component';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { DashboardUserComponent } from './components/dashboard-user/dashboard-user.component';
import { HeaderComponent } from './components/header/header.component';
import { ContactUsComponent } from './components/contactus/contactus.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { CardComponent } from './pages/home/card/card.component';
import { DashboardSellerComponent } from './components/dashboard-seller/dashboard-seller.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { Section4Component } from './pages/home/section4/section4.component';
import { FooterComponent } from './components/footer/footer.component';
import { DashboardMaintenanceCenterComponent } from './components/dashboard-maintenance-center/dashboard-maintenance-center.component';
import { Section2Component } from './pages/home/section2/section2.component';
import { ProductCardComponent } from './pages/home/section2/product-card/product-card.component';
import { SelectFormComponent } from './pages/home/section2/select-form/select-form.component';
// import { MyOrdersComponent } from './components/my-orders/my-orders.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    OurNavComponent,
    RegisterComponent,
    DashboardComponent,
    DashboardAdminComponent,
    DashboardUserComponent,
    HeaderComponent,
    ContactUsComponent,
    AboutusComponent,
    MyOrdersComponent,
    CardComponent,
    DashboardSellerComponent,
    ForgotPasswordComponent,
    Section4Component,
    FooterComponent,
    DashboardMaintenanceCenterComponent,
    Section2Component,
    ProductCardComponent,
    SelectFormComponent
    // MyOrdersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatIconModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
