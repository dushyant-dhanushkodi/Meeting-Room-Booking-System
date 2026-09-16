package com.meetingbooking.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

   @ExceptionHandler(NotFoundException.class)
   public ResponseEntity<ApiError> handleNotFound(NotFoundException ex, WebRequest request) {
       ApiError error = new ApiError(
               HttpStatus.NOT_FOUND.value(),
               HttpStatus.NOT_FOUND.getReasonPhrase(),
               ex.getMessage(),
               request.getDescription(false)
       );
       return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
   }

   @ExceptionHandler(BusinessException.class)
   public ResponseEntity<ApiError> handleBusiness(BusinessException ex, WebRequest request) {
       ApiError error = new ApiError(
               HttpStatus.BAD_REQUEST.value(),
               HttpStatus.BAD_REQUEST.getReasonPhrase(),
               ex.getMessage(),
               request.getDescription(false)
       );
       return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
   }

   @ExceptionHandler(MethodArgumentNotValidException.class)
   public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex, WebRequest request) {
       String message = ex.getBindingResult().getFieldErrors().stream()
               .findFirst()
               .map(error -> error.getField() + " " + error.getDefaultMessage())
               .orElse("Validation error");

       ApiError error = new ApiError(
               HttpStatus.BAD_REQUEST.value(),
               HttpStatus.BAD_REQUEST.getReasonPhrase(),
               message,
               request.getDescription(false)
       );
       return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
   }

   @ExceptionHandler(Exception.class)
   public ResponseEntity<ApiError> handleGeneric(Exception ex, WebRequest request) {
       ApiError error = new ApiError(
               HttpStatus.INTERNAL_SERVER_ERROR.value(),
               HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
               ex.getMessage(),
               request.getDescription(false)
       );
       return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
   }
}

