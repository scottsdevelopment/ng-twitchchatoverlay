import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigComponent } from './config/config.component';
import { ChatWidgetComponent } from './chat-widget/chat-widget.component';
import { HomepageComponent } from './homepage/homepage.component';

const routes: Routes = [
  { path: 'widgets/chat', component: ChatWidgetComponent },
  { path: '', component: HomepageComponent, children: [
    { path: 'config/chat', component: ConfigComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
