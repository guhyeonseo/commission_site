package com.commission.board.dto;

import com.commission.board.entity.BoardType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoardCreateRequest {

	private String title;

    private String content;

    private BoardType boardType;
    
}
