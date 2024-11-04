import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { ProductService } from './product.service';
import { Modal } from 'bootstrap';
import { Router } from '@angular/router';
import { Product } from './product';
import Category from './category';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  @ViewChild('rescheduleModal', { static: true }) rescheduleModal!: ElementRef;
  products: Product[] = [];
  showModal: boolean = false;
  successMessage: string = '';
  showAlert: boolean = false;
  productId!: number;
  filterName: string = '';
  filterCategory: string = '';
  sortAscending: boolean = true;
  categories: Category[] = [];
  productForm: FormGroup;
  selectedCategory: string | undefined;
  page = 0;
  size = 10;
  totalPages = 1;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      available: [false]
    });
  }
  async ngOnInit() {
    this.getProducts();
  }

  hideAlertAfterDelay() {
    setTimeout(() => {
      this.showAlert = false;
    }, 4000);
  }

  getProducts() {
    this.products = [];

    const modalElement = document.getElementById('productDetail');

    this.productService.getProducts(this.filterName, this.filterCategory, this.page, this.size)
    .subscribe(response => {
      this.products = response.content;
      this.totalPages = response.totalPages;
    });
  }

  nextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.getProducts();
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.getProducts();
    }
  }

  productEdit(product: Product) {
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      category: product.category.id,
      price: product.price,
      available: product.available
    });
    this.selectedCategory = String(product.category.id);
    this.productId = product.id
    this.loadCategories();
  }

  selectProduct(product: Product) {
    this.productId = product.id
  }

  deleteProduct() {
    this.productService.deleteProduct(this.productId).subscribe(() => {
      this.getProducts();
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const updatedProduct: Product = {
        id: this.productId,
        ...this.productForm.value,
        category: {id: this.selectedCategory}
      };

      this.productService.updateProduct(updatedProduct).subscribe(() => {
        this.getProducts();
      });
    }
  }

  selectCategory(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCategoryId = selectElement.value; // Obter o ID da categoria selecionada
    this.selectedCategory = selectedCategoryId;
  }

  hideModal(modalId: string) {
    const element = document.getElementById(modalId);
    if (element) {
      const modal = Modal.getInstance(element);
      if (modal) {
        modal.hide();
      }
    }
  }

  filteredProducts(): Product[] {
    return this.products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(this.filterName.toLowerCase())
      )
      .sort((a, b) =>
        this.sortAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      );
  }

  sortByName() {
    this.sortAscending = !this.sortAscending;
  }

}
function showModal(element: HTMLElement | null) {
  if (element) {
    const modal = new Modal(element);
    console.log(modal);

    modal.show();
  }
}