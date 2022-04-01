import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { BlockUiTemplateComponent } from './sharedModule/block-ui-template/block-ui-template.component';
import { BlockUIModule } from 'ng-block-ui';
import { AllUserManagementComponent } from './admin-management/admin-management.component';
import { ToastrModule } from 'ngx-toastr';
import { AppToDoListComponent } from './app-to-do-list/app-to-do-list.component';
import { ToDoListModuleModule } from './app-to-do-list/to-do-list-module.module';
import { SelectorModule } from './app-to-do-list/selector/selector.module';
import { OrganaizerModule } from './app-to-do-list/organaizer/organaizer.module';
import { CalendarComponent } from './app-to-do-list/calendar/calendar.component';
import { SelectorComponent } from './app-to-do-list/selector/selector.component';
import { OrganaizerComponent } from './app-to-do-list/organaizer/organaizer.component';
import { MomentPipe } from './pipes/moment.pipe';
import { SortPipe } from './pipes/sort.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MomentPipe,
    LoginComponent,
    RegisterComponent,
    CalendarComponent,
    SelectorComponent,
    OrganaizerComponent,
    UserManagementComponent,
    BlockUiTemplateComponent,
    AllUserManagementComponent,
    AppToDoListComponent,
    SortPipe,
  ],
  imports: [
    OrganaizerModule,
    SelectorModule,
    ToDoListModuleModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    BlockUIModule.forRoot({
      template: BlockUiTemplateComponent,
    }),
  ],
  entryComponents: [BlockUiTemplateComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
