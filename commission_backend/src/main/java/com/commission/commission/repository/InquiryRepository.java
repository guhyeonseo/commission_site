package com.commission.commission.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.commission.commission.entity.InquiryEntity;

public interface InquiryRepository extends JpaRepository<InquiryEntity, Long> {

	// 특정 커미션에 모든 문의 조회 및 작성 시간 오름차순
	List<InquiryEntity> findByCommission_Id(Long commissionId);

	// 특정 부모 댓글에 달린 대댓글 조회
	List<InquiryEntity> findByParentId(Long parentId);

	// 특정 커미션 + 특정 부모 댓글 기준으로 조회
    List<InquiryEntity> findByCommission_IdAndParentId(Long commissionId, Long parentId);

    // 특정 댓글에 자식 댓글이 존재하는지 확인 
    // 삭제 시 soft delete 여부 판단
    boolean existsByParentId(Long parentId);
}