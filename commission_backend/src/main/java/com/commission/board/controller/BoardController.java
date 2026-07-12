package com.commission.board.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
import org.springframework.web.multipart.MultipartFile;

import com.commission.board.dto.BoardCreateRequest;
import com.commission.board.dto.BoardResponse;
import com.commission.board.dto.BoardUpdateRequest;
import com.commission.board.entity.BoardType;
import com.commission.board.service.BoardService;
import com.commission.common.file.FileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/boards")
public class BoardController {

	private final BoardService boardService;
	
	private final FileService fileService;

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
    public ResponseEntity<Page<BoardResponse>> getBoards(
            @RequestParam("type") BoardType type,
            @RequestParam(value = "keyword", required = false) String keyword,
            Pageable pageable
    ) {

        return ResponseEntity.ok(
                boardService.getBoards(type, keyword, pageable)
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
    
    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file
    ) throws Exception {

        String imageUrl =
                fileService.saveFile(file, "board");

        return ResponseEntity.ok(imageUrl);
    }
    
}
