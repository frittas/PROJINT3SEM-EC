import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as Papa from 'papaparse';


@Component({
  selector: 'pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss']
})
export class PieComponent implements OnInit {
  @ViewChild('host')
  el!: ElementRef;
  @Input() dataUrl = '';
  @Input() title = '';


  ngAfterViewInit() {
    var svg = d3.select(this.el.nativeElement),
      width = parseInt(svg.attr("width")),
      height = parseInt(svg.attr("height")),
      radius = Math.min(width, height) / 2.2,
      g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // Generate the pie
    const pie = d3.pie<any>()
      .sort(null)
      .value((d: any) => d.value);


    var path = d3.arc<d3.PieArcDatum<any>>()
      .outerRadius(radius - 10)
      .innerRadius(0);


    var label = d3.arc()
      .outerRadius(radius)
      .innerRadius(radius - 80);


    d3.csv(this.dataUrl).then((data) => {


      var arc = g.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

      arc.append("path")
        .attr("d", path)
        .attr("fill", (d: any) => color(d.data.label));

      console.log(arc)

      arc.append("text")
        .attr("transform", (d: any) => "translate(" + label.centroid(d) + ")")
        .text((d: any) => d.data.label);

    }).catch(error => console.error(error));

    svg.append("g")
      .attr("transform", "translate(" + (width / 2 - 75) + "," + 15 + ")")
      .append("text")
      .text(this.title)
      .attr("class", "title")
  }

  ngOnInit(): void {


  }
}
