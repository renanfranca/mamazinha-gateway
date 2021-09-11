package com.mamazinha.gateway.service;

import com.mamazinha.gateway.domain.Humor;
import com.mamazinha.gateway.repository.HumorRepository;
import com.mamazinha.gateway.service.dto.HumorDTO;
import com.mamazinha.gateway.service.mapper.HumorMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link Humor}.
 */
@Service
@Transactional
public class HumorService {

    private final Logger log = LoggerFactory.getLogger(HumorService.class);

    private final HumorRepository humorRepository;

    private final HumorMapper humorMapper;

    public HumorService(HumorRepository humorRepository, HumorMapper humorMapper) {
        this.humorRepository = humorRepository;
        this.humorMapper = humorMapper;
    }

    /**
     * Save a humor.
     *
     * @param humorDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<HumorDTO> save(HumorDTO humorDTO) {
        log.debug("Request to save Humor : {}", humorDTO);
        return humorRepository.save(humorMapper.toEntity(humorDTO)).map(humorMapper::toDto);
    }

    /**
     * Partially update a humor.
     *
     * @param humorDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Mono<HumorDTO> partialUpdate(HumorDTO humorDTO) {
        log.debug("Request to partially update Humor : {}", humorDTO);

        return humorRepository
            .findById(humorDTO.getId())
            .map(
                existingHumor -> {
                    humorMapper.partialUpdate(existingHumor, humorDTO);

                    return existingHumor;
                }
            )
            .flatMap(humorRepository::save)
            .map(humorMapper::toDto);
    }

    /**
     * Get all the humors.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<HumorDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Humors");
        return humorRepository.findAllBy(pageable).map(humorMapper::toDto);
    }

    /**
     * Returns the number of humors available.
     * @return the number of entities in the database.
     *
     */
    public Mono<Long> countAll() {
        return humorRepository.count();
    }

    /**
     * Get one humor by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Mono<HumorDTO> findOne(Long id) {
        log.debug("Request to get Humor : {}", id);
        return humorRepository.findById(id).map(humorMapper::toDto);
    }

    /**
     * Delete the humor by id.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    public Mono<Void> delete(Long id) {
        log.debug("Request to delete Humor : {}", id);
        return humorRepository.deleteById(id);
    }
}
