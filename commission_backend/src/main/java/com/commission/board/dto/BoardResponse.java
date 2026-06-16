package com.commission.board.dto;

import java.time.LocalDateTime;

import com.commission.board.entity.Board;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BoardResponse {

	private Long id;

    private String title;

    private String content;

    private String writerNickname;

    private String boardType;

    private LocalDateTime createdAt;
    
    private Long writerId;

    public static BoardResponse from(Board board) {

        return BoardResponse.builder()
                .id(board.getId())
                .title(board.getTitle())
                .content(board.getContent())
                .writerId(board.getWriter().getId())
                .writerNickname(board.getWriter().getNickname())
                .boardType(board.getBoardType().name())
                .createdAt(board.getCreatedAt())
                .build();
    }
    
}
