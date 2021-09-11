package com.mamazinha.gateway.repository;

import com.mamazinha.gateway.domain.Humor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data SQL reactive repository for the Humor entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HumorRepository extends R2dbcRepository<Humor, Long>, HumorRepositoryInternal {
    Flux<Humor> findAllBy(Pageable pageable);

    // just to avoid having unambigous methods
    @Override
    Flux<Humor> findAll();

    @Override
    Mono<Humor> findById(Long id);

    @Override
    <S extends Humor> Mono<S> save(S entity);
}

interface HumorRepositoryInternal {
    <S extends Humor> Mono<S> insert(S entity);
    <S extends Humor> Mono<S> save(S entity);
    Mono<Integer> update(Humor entity);

    Flux<Humor> findAll();
    Mono<Humor> findById(Long id);
    Flux<Humor> findAllBy(Pageable pageable);
    Flux<Humor> findAllBy(Pageable pageable, Criteria criteria);
}
