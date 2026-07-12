package com.commission.board.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.commission.board.entity.Board;
import com.commission.board.entity.BoardType;

public interface BoardRepository extends JpaRepository<Board, Long>{

	Page<Board> findByBoardTypeOrderByCreatedAtDesc(
	        BoardType type,
	        Pageable pageable
	);

	@Query("""
		    SELECT b
		    FROM Board b
		    WHERE b.boardType = :type
		      AND (
		           LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
		        OR LOWER(b.content) LIKE LOWER(CONCAT('%', :keyword, '%'))
		      )
		    ORDER BY b.createdAt DESC
		""")
		Page<Board> searchBoards(
		        @Param("type") BoardType type,
		        @Param("keyword") String keyword,
		        Pageable pageable
		);
	
}
