#!/bin/bash

# Colors for console output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    echo -e "${2}${1}${NC}"
}

# Check if the working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    print_message "❌ Working directory is not clean. Please commit or stash your changes first." "$RED"
    exit 1
fi

# Get the current version from package.json
current_version=$(node -p "require('./package.json').version")
print_message "Current version: $current_version" "$YELLOW"

# Ask for the new version
read -p "Enter new version (current is $current_version): " new_version

if [ -z "$new_version" ]; then
    print_message "❌ Version cannot be empty" "$RED"
    exit 1
fi

# Update version in package.json
npm version $new_version --no-git-tag-version

# Run tests
print_message "🧪 Running tests..." "$YELLOW"
bun test
if [ $? -ne 0 ]; then
    print_message "❌ Tests failed" "$RED"
    exit 1
fi

# Build the project
print_message "🏗️ Building project..." "$YELLOW"
bun run build
if [ $? -ne 0 ]; then
    print_message "❌ Build failed" "$RED"
    exit 1
fi

# Create git tag
git add package.json
git commit -m "chore: release v$new_version"
git tag -a "v$new_version" -m "Release v$new_version"

# Push to repository
print_message "🚀 Pushing to repository..." "$YELLOW"
git push && git push --tags

# Publish to npm
print_message "📦 Publishing to npm..." "$YELLOW"
npm publish

if [ $? -eq 0 ]; then
    print_message "✅ Successfully published version $new_version" "$GREEN"
else
    print_message "❌ Failed to publish to npm" "$RED"
    exit 1
fi 