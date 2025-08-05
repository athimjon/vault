    package org.example.izzy.model.converter;


    import jakarta.persistence.AttributeConverter;
    import jakarta.persistence.Converter;
    import org.example.izzy.model.enums.Size;

    import java.util.stream.Stream;

    @Converter(autoApply = true)
    public class SizeConverter implements AttributeConverter<Size, String> {

        @Override
        public String convertToDatabaseColumn(Size size) {
            return size != null ? size.getValue() : null;
        }

        @Override
        public Size convertToEntityAttribute(String dbValue) {
            if (dbValue == null) return null;
            return Stream.of(Size.values())
                    .filter(s -> s.getValue().equals(dbValue))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Unknown SIZE: " + dbValue));
        }
    }