import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { Subject, takeUntil } from 'rxjs';

// Interface for Type Safety
interface Product {
  _id: string;
  name: string;
  price: number;
  brand: string;
  carModel: string;
  category: string;
  stock: number;
  description?: string;
  image?: any;
}

@Component({
  selector: 'app-dashboard-seller',
  templateUrl: './dashboard-seller.component.html',
  styleUrls: ['./dashboard-seller.component.css']
})
export class DashboardSellerComponent implements OnInit, OnDestroy {
  // Add '!' to fix strict initialization errors
  productForm!: FormGroup; 

  // State
  currentView: 'products' | 'profile' = 'products';
  isLoading = false;
  showProductModal = false;
  isEditing = false;
  successMessage = '';
  errorMessage = '';
  
  // Data
  products: Product[] = [];
  categories = ['Spare parts', 'Tyres', 'Engine oil', 'Batteries', 'Liquids'];
  
  // Filter & Search (Restored variables for your HTML)
  searchQuery: string = ''; 
  selectedCriteria = 'name';
  selectedCategory = '';
  
  selectedFile: File | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadMyProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm() {
    this.productForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      category: [this.categories[0], Validators.required],
      stock: [1, [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  // --- RESTORED: This method is required by your HTML (change)="onFilterChange()" ---
  onFilterChange() {
    this.loadMyProducts();
  }

  loadMyProducts() {
    this.isLoading = true;
    
    const filters: any = {
      limit: 100, 
      sortBy: 'latest'
    };

    if (this.selectedCategory) filters.category = this.selectedCategory;
    
    // Logic for the Search Inputs
    if (this.searchQuery) {
      if (this.selectedCriteria === 'name') filters.search = this.searchQuery;
      else if (this.selectedCriteria === 'brand') filters.brand = this.searchQuery;
      else if (this.selectedCriteria === 'model') filters.carModel = this.searchQuery;
    }

    this.productService.getMyProducts(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.products = res.data.products || [];
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          console.error('Failed to load products');
        }
      });
  }

  // --- RESTORED: This method is required by your HTML [style.backgroundImage]="..." ---
  getProductImage(product: Product): string {
    if (product.image && product.image.data) {
      try {
        const bufferData = product.image.data.data;
        const binary = String.fromCharCode(...new Uint8Array(bufferData));
        return `data:${product.image.contentType};base64,${window.btoa(binary)}`;
      } catch (e) {
        return 'assets/placeholder.png';
      }
    }
    return 'assets/placeholder.png'; 
  }

  openProductModal() {
    this.selectedFile = null;
    this.isEditing = false;
    this.productForm.reset({ category: this.categories[0], price: 0, stock: 1 });
    this.showProductModal = true;
  }

  // --- RESTORED: This method is required by your HTML (click)="editProduct(product)" ---
  editProduct(product: Product) {
    this.selectedFile = null;
    this.isEditing = true;
    
    this.productForm.patchValue({
      id: product._id,
      name: product.name,
      price: product.price,
      brand: product.brand,
      model: product.carModel,
      category: product.category,
      stock: product.stock,
      description: product.description
    });
    this.showProductModal = true;
  }

  onSaveProduct() {
    if (this.productForm.invalid) return;

    this.isLoading = true;
    const formVal = this.productForm.value;
    
    if (this.isEditing && formVal.id) {
      // Update logic
      this.productService.updateProduct(formVal.id, formVal, this.selectedFile || undefined)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.handleSuccess('Product Updated'),
          error: (err) => this.handleError(err)
        });
    } else {
      // Create logic
      // FIX: Check if file exists before calling create to solve 'File | null' error
      if (!this.selectedFile) {
        alert("Image is required for new products");
        this.isLoading = false;
        return;
      }
      
      this.productService.createProduct(formVal, this.selectedFile)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.handleSuccess('Product Created'),
          error: (err) => this.handleError(err)
        });
    }
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.loadMyProducts());
    }
  }

  onFileSelected(event: any) {
    if (event.target.files?.length) {
      this.selectedFile = event.target.files[0];
    }
  }
  
  closeProductModal() {
    this.showProductModal = false;
  }

  // Helpers to clean up the subscribe blocks
  private handleSuccess(msg: string) {
    this.showProductModal = false;
    this.loadMyProducts();
    this.isLoading = false;
    this.successMessage = msg;
    setTimeout(() => this.successMessage = '', 3000);
  }

  private handleError(err: any) {
    this.isLoading = false;
    alert(err.error?.message || 'Operation failed');
  }
}