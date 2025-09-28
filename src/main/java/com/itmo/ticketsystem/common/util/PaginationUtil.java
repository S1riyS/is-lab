package com.itmo.ticketsystem.common.util;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;

import java.util.List;

public class PaginationUtil {

    /**
     * Creates a Pageable object with default pagination parameters
     */
    public static Pageable createPageable(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return PageRequest.of(page, size, sort);
    }

    /**
     * Creates a Pageable object with default values
     */
    public static Pageable createPageable(@PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return pageable;
    }

    /**
     * Creates a Page from a List with manual pagination
     */
    public static <T> Page<T> createPageFromList(List<T> content, Pageable pageable) {
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), content.size());
        List<T> pageContent = content.subList(start, end);
        return new org.springframework.data.domain.PageImpl<>(pageContent, pageable, content.size());
    }
}
