package com.ggrec.vister.service;

import com.google.common.collect.ImmutableSet;
import com.google.common.io.ByteStreams;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import javax.servlet.http.Part;
import java.io.IOException;
import java.util.Set;

@Service
@AllArgsConstructor(onConstructor_ = @Autowired)
public class StatementService {

    private static final Set<String> ALLOWED_FILE_TYPES = ImmutableSet.of(
            "vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
            "vnd.ms-excel", // XLS
            "csv"
    );

    private final MessagingService messagingService;

    public void uploadStatement(Part statement) {
        try {
            String fileType = getType(statement.getContentType());
            byte[] fileData = ByteStreams.toByteArray(statement.getInputStream());
            messagingService.sendFile(fileData, fileType);
        } catch (IOException e) {
            // TODO
            e.printStackTrace();
        }
    }

    private String getType(String mimetype) {
        MediaType mediaType = MediaType.parseMediaType(mimetype);
        String subType = mediaType.getSubtype();
        if (!ALLOWED_FILE_TYPES.contains(subType))
            throw new IllegalArgumentException("File type not allowed: " + subType);
        return subType;
    }

}
