import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CinemaAdminComponent } from './cinema-admin/cinema-admin.component';
import { CinemaClientComponent } from './cinema-client/cinema-client.component';

const routes: Routes = [{
  path: "admin", component: CinemaAdminComponent
}, {
  path: "client", component: CinemaClientComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
