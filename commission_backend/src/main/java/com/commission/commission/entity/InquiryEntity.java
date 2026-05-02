package com.commission.commission.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "commission_inquiry")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InquiryEntity {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 커미션 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commission_id", nullable = false)
    private CommissionEntity commission;

    // 작성자
    @Column(name = "writer_id", nullable = false)
    private Long writerId;

    // 내용
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    // 비밀글 여부
    @Column(name = "is_secret")
    private boolean isSecret;

    // 부모 문의 (답글용)
    @Column(name = "parent_id")
    private Long parentId;

    // 생성일
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // 자동 시간 설정
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
    
    // 수정
    public void update(String content, boolean isSecret) {
        this.content = content;
        this.isSecret = isSecret;
    }
    
    // 삭제
    public void softDelete() {
        this.content = "삭제된 문의입니다.";
    }
    
}
