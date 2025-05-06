import React from 'react'
import { TreeStats } from '../utils/stats'

export default function StatsPanel({ stats }: { stats: TreeStats }) {
  return (
    <div>
      <h2 className="font-semibold">Statistics</h2>
      <ul className="mt-2 space-y-1 text-sm">
        <li>Total nodes: {stats.total}</li>
        <li>Depth: {stats.maxDepth}</li>
        <li>Root nodes: {stats.counts.root}</li>
        <li>Object nodes: {stats.counts.object}</li>
        <li>List nodes: {stats.counts.list}</li>
        <li>Data nodes: {stats.counts.data}</li>
      </ul>
    </div>
  )
}
