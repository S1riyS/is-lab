package com.itmo.ticketsystem.common.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

@Component
@RequiredArgsConstructor
public class UniqueFieldValidator implements ConstraintValidator<UniqueField, String> {

    private final ApplicationContext applicationContext;

    private Class<?> repositoryClass;
    private String fieldName;

    @Override
    public void initialize(UniqueField constraintAnnotation) {
        this.repositoryClass = constraintAnnotation.repositoryClass();
        this.fieldName = constraintAnnotation.fieldName();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.trim().isEmpty()) {
            return true;
        }

        try {
            // Get the repository bean from Spring context
            Object repository = applicationContext.getBean(repositoryClass);

            // Construct the method name: existsBy + FieldName
            String methodName = "existsBy" + capitalize(fieldName);

            // Find and invoke the method
            Method existsMethod = repositoryClass.getMethod(methodName, String.class);
            Boolean exists = (Boolean) existsMethod.invoke(repository, value.trim());

            // Return true if the value is unique (doesn't exist)
            return !exists;

        } catch (NoSuchMethodException e) {
            String errorMessage = "Repository " + repositoryClass.getSimpleName() +
                    " must have method: boolean existsBy" + capitalize(fieldName) + "(String value)";
            throw new IllegalStateException(errorMessage, e);
        } catch (Exception e) {
            String errorMessage = "Error checking uniqueness for field '" + fieldName + "' in repository " +
                    repositoryClass.getSimpleName();
            throw new IllegalStateException(errorMessage, e);
        }
    }

    private String capitalize(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
}
