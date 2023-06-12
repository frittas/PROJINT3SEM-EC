import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { ChartComponent } from '../chart.component';

@Component({
  selector: 'line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})

export class LineComponent implements OnInit, ChartComponent {

  @ViewChild('hostLine')
  el!: ElementRef;
  @Input() dataUrl = '';
  @Input() titleText = '';

  loadData() {
    const data = d3.csvParse(this.dataUrl);
    this.drawLines(data);
  }

  //Parsers and Formaters
  private parseTime = d3.timeParse("%d/%m/%Y");

  private margin = { top: 40, right: 40, bottom: 40, left: 60 };
  private width = 700 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;

  ngAfterViewInit() {
    this.loadData();
  }

  drawLines(data: any[]): void {

    data = data.reverse();
    data.forEach((d) => {
      d.date = this.parseTime(d.date);
      d.price = Number(d.price);
    });

    const svg = d3.select(this.el.nativeElement).append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // Create the X-axis band scale

    const extX: Date[] = d3.extent(data, (d) => { return d.date; }) as Date[];
    const extY: Number[] = d3.extent(data, (d) => { return d.value / 1000; }) as Number[];

    const x = d3.scaleTime()
      .range([0, this.width])
      .domain(extX)
    const y = d3.scaleLinear()
      .range([this.height, 0])
      .domain(extY)

    // Line
    const line = d3.line()
      .x((d: any) => { return x(d.date as Date); })
      .y((d: any) => { return y(d.value / 1000); })

    // Axes
    svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y));

    //  Chart Title
    svg.append("text")
      .attr("x", (this.width / 2))
      .attr("y", 20 - (this.margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(this.titleText);


    const color = d3.scaleOrdinal(d3.schemeCategory10);


    // Data Lines:
    svg.append("path")
      .datum(data)
      .attr("stroke-width", 1)
      .attr("stroke", (d: any) => color(d.label))
      .attr("fill", "none")
      .attr("d", line)
      .append('title')
      .text((d: any) => `${d.date} - ${d.value}`);

    // svg.selectAll(".prices")
    //   .data(data)
    //   .enter()
    //   .append("path")
    //   .attr("d", line)
    //   .attr("stroke-width", 5)
    //   .attr("stroke", "black")
    //   .attr("fill", "none")
    //.style("stroke", "rgb(6,120,155)");

    // // Create and fill the bars
    // this.svg.selectAll("bars")
    // .data(data)
    // .enter()
    // .append("rect")
    // .attr("x", (d: any) => x(d.label))
    // .attr("y", (d: any) => y(d.value))
    // .attr("width", x.bandwidth())
    // .attr("height", (d: any) => this.height - y(d.value))
    // .attr("fill", (d: any) => color(d.label))
    // .append('title')
    // .text((d: any) => `${d.label} - ${d.value}`);
  }




  ngOnInit(): void {

  }
}