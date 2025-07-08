#!/bin/bash

# Task Manager Development Script with Hot Reload
# This script starts the application in development mode with hot reload

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to stop existing containers
stop_existing() {
    print_status "Stopping existing containers..."
    docker compose down 2>/dev/null || true
    docker compose -f docker-compose.dev.yml down 2>/dev/null || true
}

# Function to start development environment
start_dev() {
    print_status "Starting development environment with hot reload..."
    
    # Start development services
    docker compose -f docker-compose.dev.yml up --build -d
    
    print_success "Development environment started!"
    echo ""
    echo "🌐 Application URLs:"
    echo "  - Frontend (Hot Reload): http://localhost:5173"
    echo "  - Backend API: http://localhost:3001"
    echo "  - API Docs: http://localhost:3001/api/docs"
    echo "  - Grafana: http://localhost:3000"
    echo "  - Prometheus: http://localhost:9090"
    echo ""
    echo "📝 Development Features:"
    echo "  - ✅ Hot reload enabled for React frontend"
    echo "  - ✅ Hot reload enabled for Express backend"
    echo "  - ✅ Source code mounted for live editing"
    echo "  - ✅ Database persistence"
    echo ""
    print_warning "Make changes to your code and see them reflected immediately!"
}

# Function to show logs
show_logs() {
    print_status "Showing development logs..."
    docker compose -f docker-compose.dev.yml logs -f
}

# Function to stop development environment
stop_dev() {
    print_status "Stopping development environment..."
    docker compose -f docker-compose.dev.yml down
    print_success "Development environment stopped"
}

# Function to restart development environment
restart_dev() {
    print_status "Restarting development environment..."
    stop_dev
    start_dev
}

# Function to show help
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start development environment with hot reload"
    echo "  stop      Stop development environment"
    echo "  restart   Restart development environment"
    echo "  logs      Show development logs"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start    # Start development environment"
    echo "  $0 logs     # Show logs"
    echo "  $0 stop     # Stop development environment"
}

# Main execution
main() {
    case "${1:-start}" in
        start)
            check_docker
            stop_existing
            start_dev
            ;;
        stop)
            stop_dev
            ;;
        restart)
            check_docker
            restart_dev
            ;;
        logs)
            show_logs
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@" 