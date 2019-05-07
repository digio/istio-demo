package com.istiodemo.demo;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.net.InetAddress;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping(value="/color")
public class Color {
    @Value("${version}")
    public String version = "3.0";

    public String color = "red";
    private static final Log log = LogFactory.getLog(Color.class);

    @RequestMapping(
        method = RequestMethod.GET,
        produces = { MediaType.APPLICATION_JSON_VALUE }
    )
    public Map<String, String> getResponseFromHeader() {
        Map<String, String> response = new HashMap<>();
        if (color.contains("red")) {
            try {
                int max = 500; // maxmimum flux delay in ms
                int min = 30; // maximum flux delay in ms
                int ms = new Random().nextInt((max - min)) + min;
                if (ms > 300) {
                    throw new IllegalArgumentException("REQUEST_TOO_LONG");
                }
                Thread.sleep(ms);
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block

                log.debug("ERROR:", e);
                e.printStackTrace();
            }
        }
        try {
            String hostname = InetAddress.getLocalHost().getHostName();
            response.put("version", version);
            response.put("color", color);
            response.put("hostname", hostname);
        } catch (Exception e) {
            log.debug("ERROR:", e);
        }
        return response;
        
    }
    
}