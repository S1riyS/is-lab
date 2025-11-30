package com.itmo.ticketsystem.common.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueFieldValidator.class)
@Documented
public @interface UniqueField {

    Class<?> repositoryClass();

    String fieldName() default "name";

    String message() default "This value must be unique";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
