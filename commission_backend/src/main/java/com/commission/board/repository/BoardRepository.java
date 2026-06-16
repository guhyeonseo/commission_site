package com.commission.board.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.commission.board.entity.Board;
import com.commission.board.entity.BoardType;

public interface BoardRepository extends JpaRepository<Board, Long>{

	List<Board> findByBoardTypeOrderByCreatedAtDesc(BoardType boardType);
	
}
