import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-dashboard-seller',
  templateUrl: './dashboard-seller.component.html',
  styleUrls: ['./dashboard-seller.component.css']
})
export class DashboardSellerComponent implements OnInit {
  // --- UI State ---
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  showProductModal: boolean = false;
  isEditing: boolean = false;

   // 'products' is the default view
  currentView: 'products' | 'profile' = 'products'; 

  // --- Product State ---
  products: any[] = [];
  productForm: FormGroup;
  selectedFile: File | null = null;
  
  // --- Filter/Pagination State ---
  currentPage: number = 1;
  totalPages: number = 1;
  searchQuery: string = '';
  selectedCategory: string = '';
  selectedCriteria: string = 'name'; 
  categories: string[] = ['Spare parts', 'Tyres', 'Engine oil', 'Batteries', 'Liquids'];

  constructor(
    private fb: FormBuilder, 
    private productService: ProductService
  ) {
    // Product Form
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

  ngOnInit(): void {
    this.loadMyProducts();
  }

  // ================= PRODUCT LOGIC =================

  getProductImage(product: any): string {
    if (product.image && product.image.data) {
      // 1. Get the binary data. Mongoose returns Buffer as { type: 'Buffer', data: [...] }
      const bufferData = product.image.data.data; 
      
      // 2. Convert to Base64
      let binary = '';
      const bytes = new Uint8Array(bufferData);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      // 3. Return Data URI
      return `data:${product.image.contentType};base64,${window.btoa(binary)}`;
    }
    // Return placeholder if no image
    return 'assets/placeholder.png'; 
  }

  loadMyProducts() {
    this.isLoading = true;

    const filters: any = {
      page: this.currentPage,
      limit: 10,
      category: this.selectedCategory,
      sortBy: 'latest'
    };

    if (this.searchQuery) {
      if (this.selectedCriteria === 'name') filters.search = this.searchQuery;
      else if (this.selectedCriteria === 'brand') filters.brand = this.searchQuery;
      else if (this.selectedCriteria === 'model') filters.carModel = this.searchQuery;
    }

    this.productService.getMyProducts(filters).subscribe({
      next: (res: any) => {
        this.products = res.data.products;
        this.totalPages = res.data.pages; 
        this.isLoading = false;
      },
      error: () => {
        this.showError("Failed to load products");
        this.isLoading = false;
      }
    });
  }

  onFilterChange() {
    this.currentPage = 1; 
    this.loadMyProducts();
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  openProductModal() {
    this.isEditing = false;
    this.selectedFile = null;
    this.productForm.reset({ 
      category: this.categories[0], 
      price: 0, 
      stock: 1 
    });
    this.showProductModal = true;
  }

  editProduct(product: any) {
    this.isEditing = true;
    this.selectedFile = null;
    // Map backend field names to form control names
    this.productForm.patchValue({
      id: product._id, 
      name: product.name,
      price: product.price,
      brand: product.brand,
      model: product.carModel, // Note: backend 'carModel' -> form 'model'
      category: product.category,
      stock: product.stock,
      description: product.description
    });
    this.showProductModal = true;
  }

  closeProductModal() {
    this.showProductModal = false;
  }

  onSaveProduct() {
    if (this.productForm.invalid) return;
    
    this.isLoading = true;
    const formVal = this.productForm.value;

    const handleSuccess = (msg: string) => {
      this.showSuccess(msg);
      this.closeProductModal();
      this.loadMyProducts();
      this.isLoading = false;
    };

    const handleError = (err: any) => {
      this.showError(err.error?.message || "Operation failed");
      this.isLoading = false;
    };

    if (this.isEditing && formVal.id) {
      this.productService.updateProduct(formVal.id, formVal, this.selectedFile || undefined)
        .subscribe({ next: () => handleSuccess("Product updated"), error: handleError });
    } else {
      if (!this.selectedFile) {
        this.showError("Image is required for new products");
        this.isLoading = false;
        return;
      }
      this.productService.createProduct(formVal, this.selectedFile)
        .subscribe({ next: () => handleSuccess("Product created"), error: handleError });
    }
  }

  deleteProduct(id: string) {
    if(confirm("Are you sure you want to delete this product?")) {
      this.isLoading = true;
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.showSuccess("Product deleted");
          this.loadMyProducts();
        },
        error: () => {
          this.showError("Failed to delete");
          this.isLoading = false;
        }
      });
    }
  }

  // ================= HELPERS =================

  private scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private showSuccess(msg: string) {
    this.errorMessage = '';
    this.successMessage = msg;
    this.scrollToTop();
    setTimeout(() => this.successMessage = '', 3000);
  }

  private showError(msg: string) {
    this.successMessage = '';
    this.errorMessage = msg;
    this.scrollToTop();
    setTimeout(() => this.errorMessage = '', 3000);
  }
}