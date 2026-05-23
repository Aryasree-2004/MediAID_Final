package com.cts.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="reports")
@Data
public class Report {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long reportId;
	//private ReportScope scope;
	
	@Lob
	@Column(columnDefinition="TEXT")
	private String metrics;
	private LocalDateTime generatedDate;
	

}
