#!/bin/bash

# Simple deploy script
REMOTE_HOST="itmo"
JAR_FILE="build/libs/ticket-management-system-0.0.1-SNAPSHOT.jar"
REMOTE_DIR="~/is-build"
FRONETND_BUILD_PREFIX="VITE_API_BASE_URL=/api"

# Build frontend first
echo "Building frontend..."
cd frontend
env $FRONETND_BUILD_PREFIX npm run build

# Check if frontend build was successful
if [ $? -ne 0 ]; then
    echo "Frontend build failed! Deployment aborted."
    exit 1
fi

# Copy frontend build to backend static resources
echo "Copying frontend to backend resources..."
cd ..
rm -rf src/main/resources/static
mkdir -p src/main/resources/static
cp -r frontend/dist/* src/main/resources/static/

echo "Frontend files copied:"
ls -la src/main/resources/static/

# Build the project
echo "Building project..."
./gradlew build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "Build failed! Deployment aborted."
    exit 1
fi

# Check if JAR file was created
if [ ! -f "$JAR_FILE" ]; then
    echo "JAR file not found: $JAR_FILE"
    exit 1
fi

echo "Build successful: $(ls -lh "$JAR_FILE")"

# Create directory and copy file
ssh "$REMOTE_HOST" "mkdir -p $REMOTE_DIR"
scp "$JAR_FILE" "$REMOTE_HOST:$REMOTE_DIR/"

echo "Deployment completed: $REMOTE_HOST:$REMOTE_DIR/"