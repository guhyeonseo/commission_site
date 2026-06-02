package com.commission.commission.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.commission.commission.dto.CommissionSearchDto;
import com.commission.commission.entity.Commission;
import com.commission.commission.entity.CommissionStatus;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CommissionRepositoryImpl implements CommissionRepositoryCustom {

    private final EntityManager em;

    @Override
    public List<Commission> search(CommissionSearchDto cond) {

        StringBuilder jpql = new StringBuilder("select c from Commission c where c.status != :deleted");

        if (cond.getKeyword() != null && !cond.getKeyword().isEmpty()) {
            jpql.append(" and c.title like :keyword");
        }

        if (cond.getMinPrice() != null) {
            jpql.append(" and c.price >= :minPrice");
        }

        if (cond.getMaxPrice() != null) {
            jpql.append(" and c.price <= :maxPrice");
        }

        if (cond.getCategory() != null && !cond.getCategory().isEmpty()) {
            jpql.append(" and c.category = :category");
        }

        // 정렬
        if ("priceAsc".equals(cond.getSort())) {
            jpql.append(" order by c.price asc");
        } else if ("priceDesc".equals(cond.getSort())) {
            jpql.append(" order by c.price desc");
        } else {
            jpql.append(" order by c.createdAt desc");
        }

        TypedQuery<Commission> query =
                em.createQuery(
                        jpql.toString(),
                        Commission.class
                );
        
        query.setParameter(
                "deleted",
                CommissionStatus.DELETED
        );

        if (cond.getKeyword() != null && !cond.getKeyword().isEmpty()) {
            query.setParameter("keyword", "%" + cond.getKeyword() + "%");
        }

        if (cond.getMinPrice() != null) {
            query.setParameter("minPrice", cond.getMinPrice());
        }

        if (cond.getMaxPrice() != null) {
            query.setParameter("maxPrice", cond.getMaxPrice());
        }

        if (cond.getCategory() != null && !cond.getCategory().isEmpty()) {
            query.setParameter("category", cond.getCategory());
        }
        
      
        return query.getResultList();
    }
}