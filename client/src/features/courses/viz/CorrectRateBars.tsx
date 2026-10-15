'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as d3 from 'd3';
import { Text } from '@/design/primitives';
import type { MasterySpinePoint } from './MasterySpine';
import { folioVizColors, prefersReducedMotion } from './tokens';
import { useChartWidth } from './useChartWidth';

function rateOf(p: MasterySpinePoint) {
  if (p.attempts === 0) return 0;
  return p.correct / p.attempts;
}

function fillFor(
  p: MasterySpinePoint,
  colors: ReturnType<typeof folioVizColors>,
) {
  if (p.attempts === 0) return colors.hairlineStrong;
  const r = rateOf(p);
  if (r >= 0.7) return colors.ok;
  if (r >= 0.4) return colors.warn;
  return colors.halt;
}

/**
 * Correct / attempts ratio per topic — pairs with the progress ledger.
 */
export function CorrectRateBars({ points }: { points: MasterySpinePoint[] }) {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { wrapRef, width } = useChartWidth();

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl || width <= 0 || points.length === 0) return;

    const colors = folioVizColors();
    const rowH = 28;
    const margin = { top: 8, right: 56, bottom: 8, left: 120 };
    const height = margin.top + margin.bottom + points.length * rowH;
    const innerW = Math.max(width - margin.left - margin.right, 40);
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

    const y = d3
      .scaleBand<number>()
      .domain(points.map((p) => p.sequence))
      .range([0, points.length * rowH])
      .padding(0.35);

    const x = d3.scaleLinear().domain([0, 1]).range([0, innerW]);

    // Track
    g.selectAll('rect.track')
      .data(points)
      .join('rect')
      .attr('class', 'track')
      .attr('x', 0)
      .attr('y', (d) => y(d.sequence) ?? 0)
      .attr('width', innerW)
      .attr('height', y.bandwidth())
      .attr('fill', colors.hairline)
      .attr('rx', 1);

    // 70% guide
    g.append('line')
      .attr('x1', x(0.7))
      .attr('x2', x(0.7))
      .attr('y1', 0)
      .attr('y2', points.length * rowH)
      .attr('stroke', colors.hairlineStrong)
      .attr('stroke-dasharray', '2 4')
      .attr('stroke-width', 1);

    const bars = g
      .selectAll('rect.rate')
      .data(points)
      .join('rect')
      .attr('class', 'rate')
      .attr('x', 0)
      .attr('y', (d) => y(d.sequence) ?? 0)
      .attr('height', y.bandwidth())
      .attr('rx', 1)
      .attr('fill', (d) => fillFor(d, colors))
      .attr('tabindex', 0)
      .attr('role', 'link')
      .attr('aria-label', (d) => {
        const pct = (rateOf(d) * 100).toFixed(0);
        return `Topic ${String(d.sequence).padStart(2, '0')} ${d.title}: ${pct}% correct (${d.correct}/${d.attempts}). Open topic.`;
      })
      .style('cursor', 'pointer')
      .on('click', (_, d) => router.push(d.href))
      .on('keydown', (event, d) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          router.push(d.href);
        }
      });

    if (reduce) {
      bars.attr('width', (d) => Math.max(x(rateOf(d)), d.attempts === 0 ? 2 : 0));
    } else {
      bars
        .attr('width', 0)
        .transition()
        .duration(480)
        .ease(d3.easeCubicOut)
        .attr('width', (d) =>
          Math.max(x(rateOf(d)), d.attempts === 0 ? 2 : 0),
        );
    }

    g.selectAll('text.label')
      .data(points)
      .join('text')
      .attr('class', 'label')
      .attr('x', -10)
      .attr('y', (d) => (y(d.sequence) ?? 0) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('fill', colors.muted)
      .attr('font-size', 11)
      .attr('font-family', 'var(--folio-font-body)')
      .text(
        (d) =>
          `${String(d.sequence).padStart(2, '0')} ${
            d.title.length > 16 ? `${d.title.slice(0, 14)}…` : d.title
          }`,
      );

    g.selectAll('text.pct')
      .data(points)
      .join('text')
      .attr('class', 'pct')
      .attr('x', innerW + 10)
      .attr('y', (d) => (y(d.sequence) ?? 0) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('fill', colors.faint)
      .attr('font-size', 10)
      .attr('font-family', 'var(--folio-font-mono)')
      .text((d) =>
        d.attempts === 0 ? '—' : `${(rateOf(d) * 100).toFixed(0)}%`,
      );

    bars.append('title').text((d) => {
      const pct = d.attempts === 0 ? 'no attempts' : `${(rateOf(d) * 100).toFixed(0)}%`;
      return `${String(d.sequence).padStart(2, '0')} ${d.title}\n${pct} · ${d.correct}/${d.attempts} correct`;
    });
  }, [points, width, router]);

  if (points.length === 0) return null;

  const summary = points
    .map((p) => {
      const pct =
        p.attempts === 0 ? 'untried' : `${(rateOf(p) * 100).toFixed(0)}%`;
      return `${String(p.sequence).padStart(2, '0')} ${p.title}: ${pct}`;
    })
    .join('; ');

  return (
    <div ref={wrapRef} className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <div>
          <Text as="p" face="label" tone="faint">
            Correct rate
          </Text>
          <Text as="p" size="sm" tone="muted" className="mt-1">
            Share of marked attempts correct per topic.
          </Text>
        </div>
        <Text as="p" face="mono" size="xs" tone="faint">
          Dashed = 70%
        </Text>
      </div>
      <svg
        ref={svgRef}
        role="img"
        aria-label="Correct rate by topic"
        className="block w-full overflow-visible"
      />
      <p className="sr-only">{summary}</p>
    </div>
  );
}
