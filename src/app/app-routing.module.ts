import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { SearchComponent } from './search/search.component';
import { PageComponent } from './page/page.component';
import { SaveComponent } from './page/save/save.component';
import { DemoComponent } from './demo/demo.component';
import { HistoryComponent } from './history/history.component';
import { DiffComponent } from './diff/diff.component';


const routes: Routes = [
  { path: '', component: MainComponent},
  { path: 'search', component: SearchComponent},
  { path: 'page/save', component: SaveComponent},
  { path: 'page/save/:id', component: SaveComponent},
  { path: 'page/:id', component: PageComponent},
  { path: 'page/:id/history', component: HistoryComponent},
  { path: 'page/:id/diff/:version', component: DiffComponent},
  { path: 'demo', component: DemoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
