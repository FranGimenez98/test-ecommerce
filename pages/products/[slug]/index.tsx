import Layout from '@/components/layouts/layout'
import { useRouter } from 'next/router'
import React from 'react'

export default function ProductScreen({props}: any) {
    const router = useRouter()
    const product = router.query.slug;
  return (
    <Layout>
        <h2>{product}</h2>
    </Layout>
  )
}
