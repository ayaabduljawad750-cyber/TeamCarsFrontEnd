import { Component ,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface product{
  _id:string;
  name:string;
  brand?:string;
  carModel?:string;
  price:number;
  stock:number;
  description?:string;
  category:string;
  evaluation:number;
  image:{
    data:any;
    contentType:string;
  };
  sellerId:{
    _id:string;
    firstName:string;
    lastName:string;
    email:string;
  };
  creatAt:string;
  lastUpdateAt:string;
}

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: product | null = null;
  productImage: SafeUrl | null = null;

  quantity=1;
  activeTab="description";

  constructor(private route:ActivatedRoute,
    private productService:ProductService,
    private sanitizer:DomSanitizer){}

  ngOnInit(): void {
    this.route.params.subscribe(params =>{
      const productId =params['id'];
      this.loadproduct(productId);
    });
  }

  loadproduct(id: string): void{
    this.productService.getProduct(id).subscribe({
      next:(res)=>{
        this.product=res.data.product;

        if(this.product?.image?.data){
          this.productImage =this.convertBufferToImage(
            this.product.image.data,
            this.product.image.contentType
          );
        }
      },
      error: (err) => {
        console.error('error loading product:',err)
       // alert('loading product err')
      }

    });
  }

  convertBufferToImage(buffer:any,contentType:string):SafeUrl{
    const base64string = this.bufferToBase64(buffer);
    const imageUrl = `data:${contentType};base64,${base64string}`;
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  bufferToBase64(buffer:any):string{
    if(buffer.type === 'buffer'&& Array.isArray(buffer.data)){
      const bytes = new Uint8Array(buffer.data);
      let binary ='';
      for(let i=0; i< bytes.length;i++){
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
    }
    return '';

  }

      increaseQuantity():void{
        if(this.product && this.quantity <this.product.stock){
          this.quantity++;
        }
      }
      decreaseQuantity():void{
        if(this.quantity >1){
          this.quantity--;
        }
      }

      addToCart():void{
        if(!this.product)return;
        if(this.quantity>this.product.stock){
          alert('The requested quantity is not available in stock.');
          return;
        }
        alert(`${this.quantity} of ${this.product.name} has been added to the cart.`);


      }

      setActiveTab(tab:string):void{
        this.activeTab=tab;
      }

      getStarArray(rating:number):boolean[]{
        return Array(5).fill(false).map((_,i)=> i < Math.floor(rating));
      }

      getStockStatus():string{
        if(!this.product) return '';
        return this.product.stock > 0 ? 'In Stock' : 'Out of Stock';
      }
      // getStockStatusClass():string{
      //   if(!this.product) return '';
      //   return this.product.stock > 0 ? 'In Stock' : 'Out of Stock';
      // }

      getsellerName():string{
        if (!this.product?.sellerId) return '';
        return `${this.product.sellerId.firstName} ${this.product.sellerId.lastName}`;
      }

      formatDate(date:string):string{
        const d =new Date(date);
        return d.toLocaleDateString('en-US',{
          year:'numeric',
          month:'long',
          day:'numeric'
        });
      }

}
