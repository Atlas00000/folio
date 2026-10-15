'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as d3 from 'd3';
import { Text } from '@/design/primitives';
import type { TopicAttemptPeek } from '../topic/types';
import { folioVizColors, prefersReducedMotion } from './tokens';

type DatedAttempt = TopicAttemptPeek & { at: Date };

function toDated(attempts: TopicAttemptPeek[]): DatedAttempt[] {
  return attempts
    .filter((a) => a.submittedAt)
    .map((a) => ({
      ...a,
      at: new Date(a.submittedAt as string),
    }))
    .filter((a) => !Number.isNaN(a.at.getTime()))
    .sort((a, b) => a.at.getTime() - b.at.getTime());
}

/**
 * Sparse attempt timeline for one topic — correct/incorrect marks on real timestamps.
 */
export function AttemptRhythm({ attempts }: { attempts: TopicAttemptPeek[] }) {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  const dated = useMemo(() => toDated(attempts), [attempts]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl || width <= 0 || dated.length === 0) return;

    const colors = folioVizColors();
    const height = 64;
    const margin = { top: 14, right: 12, bottom: 22, left: 12 };
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

    const extent = d3.extent(dated, (d) => d.at) as [Date, Date];
    const span = extent[1].getTime() - extent[0].getTime();
    const padMs = Math.max(60_000, span * 0.08 || 60_000);
    const x = d3
      .scaleTime()
      .domain([
        new Date(extent[0].getTime() - padMs),
        new Date(extent[1].getTime() + padMs),
      ])
      .range([0, innerW]);

    const y = innerH / 2;

    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerW)
      .attr('y1', y)
      .attr('y2', y)
      .attr('stroke', colors.hairline)
      .attr('stroke-width', 1);

    const marks = g
      .selectAll('circle.attempt')
      .data(dated)
      .join('circle')
      .attr('class', 'attempt')
      .attr('cx', (d) => x(d.at))
      .attr('cy', y)
      .attr('fill', (d) => (d.correct ? colors.ok : colors.halt))
      .attr('stroke', colors.canvas)
      .attr('stroke-width', 1.5)
      .attr('tabindex', 0)
      .attr('role', 'link')
      .attr(
        'aria-label',
        (d) =>
          `${d.correct ? 'Correct' : 'Incorrect'} attempt ${d.attemptNumber} on ${d.at.toLocaleString()}. Open practice.`,
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
      marks.attr('r', 5);
    } else {
      marks
        .attr('r', 0)
        .transition()
        .duration(360)
        .delay((_, i) => i * 40)
        .ease(d3.easeCubicOut)
        .attr('r', 5);
    }

    marks.append('title').text(
      (d) =>
        `${d.correct ? 'Correct' : 'Incorrect'} · attempt ${d.attemptNumber}\n${d.at.toLocaleString()}\n${d.prompt.slice(0, 80)}`,
    );

    const tickFormat =
      span > 48 * 3600_000 ? d3.timeFormat('%d %b') : d3.timeFormat('%H:%M');

    const axis = d3
      .axisBottom(x)
      .ticks(Math.min(4, dated.length + 1))
      .tickSize(0)
      .tickPadding(8)
      .tickFormat((d) => tickFormat(d as Date));

    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(axis)
      .call((sel) => sel.select('.domain').attr('stroke', 'none'))
      .call((sel) =>
        sel
          .selectAll('text')
          .attr('fill', colors.faint)
          .attr('font-size', 10)
          .attr('font-family', 'var(--folio-font-mono)'),
      );
  }, [dated, width, router]);

  if (dated.length === 0) return null;

  const correctN = dated.filter((d) => d.correct).length;
  const summary = `${dated.length} attempt${dated.length === 1 ? '' : 's'} on this topic; ${correctN} correct. Latest ${dated[dated.length - 1].at.toLocaleString()}.`;

  return (
    <div
      ref={wrapRef}
      className="space-y-2 border-t border-[var(--folio-hairline)] pt-4"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <Text as="p" face="label" tone="faint">
          Attempt rhythm
        </Text>
        <div className="flex gap-4">
          <Text
            as="span"
            face="mono"
            size="xs"
            className="text-[var(--folio-ok)]"
          >
            ● Correct
          </Text>
          <Text
            as="span"
            face="mono"
            size="xs"
            className="text-[var(--folio-halt)]"
          >
            ● Incorrect
          </Text>
        </div>
      </div>
      <svg
        ref={svgRef}
        role="img"
        aria-label="Timeline of attempts on this topic"
        className="block w-full overflow-visible"
      />
      <p className="sr-only">{summary}</p>
    </div>
  );
}
