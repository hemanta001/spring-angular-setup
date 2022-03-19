package com.rest.auction.users;


import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.rest.auction.users.entity.User;

import java.io.IOException;

public class UserSerializer extends StdSerializer<User> {
    public UserSerializer() {
        this(null);
    }

    public UserSerializer(Class<User> userClass) {
        super(userClass);
    }

    @Override
    public void serialize(
            User user, JsonGenerator jgen, SerializerProvider provider)
            throws IOException, JsonProcessingException {
        jgen.writeStartObject();
        jgen.writeNumberField("id", user.getId());
        jgen.writeStringField("firstName", user.getFirstName());
        jgen.writeStringField("lastName", user.getLastName());
        jgen.writeStringField("mobileNumber", user.getMobileNumber());

        jgen.writeEndObject();
    }
}
