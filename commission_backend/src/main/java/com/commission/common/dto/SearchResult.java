package com.commission.common.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SearchResult<T> {

    private List<T> content;

    private long totalElements;

}