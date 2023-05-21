import { IProduct } from '@/interfaces/IProduct';
import Link from 'next/link';
import React from 'react'


export default function Paginate({ currentPage, totalPages }: { currentPage: number, totalPages:number }) {
    const showPages = 9; // Número de páginas visibles en el paginado

    // Calcula el rango de páginas a mostrar
    let startPage = currentPage - Math.floor(showPages / 2);
    let endPage = currentPage + Math.floor(showPages / 2);
  
    if (startPage < 1) {
      startPage = 1;
      endPage = Math.min(showPages, totalPages);
    } else if (endPage > totalPages) {
      startPage = Math.max(1, totalPages - showPages + 1);
      endPage = totalPages;
    }
  
    // Genera los elementos de paginación
    const paginationItems = [];
    for (let page = startPage; page <= endPage; page++) {
      const isActive = page === currentPage;
      paginationItems.push(
        <Link key={page} href={`?page=${page}`} passHref>
          <button className={isActive ? 'active' : ''}>{page}</button>
        </Link>
      );
    }
  
    return (
      <div className="pagination">
        {currentPage > 1 && (
          <Link href={`?page=${currentPage - 1}`} passHref>
            <button className="prev">← Retroceder</button>
          </Link>
        )}
  
        {paginationItems}
  
        {currentPage < totalPages && (
          <Link href={`?page=${currentPage + 1}`} passHref>
            <button className="next">Siguiente →</button>
          </Link>
        )}
      </div>
    );
}
