'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as d3 from 'd3';
import { Text } from '@/design/primitives';
import { folioVizColors, prefersReducedMotion } from './tokens';
import { useChartWidth } from './useChartWidth';

export type MasterySpinePoint = {
  topicId: string;
  sequence: number;
  title: string;
  mastery: number;
  attempts: number;
  correct: number;
  weak: boolean;
  href: string;
};

function fillFor(
  point: MasterySpinePoint,
  colors: ReturnType<typeof folioVizColors>,
) {
  if (point.attempts === 0) return colors.hairlineStrong;
  if (point.weak) return colors.warn;
  return colors.ok;
}

/**
 * Horizontal mastery band — compact (course home) or full (progress page).
 */
export function MasterySpine({
  points,
  variant = 'compact',
}: {
  points: MasterySpinePoint[];
  variant?: 'compact' | 'full';
}) {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { wrapRef, width } = useChartWidth();
  const full = variant === 'full';

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl || width <= 0 || points.length === 0) return;

    const colors = folioVizColors();
    const height = full ? 168 : 88;
    const margin = full
      ? { top: 16, right: 12, bottom: 52, left: 36 }
      : { top: 12, right: 8, bottom: 28, left: 8 };
    const innerW = Math.max(width - margin.left - margin.right, 40);
    const innerH = height - margin.top - margin.bottom;
    const reduce = prefersReducedMotion();

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
      .scaleBand<number>()
      .domain(points.map((p) => p.sequence))
      .range([0, innerW])
      .padding(full ? 0.22 : 0.28);

    const y = d3.scaleLinear().domain([0, 100]).range([innerH, 0]);

    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerW)
      .attr('y1', innerH)
      .attr('y2', innerH)
      .attr('stroke', colors.hairline)
      .attr('stroke-width', 1);

    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerW)
      .attr('y1', y(70))
      .attr('y2', y(70))
      .attr('stroke', colors.hairlineStrong)
      .attr('stroke-dasharray', '2 4')
      .attr('stroke-width', 1);

    if (full) {
      const yAxis = d3
        .axisLeft(y)
        .tickValues([0, 70, 100])
        .tickSize(0)
        .tickPadding(8);
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
    }

    const bars = g
      .selectAll('rect.spine-bar')
      .data(points)
      .join('rect')
      .attr('class', 'spine-bar')
      .attr('x', (d) => x(d.sequence) ?? 0)
      .attr('width', x.bandwidth())
      .attr('rx', 1)
      .attr('fill', (d) => fillFor(d, colors))
      .attr('opacity', 0.92)
      .attr('tabindex', 0)
      .attr('role', 'link')
      .attr('aria-label', (d) => {
        const signal =
          d.attempts === 0 ? 'untried' : d.weak ? 'revisit' : 'solid';
        return `Topic ${String(d.sequence).padStart(2, '0')} ${d.title}: mastery ${d.mastery.toFixed(0)}, ${signal}. Open topic.`;
      })
      .style('cursor', 'pointer')
      .on('click', (_, d) => router.push(d.href))
      .on('keydown', (event, d) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          router.push(d.href);
        }
      });

    const barValue = (d: MasterySpinePoint) =>
      d.attempts === 0 ? 8 : Math.max(d.mastery, 6);

    if (reduce) {
      bars
        .attr('y', (d) => y(barValue(d)))
        .attr('height', (d) => innerH - y(barValue(d)));
    } else {
      bars
        .attr('y', innerH)
        .attr('height', 0)
        .transition()
        .duration(480)
        .ease(d3.easeCubicOut)
        .attr('y', (d) => y(barValue(d)))
        .attr('height', (d) => innerH - y(barValue(d)));
    }

    if (full) {
      g.selectAll('text.mastery')
        .data(points.filter((p) => p.attempts > 0))
        .join('text')
        .attr('class', 'mastery')
        .attr('x', (d) => (x(d.sequence) ?? 0) + x.bandwidth() / 2)
        .attr('y', (d) => y(barValue(d)) - 6)
        .attr('text-anchor', 'middle')
        .attr('fill', colors.ink)
        .attr('font-size', 10)
        .attr('font-family', 'var(--folio-font-mono)')
        .text((d) => d.mastery.toFixed(0));
    }

    g.selectAll('text.seq')
      .data(points)
      .join('text')
      .attr('class', 'seq')
      .attr('x', (d) => (x(d.sequence) ?? 0) + x.bandwidth() / 2)
      .attr('y', innerH + 16)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.faint)
      .attr('font-size', 10)
      .attr('font-family', 'var(--folio-font-mono)')
      .text((d) => String(d.sequence).padStart(2, '0'));

    if (full) {
      g.selectAll('text.title')
        .data(points)
        .join('text')
        .attr('class', 'title')
        .attr('x', (d) => (x(d.sequence) ?? 0) + x.bandwidth() / 2)
        .attr('y', innerH + 32)
        .attr('text-anchor', 'middle')
        .attr('fill', colors.muted)
        .attr('font-size', 9)
        .attr('font-family', 'var(--folio-font-body)')
        .text((d) =>
          d.title.length > 14 ? `${d.title.slice(0, 12)}…` : d.title,
        );
    }

    bars.append('title').text((d) => {
      const signal =
        d.attempts === 0 ? 'Untried' : d.weak ? 'Revisit' : 'Solid';
      return `${String(d.sequence).padStart(2, '0')} ${d.title}\n${signal} · mastery ${d.mastery.toFixed(0)} · ${d.correct}/${d.attempts}`;
    });
  }, [points, width, router, full]);

  if (points.length === 0) return null;

  const summary = points
    .map((p) => {
      const signal =
        p.attempts === 0 ? 'untried' : p.weak ? 'revisit' : 'solid';
      return `${String(p.sequence).padStart(2, '0')} ${p.title}: ${signal}, mastery ${p.mastery.toFixed(0)}`;
    })
    .join('; ');

  return (
    <div ref={wrapRef} className="space-y-2 pt-1">
      <div className="flex items-end justify-between gap-3">
        <Text as="p" face="label" tone="faint">
          {full ? 'Mastery spine · full' : 'Mastery spine'}
        </Text>
        <Text as="p" face="mono" size="xs" tone="faint">
          Dashed line = 70 threshold
        </Text>
      </div>
      <svg
        ref={svgRef}
        role="img"
        aria-label="Mastery by topic along the module"
        className="block w-full overflow-visible"
      />
      <p className="sr-only">{summary}</p>
      {full ? null : (
        <table className="sr-only">
          <caption>Mastery by topic</caption>
          <thead>
            <tr>
              <th>Sequence</th>
              <th>Topic</th>
              <th>Mastery</th>
              <th>Attempts</th>
              <th>Signal</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.topicId}>
                <td>{p.sequence}</td>
                <td>
                  <a href={p.href}>{p.title}</a>
                </td>
                <td>{p.mastery.toFixed(0)}</td>
                <td>
                  {p.correct}/{p.attempts}
                </td>
                <td>
                  {p.attempts === 0 ? 'untried' : p.weak ? 'revisit' : 'solid'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
