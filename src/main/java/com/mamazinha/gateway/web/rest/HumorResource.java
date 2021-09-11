package com.mamazinha.gateway.web.rest;

import com.mamazinha.gateway.repository.HumorRepository;
import com.mamazinha.gateway.service.HumorService;
import com.mamazinha.gateway.service.dto.HumorDTO;
import com.mamazinha.gateway.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.reactive.ResponseUtil;

/**
 * REST controller for managing {@link com.mamazinha.gateway.domain.Humor}.
 */
@RestController
@RequestMapping("/api")
public class HumorResource {

    private final Logger log = LoggerFactory.getLogger(HumorResource.class);

    private static final String ENTITY_NAME = "humor";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HumorService humorService;

    private final HumorRepository humorRepository;

    public HumorResource(HumorService humorService, HumorRepository humorRepository) {
        this.humorService = humorService;
        this.humorRepository = humorRepository;
    }

    /**
     * {@code POST  /humors} : Create a new humor.
     *
     * @param humorDTO the humorDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new humorDTO, or with status {@code 400 (Bad Request)} if the humor has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/humors")
    public Mono<ResponseEntity<HumorDTO>> createHumor(@Valid @RequestBody HumorDTO humorDTO) throws URISyntaxException {
        log.debug("REST request to save Humor : {}", humorDTO);
        if (humorDTO.getId() != null) {
            throw new BadRequestAlertException("A new humor cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return humorService
            .save(humorDTO)
            .map(
                result -> {
                    try {
                        return ResponseEntity
                            .created(new URI("/api/humors/" + result.getId()))
                            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                            .body(result);
                    } catch (URISyntaxException e) {
                        throw new RuntimeException(e);
                    }
                }
            );
    }

    /**
     * {@code PUT  /humors/:id} : Updates an existing humor.
     *
     * @param id the id of the humorDTO to save.
     * @param humorDTO the humorDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated humorDTO,
     * or with status {@code 400 (Bad Request)} if the humorDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the humorDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/humors/{id}")
    public Mono<ResponseEntity<HumorDTO>> updateHumor(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody HumorDTO humorDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Humor : {}, {}", id, humorDTO);
        if (humorDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, humorDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return humorRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    return humorService
                        .save(humorDTO)
                        .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                        .map(
                            result ->
                                ResponseEntity
                                    .ok()
                                    .headers(
                                        HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString())
                                    )
                                    .body(result)
                        );
                }
            );
    }

    /**
     * {@code PATCH  /humors/:id} : Partial updates given fields of an existing humor, field will ignore if it is null
     *
     * @param id the id of the humorDTO to save.
     * @param humorDTO the humorDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated humorDTO,
     * or with status {@code 400 (Bad Request)} if the humorDTO is not valid,
     * or with status {@code 404 (Not Found)} if the humorDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the humorDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/humors/{id}", consumes = "application/merge-patch+json")
    public Mono<ResponseEntity<HumorDTO>> partialUpdateHumor(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody HumorDTO humorDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Humor partially : {}, {}", id, humorDTO);
        if (humorDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, humorDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return humorRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    Mono<HumorDTO> result = humorService.partialUpdate(humorDTO);

                    return result
                        .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                        .map(
                            res ->
                                ResponseEntity
                                    .ok()
                                    .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, res.getId().toString()))
                                    .body(res)
                        );
                }
            );
    }

    /**
     * {@code GET  /humors} : get all the humors.
     *
     * @param pageable the pagination information.
     * @param request a {@link ServerHttpRequest} request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of humors in body.
     */
    @GetMapping("/humors")
    public Mono<ResponseEntity<List<HumorDTO>>> getAllHumors(Pageable pageable, ServerHttpRequest request) {
        log.debug("REST request to get a page of Humors");
        return humorService
            .countAll()
            .zipWith(humorService.findAll(pageable).collectList())
            .map(
                countWithEntities -> {
                    return ResponseEntity
                        .ok()
                        .headers(
                            PaginationUtil.generatePaginationHttpHeaders(
                                UriComponentsBuilder.fromHttpRequest(request),
                                new PageImpl<>(countWithEntities.getT2(), pageable, countWithEntities.getT1())
                            )
                        )
                        .body(countWithEntities.getT2());
                }
            );
    }

    /**
     * {@code GET  /humors/:id} : get the "id" humor.
     *
     * @param id the id of the humorDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the humorDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/humors/{id}")
    public Mono<ResponseEntity<HumorDTO>> getHumor(@PathVariable Long id) {
        log.debug("REST request to get Humor : {}", id);
        Mono<HumorDTO> humorDTO = humorService.findOne(id);
        return ResponseUtil.wrapOrNotFound(humorDTO);
    }

    /**
     * {@code DELETE  /humors/:id} : delete the "id" humor.
     *
     * @param id the id of the humorDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/humors/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public Mono<ResponseEntity<Void>> deleteHumor(@PathVariable Long id) {
        log.debug("REST request to delete Humor : {}", id);
        return humorService
            .delete(id)
            .map(
                result ->
                    ResponseEntity
                        .noContent()
                        .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                        .build()
            );
    }
}
