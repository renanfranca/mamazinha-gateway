package com.mamazinha.gateway.repository.rowmapper;

import com.mamazinha.gateway.domain.Humor;
import com.mamazinha.gateway.service.ColumnConverter;
import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Humor}, with proper type conversions.
 */
@Service
public class HumorRowMapper implements BiFunction<Row, String, Humor> {

    private final ColumnConverter converter;

    public HumorRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Humor} stored in the database.
     */
    @Override
    public Humor apply(Row row, String prefix) {
        Humor entity = new Humor();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setValue(converter.fromRow(row, prefix + "_value", Integer.class));
        entity.setDescription(converter.fromRow(row, prefix + "_description", String.class));
        entity.setEmoticoContentType(converter.fromRow(row, prefix + "_emotico_content_type", String.class));
        entity.setEmotico(converter.fromRow(row, prefix + "_emotico", byte[].class));
        return entity;
    }
}
