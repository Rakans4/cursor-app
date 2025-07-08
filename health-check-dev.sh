#!/bin/bash

# Task Manager Development Health Check Script
# This script checks the health of all services in the development environment

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

# Function to check container status
check_container() {
    local container_name=$1
    local service_name=$2
    
    if docker ps --format "table {{.Names}}" | grep -q "^${container_name}$"; then
        local status=$(docker inspect --format='{{.State.Status}}' $container_name)
        if [ "$status" = "running" ]; then
            print_success "$service_name is running"
            return 0
        else
            print_error "$service_name is not running (status: $status)"
            return 1
        fi
    else
        print_error "$service_name container not found"
        return 1
    fi
}

# Function to check HTTP endpoint
check_http_endpoint() {
    local url=$1
    local service_name=$2
    
    if curl -s -f "$url" > /dev/null 2>&1; then
        print_success "$service_name is responding at $url"
        return 0
    else
        print_error "$service_name is not responding at $url"
        return 1
    fi
}

# Function to check database connection
check_database() {
    if docker exec task-manager-postgres-dev pg_isready -U postgres -d task_manager > /dev/null 2>&1; then
        print_success "PostgreSQL database is ready"
        return 0
    else
        print_error "PostgreSQL database is not ready"
        return 1
    fi
}

# Function to check hot reload functionality
check_hot_reload() {
    print_status "Checking hot reload functionality..."
    
    # Check if Vite dev server is running
    if curl -s "http://localhost:5173" | grep -q "Vite" 2>/dev/null; then
        print_success "Vite dev server is running (hot reload ready)"
        return 0
    else
        print_warning "Vite dev server may not be fully ready yet"
        return 1
    fi
}

# Main health check function
main() {
    echo "=========================================="
    echo "    Task Manager Development Health Check"
    echo "=========================================="
    echo ""
    
    # Check Docker
    check_docker
    print_status "Docker is running"
    
    # Check containers
    print_status "Checking container status..."
    local container_errors=0
    
    check_container "task-manager-postgres-dev" "PostgreSQL" || container_errors=$((container_errors + 1))
    check_container "task-manager-server-dev" "API Server" || container_errors=$((container_errors + 1))
    check_container "task-manager-client-dev" "React Client" || container_errors=$((container_errors + 1))
    check_container "cursor-app-prometheus-1" "Prometheus" || container_errors=$((container_errors + 1))
    check_container "cursor-app-grafana-1" "Grafana" || container_errors=$((container_errors + 1))
    
    # Check HTTP endpoints
    print_status "Checking HTTP endpoints..."
    local http_errors=0
    
    check_http_endpoint "http://localhost:5173" "React Client (Dev)" || http_errors=$((http_errors + 1))
    check_http_endpoint "http://localhost:3001/api/health" "API Server" || http_errors=$((http_errors + 1))
    check_http_endpoint "http://localhost:9090/-/healthy" "Prometheus" || http_errors=$((http_errors + 1))
    check_http_endpoint "http://localhost:3000/api/health" "Grafana" || http_errors=$((http_errors + 1))
    
    # Check database
    print_status "Checking database..."
    local db_errors=0
    check_database || db_errors=$((db_errors + 1))
    
    # Check hot reload
    local hot_reload_errors=0
    check_hot_reload || hot_reload_errors=$((hot_reload_errors + 1))
    
    # Summary
    echo ""
    echo "=========================================="
    echo "    Development Health Check Summary"
    echo "=========================================="
    
    local total_errors=$((container_errors + http_errors + db_errors + hot_reload_errors))
    
    if [ $total_errors -eq 0 ]; then
        print_success "All development services are healthy! 🎉"
        echo ""
        echo "🌐 Development URLs:"
        echo "  - Frontend (Hot Reload): http://localhost:5173"
        echo "  - API: http://localhost:3001"
        echo "  - API Docs: http://localhost:3001/api/docs"
        echo "  - Grafana: http://localhost:3000"
        echo "  - Prometheus: http://localhost:9090"
        echo ""
        print_warning "💡 Make changes to your code and see them reflected immediately!"
    else
        print_error "Found $total_errors issue(s):"
        [ $container_errors -gt 0 ] && echo "  - $container_errors container issue(s)"
        [ $http_errors -gt 0 ] && echo "  - $http_errors HTTP endpoint issue(s)"
        [ $db_errors -gt 0 ] && echo "  - $db_errors database issue(s)"
        [ $hot_reload_errors -gt 0 ] && echo "  - $hot_reload_errors hot reload issue(s)"
        echo ""
        print_warning "Check the logs with: ./dev.sh logs"
    fi
    
    exit $total_errors
}

# Run main function
main "$@" 