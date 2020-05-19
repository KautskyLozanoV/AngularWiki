import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { SearchComponent } from './search/search.component';
import { PageComponent } from './page/page.component';


const routes: Routes = [
  { path: '', component: MainComponent},
  { path: 'search', component: SearchComponent},
  { path: 'page/:id', component: PageComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
