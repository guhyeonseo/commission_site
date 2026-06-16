package com.commission.board.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.commission.board.dto.BoardCreateRequest;
import com.commission.board.dto.BoardResponse;
import com.commission.board.dto.BoardUpdateRequest;
import com.commission.board.entity.BoardType;
import com.commission.board.service.BoardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/boards")
public class BoardController {

	private final BoardService boardService;

    @PostMapping
    public ResponseEntity<Long> createBoard(
            Authentication auth,
            @RequestBody BoardCreateRequest request) {

        Long userId = (Long) auth.getPrincipal();

        Long boardId =
                boardService.createBoard(request, userId);

        return ResponseEntity.ok(boardId);
    }

    @GetMapping
    public ResponseEntity<List<BoardResponse>> getBoards(
            @RequestParam("type") BoardType type) {

        return ResponseEntity.ok(
                boardService.getBoards(type)
        );
    }

    @GetMapping("/{boardId}")
    public ResponseEntity<BoardResponse> getBoard(
            @PathVariable("boardId") Long boardId) {

        return ResponseEntity.ok(
                boardService.getBoard(boardId)
        );
    }
    
    @PutMapping("/{boardId}")
    public ResponseEntity<Long> updateBoard(
            @PathVariable("boardId") Long boardId,
            Authentication auth,
            @RequestBody BoardUpdateRequest request) {
    	
    	System.out.println("게시글 수정 진입");

        Long userId = (Long) auth.getPrincipal();

        return ResponseEntity.ok(
                boardService.updateBoard(
                        boardId,
                        userId,
                        request
                )
        );
    }
    
    @DeleteMapping("/{boardId}")
    public ResponseEntity<Void> deleteBoard(
            @PathVariable("boardId") Long boardId,
            Authentication auth) {

        Long userId = (Long) auth.getPrincipal();

        boardService.deleteBoard(boardId, userId);

        return ResponseEntity.noContent().build();
    }
    
}
