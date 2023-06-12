import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-select-dialog',
  templateUrl: './select-dialog.component.html',
  styleUrls: ['./select-dialog.component.scss']
})
export class SelectDialogComponent {

  form!: FormGroup;
  description: string | undefined;
  selectedValue: string = '';
  saveDialog!: Function

  charts = [
    { value: 'pie', viewValue: 'Pie' },
    { value: 'bar', viewValue: 'Bar' },
    { value: 'line', viewValue: 'Line' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.description = data.description;
    this.saveDialog = data.saveDialog;
  }

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', []],
      selectedValue: ['', []],
      csv: ['', []],
    });
  }


  save() {
    this.saveDialog(this.form.value);
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}
