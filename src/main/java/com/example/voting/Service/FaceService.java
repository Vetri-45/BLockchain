package com.example.voting.Service;

import okhttp3.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class FaceService {

    @Value("${facepp.api.key}")
    private String apiKey;

    @Value("${facepp.api.secret}")
    private String apiSecret;

    @Value("${facepp.api.url}")
    private String apiUrl;

    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build();

    public boolean detectFace(String base64Image) {
        try {
            RequestBody body = new MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
                    .addFormDataPart("api_key", apiKey)
                    .addFormDataPart("api_secret", apiSecret)
                    .addFormDataPart("image_base64", base64Image)
                    .build();

            Request request = new Request.Builder()
                    .url(apiUrl + "/detect")
                    .post(body)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                String responseBody = response.body().string();

                // ✅ Print full response for debugging
                System.out.println("Face++ detect response: " + responseBody);

                JSONObject json = new JSONObject(responseBody);

                // Check for API errors
                if (json.has("error_message")) {
                    System.out.println("Face++ error: " + json.getString("error_message"));
                    throw new RuntimeException("Face++ error: " + json.getString("error_message"));
                }

                boolean hasFace = json.has("faces") && json.getJSONArray("faces").length() > 0;
                System.out.println("Face detected: " + hasFace);
                return hasFace;
            }
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Face detection failed: " + e.getMessage());
        }
    }

    public double compareFaces(String base64Image1, String base64Image2) {
        try {
            RequestBody body = new MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
                    .addFormDataPart("api_key", apiKey)
                    .addFormDataPart("api_secret", apiSecret)
                    .addFormDataPart("image_base64_1", base64Image1)
                    .addFormDataPart("image_base64_2", base64Image2)
                    .build();

            Request request = new Request.Builder()
                    .url(apiUrl + "/compare")
                    .post(body)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                String responseBody = response.body().string();

                System.out.println("Face++ compare response: " + responseBody);

                JSONObject json = new JSONObject(responseBody);

                if (json.has("error_message")) {
                    throw new RuntimeException(json.getString("error_message"));
                }

                if (json.has("confidence")) {
                    return json.getDouble("confidence");
                }

                return 0.0;
            }
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Face comparison failed: " + e.getMessage());
        }
    }
}