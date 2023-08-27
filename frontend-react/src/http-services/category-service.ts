import { HttpServiceBase } from 'src/http-services/http-service-base';
import { Category } from 'src/models/category';

export class CategoryService extends HttpServiceBase {
  static getAllCategories() {
    return this.get<Category[]>(`${this.apiUrl}/Category/GetAllCategories`);
  }
}
