package com.meetingbooking.service;

import java.time.LocalDate;
import java.util.Map;

public interface ReportService {

   Map<String, Long> getRoomUsageReport(LocalDate from, LocalDate to);

   Map<Integer, Long> getPeakHoursReport(LocalDate from, LocalDate to);
}

