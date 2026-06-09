# RestAssured, JSON & ObjectMapper — Quick-Fire Q&A

Covers the exact gap from the interview: deserialising API responses into POJOs and Collections instead of hardcoding, plus all rapid-fire theory around JSON, ObjectMapper, file handling, and RestAssured.

**Base URL used throughout:** `https://fakerestapi.azurewebsites.net`

---

## Table of Contents

- **Section 1 — POJO Setup** (model classes for the FakeRESTApi)
- **Section 2 — RestAssured Basics** (syntax, given/when/then)
- **Section 3 — Deserialisation into Collections** (the interview gap)
- **Section 4 — Full CRUD Examples** (Activities, Books, Users)
- **Section 5 — ObjectMapper Rapid-Fire** (serialise / deserialise theory)
- **Section 6 — JSON Handling Concepts** (rapid-fire theory)
- **Section 7 — File Handling in Java** (read JSON from file)
- **Section 8 — RestAssured Theory Q&A** (rapid-fire definitions)

---

## Section 1 — POJO Setup

A POJO (Plain Old Java Object) is what you deserialise JSON into. Jackson (used by RestAssured) maps JSON keys to field names automatically.

```java
// Activity.java
public class Activity {
    private int id;
    private String title;
    private String dueDate;
    private boolean completed;

    // Getters and setters (required for Jackson)
    public int getId()           { return id; }
    public void setId(int id)    { this.id = id; }
    public String getTitle()     { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDueDate()   { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}
```

```java
// Book.java
public class Book {
    private int id;
    private String title;
    private String description;
    private int pageCount;
    private String excerpt;
    private String publishDate;
    // getters + setters ...
}
```

```java
// User.java
public class User {
    private int id;
    private String userName;
    private String password;
    // getters + setters ...
}
```

```java
// Author.java
public class Author {
    private int id;
    private int idBook;
    private String firstName;
    private String lastName;
    // getters + setters ...
}
```

```java
// CoverPhoto.java
public class CoverPhoto {
    private int id;
    private int idBook;
    private String url;
    // getters + setters ...
}
```

**Tip:** Use `@JsonIgnoreProperties(ignoreUnknown = true)` on the class to avoid failures when the API returns extra fields you don't model.

```java
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Activity { ... }
```

---

## Section 2 — RestAssured Basics

**Q. What is the Given / When / Then structure?**

```java
given()                        // set up: headers, body, auth, params
    .baseUri("https://fakerestapi.azurewebsites.net")
    .header("Content-Type", "application/json")
.when()                        // action: HTTP method + endpoint
    .get("/api/v1/Activities")
.then()                        // assertions on the response
    .statusCode(200)
    .body("size()", greaterThan(0));
```

**Q. How do you set a base URI globally so you don't repeat it?**

```java
// In @BeforeAll or a base test class
RestAssured.baseURI = "https://fakerestapi.azurewebsites.net";

// Now every request just needs the path:
given().when().get("/api/v1/Activities").then().statusCode(200);
```

**Q. How do you set default headers globally?**

```java
RequestSpecification requestSpec = new RequestSpecBuilder()
    .setBaseUri("https://fakerestapi.azurewebsites.net")
    .addHeader("Content-Type", "application/json")
    .addHeader("Accept", "application/json")
    .build();

RestAssured.requestSpecification = requestSpec;
```

---

## Section 3 — Deserialisation into Collections (THE interview gap)

**The wrong way (what you were doing — hardcoded):**
```java
// DON'T DO THIS in interviews — hardcoding the response body
given().when().get("/api/v1/Activities")
    .then().body(equalTo("[{\"id\":1,\"title\":\"Activity1\"...}]"));
```

**The right way — deserialise into a List:**

```java
// Get all activities as a List<Activity>
List<Activity> activities =
    given()
        .when()
            .get("/api/v1/Activities")
        .then()
            .statusCode(200)
            .extract()
            .jsonPath()
            .getList(".", Activity.class);  // "." means root array

System.out.println("Total activities: " + activities.size());
System.out.println("First title: " + activities.get(0).getTitle());
```

**Alternative — extract full response then deserialise:**
```java
Response response = given().when().get("/api/v1/Activities");

// Option A: jsonPath list
List<Activity> list = response.jsonPath().getList(".", Activity.class);

// Option B: ObjectMapper directly
ObjectMapper mapper = new ObjectMapper();
List<Activity> list2 = mapper.readValue(
    response.asString(),
    mapper.getTypeFactory().constructCollectionType(List.class, Activity.class)
);
```

**Deserialise a single object (not an array):**
```java
Activity activity =
    given()
        .when()
            .get("/api/v1/Activities/1")
        .then()
            .statusCode(200)
            .extract()
            .as(Activity.class);  // direct POJO extraction

System.out.println(activity.getTitle());
```

**Asserting on fields of a deserialised list:**
```java
List<Activity> activities = given()
    .when().get("/api/v1/Activities")
    .then().extract().jsonPath().getList(".", Activity.class);

// Assert all returned items have an id > 0
activities.forEach(a -> assertThat(a.getId()).isGreaterThan(0));

// Find specific item using streams
Optional<Activity> found = activities.stream()
    .filter(a -> a.getTitle().equals("Activity1"))
    .findFirst();

assertThat(found).isPresent();
```

---

## Section 4 — Full CRUD Examples (FakeRESTApi)

### Activities — GET all

```java
List<Activity> activities = given()
    .when()
        .get("/api/v1/Activities")
    .then()
        .statusCode(200)
        .extract()
        .jsonPath()
        .getList(".", Activity.class);

assertThat(activities).isNotEmpty();
```

### Activities — GET by ID

```java
int activityId = 1;

Activity activity = given()
    .pathParam("id", activityId)
    .when()
        .get("/api/v1/Activities/{id}")
    .then()
        .statusCode(200)
        .extract()
        .as(Activity.class);

assertThat(activity.getId()).isEqualTo(activityId);
```

### Activities — POST (create)

```java
Activity newActivity = new Activity();
newActivity.setId(0);
newActivity.setTitle("Write Unit Tests");
newActivity.setDueDate("2026-06-15T10:00:00.000Z");
newActivity.setCompleted(false);

Activity created = given()
    .contentType(ContentType.JSON)
    .body(newActivity)                      // Jackson serialises POJO to JSON automatically
    .when()
        .post("/api/v1/Activities")
    .then()
        .statusCode(200)
        .extract()
        .as(Activity.class);

assertThat(created.getTitle()).isEqualTo("Write Unit Tests");
```

### Activities — PUT (update)

```java
Activity updated = new Activity();
updated.setId(1);
updated.setTitle("Updated Title");
updated.setDueDate("2026-06-20T00:00:00.000Z");
updated.setCompleted(true);

Activity result = given()
    .contentType(ContentType.JSON)
    .pathParam("id", 1)
    .body(updated)
    .when()
        .put("/api/v1/Activities/{id}")
    .then()
        .statusCode(200)
        .extract()
        .as(Activity.class);

assertThat(result.isCompleted()).isTrue();
```

### Activities — DELETE

```java
given()
    .pathParam("id", 1)
    .when()
        .delete("/api/v1/Activities/{id}")
    .then()
        .statusCode(200);
```

### Books — GET by ID

```java
Book book = given()
    .pathParam("id", 1)
    .when()
        .get("/api/v1/Books/{id}")
    .then()
        .statusCode(200)
        .extract()
        .as(Book.class);

assertThat(book.getPageCount()).isGreaterThan(0);
```

### Authors — GET all books by a specific book ID

```java
List<Author> authors = given()
    .pathParam("idBook", 1)
    .when()
        .get("/api/v1/Authors/authors/books/{idBook}")
    .then()
        .statusCode(200)
        .extract()
        .jsonPath()
        .getList(".", Author.class);

assertThat(authors).allMatch(a -> a.getIdBook() == 1);
```

### CoverPhotos — GET covers by book ID

```java
List<CoverPhoto> covers = given()
    .pathParam("idBook", 1)
    .when()
        .get("/api/v1/CoverPhotos/books/covers/{idBook}")
    .then()
        .statusCode(200)
        .extract()
        .jsonPath()
        .getList(".", CoverPhoto.class);

assertThat(covers.get(0).getUrl()).isNotBlank();
```

---

## Section 5 — ObjectMapper Rapid-Fire

---

**Q. What is ObjectMapper?**

ObjectMapper is Jackson's core class for converting between Java objects and JSON. It handles both serialisation (Java → JSON) and deserialisation (JSON → Java). RestAssured uses Jackson under the hood when you call `.as(MyClass.class)` or pass a POJO as `.body()`.

---

**Q. Serialise a POJO to JSON String.**

```java
ObjectMapper mapper = new ObjectMapper();
Activity activity = new Activity();
activity.setId(1);
activity.setTitle("Test");

String json = mapper.writeValueAsString(activity);
// Output: {"id":1,"title":"Test","dueDate":null,"completed":false}
```

---

**Q. Deserialise a JSON String to a POJO.**

```java
String json = "{\"id\":1,\"title\":\"Test\",\"completed\":false}";
ObjectMapper mapper = new ObjectMapper();
Activity activity = mapper.readValue(json, Activity.class);

System.out.println(activity.getTitle());  // "Test"
```

---

**Q. Deserialise a JSON array to a List.**

```java
String jsonArray = "[{\"id\":1,\"title\":\"A\"},{\"id\":2,\"title\":\"B\"}]";
ObjectMapper mapper = new ObjectMapper();

List<Activity> list = mapper.readValue(
    jsonArray,
    mapper.getTypeFactory().constructCollectionType(List.class, Activity.class)
);

System.out.println(list.size());  // 2
```

---

**Q. What is `TypeReference` and when do you use it?**

`TypeReference` preserves generic type information at runtime (generics are erased by Java's compiler). Use it when deserialising complex types like `Map<String, List<Activity>>`:

```java
ObjectMapper mapper = new ObjectMapper();
List<Activity> list = mapper.readValue(json, new TypeReference<List<Activity>>() {});

Map<String, Object> map = mapper.readValue(json, new TypeReference<Map<String, Object>>() {});
```

---

**Q. What are common Jackson annotations?**

```java
@JsonProperty("due_date")      // maps JSON key "due_date" to Java field dueDate
private String dueDate;

@JsonIgnore                    // skip this field during serialisation AND deserialisation
private String internalToken;

@JsonInclude(JsonInclude.Include.NON_NULL)  // don't include null fields in output
public class Activity { ... }

@JsonIgnoreProperties(ignoreUnknown = true)  // ignore extra JSON fields not in POJO
public class Activity { ... }

@JsonAlias({"due_date", "dueDate"})  // accept multiple JSON keys for one field
private String dueDate;
```

---

**Q. How do you read/write JSON to a File with ObjectMapper?**

```java
ObjectMapper mapper = new ObjectMapper();

// Write POJO to file
Activity activity = new Activity();
activity.setTitle("From File");
mapper.writeValue(new File("activity.json"), activity);

// Read POJO from file
Activity loaded = mapper.readValue(new File("activity.json"), Activity.class);

// Pretty-print JSON
String pretty = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(activity);
```

---

**Q. What is JsonNode and when do you use it?**

`JsonNode` is a tree-model representation of JSON — useful when you don't know the structure at compile time or want to navigate JSON without a POJO:

```java
ObjectMapper mapper = new ObjectMapper();
JsonNode root = mapper.readTree(jsonString);

String title  = root.get("title").asText();
int id        = root.get("id").asInt();
boolean done  = root.get("completed").asBoolean();

// Nested:
String city = root.path("address").path("city").asText();

// Array:
JsonNode items = root.get("activities");
for (JsonNode item : items) {
    System.out.println(item.get("title").asText());
}
```

---

## Section 6 — JSON Handling Concepts

---

**Q. What is the difference between JSONPath and JsonNode?**

- **JSONPath** — a query language for JSON (like XPath for XML). RestAssured uses it via `.jsonPath().get("data.title")`. Good for quick inline assertions.
- **JsonNode** — Jackson's tree-model API. Good for navigating/modifying JSON programmatically in Java without a POJO.

---

**Q. How do you assert nested JSON fields in RestAssured?**

```java
given().when().get("/api/v1/Books/1")
    .then()
    .statusCode(200)
    .body("id", equalTo(1))
    .body("title", notNullValue())
    .body("pageCount", greaterThan(0));

// Nested (e.g. response has "author.firstName")
.body("author.firstName", equalTo("John"))

// Array element
.body("tags[0]", equalTo("fiction"))

// Array size
.body("tags.size()", equalTo(3))
```

---

**Q. How do you extract a single value from a response using JSONPath?**

```java
// Extract a string
String title = given().when().get("/api/v1/Books/1")
    .then().extract().path("title");

// Extract an int
int id = given().when().get("/api/v1/Activities/1")
    .then().extract().path("id");

// Extract a list of strings
List<String> titles = given().when().get("/api/v1/Books")
    .then().extract().path("title");   // JSONPath on array = list of all "title" values
```

---

**Q. How do you pass a JSON body as a String vs as a Map?**

```java
// As a raw String
String body = "{ \"id\": 0, \"title\": \"New Activity\", \"completed\": false }";
given().contentType(ContentType.JSON).body(body).when().post("/api/v1/Activities");

// As a Map (cleaner, no escaping)
Map<String, Object> body = new HashMap<>();
body.put("id", 0);
body.put("title", "New Activity");
body.put("completed", false);
given().contentType(ContentType.JSON).body(body).when().post("/api/v1/Activities");

// As a POJO (best for reuse)
Activity a = new Activity();
a.setTitle("New Activity");
given().contentType(ContentType.JSON).body(a).when().post("/api/v1/Activities");
```

---

**Q. What is the difference between `application/json` and `text/plain` content types?**

- `application/json` — tells the server the body is JSON and the client expects JSON back. Standard for REST APIs.
- `text/plain` — raw text, no structure implied. The FakeRESTApi uses `text/plain; v=1.0` in its Swagger — meaning it accepts/returns JSON but declares it as text (a quirk of that API). If RestAssured fails to auto-parse, add `.accept("text/plain")` to your request.

---

## Section 7 — File Handling in Java

---

**Q. Read a JSON file from the resources folder.**

```java
// Place your file at src/test/resources/testdata/activity.json

// Method 1: ObjectMapper (best for JSON)
ObjectMapper mapper = new ObjectMapper();
Activity activity = mapper.readValue(
    new File("src/test/resources/testdata/activity.json"),
    Activity.class
);

// Method 2: getResourceAsStream (works from JAR too)
InputStream is = getClass().getResourceAsStream("/testdata/activity.json");
Activity activity = mapper.readValue(is, Activity.class);
```

---

**Q. Read a plain text file line by line.**

```java
// Java 7+ NIO (preferred)
Path path = Paths.get("src/test/resources/data.txt");
List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);

// Java 8+ Stream (lazy, good for large files)
try (Stream<String> stream = Files.lines(path)) {
    stream.filter(line -> !line.isEmpty())
          .forEach(System.out::println);
}
```

---

**Q. Write content to a file.**

```java
// Write string to file (creates or overwrites)
Files.writeString(Paths.get("output.txt"), "Hello World", StandardCharsets.UTF_8);

// Append to existing file
Files.writeString(Paths.get("output.txt"), "\nNew line",
    StandardCharsets.UTF_8, StandardOpenOption.APPEND);

// Write list of lines
Files.write(Paths.get("output.txt"), Arrays.asList("line1", "line2"));
```

---

**Q. How do you load test data from a JSON file for data-driven tests?**

```java
// activities.json in resources:
// [ {"id":1,"title":"Task A","completed":false}, {"id":2,"title":"Task B","completed":true} ]

@DataProvider(name = "activityData")
public Object[][] loadActivities() throws Exception {
    ObjectMapper mapper = new ObjectMapper();
    List<Activity> activities = mapper.readValue(
        new File("src/test/resources/testdata/activities.json"),
        new TypeReference<List<Activity>>() {}
    );

    Object[][] data = new Object[activities.size()][1];
    for (int i = 0; i < activities.size(); i++) {
        data[i][0] = activities.get(i);
    }
    return data;
}

@Test(dataProvider = "activityData")
public void testActivityTitle(Activity activity) {
    assertThat(activity.getTitle()).isNotBlank();
}
```

---

## Section 8 — RestAssured Theory Q&A

---

**Q. What is RestAssured?**

RestAssured is a Java DSL (domain-specific language) for testing REST APIs. It wraps Apache HttpClient and provides a fluent BDD-style API (given/when/then) for sending HTTP requests and asserting responses without writing boilerplate HTTP code.

---

**Q. What Maven dependency do you add for RestAssured?**

```xml
<dependency>
    <groupId>io.rest-assured</groupId>
    <artifactId>rest-assured</artifactId>
    <version>5.4.0</version>
    <scope>test</scope>
</dependency>
<!-- For Jackson POJO support -->
<dependency>
    <groupId>io.rest-assured</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>5.4.0</version>
    <scope>test</scope>
</dependency>
```

---

**Q. How do you send query parameters?**

```java
given()
    .queryParam("page", 1)
    .queryParam("limit", 10)
    .when()
        .get("/api/v1/Activities")
    .then()
        .statusCode(200);
// Produces: /api/v1/Activities?page=1&limit=10
```

---

**Q. How do you send path parameters?**

```java
given()
    .pathParam("id", 5)
    .when()
        .get("/api/v1/Activities/{id}")
    .then()
        .statusCode(200);
// Produces: /api/v1/Activities/5
```

---

**Q. How do you add authentication to a request?**

```java
// Basic auth
given().auth().basic("username", "password")

// Bearer token
given().header("Authorization", "Bearer " + token)

// OAuth2
given().auth().oauth2(accessToken)
```

---

**Q. What is the difference between `.body()` in `given()` and `.body()` in `.then()`?**

- `given().body(...)` — the request body you're SENDING (POST/PUT payload)
- `.then().body(...)` — the assertion on the RESPONSE body using Hamcrest matchers

---

**Q. How do you log the full request and response for debugging?**

```java
given()
    .log().all()        // log everything sent
    .when()
        .get("/api/v1/Activities")
    .then()
    .log().all()        // log everything received
    .statusCode(200);

// Log only on failure:
given()
    .when().get("/api/v1/Activities")
    .then()
    .log().ifValidationFails()
    .statusCode(200);
```

---

**Q. How do you extract the full Response object for further processing?**

```java
Response response = given()
    .when()
        .get("/api/v1/Activities/1");

int statusCode        = response.getStatusCode();
String body           = response.getBody().asString();
String contentType    = response.getContentType();
long responseTime     = response.getTime();         // in ms
String specificHeader = response.getHeader("Content-Type");

// Then deserialise manually:
Activity activity = response.as(Activity.class);
```

---

**Q. How do you validate response time in RestAssured?**

```java
given()
    .when()
        .get("/api/v1/Activities")
    .then()
        .statusCode(200)
        .time(lessThan(2000L));   // must respond within 2 seconds
```

---

**Q. How do you chain multiple body assertions?**

```java
given()
    .when().get("/api/v1/Activities/1")
    .then()
        .statusCode(200)
        .body("id",        equalTo(1))
        .body("title",     not(emptyString()))
        .body("completed", instanceOf(Boolean.class));
```

---

**Q. What is `RequestSpecification` and `ResponseSpecification`?**

They let you define reusable request/response specs so you don't repeat setup in every test:

```java
// Reusable request spec
RequestSpecification reqSpec = new RequestSpecBuilder()
    .setBaseUri("https://fakerestapi.azurewebsites.net")
    .setContentType(ContentType.JSON)
    .build();

// Reusable response spec
ResponseSpecification resSpec = new ResponseSpecBuilder()
    .expectStatusCode(200)
    .expectContentType(ContentType.JSON)
    .build();

// Use them:
given().spec(reqSpec)
    .when().get("/api/v1/Activities")
    .then().spec(resSpec);
```

---

**Q. How do you test a POST endpoint end-to-end — create then verify?**

```java
// Step 1: POST to create
Activity newActivity = new Activity();
newActivity.setTitle("E2E Test Activity");
newActivity.setCompleted(false);

Activity created = given()
    .contentType(ContentType.JSON)
    .body(newActivity)
    .when()
        .post("/api/v1/Activities")
    .then()
        .statusCode(200)
        .extract()
        .as(Activity.class);

int createdId = created.getId();

// Step 2: GET to verify it exists
Activity fetched = given()
    .pathParam("id", createdId)
    .when()
        .get("/api/v1/Activities/{id}")
    .then()
        .statusCode(200)
        .extract()
        .as(Activity.class);

assertThat(fetched.getTitle()).isEqualTo("E2E Test Activity");

// Step 3: DELETE cleanup
given().pathParam("id", createdId)
    .when().delete("/api/v1/Activities/{id}")
    .then().statusCode(200);
```

---

**Q. How do you handle the FakeRESTApi returning `text/plain` content type?**

The FakeRESTApi declares `text/plain; v=1.0` in Swagger even though the body is JSON. If `.as(Activity.class)` throws a parse error, override the content type on the response:

```java
// Tell RestAssured to parse the response as JSON regardless of Content-Type header
given()
    .when()
        .get("/api/v1/Activities/1")
    .then()
        .statusCode(200)
        .extract()
        .response()
        .as(Activity.class, ObjectMapperDeserializationContext -> {
            return new ObjectMapper().readValue(
                ObjectMapperDeserializationContext.getDataToDeserialize().asString(),
                Activity.class
            );
        });

// Simpler workaround: extract as String, then use ObjectMapper
String body = given().when().get("/api/v1/Activities/1")
    .then().extract().asString();
Activity activity = new ObjectMapper().readValue(body, Activity.class);
```
