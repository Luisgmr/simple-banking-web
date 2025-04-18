"use client"

import Link from 'next/link'
import { House } from 'phosphor-react'

export default function Home() {
  return (
      <main className="p-8 font-sans">
        <h1 className="text-2xl font-bold flex gap-2 items-center">
          <House size={28} weight="duotone" /> Prova Prática SENAI
        </h1>
        <p className="mt-4">Escolha um módulo:</p>
        <ul className="list-disc ml-5">
          <li><Link className="text-blue-600" href="/pessoas">Pessoa</Link></li>
          <li><Link className="text-blue-600" href="/contas">Conta</Link></li>
          <li><Link className="text-blue-600" href="/movimentacoes">Movimentação</Link></li>
        </ul>
      </main>
  )
}