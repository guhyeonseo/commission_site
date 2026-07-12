package com.commission.board.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.commission.board.dto.BoardCreateRequest;
import com.commission.board.dto.BoardResponse;
import com.commission.board.dto.BoardUpdateRequest;
import com.commission.board.entity.Board;
import com.commission.board.entity.BoardType;
import com.commission.board.repository.BoardRepository;
import com.commission.user.entity.User;
import com.commission.user.entity.UserRole;
import com.commission.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardService {

	private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    public Long createBoard(BoardCreateRequest request, Long userId) {

        User writer = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (request.getBoardType() == BoardType.NOTICE
                && writer.getRole() != UserRole.ADMIN) {

            throw new RuntimeException("공지 작성 권한이 없습니다.");
        }

        Board board = Board.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .boardType(request.getBoardType())
                .writer(writer)
                .build();

        return boardRepository.save(board).getId();
    }

    @Transactional(readOnly = true)
    public Page<BoardResponse> getBoards(
            BoardType type,
            String keyword,
            Pageable pageable) {

        Page<Board> boards;

        if (keyword == null || keyword.isBlank()) {

            boards = boardRepository
                    .findByBoardTypeOrderByCreatedAtDesc(
                            type,
                            pageable
                    );

        } else {

        	boards = boardRepository.searchBoards(
        	        type,
        	        keyword,
        	        pageable
        	);

        }

        return boards.map(BoardResponse::from);
    }

    @Transactional(readOnly = true)
    public BoardResponse getBoard(Long boardId) {

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        return BoardResponse.from(board);
    }
    
    public Long updateBoard(
            Long boardId,
            Long userId,
            BoardUpdateRequest request) {

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("게시글이 없습니다."));

        if (!board.getWriter().getId().equals(userId)) {
            throw new RuntimeException("수정 권한이 없습니다.");
        }

        board.setTitle(request.getTitle());
        board.setContent(request.getContent());

        return board.getId();
    }
    
    public void deleteBoard(Long boardId, Long userId) {

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("게시글이 없습니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        boolean isWriter =
                board.getWriter().getId().equals(userId);

        boolean isAdmin =
                user.getRole() == UserRole.ADMIN;

        if (!isWriter && !isAdmin) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }

        boardRepository.delete(board);
    }
    
}
