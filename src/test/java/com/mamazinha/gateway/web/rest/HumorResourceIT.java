package com.mamazinha.gateway.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.mamazinha.gateway.IntegrationTest;
import com.mamazinha.gateway.domain.Humor;
import com.mamazinha.gateway.repository.HumorRepository;
import com.mamazinha.gateway.service.EntityManager;
import com.mamazinha.gateway.service.dto.HumorDTO;
import com.mamazinha.gateway.service.mapper.HumorMapper;
import java.time.Duration;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link HumorResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient
@WithMockUser
class HumorResourceIT {

    private static final Integer DEFAULT_VALUE = 1;
    private static final Integer UPDATED_VALUE = 2;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final byte[] DEFAULT_EMOTICO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_EMOTICO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_EMOTICO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_EMOTICO_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/humors";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private HumorRepository humorRepository;

    @Autowired
    private HumorMapper humorMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Humor humor;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Humor createEntity(EntityManager em) {
        Humor humor = new Humor()
            .value(DEFAULT_VALUE)
            .description(DEFAULT_DESCRIPTION)
            .emotico(DEFAULT_EMOTICO)
            .emoticoContentType(DEFAULT_EMOTICO_CONTENT_TYPE);
        return humor;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Humor createUpdatedEntity(EntityManager em) {
        Humor humor = new Humor()
            .value(UPDATED_VALUE)
            .description(UPDATED_DESCRIPTION)
            .emotico(UPDATED_EMOTICO)
            .emoticoContentType(UPDATED_EMOTICO_CONTENT_TYPE);
        return humor;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Humor.class).block();
        } catch (Exception e) {
            // It can fail, if other entities are still referring this - it will be removed later.
        }
    }

    @AfterEach
    public void cleanup() {
        deleteEntities(em);
    }

    @BeforeEach
    public void initTest() {
        deleteEntities(em);
        humor = createEntity(em);
    }

    @Test
    void createHumor() throws Exception {
        int databaseSizeBeforeCreate = humorRepository.findAll().collectList().block().size();
        // Create the Humor
        HumorDTO humorDTO = humorMapper.toDto(humor);
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(humorDTO))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Humor in the database
        List<Humor> humorList = humorRepository.findAll().collectList().block();
        assertThat(humorList).hasSize(databaseSizeBeforeCreate + 1);
        Humor testHumor = humorList.get(humorList.size() - 1);
        assertThat(testHumor.getValue()).isEqualTo(DEFAULT_VALUE);
        assertThat(testHumor.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testHumor.getEmotico()).isEqualTo(DEFAULT_EMOTICO);
        assertThat(testHumor.getEmoticoContentType()).isEqualTo(DEFAULT_EMOTICO_CONTENT_TYPE);
    }

    @Test
    void createHumorWithExistingId() throws Exception {
        // Create the Humor with an existing ID
        humor.setId(1L);
        HumorDTO humorDTO = humorMapper.toDto(humor);

        int databaseSizeBeforeCreate = humorRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(humorDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Humor in the database
        List<Humor> humorList = humorRepository.findAll().collectList().block();
        assertThat(humorList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkValueIsRequired() throws Exception {
        int databaseSizeBeforeTest = humorRepository.findAll().collectList().block().size();
        // set the field null
        humor.setValue(null);

        // Create the Humor, which fails.
        HumorDTO humorDTO = humorMapper.toDto(humor);

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(humorDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Humor> humorList = humorRepository.findAll().collectList().block();
        assertThat(humorList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = humorRepository.findAll().collectList().block().size();
        // set the field null
        humor.setDescription(null);

        // Create the Humor, which fails.
        HumorDTO humorDTO = humorMapper.toDto(humor);

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(humorDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Humor> humorList = humorRepository.findAll().collectList().block();
        assertThat(humorList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllHumors() {
        // Initialize the database
        humorRepository.save(humor).block();

        // Get all the humorList
        webTestClient
            .get()
            .uri(ENTITY_API_URL + "?sort=id,desc")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.[*].id")
            .value(hasItem(humor.getId().intValue()))
            .jsonPath("$.[*].value")
            .value(hasItem(DEFAULT_VALUE))
            .jsonPath("$.[*].description")
            .value(hasItem(DEFAULT_DESCRIPTION))
            .jsonPath("$.[*].emoticoContentType")
            .value(hasItem(DEFAULT_EMOTICO_CONTENT_TYPE))
            .jsonPath("$.[*].emotico")
            .value(hasItem(Base64Utils.encodeToString(DEFAULT_EMOTICO)));
    }

    @Test
    void getHumor() {
        // Initialize the database
        humorRepository.save(humor).block();

        // Get the humor
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, humor.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(humor.getId().intValue()))
            .jsonPath("$.value")
            .value(is(DEFAULT_VALUE))
            .jsonPath("$.description")
            .value(is(DEFAULT_DESCRIPTION))
            .jsonPath("$.emoticoContentType")
            .value(is(DEFAULT_EMOTICO_CONTENT_TYPE))
            .jsonPath("$.emotico")
            .value(is(Base64Utils.encodeToString(DEFAULT_EMOTICO)));
    }

    @Test
    void getNonExistingHumor() {
        // Get the humor
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putNewHumor() throws Exception {
        // Initialize the database
        humorRepository.save(humor).block();

        int databaseSizeBeforeUpdate = humorRepository.findAll().collectList().block().size();

        // Update the humor
        Humor updatedHumor = humorRepository.findById(humor.getId()).block();
        updatedHumor
            .value(UPDATED_VALUE)
            .description(UPDATED_DESCRIPTION)
            .emotico(UPDATED_EMOTICO)
            .emoticoContentType(UPDATED_EMOTICO_CONTENT_TYPE);
        HumorDTO humorDTO = humorMapper.toDto(updatedHumor);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, humorDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(humorDTO))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Humor in the database
        List<Humor> humorList = humorRepository.findAll().collectList().block();
        assertThat(humorList).hasSize(databaseSizeBeforeUpdate);
        Humor testHumor = humorList.get(humorList.size() - 1);
        assertThat(testHumor.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testHumor.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testHumor.getEmotico()).isEqualTo(UPDATED_EMOTICO);
        assertThat(testHumor.getEmoticoContentType()).isEqualTo(UPDATED_EMOTICO_CONTENT_TYPE);
    }

    @Test
    void putNonExistingHumor() throws Exception {
        int databaseSizeBeforeUpdate = humorRepository.findAll().collectList().block().size();
        humor.setId(count.incrementAndGet());

        // Create the Humor
        HumorDTO humorDTO = humorMapper.toDto(humor);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, humorDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(humorDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Humor in the database
        List<Humor> humorList = humorRepository.findAll().collectList().block();
        assertThat(humorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchHumor() throws Exception {
        int databaseSizeBeforeUpdate = humorRepository.findAll().collectList().block().size();
        humor.setId(count.incrementAndGet());

        // Create the Humor
        HumorDTO humorDTO = humorMapper.toDto(humor);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(humorDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Humor in the database
        List<Humor> humorList = humorRepository.findAll().collectList().block();
        assertThat(humorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamHumor() throws Exception {
        int databaseSizeBeforeUpdate = humorRepository.findAll().collectList().block().size();
        humor.setId(count.incrementAndGet());

        // Create the Humor
        HumorDTO humorDTO = humorMapper.toDto(humor);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(humorDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Humor in the database
        List<Humor> humorList = humorRepository.findAll().collectList().block();
        assertThat(humorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateHumorWithPatch() throws Exception {
        // Initialize the database
        humorRepository.save(humor).block();

        int databaseSizeBeforeUpdate = humorRepository.findAll().collectList().block().size();

        // Update the humor using partial update
        Humor partialUpdatedHumor = new Humor();
        partialUpdatedHumor.setId(humor.getId());

        partialUpdatedHumor
            .value(UPDATED_VALUE)
            .description(UPDATED_DESCRIPTION)
            .emotico(UPDATED_EMOTICO)
            .emoticoContentType(UPDATED_EMOTICO_CONTENT_TYPE);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedHumor.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedHumor))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Humor in the database
        List<Humor> humorList = humorRepository.findAll().collectList().block();
        assertThat(humorList).hasSize(databaseSizeBeforeUpdate);
        Humor testHumor = humorList.get(humorList.size() - 1);
        assertThat(testHumor.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testHumor.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testHumor.getEmotico()).isEqualTo(UPDATED_EMOTICO);
        assertThat(testHumor.getEmoticoContentType()).isEqualTo(UPDATED_EMOTICO_CONTENT_TYPE);
    }

    @Test
    void fullUpdateHumorWithPatch() throws Exception {
        // Initialize the database
        humorRepository.save(humor).block();

        int databaseSizeBeforeUpdate = humorRepository.findAll().collectList().block().size();

        // Update the humor using partial update
        Humor partialUpdatedHumor = new Humor();
        partialUpdatedHumor.setId(humor.getId());

        partialUpdatedHumor
            .value(UPDATED_VALUE)
            .description(UPDATED_DESCRIPTION)
            .emotico(UPDATED_EMOTICO)
            .emoticoContentType(UPDATED_EMOTICO_CONTENT_TYPE);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedHumor.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedHumor))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Humor in the database
        List<Humor> humorList = humorRepository.findAll().collectList().block();
        assertThat(humorList).hasSize(databaseSizeBeforeUpdate);
        Humor testHumor = humorList.get(humorList.size() - 1);
        assertThat(testHumor.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testHumor.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testHumor.getEmotico()).isEqualTo(UPDATED_EMOTICO);
        assertThat(testHumor.getEmoticoContentType()).isEqualTo(UPDATED_EMOTICO_CONTENT_TYPE);
    }

    @Test
    void patchNonExistingHumor() throws Exception {
        int databaseSizeBeforeUpdate = humorRepository.findAll().collectList().block().size();
        humor.setId(count.incrementAndGet());

        // Create the Humor
        HumorDTO humorDTO = humorMapper.toDto(humor);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, humorDTO.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(humorDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Humor in the database
        List<Humor> humorList = humorRepository.findAll().collectList().block();
        assertThat(humorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchHumor() throws Exception {
        int databaseSizeBeforeUpdate = humorRepository.findAll().collectList().block().size();
        humor.setId(count.incrementAndGet());

        // Create the Humor
        HumorDTO humorDTO = humorMapper.toDto(humor);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(humorDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Humor in the database
        List<Humor> humorList = humorRepository.findAll().collectList().block();
        assertThat(humorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamHumor() throws Exception {
        int databaseSizeBeforeUpdate = humorRepository.findAll().collectList().block().size();
        humor.setId(count.incrementAndGet());

        // Create the Humor
        HumorDTO humorDTO = humorMapper.toDto(humor);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(humorDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Humor in the database
        List<Humor> humorList = humorRepository.findAll().collectList().block();
        assertThat(humorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteHumor() {
        // Initialize the database
        humorRepository.save(humor).block();

        int databaseSizeBeforeDelete = humorRepository.findAll().collectList().block().size();

        // Delete the humor
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, humor.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Humor> humorList = humorRepository.findAll().collectList().block();
        assertThat(humorList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
