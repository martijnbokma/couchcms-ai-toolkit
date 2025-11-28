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

# Clean up any leftover git submodule artifacts
cleanup_submodule() {
    print_info "Cleaning up old submodule artifacts..."
    
    # Remove from .gitmodules
    if [ -f .gitmodules ]; then
        git config --file .gitmodules --remove-section "submodule.$TOOLKIT_DIR" 2>/dev/null || true
    fi
    
    # Remove from .git/config
    git config --remove-section "submodule.$TOOLKIT_DIR" 2>/dev/null || true
    
    # Remove from git index
    git rm --cached "$TOOLKIT_DIR" 2>/dev/null || true
    
    # Remove git modules directory
    rm -rf ".git/modules/$TOOLKIT_DIR" 2>/dev/null || true
    
    # Remove actual directory if empty or corrupted
    if [ -d "$TOOLKIT_DIR" ] && [ ! -d "$TOOLKIT_DIR/.git" ]; then
        rm -rf "$TOOLKIT_DIR" 2>/dev/null || true
    fi
    
    print_success "Cleanup complete"
}

# Install toolkit
# Returns: 0 if newly installed, 1 if updated/skipped
install_toolkit() {
    print_step "📦 Installing CouchCMS AI Toolkit..."
    
    # Check if directory exists and is a valid git repo
    if [ -d "$TOOLKIT_DIR" ] && [ -d "$TOOLKIT_DIR/.git" ]; then
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
    
    # Clean up any leftover artifacts from previous installations
    if [ -d ".git/modules/$TOOLKIT_DIR" ] || git config --file .gitmodules --get "submodule.$TOOLKIT_DIR.url" &> /dev/null; then
        print_warning "Found leftover submodule artifacts"
        cleanup_submodule
    fi
    
    # Add as submodule
    print_info "Adding submodule from $REPO_URL..."
    if ! git submodule add "$REPO_URL" "$TOOLKIT_DIR" 2>&1; then
        print_error "Failed to add submodule"
        print_info "Attempting cleanup and retry..."
        cleanup_submodule
        git submodule add "$REPO_URL" "$TOOLKIT_DIR"
    fi
    
    # Verify installation
    if [ ! -d "$TOOLKIT_DIR" ]; then
        print_error "Submodule directory not created"
        exit 1
    fi
    
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



# Display success message
display_success() {
    local runtime_cmd="bun"
    [ "$HAS_NODE" = true ] && runtime_cmd="node"
    
    echo -e "\n${GREEN}============================================================${NC}"
    echo -e "${GREEN}🎉 CouchCMS AI Toolkit installed successfully!${NC}"
    echo -e "${GREEN}============================================================${NC}"
    
    echo -e "\n${BLUE}📚 Next step - Run setup wizard:${NC}"
    echo -e "\n${BOLD}    $runtime_cmd $TOOLKIT_DIR/scripts/init.js${NC}\n"
    
    echo -e "${BLUE}💡 Useful commands (after setup):${NC}"
    print_info "$runtime_cmd $TOOLKIT_DIR/scripts/health.js      # Check installation"
    print_info "$runtime_cmd $TOOLKIT_DIR/scripts/sync.js        # Re-sync configs"
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
    
    # Install toolkit
    install_toolkit
    
    # Install dependencies
    install_dependencies
    
    # Success message
    display_success
}

# Set error trap
trap handle_error ERR

# Run installer
main
