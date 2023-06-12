import { Component, ComponentRef, OnInit, Type, ViewChild, ViewRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { SelectDialogComponent } from '../select-dialog/select-dialog.component';
import { ChartHostDirective } from '../chart-host.directive';
import { PieComponent } from '../pie/pie.component';
import { BarComponent } from '../bar/bar.component';
import { LineComponent } from '../line/line.component';
import { ChartComponent } from '../chart.component';
import { ChartService } from '../chart-service.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  @ViewChild(ChartHostDirective, { static: true }) chartHost!: ChartHostDirective;

  constructor(private dialog: MatDialog, private chartService: ChartService) {
  }

  chartList: any[] = [];

  ngOnInit(): void {
    const existentCharts = this.chartService.get('charts');
    existentCharts.length && existentCharts.forEach((chart: any) => {
      this.addComponent(chart)
    });
  }

  saveDialog(formValue: any) {
    this.chartList.push(formValue)
    this.chartService.set('charts', this.chartList);
    this.addComponent(formValue)
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minHeight = 400;
    dialogConfig.minWidth = 500;
    dialogConfig.data = {
      description: 'Adcionar novo Chart',
      saveDialog: this.saveDialog.bind(this)
    };

    this.dialog.open(SelectDialogComponent, dialogConfig);
  }


  addComponent(data: any) {
    const viewContainerRef = this.chartHost.viewContainerRef;
    // viewContainerRef.clear();
    let componentType: Type<any>;
    switch (data.selectedValue) {
      case 'pie':
        componentType = PieComponent;
        break;
      case 'line':
        componentType = LineComponent;
        break;
      case 'bar':
        componentType = BarComponent;
        break;
      default:
        componentType = PieComponent;
        break;
    }

    const componentRef = viewContainerRef.createComponent<ChartComponent>(componentType);
    componentRef.instance.dataUrl = data.csv;
    componentRef.instance.titleText = data.title;
  }

  removeComponent(hostView: ViewRef) {
    const viewContainerRef = this.chartHost.viewContainerRef;
    const index = viewContainerRef.indexOf(hostView)
    if (index != -1) viewContainerRef.remove(index)
  }
}
