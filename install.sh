#!/bin/bash
#
# CouchCMS AI Toolkit - One-Command Installer (Bash)
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/martijnbokma/couchcms-ai-toolkit/master/install.sh | bash
#
# Or download and run:
#   wget https://raw.githubusercontent.com/martijnbokma/couchcms-ai-toolkit/master/install.sh
#   chmod +x install.sh
#   ./install.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

REPO_URL="https://github.com/martijnbokma/couchcms-ai-toolkit.git"
TOOLKIT_DIR="ai-toolkit-shared"

# Print functions
print_header() {
    echo -e "${BOLD}============================================================${NC}"
    echo -e "${BOLD}🚀 CouchCMS AI Toolkit - One-Command Installer${NC}"
    echo -e "${BOLD}============================================================${NC}\n"
}

print_step() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}  ✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "   $1"
}

# Check prerequisites
check_prerequisites() {
    print_step "\n🔍 Checking prerequisites..."
    
    # Check git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed"
        print_info "Install from: https://git-scm.com/"
        exit 1
    fi
    print_success "Git installed"
    
    # Check bun or node
    HAS_BUN=false
    HAS_NODE=false
    
    if command -v bun &> /dev/null; then
        HAS_BUN=true
        print_success "Bun installed"
    elif command -v node &> /dev/null; then
        HAS_NODE=true
        print_success "Node.js installed"
    else
        print_error "Neither Bun nor Node.js is installed"
        print_info "Install Bun: curl -fsSL https://bun.sh/install | bash"
        print_info "Or Node.js: https://nodejs.org/"
        exit 1
    fi
    
    # Check if in git repo
    if ! git rev-parse --git-dir &> /dev/null; then
        print_error "Not in a git repository"
        print_info "Run: git init"
        exit 1
    fi
    print_success "Git repository detected"
}

# Install toolkit
install_toolkit() {
    print_step "\n📦 Installing CouchCMS AI Toolkit..."
    
    # Check if already installed
    if [ -d "$TOOLKIT_DIR" ]; then
        print_warning "$TOOLKIT_DIR already exists"
        read -p "   Update existing installation? [Y/n] " -n 1 -r
        echo
        
        if [[ $REPLY =~ ^[Nn]$ ]]; then
            print_info "Skipping installation"
            return 1
        fi
        
        print_info "Updating toolkit..."
        cd "$TOOLKIT_DIR"
        git pull
        cd ..
        print_success "Toolkit updated"
        return 0
    fi
    
    # Add as submodule
    print_info "Adding submodule from $REPO_URL..."
    git submodule add "$REPO_URL" "$TOOLKIT_DIR"
    
    print_success "Toolkit installed"
    return 0
}

# Install dependencies
install_dependencies() {
    print_step "\n📚 Installing dependencies..."
    
    cd "$TOOLKIT_DIR"
    
    if [ "$HAS_BUN" = true ]; then
        print_info "Using Bun..."
        bun install
    else
        print_info "Using npm..."
        npm install
    fi
    
    cd ..
    print_success "Dependencies installed"
}

# Run setup
run_setup() {
    print_step "\n🚀 Running setup wizard..."
    print_warning "(You can run this again later with: bun ai-toolkit-shared/scripts/init.js)\n"
    
    cd "$TOOLKIT_DIR"
    
    if [ "$HAS_BUN" = true ]; then
        bun scripts/init.js
    else
        node scripts/init.js
    fi
    
    cd ..
}

# Display success message
display_success() {
    echo -e "\n${GREEN}============================================================${NC}"
    echo -e "${GREEN}🎉 CouchCMS AI Toolkit installed successfully!${NC}"
    echo -e "${GREEN}============================================================${NC}"
    
    echo -e "\n${BLUE}📚 Next steps:${NC}"
    print_info "1. Your AI configs are ready in .cursorrules, .claude/, etc."
    print_info "2. Start coding - your AI assistant knows CouchCMS!"
    print_info "3. Update config: edit .project/standards.md or config.yaml"
    print_info "4. Re-sync: bun ai-toolkit-shared/scripts/sync.js"
    
    echo -e "\n${BLUE}💡 Useful commands:${NC}"
    print_info "bun ai-toolkit-shared/scripts/health.js      # Check installation"
    print_info "bun ai-toolkit-shared/scripts/sync.js --watch # Auto-sync on changes"
    print_info "bun ai-toolkit-shared/scripts/browse.js      # Browse modules"
    
    echo -e "\n${BLUE}📖 Documentation:${NC}"
    print_info "https://github.com/martijnbokma/couchcms-ai-toolkit#readme"
    
    echo -e "\n${GREEN}✨ Happy coding!${NC}\n"
}

# Main installation flow
main() {
    print_header
    
    # Step 1: Check prerequisites
    check_prerequisites
    
    # Step 2: Install toolkit
    if install_toolkit; then
        NEWLY_INSTALLED=true
    else
        NEWLY_INSTALLED=false
    fi
    
    # Step 3: Install dependencies
    install_dependencies
    
    # Step 4: Run setup (only if newly installed)
    if [ "$NEWLY_INSTALLED" = true ]; then
        run_setup
    fi
    
    # Step 5: Success message
    display_success
}

# Error handler
trap 'echo -e "\n${RED}❌ Installation failed${NC}"; echo -e "${YELLOW}💡 Try manual installation:${NC}"; echo "   git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared"; echo "   cd ai-toolkit-shared && bun install && cd .."; echo "   bun ai-toolkit-shared/scripts/init.js"; exit 1' ERR

# Run main
main
