# 1️⃣ Use official Java 21 image
FROM eclipse-temurin:21-jdk-alpine

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Copy the built JAR into the container
# Make sure the JAR name matches your Maven build output
COPY target/*.jar app.jar

# 4️⃣ Expose the port your Spring Boot app runs on
EXPOSE 80

# 5️⃣ Run the Spring Boot JAR
ENTRYPOINT ["java","-jar","app.jar"]
