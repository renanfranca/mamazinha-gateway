package com.mamazinha.gateway.domain;

import java.io.Serializable;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A Humor.
 */
@Table("humor")
public class Humor implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private Long id;

    /**
     * 1 to 5  ANGRY, SAD, CALM, HAPPY, EXCITED
     */
    @NotNull(message = "must not be null")
    @Column("value")
    private Integer value;

    @NotNull(message = "must not be null")
    @Column("description")
    private String description;

    @Column("emotico")
    private byte[] emotico;

    @Column("emotico_content_type")
    private String emoticoContentType;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Humor id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getValue() {
        return this.value;
    }

    public Humor value(Integer value) {
        this.value = value;
        return this;
    }

    public void setValue(Integer value) {
        this.value = value;
    }

    public String getDescription() {
        return this.description;
    }

    public Humor description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public byte[] getEmotico() {
        return this.emotico;
    }

    public Humor emotico(byte[] emotico) {
        this.emotico = emotico;
        return this;
    }

    public void setEmotico(byte[] emotico) {
        this.emotico = emotico;
    }

    public String getEmoticoContentType() {
        return this.emoticoContentType;
    }

    public Humor emoticoContentType(String emoticoContentType) {
        this.emoticoContentType = emoticoContentType;
        return this;
    }

    public void setEmoticoContentType(String emoticoContentType) {
        this.emoticoContentType = emoticoContentType;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Humor)) {
            return false;
        }
        return id != null && id.equals(((Humor) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Humor{" +
            "id=" + getId() +
            ", value=" + getValue() +
            ", description='" + getDescription() + "'" +
            ", emotico='" + getEmotico() + "'" +
            ", emoticoContentType='" + getEmoticoContentType() + "'" +
            "}";
    }
}
