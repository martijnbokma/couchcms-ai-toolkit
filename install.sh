#!/bin/bash
#
# CouchCMS AI Toolkit - One-Command Installer
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/martijnbokma/couchcms-ai-toolkit/master/install.sh | bash
#
# Or download and run:
#   wget https://raw.githubusercontent.com/martijnbokma/couchcms-ai-toolkit/master/install.sh
#   chmod +x install.sh
#   ./install.sh

set -e

# Configuration
readonly REPO_URL="https://github.com/martijnbokma/couchcms-ai-toolkit.git"
readonly TOOLKIT_DIR="ai-toolkit-shared"

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly BOLD='\033[1m'
readonly NC='\033[0m'

# Runtime detection
HAS_BUN=false
HAS_NODE=false

# Print functions
print_header() {
    echo -e "\n${BOLD}============================================================${NC}"
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
    print_step "🔍 Checking prerequisites..."
    
    # Check git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed"
        print_info "Install from: https://git-scm.com/"
        exit 1
    fi
    print_success "Git installed"
    
    # Check bun or node
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
# Returns: 0 if newly installed, 1 if updated/skipped
install_toolkit() {
    print_step "📦 Installing CouchCMS AI Toolkit..."
    
    # Check if already installed
    if [ -d "$TOOLKIT_DIR" ]; then
        print_warning "$TOOLKIT_DIR already exists"
        read -p "   Update existing installation? [Y/n] " -n 1 -r
        echo
        
        if [[ $REPLY =~ ^[Nn]$ ]]; then
            print_info "Skipping update"
            return 1
        fi
        
        print_info "Updating toolkit..."
        (cd "$TOOLKIT_DIR" && git pull)
        print_success "Toolkit updated"
        return 1  # Return 1 for update (not newly installed)
    fi
    
    # Check if submodule exists but directory is missing
    if git config --file .gitmodules --get "submodule.$TOOLKIT_DIR.url" &> /dev/null; then
        print_warning "Submodule exists in .gitmodules but directory is missing"
        print_info "Cleaning up old submodule configuration..."
        git submodule deinit -f "$TOOLKIT_DIR" 2>/dev/null || true
        git rm -f "$TOOLKIT_DIR" 2>/dev/null || true
        rm -rf ".git/modules/$TOOLKIT_DIR" 2>/dev/null || true
        print_success "Cleaned up old submodule"
    fi
    
    # Add as submodule
    print_info "Adding submodule from $REPO_URL..."
    git submodule add "$REPO_URL" "$TOOLKIT_DIR"
    
    print_success "Toolkit installed"
    return 0  # Return 0 for new installation
}

# Install dependencies
install_dependencies() {
    print_step "📚 Installing dependencies..."
    
    # Make scripts executable
    print_info "Making scripts executable..."
    chmod +x "$TOOLKIT_DIR/scripts/"*.js 2>/dev/null || true
    
    # Install dependencies
    if [ "$HAS_BUN" = true ]; then
        print_info "Using Bun..."
        (cd "$TOOLKIT_DIR" && bun install)
    else
        print_info "Using npm..."
        (cd "$TOOLKIT_DIR" && npm install)
    fi
    
    print_success "Dependencies installed"
}

# Run setup
run_setup() {
    print_step "🚀 Running setup wizard..."
    print_info "(You can run this again later with: bun $TOOLKIT_DIR/scripts/init.js)\n"
    
    # Set auto mode for non-interactive installation
    export TOOLKIT_AUTO_MODE="true"
    
    if [ "$HAS_BUN" = true ]; then
        (cd "$TOOLKIT_DIR" && bun scripts/init.js)
    else
        (cd "$TOOLKIT_DIR" && node scripts/init.js)
    fi
}

# Display success message
display_success() {
    local runtime_cmd="bun"
    [ "$HAS_NODE" = true ] && runtime_cmd="node"
    
    echo -e "\n${GREEN}============================================================${NC}"
    echo -e "${GREEN}🎉 CouchCMS AI Toolkit installed successfully!${NC}"
    echo -e "${GREEN}============================================================${NC}"
    
    echo -e "\n${BLUE}📚 Next steps:${NC}"
    print_info "1. Your AI configs are ready in .cursorrules, .claude/, etc."
    print_info "2. Start coding - your AI assistant knows CouchCMS!"
    print_info "3. Update config: edit .project/standards.md"
    print_info "4. Re-sync: $runtime_cmd $TOOLKIT_DIR/scripts/sync.js"
    
    echo -e "\n${BLUE}💡 Useful commands:${NC}"
    print_info "$runtime_cmd $TOOLKIT_DIR/scripts/health.js      # Check installation"
    print_info "$runtime_cmd $TOOLKIT_DIR/scripts/sync.js --watch # Auto-sync on changes"
    print_info "$runtime_cmd $TOOLKIT_DIR/scripts/browse.js      # Browse modules"
    
    echo -e "\n${BLUE}📖 Documentation:${NC}"
    print_info "https://github.com/martijnbokma/couchcms-ai-toolkit#readme"
    
    echo -e "\n${GREEN}✨ Happy coding!${NC}\n"
}

# Error handler
handle_error() {
    local runtime_cmd="bun"
    command -v node &> /dev/null && runtime_cmd="node"
    
    echo -e "\n${RED}❌ Installation failed${NC}"
    echo -e "${YELLOW}💡 Try manual installation:${NC}"
    print_info "git submodule add $REPO_URL $TOOLKIT_DIR"
    print_info "cd $TOOLKIT_DIR && $runtime_cmd install && cd .."
    print_info "$runtime_cmd $TOOLKIT_DIR/scripts/init.js"
    exit 1
}

# Main installation flow
main() {
    print_header
    
    # Check prerequisites
    check_prerequisites
    
    # Install toolkit (returns 0 if newly installed, 1 if updated)
    if install_toolkit; then
        local newly_installed=true
    else
        local newly_installed=false
    fi
    
    # Install dependencies
    install_dependencies
    
    # Run setup wizard (only for new installations)
    if [ "$newly_installed" = true ]; then
        run_setup
    else
        print_info "\n💡 Skipping setup wizard (already configured)"
        print_info "To reconfigure, run: bun $TOOLKIT_DIR/scripts/init.js\n"
    fi
    
    # Success message
    display_success
}

# Set error trap
trap handle_error ERR

# Run installer
main
