package com.meetingbooking.controller;

import com.meetingbooking.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

   private final ReportService reportService;

   public ReportController(ReportService reportService) {
       this.reportService = reportService;
   }

   @GetMapping("/room-usage")
   @PreAuthorize("hasRole('ADMIN')")
   public ResponseEntity<Map<String, Long>> getRoomUsageReport(
           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
       return ResponseEntity.ok(reportService.getRoomUsageReport(from, to));
   }

   @GetMapping("/peak-hours")
   @PreAuthorize("hasRole('ADMIN')")
   public ResponseEntity<Map<Integer, Long>> getPeakHoursReport(
           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
       return ResponseEntity.ok(reportService.getPeakHoursReport(from, to));
   }
}

