import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';

import { Category } from './../shared/category.model';
import { CategoryService } from './../shared/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  public currentAction: string;
  public categoryForm: FormGroup;
  public pageTitle: string;
  public serverErrorMessages: string[] = null;
  public submittingForm = false;
  public category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  public submitForm(): void {
    this.submittingForm = true;

    this.currentAction === 'new' ?
      this.createCategory() :
      this.updateCategory();
  }

  private createCategory(): void {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.create(category)
      .subscribe(
        (category) => this.actionsForSuccess(category),
        (error) => this.actionsForError(error)
      );
  }

  private updateCategory(): void {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.update(category)
      .subscribe(
        (category) => this.actionsForSuccess(category),
        (error) => this.actionsForError(error)
      );
  }

  private actionsForSuccess(category: Category): void {
    this.currentAction === 'new' ?
      toastr.success('Nova categoria criada com sucesso') :
      toastr.success('Categoria alterada com sucesso');

    this.router.navigateByUrl('/categories', { skipLocationChange: true })
      .then(() => this.router.navigate(['categories', category.id, 'edit']))
      .catch((error) => alert('Ocorreu um erro no redirect da página ' + error));
  }

  private actionsForError(error): void {
    toastr.console.error('Ocorreu um erro na tentativa de processar sua solicitação, por favor tente novamente mais tarde');

    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ['Falha na comunicação com o servidor, por favor tenta novamente mais tarde']
    }
  }

  private setPageTitle(): void {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de Nova Categoria';
    } else {
      const categoryName = this.category.name || '';
      this.pageTitle = 'Editando Categoria: ' + categoryName;
    }
  }

  private setCurrentAction(): void {
    this.route.snapshot.url[0].path === 'new' ?
      this.currentAction = 'new' :
      this.currentAction = 'edit';
  }

  private buildCategoryForm(): void {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      description: [null],
      name: [null, [Validators.required, Validators.minLength(2)]]
    });
  }

  private loadCategory(): void {
    if (this.currentAction === 'edit') {
      this.route.paramMap
        .pipe(
          switchMap((params) => this.categoryService.getById(Number(params.get('id'))))
        )
        .subscribe(
          (category) => {
            this.category = category;
            this.categoryForm.patchValue(this.category);
          },
          (error) => alert('Erro ao tentar executar operação, por favor tente novamente mais tarde ' + error)
        );
    }
  }

}
