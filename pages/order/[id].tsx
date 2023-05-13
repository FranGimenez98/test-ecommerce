import Layout from '@/components/layouts/layout'
import React from 'react'

export default function OrderScreen() {
  return (
    <Layout>
        <div>
          <h2>Tu orden</h2>
          <button className="bg-black text-white">
            Realizar compra
          </button>
        </div>
    </Layout>
  )
}
