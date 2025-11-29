# Installation for Private Repositories


:::warning[Critical Step]
You **must** install the toolkit's dependencies before running any scripts. The toolkit requires several npm packages (gray-matter, yaml, handlebars) that need to be installed first.
:::

```bash
cd ai-toolkit-shared
bun install  # or: npm install
cd ..
```

This installs the required packages:
- `gray-matter` - YAML frontmatter parsing
- `yaml` - YAML processing
- `handlebars` - Template generation


How to install the toolkit when the repository is private.

## 🔒 Why This Guide?

The one-command installer (`curl | bash`) only works for **public** repositories. If your repository is private, you need authentication.

## 📋 Installation Methods

### Method 1: Git Clone with SSH (Recommended)

Use SSH keys for authentication:

```bash
# 1. Add toolkit as submodule (SSH)
git submodule add git@github.com:martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared

# 2. Install dependencies
cd ai-toolkit-shared
bun install
cd ..

# 3. Run setup
bun ai-toolkit-shared/scripts/init.js
```

**Prerequisites:**
- SSH key added to GitHub account
- See: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### Method 2: Git Clone with HTTPS + Token

Use a Personal Access Token:

```bash
# 1. Create token on GitHub
# Settings → Developer settings → Personal access tokens → Generate new token
# Scopes needed: repo (full control)

# 2. Add toolkit as submodule (HTTPS with token)
git submodule add https://YOUR_TOKEN@github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared

# 3. Install dependencies
cd ai-toolkit-shared
bun install
cd ..

# 4. Run setup
bun ai-toolkit-shared/scripts/init.js
```

**Security Note:** Don't commit the token! Use credential helper:
```bash
git config --global credential.helper store
```

### Method 3: Manual Clone

Clone the repository manually:

```bash
# 1. Clone toolkit
git clone git@github.com:martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared

# 2. Install dependencies
cd ai-toolkit-shared
bun install
cd ..

# 3. Run setup
bun ai-toolkit-shared/scripts/init.js
```

**Note:** This is not a submodule, so updates are manual.

## 🔓 Making Repository Public

If you want to use the one-command installer, make the repository public:

### On GitHub

1. Go to repository Settings
2. 📝 Scroll to "Danger Zone"
3. 📝 Click "Change visibility"
4. 📝 Select "Make public"
5. ✅ Confirm

### Benefits of Public Repository

- ✅ One-command install works
- ✅ No authentication needed
- ✅ Easier to share
- ✅ Community can contribute
- ✅ Better for open source

### Considerations

- ⚠️ Code is visible to everyone
- ⚠️ Issues/PRs are public
- ⚠️ Can't undo easily (history remains)

## 🔐 Keeping Repository Private

If the repository must stay private:

### For Team Members

**Option 1: SSH Keys**
```bash
# Each team member adds their SSH key to GitHub
# Then uses SSH URL for submodule
git submodule add git@github.com:org/repo.git ai-toolkit-shared
```

**Option 2: Deploy Keys**
```bash
# Create deploy key for CI/CD
# Settings → Deploy keys → Add deploy key
# Use in automated deployments
```

**Option 3: GitHub App**
```bash
# Create GitHub App for organization
# Use app credentials for access
```

### For CI/CD

Use GitHub Actions secrets:

```yaml
# .github/workflows/deploy.yml
- name: Checkout with submodules
  uses: actions/checkout@v3
  with:
    submodules: recursive
    token: ${{ secrets.GITHUB_TOKEN }}
```

## 📊 Comparison

| Method | Public Repo | Private Repo | Ease | Security |
|--------|-------------|--------------|------|----------|
| One-command install | ✅ | ❌ | ⭐⭐⭐ | ⭐⭐ |
| SSH submodule | ✅ | ✅ | ⭐⭐ | ⭐⭐⭐ |
| HTTPS + token | ✅ | ✅ | ⭐⭐ | ⭐⭐ |
| Manual clone | ✅ | ✅ | ⭐ | ⭐⭐⭐ |

## 🆘 Troubleshooting

### "Permission denied (publickey)"

**Problem:** SSH key not configured.

**Solution:**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub
# Settings → SSH and GPG keys → New SSH key
# Paste contents of ~/.ssh/id_ed25519.pub
```

### "Authentication failed"

**Problem:** Token expired or wrong permissions.

**Solution:**
```bash
# Create new token with 'repo' scope
# GitHub → Settings → Developer settings → Personal access tokens
```

### "Repository not found"

**Problem:** No access to private repository.

**Solution:**
- Check you're logged in to correct GitHub account
- Verify you have access to the repository
- Check repository name is correct

## 💡 Recommendations

### For Open Source Projects
→ **Make repository public** and use one-command install

### For Private Projects
→ **Use SSH submodules** for team members

### For Organizations
→ **Use GitHub App** or deploy keys for automation

## 📚 More Information

- **[GitHub SSH Keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)** - SSH setup
- **[Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)** - Token creation
- **[Git Submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)** - Submodule documentation

---

**Need help?** Open an issue or contact the maintainer.
