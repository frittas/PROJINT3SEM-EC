import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})

export class BarComponent implements OnInit {

  @ViewChild('hostBar')
  el!: ElementRef;
  @Input() dataUrl = '';
  @Input() titleText = '';

  private svg: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  loadData() {
    d3.csv(this.dataUrl).then((data) => {
      this.drawBars(data);
    });
  }



  ngAfterViewInit() {
    this.loadData();
  }

  drawBars(data: any[]): void {
    const width = data.length * 150;


    const height = data.reduce((acc, curr) => {
      if (curr.value > acc) {
        acc = curr.value
      }
      return parseInt(acc);
    }, 0)

    this.el.nativeElement.setAttribute('width', width);
    this.el.nativeElement.setAttribute('height', this.height + (this.margin * 2));

    this.svg = d3.select(this.el.nativeElement)
      .append("svg")
      .attr("width", width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
    // Create the X-axis band scale
    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(data.map(d => d.label))
      .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Create the Y-axis band scale
    const y = d3.scaleLinear()
      .domain([0, height + 20])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append("g")
      .call(d3.axisLeft(y));

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create and fill the bars
    this.svg.selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d: any) => x(d.label))
      .attr("y", (d: any) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d: any) => this.height - y(d.value))
      .attr("fill", (d: any) => color(d.label))
      .append('title')
      .text((d: any) => `${d.label} - ${d.value}`);

      this.svg.append("g")
      .attr("transform", "translate(" + (width / 2 - 105) + "," + 15 + ")")
      .append("text")
      .text(this.titleText)
      .attr("class", "title");

  }


  ngOnInit(): void {

  }

}