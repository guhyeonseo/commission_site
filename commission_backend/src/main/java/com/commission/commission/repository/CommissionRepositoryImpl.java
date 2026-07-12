package com.commission.commission.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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
	    public Page<Commission> search(
	            CommissionSearchDto cond,
	            Pageable pageable
	    ) {

	        StringBuilder jpql = new StringBuilder(
	                "select c from Commission c where c.status != :deleted"
	        );

	        StringBuilder countJpql = new StringBuilder(
	                "select count(c) from Commission c where c.status != :deleted"
	        );

	        // 검색 조건
	        if (cond.getKeyword() != null && !cond.getKeyword().isBlank()) {
	            jpql.append(" and c.title like :keyword");
	            countJpql.append(" and c.title like :keyword");
	        }

	        if (cond.getMinPrice() != null) {
	            jpql.append(" and c.price >= :minPrice");
	            countJpql.append(" and c.price >= :minPrice");
	        }

	        if (cond.getMaxPrice() != null) {
	            jpql.append(" and c.price <= :maxPrice");
	            countJpql.append(" and c.price <= :maxPrice");
	        }

	        if (cond.getCategory() != null && !cond.getCategory().isBlank()) {
	            jpql.append(" and c.category = :category");
	            countJpql.append(" and c.category = :category");
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
	                em.createQuery(jpql.toString(), Commission.class);

	        TypedQuery<Long> countQuery =
	                em.createQuery(countJpql.toString(), Long.class);

	        // 공통 파라미터
	        query.setParameter("deleted", CommissionStatus.DELETED);
	        countQuery.setParameter("deleted", CommissionStatus.DELETED);

	        if (cond.getKeyword() != null && !cond.getKeyword().isBlank()) {
	            String keyword = "%" + cond.getKeyword() + "%";
	            query.setParameter("keyword", keyword);
	            countQuery.setParameter("keyword", keyword);
	        }

	        if (cond.getMinPrice() != null) {
	            query.setParameter("minPrice", cond.getMinPrice());
	            countQuery.setParameter("minPrice", cond.getMinPrice());
	        }

	        if (cond.getMaxPrice() != null) {
	            query.setParameter("maxPrice", cond.getMaxPrice());
	            countQuery.setParameter("maxPrice", cond.getMaxPrice());
	        }

	        if (cond.getCategory() != null && !cond.getCategory().isBlank()) {
	            query.setParameter("category", cond.getCategory());
	            countQuery.setParameter("category", cond.getCategory());
	        }

	        // 페이지 적용
	        query.setFirstResult((int) pageable.getOffset());
	        query.setMaxResults(pageable.getPageSize());

	        List<Commission> content = query.getResultList();
	        Long total = countQuery.getSingleResult();

	        return new PageImpl<>(
	                content,
	                pageable,
	                total
	        );
	    }
	}