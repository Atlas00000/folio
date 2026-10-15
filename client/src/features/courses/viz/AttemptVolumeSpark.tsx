'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as d3 from 'd3';
import { Text } from '@/design/primitives';
import type { MasterySpinePoint } from './MasterySpine';
import { folioVizColors, prefersReducedMotion } from './tokens';
import { useChartWidth } from './useChartWidth';

/**
 * Attempt load along the topic spine — volume of practice, not a vanity streak.
 */
export function AttemptVolumeSpark({ points }: { points: MasterySpinePoint[] }) {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { wrapRef, width } = useChartWidth();

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl || width <= 0 || points.length === 0) return;

    const colors = folioVizColors();
    const height = 96;
    const margin = { top: 12, right: 12, bottom: 28, left: 36 };
    const innerW = Math.max(width - margin.left - margin.right, 40);
    const innerH = height - margin.top - margin.bottom;
    const reduce = prefersReducedMotion();
    const maxAttempts = Math.max(1, ...points.map((p) => p.attempts));

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();
    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', width)
      .attr('height', height);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scalePoint<number>()
      .domain(points.map((p) => p.sequence))
      .range([0, innerW])
      .padding(0.35);

    const y = d3.scaleLinear().domain([0, maxAttempts]).nice().range([innerH, 0]);

    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerW)
      .attr('y1', innerH)
      .attr('y2', innerH)
      .attr('stroke', colors.hairline)
      .attr('stroke-width', 1);

    const yAxis = d3
      .axisLeft(y)
      .ticks(Math.min(4, maxAttempts))
      .tickSize(0)
      .tickPadding(8)
      .tickFormat((d) => String(d));

    g.append('g')
      .call(yAxis)
      .call((sel) => sel.select('.domain').attr('stroke', 'none'))
      .call((sel) =>
        sel
          .selectAll('text')
          .attr('fill', colors.faint)
          .attr('font-size', 10)
          .attr('font-family', 'var(--folio-font-mono)'),
      );

    const line = d3
      .line<MasterySpinePoint>()
      .x((d) => x(d.sequence) ?? 0)
      .y((d) => y(d.attempts))
      .curve(d3.curveMonotoneX);

    const area = d3
      .area<MasterySpinePoint>()
      .x((d) => x(d.sequence) ?? 0)
      .y0(innerH)
      .y1((d) => y(d.attempts))
      .curve(d3.curveMonotoneX);

    const areaPath = g
      .append('path')
      .datum(points)
      .attr('fill', colors.signalDim)
      .attr('d', area);

    const linePath = g
      .append('path')
      .datum(points)
      .attr('fill', 'none')
      .attr('stroke', colors.signal)
      .attr('stroke-width', 1.5)
      .attr('d', line);

    if (!reduce) {
      const lineLen = (linePath.node() as SVGPathElement)?.getTotalLength?.() ?? 0;
      linePath
        .attr('stroke-dasharray', `${lineLen} ${lineLen}`)
        .attr('stroke-dashoffset', lineLen)
        .transition()
        .duration(520)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0);
      areaPath.attr('opacity', 0).transition().duration(420).attr('opacity', 1);
    }

    const dots = g
      .selectAll('circle.vol')
      .data(points)
      .join('circle')
      .attr('class', 'vol')
      .attr('cx', (d) => x(d.sequence) ?? 0)
      .attr('cy', (d) => y(d.attempts))
      .attr('fill', colors.signal)
      .attr('stroke', colors.canvas)
      .attr('stroke-width', 1.5)
      .attr('tabindex', 0)
      .attr('role', 'link')
      .attr(
        'aria-label',
        (d) =>
          `Topic ${String(d.sequence).padStart(2, '0')} ${d.title}: ${d.attempts} attempts, ${d.correct} correct. Open topic.`,
      )
      .style('cursor', 'pointer')
      .on('click', (_, d) => router.push(d.href))
      .on('keydown', (event, d) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          router.push(d.href);
        }
      });

    if (reduce) {
      dots.attr('r', 4);
    } else {
      dots
        .attr('r', 0)
        .transition()
        .delay((_, i) => 200 + i * 40)
        .duration(280)
        .attr('r', 4);
    }

    dots
      .append('title')
      .text(
        (d) =>
          `${String(d.sequence).padStart(2, '0')} ${d.title}\n${d.attempts} attempts · ${d.correct} correct`,
      );

    g.selectAll('text.seq')
      .data(points)
      .join('text')
      .attr('class', 'seq')
      .attr('x', (d) => x(d.sequence) ?? 0)
      .attr('y', innerH + 16)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.faint)
      .attr('font-size', 10)
      .attr('font-family', 'var(--folio-font-mono)')
      .text((d) => String(d.sequence).padStart(2, '0'));
  }, [points, width, router]);

  if (points.length === 0) return null;

  const total = points.reduce((s, p) => s + p.attempts, 0);
  const summary = `Attempt volume across ${points.length} topics: ${total} total attempts.`;

  return (
    <div ref={wrapRef} className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <div>
          <Text as="p" face="label" tone="faint">
            Attempt volume
          </Text>
          <Text as="p" size="sm" tone="muted" className="mt-1">
            Practice load by topic — not a streak.
          </Text>
        </div>
        <Text as="p" face="mono" size="xs" tone="faint">
          {total} attempts
        </Text>
      </div>
      <svg
        ref={svgRef}
        role="img"
        aria-label="Attempts per topic"
        className="block w-full overflow-visible"
      />
      <p className="sr-only">{summary}</p>
    </div>
  );
}
