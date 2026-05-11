.PHONY: help setup dev build install lint preview

# ========== LOCAL DEV CONFIG ==========
FE_PORT=5173

# ========== HELP ==========
help:
	@echo "========================================"
	@echo "  TITIP.IN FRONTEND"
	@echo "========================================"
	@echo ""
	@echo "SETUP (jalankan sekali setelah clone):"
	@echo "  make setup     - Copy .env dan install dependencies"
	@echo ""
	@echo "DEVELOPMENT:"
	@echo "  make dev       - Jalankan dev server (port $(FE_PORT))"
	@echo ""
	@echo "BUILD:"
	@echo "  make build     - Build untuk production"
	@echo "  make preview   - Preview hasil build"
	@echo ""
	@echo "LAINNYA:"
	@echo "  make install   - Install npm dependencies"
	@echo "  make lint      - Lint dengan ESLint"
	@echo "========================================"

# ========== SETUP ==========
setup:
	@echo "========================================"
	@echo "  SETUP TITIP.IN FRONTEND"
	@echo "========================================"
	@echo ""
	@if [ ! -f .env ]; then \
		echo "✓ Creating .env"; \
		cp .env.example .env; \
	else \
		echo "⊙ .env already exists"; \
	fi
	@echo ""
	@make install
	@echo ""
	@echo "========================================"
	@echo "  SETUP COMPLETE!"
	@echo "========================================"
	@echo ""
	@echo "Next steps:"
	@echo "  1. Sesuaikan VITE_API_URL di .env"
	@echo "  2. make dev"
	@echo "========================================"

# ========== INSTALL ==========
install:
	@echo "Installing dependencies..."
	@if [ ! -d node_modules ]; then \
		npm install; \
	else \
		echo "⊙ node_modules already exists, skipping"; \
	fi

# ========== DEVELOPMENT ==========
dev:
	@echo "========================================"
	@echo "  Titip.in Frontend"
	@echo "  http://localhost:$(FE_PORT)"
	@echo "========================================"
	@if [ ! -d node_modules ]; then npm install; fi
	@npm run dev

# ========== BUILD ==========
build:
	@if [ ! -d node_modules ]; then npm install; fi
	@npm run build
	@echo ""
	@echo "========================================"
	@echo "  BUILD COMPLETE — output: dist/"
	@echo "========================================"

preview:
	@echo "Previewing production build..."
	@npm run preview

# ========== LINTING ==========
lint:
	@echo "Linting..."
	@npm run lint