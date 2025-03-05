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

# Ask for the release type
echo "Select release type:"
echo "1) Stable"
echo "2) Beta"
echo "3) Canary"
read -p "Enter choice (1-3): " release_type

# Ask for the new version
read -p "Enter new version (current is $current_version): " new_version

if [ -z "$new_version" ]; then
    print_message "❌ Version cannot be empty" "$RED"
    exit 1
fi

# Modify version based on release type
case $release_type in
    2)
        new_version="${new_version}-beta.0"
        npm_tag="beta"
        ;;
    3)
        new_version="${new_version}-canary.$(date +%Y%m%d%H%M)"
        npm_tag="canary"
        ;;
    *)
        npm_tag="latest"
        ;;
esac

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

# Publish to npm with appropriate tag
print_message "📦 Publishing to npm with tag: $npm_tag..." "$YELLOW"
npm publish --tag $npm_tag

if [ $? -eq 0 ]; then
    print_message "✅ Successfully published version $new_version with tag: $npm_tag" "$GREEN"
else
    print_message "❌ Failed to publish to npm" "$RED"
    exit 1
fi