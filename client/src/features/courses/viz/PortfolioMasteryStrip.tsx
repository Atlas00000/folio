'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as d3 from 'd3';
import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import type { PortfolioStripPoint } from '../hub/buildPortfolioStrip';
import { folioVizColors, prefersReducedMotion } from './tokens';
import { useChartWidth } from './useChartWidth';

function fillFor(
  p: PortfolioStripPoint,
  colors: ReturnType<typeof folioVizColors>,
) {
  if (p.signal === 'untried') return colors.hairlineStrong;
  if (p.signal === 'weak') return colors.warn;
  return colors.ok;
}

/**
 * One mastery column per enrolled course — hub portfolio instrument.
 */
export function PortfolioMasteryStrip({
  points,
}: {
  points: PortfolioStripPoint[];
}) {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { wrapRef, width } = useChartWidth();

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl || width <= 0 || points.length === 0) return;

    const colors = folioVizColors();
    const height = 148;
    const margin = { top: 16, right: 12, bottom: 44, left: 36 };
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
      .scaleBand<string>()
      .domain(points.map((p) => p.courseId))
      .range([0, innerW])
      .padding(0.32);

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

    const barValue = (d: PortfolioStripPoint) =>
      d.totalAttempts === 0 ? 8 : Math.max(d.avgMastery, 6);

    const bars = g
      .selectAll('rect.portfolio-bar')
      .data(points)
      .join('rect')
      .attr('class', 'portfolio-bar')
      .attr('x', (d) => x(d.courseId) ?? 0)
      .attr('width', x.bandwidth())
      .attr('rx', 1)
      .attr('fill', (d) => fillFor(d, colors))
      .attr('opacity', 0.92)
      .attr('tabindex', 0)
      .attr('role', 'link')
      .attr(
        'aria-label',
        (d) =>
          `${d.code} ${d.title}: avg mastery ${d.avgMastery.toFixed(0)}, ${d.weak} weak, ${d.untried} untried. Open course.`,
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

    g.selectAll('text.value')
      .data(points.filter((p) => p.totalAttempts > 0))
      .join('text')
      .attr('class', 'value')
      .attr('x', (d) => (x(d.courseId) ?? 0) + x.bandwidth() / 2)
      .attr('y', (d) => y(barValue(d)) - 6)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.ink)
      .attr('font-size', 10)
      .attr('font-family', 'var(--folio-font-mono)')
      .text((d) => d.avgMastery.toFixed(0));

    g.selectAll('text.code')
      .data(points)
      .join('text')
      .attr('class', 'code')
      .attr('x', (d) => (x(d.courseId) ?? 0) + x.bandwidth() / 2)
      .attr('y', innerH + 18)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.signal)
      .attr('font-size', 11)
      .attr('font-family', 'var(--folio-font-mono)')
      .text((d) => d.code);

    g.selectAll('text.meta')
      .data(points)
      .join('text')
      .attr('class', 'meta')
      .attr('x', (d) => (x(d.courseId) ?? 0) + x.bandwidth() / 2)
      .attr('y', innerH + 34)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.faint)
      .attr('font-size', 9)
      .attr('font-family', 'var(--folio-font-mono)')
      .text((d) =>
        d.totalAttempts === 0
          ? 'Untried'
          : d.weak > 0
            ? `${d.weak} weak`
            : 'Solid',
      );

    bars.append('title').text(
      (d) =>
        `${d.code} — ${d.title}\nAvg mastery ${d.avgMastery.toFixed(0)}\n${d.attempted} attempted · ${d.weak} weak · ${d.untried} untried`,
    );
  }, [points, width, router]);

  if (points.length === 0) return null;

  const weakCourses = points.filter((p) => p.signal === 'weak').length;
  const summary = points
    .map(
      (p) =>
        `${p.code}: avg ${p.avgMastery.toFixed(0)}, ${p.signal}, ${p.weak} weak`,
    )
    .join('; ');

  return (
    <PageEnter stage={1}>
      <section aria-label="Portfolio mastery" className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--folio-hairline)] pb-2">
          <div>
            <Text as="h2" face="display" size="xl">
              Portfolio mastery
            </Text>
            <Text as="p" size="sm" tone="muted" className="mt-1">
              Average mastery across each enrolment — click a column to open the
              course.
            </Text>
          </div>
          <Text as="p" face="mono" size="xs" tone="faint">
            {weakCourses > 0
              ? `${weakCourses} course${weakCourses === 1 ? '' : 's'} need revisit`
              : 'Dashed = 70 threshold'}
          </Text>
        </div>

        <div ref={wrapRef}>
          <svg
            ref={svgRef}
            role="img"
            aria-label="Average mastery by enrolled course"
            className="block w-full overflow-visible"
          />
        </div>
        <p className="sr-only">{summary}</p>
      </section>
    </PageEnter>
  );
}
