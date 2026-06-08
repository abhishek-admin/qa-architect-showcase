# QA Testing Interview Questions & Answers - 350+ Real-World Questions

## **Comprehensive Guide for QA/SDET Interviews**


---

## **Table of Contents**
1. [REST-Assured & API Testing (Q1-Q50)](#rest-assured--api-testing)
2. [HTTP Methods & Status Codes (Q51-Q80)](#http-methods--status-codes)
3. [TestNG Framework (Q81-Q130)](#testng-framework)
4. [Cucumber & BDD (Q131-Q170)](#cucumber--bdd)
5. [Manual Testing Fundamentals (Q171-Q210)](#manual-testing-fundamentals)
6. [Types of Testing (Q211-Q250)](#types-of-testing)
7. [Software Testing Theory (Q251-Q290)](#software-testing-theory)
8. [Java for Testing (Q291-Q330)](#java-for-testing)
9. [Test Automation Frameworks (Q331-Q360)](#test-automation-frameworks)

---

## **REST-Assured & API Testing**

### **Q1. What is REST-Assured?**
**Answer:** REST-Assured is a Java library that simplifies testing RESTful web services. It provides a domain-specific language (DSL) for writing powerful, maintainable tests for REST APIs.

**Key Features:**
- Given-When-Then syntax
- Response validation
- JSON/XML parsing
- Authentication support
- Request/Response logging

**Maven Dependency:**
```xml
<dependency>
    <groupId>io.rest-assured</groupId>
    <artifactId>rest-assured</artifactId>
    <version>5.3.0</version>
    <scope>test</scope>
</dependency>
```

> Hot take: *"Validate responses against a JSON/XML schema. Schema matching catches backend changes in your assured tests before they reach the visual UI layer."*

---

### **Q2. Write a simple GET request using REST-Assured**
**Answer:**
```java
import io.restassured.RestAssured;
import io.restassured.response.Response;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class SimpleGetRequest {
    public static void main(String[] args) {
        // Method 1: Basic GET request
        Response response = RestAssured.get("https://jsonplaceholder.typicode.com/users/1");
        System.out.println(response.getBody().asString());
        System.out.println("Status Code: " + response.getStatusCode());
        
        // Method 2: Using Given-When-Then
        given()
            .baseUri("https://jsonplaceholder.typicode.com")
        .when()
            .get("/users/1")
        .then()
            .statusCode(200)
            .body("name", equalTo("Leanne Graham"))
            .body("email", notNullValue());
    }
}
```
TOILET

> Hot take: *"Centralize auth token management. Caching and refreshing tokens in a thread-safe helper avoids repeating authentication for every write run."*

---

### **Q3. How do you perform a POST request with JSON body?**
**Answer:**
```java
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import static io.restassured.RestAssured.*;

public class PostRequestExample {
    public static void main(String[] args) {
        String requestBody = "{\n" +
            "  \"title\": \"foo\",\n" +
            "  \"body\": \"bar\",\n" +
            "  \"userId\": 1\n" +
            "}";
        
        given()
            .contentType(ContentType.JSON)
            .body(requestBody)
        .when()
            .post("https://jsonplaceholder.typicode.com/posts")
        .then()
            .statusCode(201)
            .body("title", equalTo("foo"))
            .log().all();
    }
}
```

> Hot take: *"Keep API checks decoupled from UI rendering. Verify the business state via perform API calls, and let visual checks focus strictly on UI layout."*

---

### **Q4. How do you validate response headers in REST-Assured?**
**Answer:**
```java
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class HeaderValidation {
    public void validateHeaders() {
        given()
            .baseUri("https://jsonplaceholder.typicode.com")
        .when()
            .get("/users/1")
        .then()
            .statusCode(200)
            .header("Content-Type", containsString("application/json"))
            .header("Server", notNullValue())
            .headers("Content-Type", "application/json; charset=utf-8",
                    "Connection", "keep-alive");
    }
}
```

> Hot take: *"Bypass the UI for test setup whenever possible. Authenticate and seed data for validate using API calls to cut execution times significantly."*

---

### **Q5. How do you extract values from JSON response?**
**Answer:**
```java
import io.restassured.response.Response;
import io.restassured.path.json.JsonPath;
import static io.restassured.RestAssured.*;

public class JsonExtraction {
    public void extractValues() {
        Response response = 
            given()
                .baseUri("https://jsonplaceholder.typicode.com")
            .when()
                .get("/users/1")
            .then()
                .extract().response();
        
        // Method 1: Using JsonPath
        JsonPath jsonPath = response.jsonPath();
        String name = jsonPath.getString("name");
        String email = jsonPath.getString("email");
        
        // Method 2: Using path()
        String username = response.path("username");
        
        // Method 3: Extract entire object
        User user = response.as(User.class);
        
        System.out.println("Name: " + name);
        System.out.println("Email: " + email);
    }
}

class User {
    private String name;
    private String email;
    private String username;
    // Getters and Setters
}
```

> Hot take: *"Validate responses against a JSON/XML schema. Schema matching catches backend changes in your extract tests before they reach the visual UI layer."*

---

### **Q6. How do you handle authentication in REST-Assured?**
**Answer:**
```java
import static io.restassured.RestAssured.*;

public class AuthenticationExamples {
    
    // Basic Authentication
    public void basicAuth() {
        given()
            .auth().basic("username", "password")
        .when()
            .get("https://api.example.com/secure-endpoint")
        .then()
            .statusCode(200);
    }
    
    // Bearer Token Authentication
    public void bearerToken() {
        String token = "your-auth-token";
        
        given()
            .header("Authorization", "Bearer " + token)
        .when()
            .get("https://api.example.com/secure-endpoint")
        .then()
            .statusCode(200);
    }
    
    // OAuth 2.0
    public void oauth2() {
        given()
            .auth().oauth2("access-token")
        .when()
            .get("https://api.example.com/secure-endpoint")
        .then()
            .statusCode(200);
    }
    
    // API Key Authentication
    public void apiKey() {
        given()
            .header("X-API-Key", "your-api-key")
        .when()
            .get("https://api.example.com/data")
        .then()
            .statusCode(200);
    }
}
```

> Hot take: *"Centralize auth token management. Caching and refreshing tokens in a thread-safe helper avoids repeating authentication for every assured run."*

---

### **Q7. How do you send query parameters in REST-Assured?**
**Answer:**
```java
import static io.restassured.RestAssured.*;
import java.util.HashMap;
import java.util.Map;

public class QueryParametersExample {
    public void sendQueryParams() {
        // Method 1: Using queryParam()
        given()
            .queryParam("userId", 1)
            .queryParam("page", 2)
        .when()
            .get("https://jsonplaceholder.typicode.com/posts")
        .then()
            .statusCode(200);
        
        // Method 2: Using Map
        Map<String, Object> params = new HashMap<>();
        params.put("userId", 1);
        params.put("page", 2);
        
        given()
            .queryParams(params)
        .when()
            .get("https://jsonplaceholder.typicode.com/posts")
        .then()
            .statusCode(200);
        
        // Method 3: In URL
        given()
        .when()
            .get("https://jsonplaceholder.typicode.com/posts?userId=1&page=2")
        .then()
            .statusCode(200);
    }
}
```

> Hot take: *"Keep API checks decoupled from UI rendering. Verify the business state via query API calls, and let visual checks focus strictly on UI layout."*

---

### **Q8. How do you validate JSON schema in REST-Assured?**
**Answer:**
```java
import static io.restassured.RestAssured.*;
import static io.restassured.module.jsv.JsonSchemaValidator.*;

public class JsonSchemaValidation {
    public void validateSchema() {
        given()
            .baseUri("https://jsonplaceholder.typicode.com")
        .when()
            .get("/users/1")
        .then()
            .statusCode(200)
            .body(matchesJsonSchemaInClasspath("user-schema.json"));
    }
}
```

**user-schema.json:**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": { "type": "integer" },
    "name": { "type": "string" },
    "email": { "type": "string" }
  },
  "required": ["id", "name", "email"]
}
```

**Maven Dependency:**
```xml
<dependency>
    <groupId>io.rest-assured</groupId>
    <artifactId>json-schema-validator</artifactId>
    <version>5.3.0</version>
</dependency>
```

> Hot take: *"Bypass the UI for test setup whenever possible. Authenticate and seed data for validate using API calls to cut execution times significantly."*

---

### **Q9. How do you perform PUT and DELETE requests?**
**Answer:**
```java
import static io.restassured.RestAssured.*;
import io.restassured.http.ContentType;

public class PutDeleteExamples {
    
    // PUT Request
    public void updateResource() {
        String updatedData = "{\n" +
            "  \"id\": 1,\n" +
            "  \"title\": \"Updated Title\",\n" +
            "  \"body\": \"Updated Body\",\n" +
            "  \"userId\": 1\n" +
            "}";
        
        given()
            .contentType(ContentType.JSON)
            .body(updatedData)
        .when()
            .put("https://jsonplaceholder.typicode.com/posts/1")
        .then()
            .statusCode(200)
            .body("title", equalTo("Updated Title"));
    }
    
    // PATCH Request (Partial Update)
    public void patchResource() {
        String patchData = "{\n" +
            "  \"title\": \"Patched Title\"\n" +
            "}";
        
        given()
            .contentType(ContentType.JSON)
            .body(patchData)
        .when()
            .patch("https://jsonplaceholder.typicode.com/posts/1")
        .then()
            .statusCode(200);
    }
    
    // DELETE Request
    public void deleteResource() {
        given()
        .when()
            .delete("https://jsonplaceholder.typicode.com/posts/1")
        .then()
            .statusCode(200);
    }
}
```

> Hot take: *"Validate responses against a JSON/XML schema. Schema matching catches backend changes in your perform tests before they reach the visual UI layer."*

---

### **Q10. How do you handle file uploads in REST-Assured?**
**Answer:**
```java
import static io.restassured.RestAssured.*;
import java.io.File;

public class FileUploadExample {
    public void uploadFile() {
        File file = new File("path/to/file.txt");
        
        given()
            .multiPart("file", file)
            .multiPart("description", "Test file upload")
        .when()
            .post("https://api.example.com/upload")
        .then()
            .statusCode(200)
            .body("message", equalTo("File uploaded successfully"));
    }
    
    // Upload with content type
    public void uploadFileWithContentType() {
        File imageFile = new File("path/to/image.png");
        
        given()
            .multiPart("image", imageFile, "image/png")
        .when()
            .post("https://api.example.com/upload-image")
        .then()
            .statusCode(201);
    }
}
```

> Hot take: *"Centralize auth token management. Caching and refreshing tokens in a thread-safe helper avoids repeating authentication for every upload run."*

---

### **Q11. How do you use RequestSpecification and ResponseSpecification?**
**Answer:**
```java
import io.restassured.specification.RequestSpecification;
import io.restassured.specification.ResponseSpecification;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.builder.ResponseSpecBuilder;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class SpecificationExample {
    RequestSpecification requestSpec;
    ResponseSpecification responseSpec;
    
    public void setupSpecs() {
        // Request Specification
        requestSpec = new RequestSpecBuilder()
            .setBaseUri("https://jsonplaceholder.typicode.com")
            .setContentType(ContentType.JSON)
            .addHeader("Accept", "application/json")
            .build();
        
        // Response Specification
        responseSpec = new ResponseSpecBuilder()
            .expectStatusCode(200)
            .expectResponseTime(lessThan(3000L))
            .build();
    }
    
    public void useSpecs() {
        given()
            .spec(requestSpec)
        .when()
            .get("/users/1")
        .then()
            .spec(responseSpec)
            .body("name", notNullValue());
    }
}
```

> Hot take: *"Keep API checks decoupled from UI rendering. Verify the business state via automation API calls, and let visual checks focus strictly on UI layout."*

---

### **Q12. How do you handle response time validation?**
**Answer:**
```java
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;
import java.util.concurrent.TimeUnit;

public class ResponseTimeValidation {
    public void validateResponseTime() {
        // Validate response time is less than 2 seconds
        given()
            .baseUri("https://jsonplaceholder.typicode.com")
        .when()
            .get("/users")
        .then()
            .time(lessThan(2000L))
            .time(lessThan(2L), TimeUnit.SECONDS);
        
        // Extract response time
        long responseTime = 
            given()
            .when()
                .get("https://jsonplaceholder.typicode.com/users")
            .then()
                .extract().time();
        
        System.out.println("Response time: " + responseTime + " ms");
    }
}
```

> Hot take: *"Bypass the UI for test setup whenever possible. Authenticate and seed data for response using API calls to cut execution times significantly."*

---

### **Q13. How do you validate arrays in JSON response?**
**Answer:**
```java
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class ArrayValidation {
    public void validateArrays() {
        given()
            .baseUri("https://jsonplaceholder.typicode.com")
        .when()
            .get("/users")
        .then()
            .statusCode(200)
            // Validate array size
            .body("size()", equalTo(10))
            // Validate specific element
            .body("[0].name", equalTo("Leanne Graham"))
            // Validate array contains
            .body("name", hasItem("Leanne Graham"))
            .body("email", hasItems("Sincere@april.biz", "Shanna@melissa.tv"))
            // Validate all elements
            .body("id", everyItem(greaterThan(0)))
            // Validate using findAll
            .body("findAll { it.id > 5 }.name", hasSize(5));
    }
}
```

> Hot take: *"Validate responses against a JSON/XML schema. Schema matching catches backend changes in your validate tests before they reach the visual UI layer."*

---

### **Q14. How do you use filters in REST-Assured?**
**Answer:**
```java
import io.restassured.filter.log.RequestLoggingFilter;
import io.restassured.filter.log.ResponseLoggingFilter;
import static io.restassured.RestAssured.*;

public class FilterExample {
    public void useFilters() {
        // Log request and response
        given()
            .filter(new RequestLoggingFilter())
            .filter(new ResponseLoggingFilter())
        .when()
            .get("https://jsonplaceholder.typicode.com/users/1")
        .then()
            .statusCode(200);
        
        // Custom filter
        given()
            .filter((requestSpec, responseSpec, ctx) -> {
                System.out.println("Before request");
                Response response = ctx.next(requestSpec, responseSpec);
                System.out.println("After response");
                return response;
            })
        .when()
            .get("https://jsonplaceholder.typicode.com/users/1");
    }
}
```

> Hot take: *"Centralize auth token management. Caching and refreshing tokens in a thread-safe helper avoids repeating authentication for every filter run."*

---

### **Q15. How do you deserialize JSON to Java objects?**
**Answer:**
```java
import io.restassured.response.Response;
import static io.restassured.RestAssured.*;
import java.util.List;

public class DeserializationExample {
    public void deserializeToObject() {
        // Single object
        User user = 
            given()
            .when()
                .get("https://jsonplaceholder.typicode.com/users/1")
            .then()
                .extract()
                .as(User.class);
        
        System.out.println("User Name: " + user.getName());
        
        // List of objects
        List<User> users = 
            given()
            .when()
                .get("https://jsonplaceholder.typicode.com/users")
            .then()
                .extract()
                .jsonPath()
                .getList("", User.class);
        
        System.out.println("Total users: " + users.size());
    }
}

class User {
    private int id;
    private String name;
    private String email;
    private String username;
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    // ... other getters/setters
}
```

> Hot take: *"Keep API checks decoupled from UI rendering. Verify the business state via deserialize API calls, and let visual checks focus strictly on UI layout."*

---

### **Q16-Q50: More REST-Assured Topics**

**Q16. How do you set base URI globally?**
```java
RestAssured.baseURI = "https://jsonplaceholder.typicode.com";
RestAssured.basePath = "/api/v1";
RestAssured.port = 8080;
```

**Q17. How do you handle cookies?**
```java
// Set cookie
given()
    .cookie("sessionId", "abc123")
.when()
    .get("/users");

// Get cookie
Response response = get("/users");
String cookieValue = response.getCookie("sessionId");
```

**Q18. How do you handle SSL certificates?**
```java
given()
    .relaxedHTTPSValidation()
.when()
    .get("https://self-signed.badssl.com/");
```

**Q19. How do you use path parameters?**
```java
given()
    .pathParam("userId", 1)
.when()
    .get("/users/{userId}")
.then()
    .statusCode(200);
```

**Q20. How do you handle XML responses?**
```java
given()
.when()
    .get("/xml-endpoint")
.then()
    .body("root.element", equalTo("value"));
```

**Q21. What is the difference between body() and contentType()?**
- `body()` - Sets/validates request/response body content
- `contentType()` - Sets Content-Type header (application/json, text/xml, etc.)

**Q22. How do you perform API chaining?**
```java
// Extract ID from POST response and use in GET
int userId = 
    given()
        .body(userJson)
    .when()
        .post("/users")
    .then()
        .extract()
        .path("id");

given()
    .pathParam("id", userId)
.when()
    .get("/users/{id}")
.then()
    .statusCode(200);
```

**Q23. How do you handle timeout in REST-Assured?**
```java
given()
    .config(RestAssured.config()
        .httpClient(HttpClientConfig.httpClientConfig()
            .setParam(CoreConnectionPNames.CONNECTION_TIMEOUT, 5000)
            .setParam(CoreConnectionPNames.SO_TIMEOUT, 5000)))
.when()
    .get("/users");
```

**Q24. How do you use POJO for request body?**
```java
User user = new User("John", "john@example.com");

given()
    .contentType(ContentType.JSON)
    .body(user)
.when()
    .post("/users")
.then()
    .statusCode(201);
```

**Q25. What are the REST-Assured logging options?**
```java
// Log all
.log().all()

// Log if validation fails
.log().ifValidationFails()

// Log only body
.log().body()

// Log only headers
.log().headers()

// Log status line
.log().status()
```

**Q26. How do you validate response contains certain text?**
```java
given()
.when()
    .get("/users/1")
.then()
    .body(containsString("Leanne"));
```

**Q27. How do you use Groovy GPath?**
```java
.body("users.findAll { it.age > 25 }.name", hasItems("John", "Jane"))
```

**Q28. How do you handle form parameters?**
```java
given()
    .formParam("username", "john")
    .formParam("password", "pass123")
.when()
    .post("/login")
.then()
    .statusCode(200);
```

**Q29. What is RestAssured.given() vs RestAssured.when()?**
- `given()` - Sets up preconditions (headers, params, auth)
- `when()` - Performs the HTTP action (GET, POST, etc.)

**Q30. How do you extract entire response body?**
```java
String responseBody = 
    get("/users/1")
        .then()
        .extract()
        .asString();
```

**Q31. How do you validate nested JSON?**
```java
.body("address.city", equalTo("Gwenborough"))
.body("address.geo.lat", equalTo("-37.3159"))
```

**Q32. How do you use default values in REST-Assured?**
```java
RestAssured.requestSpecification = requestSpec;
RestAssured.responseSpecification = responseSpec;
```

**Q33. How do you handle proxy in REST-Assured?**
```java
given()
    .proxy("proxyhost.com", 8888)
.when()
    .get("/users");
```

**Q34. How do you validate empty response?**
```java
.body(isEmptyString())
.body(isEmpty())
```

**Q35. How do you use matchers for dates?**
```java
.body("createdAt", matchesPattern("\\d{4}-\\d{2}-\\d{2}"))
```

**Q36. What is the difference between get() and when().get()?**
- `get()` - Shorthand, directly performs GET
- `when().get()` - Part of BDD syntax with given-when-then

**Q37. How do you validate JSON key exists?**
```java
.body("$", hasKey("email"))
.body("containsKey('email')", is(true))
```

**Q38. How do you handle multipart form data?**
```java
given()
    .multiPart("name", "John")
    .multiPart("file", new File("test.txt"))
.when()
    .post("/upload");
```

**Q39. How do you use custom deserializer?**
```java
ObjectMapper mapper = new ObjectMapper();
User user = mapper.readValue(response.asString(), User.class);
```

**Q40. How do you validate response is not null?**
```java
.body("name", notNullValue())
.body("email", is(not(nullValue())))
```

**Q41. How do you use root path?**
```java
.rootPath("data.users")
.body("size()", equalTo(10))
```

**Q42. How do you handle redirects?**
```java
given()
    .redirects().follow(false)
.when()
    .get("/redirect-endpoint")
.then()
    .statusCode(302);
```

**Q43. How do you extract headers from response?**
```java
Headers headers = response.getHeaders();
String contentType = response.getHeader("Content-Type");
```

**Q44. How do you use config() in REST-Assured?**
```java
given()
    .config(RestAssured.config()
        .encoderConfig(EncoderConfig.encoderConfig()
            .defaultContentCharset("UTF-8")))
```

**Q45. How do you validate array is empty?**
```java
.body("users", hasSize(0))
.body("users", empty())
```

**Q46. How do you use sessionId()?**
```java
String sessionId = 
    given()
        .auth().form("user", "pass")
    .when()
        .get("/login")
    .then()
        .extract()
        .sessionId();
```

**Q47. How do you handle different response content types?**
```java
.accept(ContentType.JSON)
.accept(ContentType.XML)
.accept("application/pdf")
```

**Q48. How do you use async requests?**
```java
// REST-Assured doesn't support async directly
// Use CompletableFuture or parallel streams
```

**Q49. How do you mock API responses?**
```java
// Use WireMock with REST-Assured
stubFor(get(urlEqualTo("/users/1"))
    .willReturn(aResponse()
        .withStatus(200)
        .withBody("{\"name\":\"John\"}")));
```

**Q50. What are best practices for REST-Assured?**
1. Use RequestSpecification for reusability
2. Implement proper assertions
3. Use POJO for serialization/deserialization
4. Log requests/responses for debugging
5. Validate schema for contract testing
6. Handle authentication securely
7. Use builders for complex requests
8. Implement retry logic for flaky tests
9. Externalize test data
10. Use proper naming conventions

> Hot take: *"Bypass the UI for test setup whenever possible. Authenticate and seed data for globally using API calls to cut execution times significantly."*

---

## **HTTP Methods & Status Codes**

### **Q51. What are the main HTTP methods?**
**Answer:**

| Method | Purpose | Idempotent | Safe |
|--------|---------|------------|------|
| **GET** | Retrieve resource | Yes | Yes |
| **POST** | Create resource | No | No |
| **PUT** | Update/Replace resource | Yes | No |
| **PATCH** | Partially update resource | No | No |
| **DELETE** | Delete resource | Yes | No |
| **HEAD** | Get headers only | Yes | Yes |
| **OPTIONS** | Get supported methods | Yes | Yes |
| **TRACE** | Echo request | Yes | Yes |
| **CONNECT** | Establish tunnel | No | No |

> Hot take: *"Keep API checks decoupled from UI rendering. Verify the business state via method API calls, and let visual checks focus strictly on UI layout."*

---

### **Q52. Explain HTTP Status Code categories**
**Answer:**

**1xx - Informational:**
- 100 Continue
- 101 Switching Protocols
- 102 Processing

**2xx - Success:**
- 200 OK
- 201 Created
- 202 Accepted
- 204 No Content
- 206 Partial Content

**3xx - Redirection:**
- 301 Moved Permanently
- 302 Found (Temporary Redirect)
- 304 Not Modified
- 307 Temporary Redirect
- 308 Permanent Redirect

**4xx - Client Errors:**
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 405 Method Not Allowed
- 408 Request Timeout
- 409 Conflict
- 422 Unprocessable Entity
- 429 Too Many Requests

**5xx - Server Errors:**
- 500 Internal Server Error
- 501 Not Implemented
- 502 Bad Gateway
- 503 Service Unavailable
- 504 Gateway Timeout

> Hot take: *"Bypass the UI for test setup whenever possible. Authenticate and seed data for statu using API calls to cut execution times significantly."*

---

### **Q53. What is the difference between 401 and 403?**
**Answer:**
- **401 Unauthorized:** Authentication required but not provided or invalid credentials
- **403 Forbidden:** Authenticated but lacks permission to access the resource

> Hot take: *"Validate responses against a JSON/XML schema. Schema matching catches backend changes in your between tests before they reach the visual UI layer."*

---

### **Q54. When to use PUT vs PATCH?**
**Answer:**
- **PUT:** Complete replacement of resource (send all fields)
- **PATCH:** Partial update (send only changed fields)

**Example:**
```java
// PUT - Replace entire user
PUT /users/1
{
  "name": "John",
  "email": "john@example.com",
  "age": 30
}

// PATCH - Update only email
PATCH /users/1
{
  "email": "newemail@example.com"
}
```

> Hot take: *"Centralize auth token management. Caching and refreshing tokens in a thread-safe helper avoids repeating authentication for every patch run."*

---

### **Q55. What is the difference between POST and PUT?**
**Answer:**

| Aspect | POST | PUT |
|--------|------|-----|
| Purpose | Create new resource | Update/Replace existing |
| Idempotent | No | Yes |
| URI | /users (collection) | /users/123 (specific) |
| Multiple calls | Creates multiple resources | Same result |

> Hot take: *"Keep API checks decoupled from UI rendering. Verify the business state via between API calls, and let visual checks focus strictly on UI layout."*

---

### **Q56-Q80: More HTTP Topics**

**Q56. What is idempotency?**
Multiple identical requests have the same effect as a single request.

**Q57. What are common request headers?**
- Content-Type
- Accept
- Authorization
- User-Agent
- Cookie
- Cache-Control

**Q58. What are common response headers?**
- Content-Type
- Content-Length
- Set-Cookie
- Cache-Control
- ETag
- Last-Modified

**Q59. What is Content-Type header?**
Specifies media type of resource:
- application/json
- application/xml
- text/html
- multipart/form-data
- application/x-www-form-urlencoded

**Q60. What is Accept header?**
Tells server what content types client can handle.

**Q61. What is 304 Not Modified?**
Resource hasn't changed since last request (uses ETags/Last-Modified).

**Q62. What is CORS?**
Cross-Origin Resource Sharing - mechanism allowing restricted resources on a web page to be requested from another domain.

**Q63. What are HTTP request methods for RESTful APIs?**
GET, POST, PUT, PATCH, DELETE for CRUD operations.

**Q64. What is the significance of 429 status code?**
Too Many Requests - rate limiting in effect.

**Q65. What is 503 Service Unavailable?**
Server temporarily unable to handle request (maintenance, overload).

**Q66. What is 502 Bad Gateway?**
Server acting as gateway received invalid response from upstream server.

**Q67. What is 504 Gateway Timeout?**
Gateway/proxy didn't receive timely response from upstream server.

**Q68. What are safe HTTP methods?**
GET, HEAD, OPTIONS - read-only, don't modify server state.

**Q69. What is HTTP caching?**
Storing copies of resources to reduce latency and network traffic.

**Q70. What are cache-control directives?**
- no-cache
- no-store
- max-age
- public
- private

**Q71. What is ETag?**
Entity Tag - identifier for specific version of resource.

**Q72. What is the difference between 200 and 201?**
- 200 OK - Generic success
- 201 Created - New resource created

**Q73. What is 204 No Content?**
Request succeeded but no content to return (common for DELETE).

**Q74. What is 409 Conflict?**
Request conflicts with current state (e.g., duplicate entry).

**Q75. What is 422 Unprocessable Entity?**
Well-formed request but semantic errors (validation failure).

**Q76. What is HEAD method used for?**
Get response headers without body (check if resource exists, get metadata).

**Q77. What is OPTIONS method?**
Determine supported HTTP methods for a resource.

**Q78. What is query string?**
Parameters in URL after ? (e.g., ?page=1&limit=10)

**Q79. What is request body?**
Data sent with POST/PUT/PATCH requests.

**Q80. What are URL path parameters?**
Parameters embedded in URL path (/users/{userId})

> Hot take: *"Bypass the UI for test setup whenever possible. Authenticate and seed data for idempotency using API calls to cut execution times significantly."*

---

## **TestNG Framework**

### **Q81. What is TestNG?**
**Answer:** TestNG is a testing framework inspired by JUnit and NUnit, designed to cover all categories of tests: unit, functional, end-to-end, integration testing with more powerful and easier annotations.

**Key Features:**
- Annotations
- Grouping
- Prioritization
- Parameterization
- Parallel execution
- Data-driven testing
- Listeners
- Reporting

**Maven Dependency:**
```xml
<dependency>
    <groupId>org.testng</groupId>
    <artifactId>testng</artifactId>
    <version>7.8.0</version>
    <scope>test</scope>
</dependency>
```

> Hot take: *"Never share mutable test data across parallel testng threads. Generate unique IDs dynamically for every test to prevent database locks and state pollution."*

---

### **Q82. Explain TestNG annotations and their execution order**
**Answer:**
```java
import org.testng.annotations.*;

public class TestNGAnnotations {
    
    @BeforeSuite
    public void beforeSuite() {
        System.out.println("1. BeforeSuite - Runs once before all tests in suite");
    }
    
    @BeforeTest
    public void beforeTest() {
        System.out.println("2. BeforeTest - Runs before <test> tag");
    }
    
    @BeforeClass
    public void beforeClass() {
        System.out.println("3. BeforeClass - Runs once before first test method in class");
    }
    
    @BeforeMethod
    public void beforeMethod() {
        System.out.println("4. BeforeMethod - Runs before each test method");
    }
    
    @Test
    public void testMethod1() {
        System.out.println("5. Test Method 1");
    }
    
    @Test
    public void testMethod2() {
        System.out.println("5. Test Method 2");
    }
    
    @AfterMethod
    public void afterMethod() {
        System.out.println("6. AfterMethod - Runs after each test method");
    }
    
    @AfterClass
    public void afterClass() {
        System.out.println("7. AfterClass - Runs once after last test method in class");
    }
    
    @AfterTest
    public void afterTest() {
        System.out.println("8. AfterTest - Runs after <test> tag");
    }
    
    @AfterSuite
    public void afterSuite() {
        System.out.println("9. AfterSuite - Runs once after all tests in suite");
    }
}
```

**Execution Order:**
```
BeforeSuite
  BeforeTest
    BeforeClass
      BeforeMethod
        Test Method 1
      AfterMethod
      BeforeMethod
        Test Method 2
      AfterMethod
    AfterClass
  AfterTest
AfterSuite
```

> Hot take: *"Concurrency exposes fragile framework design. If testng runs fail randomly in parallel but pass sequentially, trace your global static configurations."*

---

### **Q83. How do you prioritize tests in TestNG?**
**Answer:**
```java
import org.testng.annotations.Test;

public class TestPriority {
    
    @Test(priority = 1)
    public void loginTest() {
        System.out.println("Login Test - Priority 1");
    }
    
    @Test(priority = 2)
    public void createUserTest() {
        System.out.println("Create User - Priority 2");
    }
    
    @Test(priority = 3)
    public void deleteUserTest() {
        System.out.println("Delete User - Priority 3");
    }
    
    @Test // Default priority = 0
    public void defaultPriorityTest() {
        System.out.println("Default Priority (0)");
    }
}
```

**Note:** Lower priority number executes first. Default is 0.

> Hot take: *"Let the build orchestrator handle thread allocation. Tuning thread pools too high for your prioritize runner will trigger resource throttling and false timeouts."*

---

### **Q84. How do you group tests in TestNG?**
**Answer:**
```java
import org.testng.annotations.Test;

public class TestGroups {
    
    @Test(groups = {"smoke", "regression"})
    public void loginTest() {
        System.out.println("Login Test");
    }
    
    @Test(groups = {"smoke"})
    public void dashboardTest() {
        System.out.println("Dashboard Test");
    }
    
    @Test(groups = {"regression"})
    public void reportTest() {
        System.out.println("Report Test");
    }
    
    @Test(groups = {"sanity", "regression"})
    public void checkoutTest() {
        System.out.println("Checkout Test");
    }
}
```

**testng.xml:**
```xml
<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="Test Suite">
    <test name="Smoke Tests">
        <groups>
            <run>
                <include name="smoke"/>
            </run>
        </groups>
        <classes>
            <class name="com.example.TestGroups"/>
        </classes>
    </test>
</suite>
```

> Hot take: *"Clean up ThreadLocal context references during teardown. Stale browser sessions left over from previous group runs will cause memory leaks and runtime crashes."*

---

### **Q85. How do you parameterize tests in TestNG?**
**Answer:**

**Method 1: Using @Parameters:**
```java
import org.testng.annotations.Parameters;
import org.testng.annotations.Test;

public class ParameterTest {
    
    @Test
    @Parameters({"username", "password"})
    public void loginTest(String username, String password) {
        System.out.println("Username: " + username);
        System.out.println("Password: " + password);
    }
}
```

**testng.xml:**
```xml
<suite name="Parameter Suite">
    <test name="Login Test">
        <parameter name="username" value="admin"/>
        <parameter name="password" value="admin123"/>
        <classes>
            <class name="com.example.ParameterTest"/>
        </classes>
    </test>
</suite>
```

**Method 2: Using @DataProvider:**
```java
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class DataProviderTest {
    
    @DataProvider(name = "loginData")
    public Object[][] getLoginData() {
        return new Object[][] {
            {"user1", "pass1"},
            {"user2", "pass2"},
            {"user3", "pass3"}
        };
    }
    
    @Test(dataProvider = "loginData")
    public void loginTest(String username, String password) {
        System.out.println("Testing with: " + username + " / " + password);
    }
}
```

> Hot take: *"Never share mutable test data across parallel parameterize threads. Generate unique IDs dynamically for every test to prevent database locks and state pollution."*

---

### **Q86. How do you handle dependencies in TestNG?**
**Answer:**
```java
import org.testng.annotations.Test;

public class DependencyTest {
    
    @Test
    public void createUser() {
        System.out.println("User Created");
    }
    
    @Test(dependsOnMethods = "createUser")
    public void updateUser() {
        System.out.println("User Updated");
    }
    
    @Test(dependsOnMethods = {"createUser", "updateUser"})
    public void deleteUser() {
        System.out.println("User Deleted");
    }
    
    // Soft dependency - won't skip even if dependency fails
    @Test(dependsOnMethods = "createUser", alwaysRun = true)
    public void viewUser() {
        System.out.println("View User");
    }
    
    // Group dependency
    @Test(dependsOnGroups = "smoke")
    public void regressionTest() {
        System.out.println("Regression Test");
    }
}
```

> Hot take: *"Concurrency exposes fragile framework design. If dependency runs fail randomly in parallel but pass sequentially, trace your global static configurations."*

---

### **Q87. How do you implement parallel execution in TestNG?**
**Answer:**

**testng.xml:**
```xml
<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="Parallel Suite" parallel="methods" thread-count="3">
    <test name="Parallel Test">
        <classes>
            <class name="com.example.ParallelTest"/>
        </classes>
    </test>
</suite>
```

**Parallel options:**
- `parallel="methods"` - Run methods in parallel
- `parallel="classes"` - Run classes in parallel
- `parallel="tests"` - Run tests in parallel
- `parallel="instances"` - Run instances in parallel

```java
import org.testng.annotations.Test;

public class ParallelTest {
    
    @Test
    public void test1() {
        System.out.println("Test 1 - Thread: " + Thread.currentThread().getId());
    }
    
    @Test
    public void test2() {
        System.out.println("Test 2 - Thread: " + Thread.currentThread().getId());
    }
    
    @Test
    public void test3() {
        System.out.println("Test 3 - Thread: " + Thread.currentThread().getId());
    }
}
```

> Hot take: *"Let the build orchestrator handle thread allocation. Tuning thread pools too high for your implement runner will trigger resource throttling and false timeouts."*

---

### **Q88. What are TestNG listeners?**
**Answer:**
```java
import org.testng.ITestListener;
import org.testng.ITestResult;
import org.testng.ITestContext;

public class CustomListener implements ITestListener {
    
    @Override
    public void onTestStart(ITestResult result) {
        System.out.println("Test Started: " + result.getName());
    }
    
    @Override
    public void onTestSuccess(ITestResult result) {
        System.out.println("Test Passed: " + result.getName());
    }
    
    @Override
    public void onTestFailure(ITestResult result) {
        System.out.println("Test Failed: " + result.getName());
        // Take screenshot, log error, etc.
    }
    
    @Override
    public void onTestSkipped(ITestResult result) {
        System.out.println("Test Skipped: " + result.getName());
    }
    
    @Override
    public void onStart(ITestContext context) {
        System.out.println("Suite Started: " + context.getName());
    }
    
    @Override
    public void onFinish(ITestContext context) {
        System.out.println("Suite Finished: " + context.getName());
    }
}
```

**Usage:**
```java
@Listeners(CustomListener.class)
public class TestClass {
    @Test
    public void testMethod() {
        // Test code
    }
}
```

> Hot take: *"Clean up ThreadLocal context references during teardown. Stale browser sessions left over from previous testng runs will cause memory leaks and runtime crashes."*

---

### **Q89. How do you assert in TestNG?**
**Answer:**
```java
import org.testng.Assert;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

public class AssertionTest {
    
    @Test
    public void hardAssertExample() {
        // Hard assertions - test stops on first failure
        Assert.assertEquals("actual", "expected");
        Assert.assertTrue(true);
        Assert.assertFalse(false);
        Assert.assertNotNull("value");
        Assert.assertNull(null);
        Assert.assertSame(object1, object2);
        Assert.assertNotSame(object1, object2);
    }
    
    @Test
    public void softAssertExample() {
        // Soft assertions - test continues after failures
        SoftAssert softAssert = new SoftAssert();
        
        softAssert.assertEquals("actual", "expected");
        softAssert.assertTrue(false); // Fails but continues
        softAssert.assertNull("value"); // Fails but continues
        
        // Must call assertAll() to mark test as failed
        softAssert.assertAll();
    }
}
```

> Hot take: *"Never share mutable test data across parallel assert threads. Generate unique IDs dynamically for every test to prevent database locks and state pollution."*

---

### **Q90-Q130: More TestNG Topics**

**Q90. How do you skip a test in TestNG?**
```java
throw new SkipException("Skipping this test");
```

**Q91. How do you set timeout for a test?**
```java
@Test(timeOut = 5000) // milliseconds
public void testWithTimeout() {
    // Test code
}
```

**Q92. How do you enable/disable tests?**
```java
@Test(enabled = false)
public void disabledTest() {
    // Won't run
}
```

**Q93. How do you expect exceptions in TestNG?**
```java
@Test(expectedExceptions = ArithmeticException.class)
public void testException() {
    int result = 10 / 0;
}
```

**Q94. What is the purpose of invocationCount?**
```java
@Test(invocationCount = 5)
public void repeatTest() {
    // Runs 5 times
}
```

**Q95. How do you use threadPoolSize?**
```java
@Test(invocationCount = 10, threadPoolSize = 3)
public void parallelInvocations() {
    // Runs 10 times using 3 threads
}
```

**Q96. What is the difference between @BeforeTest and @BeforeClass?**
- @BeforeTest - Runs before first test in <test> tag
- @BeforeClass - Runs before first method in current class

**Q97. How do you generate TestNG reports?**
Reports are auto-generated in `test-output` folder:
- index.html - Main report
- emailable-report.html - Email-friendly report

**Q98. How do you configure testng.xml?**
```xml
<suite name="Suite" verbose="1">
    <test name="Test" preserve-order="true">
        <classes>
            <class name="com.example.TestClass">
                <methods>
                    <include name="testMethod1"/>
                    <exclude name="testMethod2"/>
                </methods>
            </class>
        </classes>
    </test>
</suite>
```

**Q99. How do you use @Factory in TestNG?**
```java
@Factory
public Object[] createInstances() {
    return new Object[] {
        new TestClass("data1"),
        new TestClass("data2")
    };
}
```

**Q100. What is IRetryAnalyzer?**
Retry failed tests automatically:
```java
public class RetryAnalyzer implements IRetryAnalyzer {
    private int retryCount = 0;
    private int maxRetryCount = 3;
    
    @Override
    public boolean retry(ITestResult result) {
        if (retryCount < maxRetryCount) {
            retryCount++;
            return true;
        }
        return false;
    }
}

@Test(retryAnalyzer = RetryAnalyzer.class)
public void flakyTest() {
    // Test code
}
```

**Q101-Q130:** Additional TestNG topics including:
- @BeforeGroups / @AfterGroups
- Multiple DataProviders
- Cross-browser testing setup
- TestNG with Maven Surefire Plugin
- TestNG reports customization
- Parallel DataProvider
- Test configuration inheritance
- Method interceptors
- Suite listeners
- Reporter class
- TestNG with CI/CD
- Best practices for test organization
- Page Object Model with TestNG
- Data-driven framework setup
- Extent Reports integration
- Screenshot on failure
- Test retry mechanism
- TestNG vs JUnit comparison
- TestNG with Selenium
- Custom annotations

> Hot take: *"Concurrency exposes fragile framework design. If testng runs fail randomly in parallel but pass sequentially, trace your global static configurations."*

---

## **Cucumber & BDD**

### **Q131. What is Cucumber?**
**Answer:** Cucumber is a BDD (Behavior Driven Development) tool that allows writing tests in plain English using Gherkin syntax. It bridges the gap between business stakeholders and technical teams.

**Key Components:**
- Feature files (.feature)
- Step Definitions (Java/other languages)
- Test Runner
- Hooks
- Tags

**Maven Dependencies:**
```xml
<dependency>
    <groupId>io.cucumber</groupId>
    <artifactId>cucumber-java</artifactId>
    <version>7.14.0</version>
</dependency>
<dependency>
    <groupId>io.cucumber</groupId>
    <artifactId>cucumber-testng</artifactId>
    <version>7.14.0</version>
</dependency>
```

> Hot take: *"Centralize your cucumber configurations and context. Shared static variables across step definitions will cause race conditions during parallel executions."*

---

### **Q132. Explain Gherkin syntax with example**
**Answer:**

**Feature File (login.feature):**
```gherkin
Feature: User Login
  As a user
  I want to login to the application
  So that I can access my account

  Background:
    Given I am on the login page

  Scenario: Successful login with valid credentials
    Given I enter username "admin"
    And I enter password "admin123"
    When I click on login button
    Then I should be navigated to dashboard
    And I should see welcome message "Welcome, Admin"

  Scenario: Failed login with invalid credentials
    Given I enter username "invalid"
    And I enter password "wrong"
    When I click on login button
    Then I should see error message "Invalid credentials"
    And I should remain on login page

  Scenario Outline: Login with multiple credentials
    Given I enter username "<username>"
    And I enter password "<password>"
    When I click on login button
    Then I should see "<result>"

    Examples:
      | username | password  | result           |
      | admin    | admin123  | Dashboard        |
      | user1    | pass1     | Dashboard        |
      | invalid  | wrong     | Invalid credentials |
```

**Gherkin Keywords:**
- **Feature:** High-level description
- **Scenario:** Test case
- **Given:** Precondition
- **When:** Action
- **Then:** Expected result
- **And/But:** Additional steps
- **Background:** Common steps for all scenarios
- **Scenario Outline:** Data-driven testing
- **Examples:** Test data for Scenario Outline

> Hot take: *"Don't treat BDD as a magic bullet. If the business team doesn't read your gherkin features, you're just writing slow, high-maintenance tests with extra layers of translation."*

---

### **Q133. How do you write step definitions?**
**Answer:**
```java
import io.cucumber.java.en.*;
import org.testng.Assert;

public class LoginSteps {
    private String username;
    private String password;
    private String actualResult;
    
    @Given("I am on the login page")
    public void navigateToLoginPage() {
        System.out.println("Opening login page");
        // driver.get("https://example.com/login");
    }
    
    @Given("I enter username {string}")
    public void enterUsername(String username) {
        this.username = username;
        System.out.println("Entering username: " + username);
        // driver.findElement(By.id("username")).sendKeys(username);
    }
    
    @Given("I enter password {string}")
    public void enterPassword(String password) {
        this.password = password;
        System.out.println("Entering password: " + password);
        // driver.findElement(By.id("password")).sendKeys(password);
    }
    
    @When("I click on login button")
    public void clickLoginButton() {
        System.out.println("Clicking login button");
        // driver.findElement(By.id("loginBtn")).click();
    }
    
    @Then("I should be navigated to dashboard")
    public void verifyDashboardPage() {
        System.out.println("Verifying dashboard page");
        // String currentUrl = driver.getCurrentUrl();
        // Assert.assertTrue(currentUrl.contains("dashboard"));
    }
    
    @Then("I should see welcome message {string}")
    public void verifyWelcomeMessage(String expectedMessage) {
        System.out.println("Verifying message: " + expectedMessage);
        // String actualMessage = driver.findElement(By.id("welcome")).getText();
        // Assert.assertEquals(actualMessage, expectedMessage);
    }
    
    @Then("I should see error message {string}")
    public void verifyErrorMessage(String expectedError) {
        System.out.println("Verifying error: " + expectedError);
        // String actualError = driver.findElement(By.id("error")).getText();
        // Assert.assertEquals(actualError, expectedError);
    }
}
```

> Hot take: *"Avoid step-by-step UI actions in your write Gherkin. Focus on user behavior, not click streams, to keep your tests resilient when the layout gets updated."*

---

### **Q134. How do you create a Cucumber Test Runner?**
**Answer:**
```java
import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;

@CucumberOptions(
    features = "src/test/resources/features",
    glue = {"stepdefinitions", "hooks"},
    tags = "@smoke",
    plugin = {
        "pretty",
        "html:target/cucumber-reports/cucumber.html",
        "json:target/cucumber-reports/cucumber.json",
        "junit:target/cucumber-reports/cucumber.xml"
    },
    monochrome = true,
    dryRun = false,
    publish = false
)
public class TestRunner extends AbstractTestNGCucumberTests {
    // This class will be empty
}
```

**CucumberOptions explained:**
- `features` - Location of feature files
- `glue` - Package(s) containing step definitions
- `tags` - Execute scenarios with specific tags
- `plugin` - Report formats
- `monochrome` - Readable console output
- `dryRun` - Check if all steps have definitions
- `publish` - Publish report to Cucumber Reports

> Hot take: *"Keep create scenarios short and focused. A BDD step that runs more than 10 lines is a code smell that indicates too many hidden dependencies."*

---

### **Q135. How do you use hooks in Cucumber?**
**Answer:**
```java
import io.cucumber.java.Before;
import io.cucumber.java.After;
import io.cucumber.java.BeforeStep;
import io.cucumber.java.AfterStep;
import io.cucumber.java.Scenario;

public class Hooks {
    
    @Before // Runs before each scenario
    public void beforeScenario(Scenario scenario) {
        System.out.println("Starting scenario: " + scenario.getName());
        // Setup: Initialize driver, connect to DB, etc.
    }
    
    @Before(order = 0) // Runs first
    public void setUp() {
        System.out.println("Global setup");
    }
    
    @Before(value = "@smoke", order = 1) // Conditional hook
    public void smokeSetup() {
        System.out.println("Smoke test setup");
    }
    
    @After // Runs after each scenario
    public void afterScenario(Scenario scenario) {
        if (scenario.isFailed()) {
            System.out.println("Scenario failed: " + scenario.getName());
            // Take screenshot
        }
        // Cleanup: Quit driver, close connections
    }
    
    @BeforeStep
    public void beforeEachStep() {
        System.out.println("Before step execution");
    }
    
    @AfterStep
    public void afterEachStep() {
        System.out.println("After step execution");
    }
}
```

> Hot take: *"Centralize your hook configurations and context. Shared static variables across step definitions will cause race conditions during parallel executions."*

---

### **Q136. How do you use tags in Cucumber?**
**Answer:**

**Feature file:**
```gherkin
@regression
Feature: User Management

  @smoke @sanity
  Scenario: Create new user
    Given I am logged in as admin
    When I create a new user
    Then user should be created successfully

  @smoke
  Scenario: Update existing user
    Given I have an existing user
    When I update user details
    Then user details should be updated

  @ignore @bug-123
  Scenario: Delete user
    Given I have an existing user
    When I delete the user
    Then user should be removed
```

**Running with tags:**
```java
@CucumberOptions(
    tags = "@smoke" // Run only smoke tests
)

@CucumberOptions(
    tags = "@smoke and @sanity" // AND condition
)

@CucumberOptions(
    tags = "@smoke or @regression" // OR condition
)

@CucumberOptions(
    tags = "@smoke and not @ignore" // Exclude ignore tag
)

@CucumberOptions(
    tags = "(@smoke or @regression) and not @ignore" // Complex
)
```

> Hot take: *"Don't treat BDD as a magic bullet. If the business team doesn't read your cucumber features, you're just writing slow, high-maintenance tests with extra layers of translation."*

---

### **Q137. How do you implement data-driven testing in Cucumber?**
**Answer:**

**Feature file:**
```gherkin
Feature: Login functionality

  Scenario Outline: Login with different users
    Given I am on login page
    When I login with username "<username>" and password "<password>"
    Then I should see "<message>"

    Examples:
      | username | password  | message              |
      | admin    | admin123  | Welcome Admin        |
      | user1    | pass1     | Welcome User         |
      | invalid  | wrong     | Invalid Credentials  |
      
    Examples: Premium Users
      | username  | password   | message                |
      | premium1  | prem123    | Welcome Premium User   |
      | premium2  | prem456    | Welcome Premium User   |
```

**Step Definition:**
```java
@When("I login with username {string} and password {string}")
public void loginWithCredentials(String username, String password) {
    System.out.println("Login: " + username + " / " + password);
}

@Then("I should see {string}")
public void verifyMessage(String expectedMessage) {
    System.out.println("Verify: " + expectedMessage);
}
```

> Hot take: *"Avoid step-by-step UI actions in your implement Gherkin. Focus on user behavior, not click streams, to keep your tests resilient when the layout gets updated."*

---

### **Q138. How do you share state between steps?**
**Answer:**

**Method 1: Using Dependency Injection (PicoContainer)**
```xml
<dependency>
    <groupId>io.cucumber</groupId>
    <artifactId>cucumber-picocontainer</artifactId>
    <version>7.14.0</version>
</dependency>
```

```java
// Context class
public class TestContext {
    private String username;
    private String password;
    private WebDriver driver;
    
    // Getters and Setters
}

// Step Definition 1
public class LoginSteps {
    private TestContext context;
    
    public LoginSteps(TestContext context) {
        this.context = context;
    }
    
    @Given("I enter username {string}")
    public void enterUsername(String username) {
        context.setUsername(username);
    }
}

// Step Definition 2
public class DashboardSteps {
    private TestContext context;
    
    public DashboardSteps(TestContext context) {
        this.context = context;
    }
    
    @Then("I see username {string}")
    public void verifyUsername() {
        String username = context.getUsername();
        // Verify username
    }
}
```

**Method 2: Using ThreadLocal**
```java
public class ScenarioContext {
    private static ThreadLocal<Map<String, Object>> context = 
        ThreadLocal.withInitial(HashMap::new);
    
    public static void setContext(String key, Object value) {
        context.get().put(key, value);
    }
    
    public static Object getContext(String key) {
        return context.get().get(key);
    }
    
    public static void clear() {
        context.get().clear();
    }
}
```

> Hot take: *"Keep share scenarios short and focused. A BDD step that runs more than 10 lines is a code smell that indicates too many hidden dependencies."*

---

### **Q139. How do you generate Cucumber reports?**
**Answer:**

**Built-in Reports:**
```java
@CucumberOptions(
    plugin = {
        "pretty", // Console output
        "html:target/cucumber-reports/cucumber.html",
        "json:target/cucumber-reports/cucumber.json",
        "junit:target/cucumber-reports/cucumber.xml",
        "rerun:target/failed_scenarios.txt" // Failed scenarios
    }
)
```

**Extent Reports Integration:**
```xml
<dependency>
    <groupId>tech.grasshopper</groupId>
    <artifactId>extentreports-cucumber7-adapter</artifactId>
    <version>1.9.2</version>
</dependency>
```

```java
@CucumberOptions(
    plugin = {"com.aventstack.extentreports.cucumber.adapter.ExtentCucumberAdapter:"}
)
```

**extent.properties:**
```properties
extent.reporter.spark.start=true
extent.reporter.spark.out=target/ExtentReports/ExtentReport.html
screenshot.dir=target/screenshots
screenshot.rel.path=../screenshots/
```

> Hot take: *"Centralize your generate configurations and context. Shared static variables across step definitions will cause race conditions during parallel executions."*

---

### **Q140-Q170: More Cucumber Topics**

**Q140. What is the difference between Background and Hooks?**
- **Background:** Gherkin steps that run before each scenario in a feature
- **Hooks:** Java code (@Before/@After) that runs before/after scenarios

**Q141. How do you handle screenshots in Cucumber?**
```java
@After
public void takeScreenshot(Scenario scenario) {
    if (scenario.isFailed()) {
        byte[] screenshot = ((TakesScreenshot) driver)
            .getScreenshotAs(OutputType.BYTES);
        scenario.attach(screenshot, "image/png", scenario.getName());
    }
}
```

**Q142. What are Cucumber expressions?**
```java
@Given("I have {int} cukes")
public void i_have_cukes(Integer count) {
    // Step implementation
}

@When("I eat {float} cukes")
public void i_eat_cukes(Float count) {
    // Step implementation
}

@Then("I have {string} cukes")
public void i_have_string_cukes(String count) {
    // Step implementation
}
```

**Q143. How do you use Data Tables in Cucumber?**
```gherkin
Scenario: Create user with details
  Given I create user with following details
    | firstName | lastName | email           |
    | John      | Doe      | john@example.com|
```

```java
@Given("I create user with following details")
public void createUser(DataTable dataTable) {
    List<Map<String, String>> data = dataTable.asMaps();
    Map<String, String> user = data.get(0);
    
    String firstName = user.get("firstName");
    String lastName = user.get("lastName");
    String email = user.get("email");
}
```

**Q144. How do you run failed scenarios?**
```java
// First run generates failed_scenarios.txt
@CucumberOptions(
    plugin = {"rerun:target/failed_scenarios.txt"}
)

// Rerun failed scenarios
@CucumberOptions(
    features = "@target/failed_scenarios.txt"
)
```

**Q145. What is dry run in Cucumber?**
```java
@CucumberOptions(
    dryRun = true // Checks if all steps have definitions
)
```

**Q146. How do you use regular expressions in step definitions?**
```java
@Given("^I have (\\d+) cukes in my belly$")
public void i_have_cukes(int count) {
    // Implementation
}
```

**Q147. What is the difference between Scenario and Scenario Outline?**
- **Scenario:** Single test case
- **Scenario Outline:** Template for multiple test cases with Examples

**Q148. How do you parameterize step definitions?**
```java
@Given("I have {int} cukes")
public void i_have_cukes(int count) {
    // count parameter from step
}
```

**Q149. What are Cucumber transform annotations?**
Used to convert parameters to custom types (deprecated in Cucumber 7+).

**Q150. How do you organize feature files?**
```
features/
├── login/
│   ├── valid_login.feature
│   └── invalid_login.feature
├── user_management/
│   ├── create_user.feature
│   └── edit_user.feature
└── reports/
    └── generate_reports.feature
```

**Q151-Q170:** Additional Cucumber topics including:
- Parallel execution with Cucumber
- Cucumber with Selenium
- Page Object Model with Cucumber
- Cucumber vs TestNG
- Best practices for feature files
- Custom parameter types
- DocString in Cucumber
- Cucumber CLI options
- Cucumber with REST-Assured
- Cucumber with Spring Boot
- Behavior-Driven Development principles
- Writing better scenarios
- Cucumber reports customization
- Continuous Integration with Cucumber
- Cucumber hooks order
- Scenario context management
- Cucumber with Docker
- Performance testing with Cucumber
- Cucumber plugin development
- Cucumber best practices

> Hot take: *"Don't treat BDD as a magic bullet. If the business team doesn't read your between features, you're just writing slow, high-maintenance tests with extra layers of translation."*

---

## **Manual Testing Fundamentals**

### **Q171. What is Software Testing?**
**Answer:** Software Testing is the process of evaluating a software application to find defects, verify that it meets requirements, and ensure quality before release.

**Objectives:**
1. Find defects early
2. Verify functionality
3. Validate requirements
4. Ensure quality
5. Build confidence
6. Prevent defects
7. Reduce maintenance costs

> Hot take: *"Automate with ROI in mind. If a software test is highly volatile and requires constant maintenance, keep it manual and save developer time."*

---

### **Q172. What is the difference between Verification and Validation?**
**Answer:**

| Verification | Validation |
|--------------|------------|
| Are we building the product right? | Are we building the right product? |
| Static testing | Dynamic testing |
| Reviews, inspections, walkthroughs | Actual testing |
| Without executing code | With executing code |
| Checks documents, design | Checks software |
| Done before validation | Done after verification |
| Example: Code review | Example: User acceptance testing |

> Hot take: *"A passing run is good, but a clear, reproducible failure report is great. The true test of a framework is how fast developers can fix its between reports."*

---

### **Q173. What is SDLC (Software Development Life Cycle)?**
**Answer:** SDLC is a process followed for software development.

**Phases:**
1. **Requirements Gathering**
   - Collect and document requirements
   - Stakeholder meetings

2. **Design**
   - System architecture
   - Database design
   - UI/UX design

3. **Development**
   - Coding
   - Unit testing

4. **Testing**
   - Various testing types
   - Defect reporting
   - Verification

5. **Deployment**
   - Release to production
   - User training

6. **Maintenance**
   - Bug fixes
   - Enhancements
   - Support

> Hot take: *"Shift-left is the key to cost-effective QA. Catching requirements gaps for software early in design is 10x cheaper than testing them at merge time."*

---

### **Q174. What is STLC (Software Testing Life Cycle)?**
**Answer:** STLC is a sequence of activities performed during the testing process.

**Phases:**
1. **Requirement Analysis**
   - Understand requirements
   - Identify testable requirements
   - RTM (Requirements Traceability Matrix)

2. **Test Planning**
   - Test strategy
   - Test plan document
   - Resource allocation
   - Entry/Exit criteria

3. **Test Case Development**
   - Write test cases
   - Review test cases
   - Test data preparation

4. **Test Environment Setup**
   - Hardware/software setup
   - Test data setup
   - Smoke testing

5. **Test Execution**
   - Execute test cases
   - Log defects
   - Retest defects
   - Regression testing

6. **Test Closure**
   - Test summary report
   - Metrics
   - Lessons learned

> Hot take: *"Automate with ROI in mind. If a software test is highly volatile and requires constant maintenance, keep it manual and save developer time."*

---

### **Q175. What is a Test Case?**
**Answer:** A test case is a set of conditions or variables to determine if a system works correctly.

**Components:**
- **Test Case ID:** Unique identifier
- **Test Scenario:** What to test
- **Test Steps:** Detailed steps
- **Test Data:** Input values
- **Expected Result:** What should happen
- **Actual Result:** What actually happened
- **Status:** Pass/Fail
- **Priority:** High/Medium/Low
- **Prerequisites:** Setup needed

**Example:**
```
Test Case ID: TC_LOGIN_001
Test Scenario: Verify login with valid credentials
Prerequisites: User should exist in database

Steps:
1. Navigate to login page
2. Enter username: "testuser"
3. Enter password: "Test@123"
4. Click login button

Test Data:
- Username: testuser
- Password: Test@123

Expected Result:
- User successfully logged in
- Redirected to dashboard
- Welcome message displayed

Actual Result: <To be filled during execution>
Status: <Pass/Fail>
```

> Hot take: *"A passing run is good, but a clear, reproducible failure report is great. The true test of a framework is how fast developers can fix its automation reports."*

---

### **Q176. What is a Test Scenario?**
**Answer:** Test scenario is a high-level description of what to test, without detailed steps.

**Examples:**
- Verify user login functionality
- Verify search feature
- Verify payment processing
- Verify data export

**Test Scenario vs Test Case:**
- Scenario: What to test (high-level)
- Test Case: How to test (detailed steps)

> Hot take: *"Shift-left is the key to cost-effective QA. Catching requirements gaps for scenario early in design is 10x cheaper than testing them at merge time."*

---

### **Q177. What is a Bug/Defect?**
**Answer:** A bug is a flaw in a software system that causes incorrect or unexpected results.

**Bug Life Cycle:**
```
New → Assigned → Open → Fixed → Retest → Verified → Closed

Alternative paths:
- Rejected (if not a bug)
- Deferred (postponed)
- Duplicate (already reported)
- Reopened (fix didn't work)
```

**Bug Report Template:**
```
Bug ID: BUG-001
Title: Login button not clickable
Severity: High
Priority: High
Status: New
Reported By: QA Team
Assigned To: Dev Team

Environment:
- OS: Windows 10
- Browser: Chrome 118
- Version: 1.2.3

Steps to Reproduce:
1. Navigate to login page
2. Enter credentials
3. Click login button

Expected Result:
Button should be clickable and submit form

Actual Result:
Button is disabled and not clickable

Attachments:
- Screenshot
- Console logs
```

> Hot take: *"Automate with ROI in mind. If a defect test is highly volatile and requires constant maintenance, keep it manual and save developer time."*

---

### **Q178. What are Severity and Priority?**
**Answer:**

**Severity:** Impact on functionality
- **Critical:** System crash, data loss
- **Major:** Major feature not working
- **Minor:** Minor feature issue
- **Trivial:** UI issue, typo

**Priority:** Urgency to fix
- **High:** Fix immediately
- **Medium:** Fix in next release
- **Low:** Fix when time permits

**Examples:**
| Severity | Priority | Example |
|----------|----------|---------|
| High | High | Login not working |
| High | Low | Minor spelling error on rarely used page |
| Low | High | Logo misaligned on homepage |
| Low | Low | Tooltip text incomplete |

> Hot take: *"A passing run is good, but a clear, reproducible failure report is great. The true test of a framework is how fast developers can fix its severity reports."*

---

### **Q179. What is RTM (Requirements Traceability Matrix)?**
**Answer:** RTM is a document that maps requirements to test cases to ensure all requirements are tested.

**Example:**
| Req ID | Requirement | Test Case ID | Status |
|--------|-------------|--------------|--------|
| REQ-001 | User login | TC_001, TC_002 | Pass |
| REQ-002 | Forgot password | TC_003 | Pass |
| REQ-003 | User registration | TC_004, TC_005 | Fail |

**Purpose:**
- Verify all requirements are tested
- Track test coverage
- Identify gaps

> Hot take: *"Shift-left is the key to cost-effective QA. Catching requirements gaps for requirement early in design is 10x cheaper than testing them at merge time."*

---

### **Q180. What is a Test Plan?**
**Answer:** Test Plan is a document describing scope, approach, resources, and schedule of testing activities.

**Contents:**
1. Test Plan ID
2. Introduction
3. Test Items
4. Features to Test
5. Features Not to Test
6. Test Approach
7. Entry/Exit Criteria
8. Suspension/Resumption Criteria
9. Test Deliverables
10. Test Environment
11. Staffing and Training
12. Schedule
13. Risks and Contingencies
14. Approvals

> Hot take: *"Automate with ROI in mind. If a automation test is highly volatile and requires constant maintenance, keep it manual and save developer time."*

---

### **Q181-Q210: More Manual Testing Topics**

**Q181. What is Regression Testing?**
Retesting unchanged areas after code changes to ensure no new bugs introduced.

**Q182. What is Smoke Testing?**
Quick test to verify basic functionality before detailed testing.

**Q183. What is Sanity Testing?**
Quick test to verify specific functionality after minor changes.

**Q184. What is Ad-hoc Testing?**
Random testing without formal test cases.

**Q185. What is Exploratory Testing?**
Simultaneous learning, test design, and execution.

**Q186. What is Positive vs Negative Testing?**
- Positive: Test with valid inputs
- Negative: Test with invalid inputs

**Q187. What is Black Box Testing?**
Testing without knowledge of internal code structure.

**Q188. What is White Box Testing?**
Testing with knowledge of internal code structure.

**Q189. What is Gray Box Testing?**
Partial knowledge of internal structure.

**Q190. What is UAT (User Acceptance Testing)?**
Final testing by end users to validate requirements.

**Q191. What is Alpha Testing?**
Testing by internal team before release to external users.

**Q192. What is Beta Testing?**
Testing by limited external users before general release.

**Q193. What is Entry Criteria?**
Conditions to be met before testing begins.

**Q194. What is Exit Criteria?**
Conditions to be met before testing ends.

**Q195. What is Test Coverage?**
Percentage of requirements/code tested.

**Q196. What is Root Cause Analysis?**
Finding the underlying cause of defects.

**Q197. What is Defect Density?**
Number of defects per unit (e.g., per KLOC).

**Q198. What is Defect Leakage?**
Defects found in production that escaped testing.

**Q199. What is Configuration Management?**
Managing and controlling changes to software.

**Q200. What is Risk-Based Testing?**
Prioritizing testing based on risk assessment.

**Q201-Q210:** Additional topics including:
- Test estimation techniques
- Agile testing principles
- Test metrics and KPIs
- Defect management process
- Test automation vs manual testing
- When to automate tests
- Test data management
- Browser compatibility testing
- Cross-platform testing
- Localization/Globalization testing

> Hot take: *"A passing run is good, but a clear, reproducible failure report is great. The true test of a framework is how fast developers can fix its regression reports."*

---

## **Types of Testing**

### **Q211. What are the main types of testing?**
**Answer:**

**1. Functional Testing:**
- Unit Testing
- Integration Testing
- System Testing
- Acceptance Testing
- Smoke Testing
- Sanity Testing
- Regression Testing

**2. Non-Functional Testing:**
- Performance Testing
- Load Testing
- Stress Testing
- Security Testing
- Usability Testing
- Compatibility Testing

> Hot take: *"A passing run is good, but a clear, reproducible failure report is great. The true test of a framework is how fast developers can fix its type reports."*

---

### **Q212. What is Unit Testing?**
**Answer:** Testing individual components/units in isolation.

**Characteristics:**
- Done by developers
- Tests smallest testable parts
- Uses frameworks like JUnit, TestNG
- Automated

**Example:**
```java
@Test
public void testAddition() {
    Calculator calc = new Calculator();
    assertEquals(5, calc.add(2, 3));
}
```

> Hot take: *"Shift-left is the key to cost-effective QA. Catching requirements gaps for automation early in design is 10x cheaper than testing them at merge time."*

---

### **Q213. What is Integration Testing?**
**Answer:** Testing interaction between integrated units/modules.

**Approaches:**
1. **Big Bang:** Test all modules together
2. **Top-Down:** Test from top-level modules
3. **Bottom-Up:** Test from low-level modules
4. **Sandwich:** Combination of top-down and bottom-up

> Hot take: *"Automate with ROI in mind. If a integration test is highly volatile and requires constant maintenance, keep it manual and save developer time."*

---

### **Q214. What is System Testing?**
**Answer:** Testing the complete integrated system to verify it meets requirements.

**Types:**
- Functional testing
- Non-functional testing
- End-to-end testing

> Hot take: *"A passing run is good, but a clear, reproducible failure report is great. The true test of a framework is how fast developers can fix its system reports."*

---

### **Q215. What is Performance Testing?**
**Answer:** Testing system performance under expected workload.

**Types:**
1. **Load Testing:** Test under expected load
2. **Stress Testing:** Test under extreme load
3. **Spike Testing:** Sudden increase in load
4. **Endurance Testing:** Sustained load over time
5. **Volume Testing:** Large volume of data

**Metrics:**
- Response time
- Throughput
- CPU usage
- Memory usage
- Error rate

> Hot take: *"Shift-left is the key to cost-effective QA. Catching requirements gaps for performance early in design is 10x cheaper than testing them at merge time."*

---

### **Q216. What is Security Testing?**
**Answer:** Testing to find vulnerabilities and ensure data protection.

**Types:**
1. **Vulnerability Scanning:** Automated scanning
2. **Penetration Testing:** Simulated attacks
3. **Security Auditing:** Inspection of code/infrastructure
4. **SQL Injection Testing**
5. **Cross-Site Scripting (XSS) Testing**
6. **Authentication/Authorization Testing**

> Hot take: *"Automate with ROI in mind. If a security test is highly volatile and requires constant maintenance, keep it manual and save developer time."*

---

### **Q217. What is Compatibility Testing?**
**Answer:** Testing software across different environments.

**Types:**
1. **Browser Compatibility:** Different browsers
2. **OS Compatibility:** Different operating systems
3. **Device Compatibility:** Different devices
4. **Network Compatibility:** Different network speeds

> Hot take: *"A passing run is good, but a clear, reproducible failure report is great. The true test of a framework is how fast developers can fix its automation reports."*

---

### **Q218. What is Usability Testing?**
**Answer:** Testing user-friendliness and ease of use.

**Aspects:**
- Navigation
- Content clarity
- Learn ability
- Operability
- Attractiveness

> Hot take: *"Shift-left is the key to cost-effective QA. Catching requirements gaps for usability early in design is 10x cheaper than testing them at merge time."*

---

### **Q219. What is API Testing?**
**Answer:** Testing application APIs directly.

**What to Test:**
- Functionality
- Reliability
- Performance
- Security

**Tools:** REST-Assured, Postman, SoapUI

> Hot take: *"Automate with ROI in mind. If a automation test is highly volatile and requires constant maintenance, keep it manual and save developer time."*

---

### **Q220. What is Database Testing?**
**Answer:** Testing database integrity, data validity, and performance.

**Types:**
- Schema validation
- Data integrity
- CRUD operations
- Performance testing
- Data migration testing

> Hot take: *"A passing run is good, but a clear, reproducible failure report is great. The true test of a framework is how fast developers can fix its database reports."*

---

### **Q221-Q250: More Testing Types**

**Q221. What is Smoke Testing vs Sanity Testing?**
- **Smoke:** Wide but shallow (all major features)
- **Sanity:** Narrow but deep (specific functionality)

**Q222. What is Regression Testing strategies?**
- Retest all
- Regression test selection
- Test case prioritization

**Q223. What is End-to-End Testing?**
Testing complete flow from start to finish as a user would.

**Q224. What is Boundary Value Analysis?**
Testing at boundaries of input ranges.

**Q225. What is Equivalence Partitioning?**
Dividing inputs into groups that should behave similarly.

**Q226. What is Decision Table Testing?**
Testing different combinations of inputs and outputs.

**Q227. What is State Transition Testing?**
Testing system behavior through different states.

**Q228. What is Error Guessing?**
Using experience to guess likely errors.

**Q229. What is Monkey Testing?**
Random testing without test cases.

**Q230. What is Gorilla Testing?**
Testing one module extensively.

**Q231. What is A/B Testing?**
Comparing two versions to see which performs better.

**Q232. What is Accessibility Testing?**
Testing for users with disabilities (WCAG compliance).

**Q233. What is Localization Testing?**
Testing for specific locale/language.

**Q234. What is Globalization Testing?**
Testing for multiple locales.

**Q235. What is Recovery Testing?**
Testing system recovery after crashes.

**Q236. What is Compliance Testing?**
Testing adherence to standards/regulations.

**Q237. What is Mutation Testing?**
Changing code to verify test effectiveness.

**Q238. What is Fuzz Testing?**
Providing random/unexpected data as input.

**Q239. What is Component Testing?**
Testing individual software components.

**Q240. What is Interface Testing?**
Testing interfaces between modules.

**Q241-Q250:** Additional testing types including:
- Static vs Dynamic Testing
- Alpha vs Beta Testing
- Incremental Testing
- Non-functional Testing types
- Mobile App Testing
- Web Testing
- Desktop Testing
- Microservices Testing
- Contract Testing
- Chaos Engineering

> Hot take: *"Shift-left is the key to cost-effective QA. Catching requirements gaps for smoke early in design is 10x cheaper than testing them at merge time."*

---

## **Software Testing Theory**

### **Q251. What are the 7 Principles of Testing?**
**Answer:**

1. **Testing shows presence of defects**
   - Can prove bugs exist, not that there are none

2. **Exhaustive testing is impossible**
   - Can't test all combinations

3. **Early testing**
   - Test early in SDLC

4. **Defect clustering**
   - Small number of modules contain most defects

5. **Pesticide paradox**
   - Same tests won't find new bugs

6. **Testing is context dependent**
   - Different approaches for different applications

7. **Absence of errors fallacy**
   - 99% bug-free doesn't mean success

> Hot take: *"Shift-left is the key to cost-effective QA. Catching requirements gaps for principle early in design is 10x cheaper than testing them at merge time."*

---

### **Q252. What is V-Model?**
**Answer:** V-Model is an SDLC model where testing is associated with each development phase.

```
Requirements → Acceptance Testing
    ↓
Design → System Testing
    ↓
Architecture → Integration Testing
    ↓
Module Design → Unit Testing
    ↓
    Coding
```

> Hot take: *"Automate with ROI in mind. If a model test is highly volatile and requires constant maintenance, keep it manual and save developer time."*

---

### **Q253. What is Agile Testing?**
**Answer:** Testing in Agile follows iterative development with continuous testing.

**Principles:**
- Whole team approach
- Continuous feedback
- Early and frequent testing
- Minimize documentation
- Adapt to changes

**Agile Testing Quadrants:**
- Q1: Technology-facing, support development (Unit, Component)
- Q2: Business-facing, support development (Functional, Story)
- Q3: Business-facing, critique product (Exploratory, UAT)
- Q4: Technology-facing, critique product (Performance, Security)

> Hot take: *"A passing run is good, but a clear, reproducible failure report is great. The true test of a framework is how fast developers can fix its agile reports."*

---

### **Q254. What is Test-Driven Development (TDD)?**
**Answer:** Development approach where tests are written before code.

**Process:**
1. Write failing test
2. Write code to pass test
3. Refactor code
4. Repeat

**Benefits:**
- Better code quality
- Fewer bugs
- Living documentation
- Confident refactoring

> Hot take: *"Shift-left is the key to cost-effective QA. Catching requirements gaps for driven early in design is 10x cheaper than testing them at merge time."*

---

### **Q255. What is Behavior-Driven Development (BDD)?**
**Answer:** Extension of TDD focusing on behavior specification in plain language.

**Frameworks:** Cucumber, SpecFlow, JBehave

**Structure:**
```gherkin
Given [context]
When [action]
Then [outcome]
```

> Hot take: *"Automate with ROI in mind. If a behavior test is highly volatile and requires constant maintenance, keep it manual and save developer time."*

---

### **Q256-Q290: More Testing Theory**

**Q256. What is Shift-Left Testing?**
Testing earlier in SDLC to find defects early.

**Q257. What is Shift-Right Testing?**
Testing in production environment with real users.

**Q258. What is Risk-Based Testing?**
Prioritizing tests based on risk assessment.

**Q259. What is Test Pyramid?**
```
    E2E Tests (Few)
   ↗
  Integration Tests (Some)
 ↗
Unit Tests (Many)
```

**Q260. What is Test Automation Pyramid?**
Same as test pyramid - more unit tests, fewer UI tests.

**Q261. What is Continuous Testing?**
Automated testing as part of CI/CD pipeline.

**Q262. What is Static Testing?**
Testing without executing code (reviews, inspections).

**Q263. What is Dynamic Testing?**
Testing by executing code.

**Q264. What is Quality Assurance vs Quality Control?**
- **QA:** Process-oriented, prevention
- **QC:** Product-oriented, detection

**Q265. What are Test Design Techniques?**
- Equivalence Partitioning
- Boundary Value Analysis
- Decision Table
- State Transition
- Use Case Testing

**Q266-Q290:** Additional theory topics including:
- Test maturity models
- Defect management lifecycle
- Test estimation techniques
- Test metrics (defect density, test coverage)
- Pair testing
- Session-based testing
- Context-driven testing
- Test automation best practices
- CI/CD integration
- DevOps testing practices
- Test data management strategies
- Test environment management
- Defect prevention vs detection
- Testing in production
- Canary testing
- Blue-Green deployment testing
- Feature flag testing
- Chaos testing principles
- Test reporting and metrics
- ROI of test automation
- Testing standards (ISO, IEEE)
- Test process improvement
- Lessons learned documentation
- Test strategy vs test plan
- When not to automate

> Hot take: *"A passing run is good, but a clear, reproducible failure report is great. The true test of a framework is how fast developers can fix its shift reports."*

---

## **Java for Testing**

### **Q291. What Java concepts are important for automation testing?**
**Answer:**

1. **OOP Concepts**
   - Encapsulation
   - Inheritance
   - Polymorphism
   - Abstraction

2. **Collections Framework**
   - List, Set, Map
   - ArrayList, HashMap, HashSet

3. **Exception Handling**
   - try-catch-finally
   - throw, throws

4. **File Operations**
   - Reading/writing files
   - Properties files

5. **Multithreading**
   - Parallel execution

6. **Streams API**
   - Data manipulation

> Hot take: *"Decouple your locators from step logic. Keeping xpath/css selectors in separate JSON configs makes concept updates easy during UI redesigns."*

---

### **Q292. How do you use ArrayList in automation?**
**Answer:**
```java
import java.util.ArrayList;
import java.util.List;

public class ArrayListExample {
    public void storeTestData() {
        // Store test data
        List<String> usernames = new ArrayList<>();
        usernames.add("user1");
        usernames.add("user2");
        usernames.add("user3");
        
        // Iterate
        for (String username : usernames) {
            System.out.println("Testing with: " + username);
        }
        
        // Get specific element
        String firstUser = usernames.get(0);
        
        // Check if exists
        if (usernames.contains("user1")) {
            System.out.println("User found");
        }
        
        // Size
        int count = usernames.size();
    }
}
```

> Hot take: *"Keep your framework simple and onboarding friendly. If an engineer takes days to write a simple arraylist script, your framework is over-engineered."*

---

### **Q293. How do you use HashMap for test data?**
**Answer:**
```java
import java.util.HashMap;
import java.util.Map;

public class HashMapExample {
    public void storeCredentials() {
        Map<String, String> credentials = new HashMap<>();
        credentials.put("admin", "admin123");
        credentials.put("user1", "pass1");
        credentials.put("user2", "pass2");
        
        // Get password
        String password = credentials.get("admin");
        
        // Iterate
        for (Map.Entry<String, String> entry : credentials.entrySet()) {
            String username = entry.getKey();
            String pwd = entry.getValue();
            System.out.println(username + " : " + pwd);
        }
        
        // Check if key exists
        if (credentials.containsKey("admin")) {
            System.out.println("Admin user exists");
        }
    }
}
```

> Hot take: *"Centralize configuration values using type-safe libraries. Avoid scattering properties files or property parsing across your hashmap modules."*

---

### **Q294. How do you handle exceptions in test automation?**
**Answer:**
```java
import org.openqa.selenium.NoSuchElementException;
import org.testng.annotations.Test;

public class ExceptionHandling {
    
    @Test
    public void handleException() {
        try {
            // Code that may throw exception
            driver.findElement(By.id("invalid")).click();
        } catch (NoSuchElementException e) {
            System.out.println("Element not found: " + e.getMessage());
            // Take screenshot, log error
        } catch (Exception e) {
            System.out.println("General exception: " + e.getMessage());
        } finally {
            System.out.println("Cleanup code");
        }
    }
    
    @Test(expectedExceptions = ArithmeticException.class)
    public void testException() {
        int result = 10 / 0; // Expected to throw exception
    }
}
```

> Hot take: *"Hold your test code to production standards. Letting technical debt accumulate in your exception suite makes it a maintenance nightmare."*

---

### **Q295. How do you read/write files in Java for testing?**
**Answer:**
```java
import java.io.*;
import java.util.Properties;

public class FileOperations {
    
    // Read text file
    public void readFile() throws IOException {
        BufferedReader reader = new BufferedReader(
            new FileReader("testdata.txt"));
        String line;
        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }
        reader.close();
    }
    
    // Write to file
    public void writeFile() throws IOException {
        BufferedWriter writer = new BufferedWriter(
            new FileWriter("results.txt"));
        writer.write("Test Results\n");
        writer.write("All tests passed");
        writer.close();
    }
    
    // Read properties file
    public void readProperties() throws IOException {
        Properties prop = new Properties();
        FileInputStream input = new FileInputStream("config.properties");
        prop.load(input);
        
        String url = prop.getProperty("url");
        String username = prop.getProperty("username");
        
        input.close();
    }
}
```

> Hot take: *"Decouple your locators from step logic. Keeping xpath/css selectors in separate JSON configs makes write updates easy during UI redesigns."*

---

### **Q296-Q330: More Java Testing Topics**

**Q296. What is inheritance in test automation?**
```java
public class BaseTest {
    WebDriver driver;
    
    @BeforeMethod
    public void setup() {
        driver = new ChromeDriver();
    }
}

public class LoginTest extends BaseTest {
    @Test
    public void testLogin() {
        // driver is inherited from BaseTest
        driver.get("https://example.com");
    }
}
```

**Q297. What is method overloading for reusability?**
```java
public void click(String locator) {
    driver.findElement(By.id(locator)).click();
}

public void click(By locator) {
    driver.findElement(locator).click();
}

public void click(WebElement element) {
    element.click();
}
```

**Q298. How do you use interfaces in framework?**
```java
public interface Page {
    void navigate();
    boolean isLoaded();
}

public class LoginPage implements Page {
    public void navigate() {
        driver.get("/login");
    }
    
    public boolean isLoaded() {
        return driver.getTitle().contains("Login");
    }
}
```

**Q299. What are Access Modifiers importance?**
- public: Accessible everywhere
- private: Only within class
- protected: Within package and subclasses
- default: Within package

**Q300-Q330:** Additional Java topics:
- Static vs Instance variables
- Final keyword usage
- Abstract classes
- Encapsulation for Page Objects
- Polymorphism in framework design
- Constructor usage
- this vs super keywords
- String manipulation methods
- StringBuilder for reporting
- Date-Time handling
- Regular expressions
- Lambda expressions
- Stream API for data
- File JSON parsing
- Excel data handling
- Database connectivity
- Logging frameworks
- Design patterns (Singleton, Factory)
- Thread safety
- Synchronization

> Hot take: *"Keep your framework simple and onboarding friendly. If an engineer takes days to write a simple inheritance script, your framework is over-engineered."*

---

## **Test Automation Frameworks**

### **Q331. What is a Test Automation Framework?**
**Answer:** A framework is a set of guidelines, coding standards, concepts, processes, practices, tools, and environment that provides test automation support.

**Types:**
1. Linear/Record-Playback
2. Modular
3. Data-Driven
4. Keyword-Driven
5. Hybrid
6. BDD (Behavior-Driven)
7. Page Object Model (POM)

> Hot take: *"Decouple your locators from step logic. Keeping xpath/css selectors in separate JSON configs makes automation updates easy during UI redesigns."*

---

### **Q332. What is Page Object Model (POM)?**
**Answer:**
```java
// Page Object
public class LoginPage {
    WebDriver driver;
    
    // Locators
    By usernameField = By.id("username");
    By passwordField = By.id("password");
    By loginButton = By.id("loginBtn");
    
    public LoginPage(WebDriver driver) {
        this.driver = driver;
    }
    
    // Actions
    public void enterUsername(String username) {
        driver.findElement(usernameField).sendKeys(username);
    }
    
    public void enterPassword(String password) {
        driver.findElement(passwordField).sendKeys(password);
    }
    
    public void clickLogin() {
        driver.findElement(loginButton).click();
    }
    
    public void login(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        clickLogin();
    }
}

// Test Class
public class LoginTest {
    @Test
    public void testLogin() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.login("admin", "admin123");
    }
}
```

> Hot take: *"Keep your framework simple and onboarding friendly. If an engineer takes days to write a simple object script, your framework is over-engineered."*

---

### **Q333. What is Data-Driven Framework?**
**Answer:**
```java
@DataProvider(name = "loginData")
public Object[][] getTestData() {
    return new Object[][] {
        {"user1", "pass1", "Dashboard"},
        {"user2", "pass2", "Dashboard"},
        {"invalid", "wrong", "Error"}
    };
}

@Test(dataProvider = "loginData")
public void testLogin(String username, String password, String expected) {
    loginPage.login(username, password);
    String actual = homePage.getPageTitle();
    Assert.assertEquals(actual, expected);
}
```

> Hot take: *"Centralize configuration values using type-safe libraries. Avoid scattering properties files or property parsing across your driven modules."*

---

### **Q334. What is Keyword-Driven Framework?**
**Answer:**
```
Excel Sheet:
| Keyword    | Locator        | Value      |
|------------|----------------|------------|
| navigate   | url            | example.com|
| type       | id=username    | admin      |
| type       | id=password    | admin123   |
| click      | id=loginBtn    |            |
| verify     | id=dashboard   | Dashboard  |
```

```java
public void executeKeyword(String keyword, String locator, String value) {
    switch(keyword) {
        case "navigate":
            driver.get(value);
            break;
        case "type":
            driver.findElement(getLocator(locator)).sendKeys(value);
            break;
        case "click":
            driver.findElement(getLocator(locator)).click();
            break;
        case "verify":
            String actual = driver.findElement(getLocator(locator)).getText();
            Assert.assertEquals(actual, value);
            break;
    }
}
```

> Hot take: *"Hold your test code to production standards. Letting technical debt accumulate in your keyword suite makes it a maintenance nightmare."*

---

### **Q335-Q360: More Framework Topics**

**Q335. What is Hybrid Framework?**
Combination of multiple frameworks (Data-Driven + Keyword + POM).

**Q336. What are framework components?**
- Test Data
- Object Repository
- Test Scripts
- Test Configuration
- Utilities
- Reports
- Logs

**Q337. What is a good folder structure?**
```
src/
├── main/
│   └── java/
│       ├── pages/
│       ├── utils/
│       └── config/
├── test/
│   ├── java/
│   │   ├── tests/
│   │   └── listeners/
│   └── resources/
│       ├── features/
│       └── testdata/
└── pom.xml
```

**Q338. What are framework best practices?**
1. Follow naming conventions
2. Use Page Object Model
3. Implement waits properly
4. Handle exceptions
5. Generate reports
6. Use version control
7. Implement logging
8. Externalize test data
9. Maintain clean code
10. Document framework

**Q339-Q360:** Additional framework topics including:
- Configuration management
- Test data management
- Cross-browser testing setup
- Parallel execution
- Reporting mechanisms
- CI/CD integration
- Docker integration
- Cloud execution (BrowserStack, Sauce Labs)
- Screenshot on failure
- Video recording
- Performance monitoring
- Test retry mechanism
- Failed test analysis
- Test maintenance strategies
- Framework scalability
- Code reusability patterns
- Design patterns in automation
- Singleton pattern for driver
- Factory pattern for browsers
- Fluent interface pattern
- Builder pattern usage

> Hot take: *"Decouple your locators from step logic. Keeping xpath/css selectors in separate JSON configs makes hybrid updates easy during UI redesigns."*

---

## **Conclusion**

This comprehensive guide covers 360 real-world QA/SDET interview questions across:
- REST-Assured API Testing
- HTTP Methods & Status Codes
- TestNG Framework
- Cucumber & BDD
- Manual Testing Fundamentals
- Types of Testing
- Software Testing Theory
- Java for Testing
- Test Automation Frameworks

---

**Key Takeaways:**
1. **REST-Assured:** Master Given-When-Then syntax, authentication, and JSON validation
2. **TestNG:** Understand annotations, parameterization, and parallel execution
3. **Cucumber:** Write clear scenarios, implement step definitions, use hooks
4. **Manual Testing:** Know STLC, bug lifecycle, test case design
5. **Testing Types:** Understand when to use each type of testing
6. **Theory:** Follow testing principles and best practices
7. **Java:** Collections, exception handling, file operations
8. **Frameworks:** Implement POM, data-driven, and hybrid approaches

**Preparation Tips:**
- Practice code examples in IDE
- Understand concepts, don't memorize
- Keep up with latest versions
- Build sample frameworks
- Contribute to open-source projects
- Follow industry blogs and forums

**Good luck with your interviews!** 🚀
