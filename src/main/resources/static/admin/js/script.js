// Global variables
let currentUser = null;
let categories = [];
let products = [];
let colourVariants = [];
let orders = [];
let currentPage = {
    categories: 1,
    products: 1,
    orders: 1
};
const itemsPerPage = 10;
let pendingAction = null;
let pendingActionData = null;

// Initialize the admin panel
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAccess();
    loadDashboardData();
    loadCategories();
    loadProducts();
    loadOrders();
    setupEventListeners();
});

// Check if user is admin and has access
function checkAdminAccess() {
    const userData = localStorage.getItem('izzy-user');
    if (!userData) {
        window.location.href = '/login'; // Redirect to login if not authenticated
        return;
    }

    currentUser = JSON.parse(userData);
    const isAdmin = currentUser.roles.some(role => role === 'ROLE_ADMIN');

    if (!isAdmin) {
        window.location.href = '/'; // Redirect to home if not admin
        return;
    }

    // Display admin name
    document.getElementById('adminName').textContent = currentUser.fullName;
    document.getElementById('mobileAdminName').textContent = currentUser.fullName;
}

// Setup event listeners
function setupEventListeners() {
    // Pagination
    document.getElementById('prevCategoryPage').addEventListener('click', () => {
        if (currentPage.categories > 1) {
            currentPage.categories--;
            loadCategories();
        }
    });
    document.getElementById('nextCategoryPage').addEventListener('click', () => {
        currentPage.categories++;
        loadCategories();
    });

    document.getElementById('prevProductPage').addEventListener('click', () => {
        if (currentPage.products > 1) {
            currentPage.products--;
            loadProducts();
        }
    });
    document.getElementById('nextProductPage').addEventListener('click', () => {
        currentPage.products++;
        loadProducts();
    });

    document.getElementById('prevOrderPage').addEventListener('click', () => {
        if (currentPage.orders > 1) {
            currentPage.orders--;
            loadOrders();
        }
    });
    document.getElementById('nextOrderPage').addEventListener('click', () => {
        currentPage.orders++;
        loadOrders();
    });

    // Search and filters
    document.getElementById('categorySearch').addEventListener('input', debounce(loadCategories, 300));
    document.getElementById('productSearch').addEventListener('input', debounce(loadProducts, 300));
    document.getElementById('productStatusFilter').addEventListener('change', loadProducts);
    document.getElementById('productCategoryFilter').addEventListener('change', loadProducts);
    document.getElementById('orderSearch').addEventListener('input', debounce(loadOrders, 300));
    document.getElementById('orderStatusFilter').addEventListener('change', loadOrders);
    document.getElementById('orderDateFilter').addEventListener('change', loadOrders);
    document.getElementById('productDetailsFilter').addEventListener('change', loadProductDetails);
}

// Debounce function for search inputs
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Navigation functions
function showDashboard() {
    document.getElementById('pageTitle').textContent = 'Dashboard';
    document.getElementById('dashboardContent').style.display = 'block';
    document.getElementById('categoriesContent').style.display = 'none';
    document.getElementById('productsContent').style.display = 'none';
    document.getElementById('productDetailsContent').style.display = 'none';
    document.getElementById('ordersContent').style.display = 'none';
    loadDashboardData();
}

function showCategories() {
    document.getElementById('pageTitle').textContent = 'Categories';
    document.getElementById('dashboardContent').style.display = 'none';
    document.getElementById('categoriesContent').style.display = 'block';
    document.getElementById('productsContent').style.display = 'none';
    document.getElementById('productDetailsContent').style.display = 'none';
    document.getElementById('ordersContent').style.display = 'none';
    loadCategories();
}

function showProducts() {
    document.getElementById('pageTitle').textContent = 'Products';
    document.getElementById('dashboardContent').style.display = 'none';
    document.getElementById('categoriesContent').style.display = 'none';
    document.getElementById('productsContent').style.display = 'block';
    document.getElementById('productDetailsContent').style.display = 'none';
    document.getElementById('ordersContent').style.display = 'none';
    loadProducts();
}

function showProductDetails() {
    document.getElementById('pageTitle').textContent = 'Product Details';
    document.getElementById('dashboardContent').style.display = 'none';
    document.getElementById('categoriesContent').style.display = 'none';
    document.getElementById('productsContent').style.display = 'none';
    document.getElementById('productDetailsContent').style.display = 'block';
    document.getElementById('ordersContent').style.display = 'none';
    loadProductDetails();
}

function showOrders() {
    document.getElementById('pageTitle').textContent = 'Orders';
    document.getElementById('dashboardContent').style.display = 'none';
    document.getElementById('categoriesContent').style.display = 'none';
    document.getElementById('productsContent').style.display = 'none';
    document.getElementById('productDetailsContent').style.display = 'none';
    document.getElementById('ordersContent').style.display = 'block';
    loadOrders();
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('mobile-sidebar');
    sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
}

function logout() {
    localStorage.removeItem('izzy-user');
    window.location.href = '/login';
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function showConfirmationModal(title, message, action, data = null) {
    document.getElementById('confirmationModalTitle').textContent = title;
    document.getElementById('confirmationModalMessage').textContent = message;
    pendingAction = action;
    pendingActionData = data;
    openModal('confirmationModal');
}

function confirmAction() {
    if (pendingAction && typeof pendingAction === 'function') {
        pendingAction(pendingActionData);
    }
    closeModal('confirmationModal');
    pendingAction = null;
    pendingActionData = null;
}

// Dashboard functions
function loadDashboardData() {
    // In a real app, you would fetch this data from your API
    // For demo purposes, we'll use mock data

    // Mock dashboard stats
    document.getElementById('totalProducts').textContent = '142';
    document.getElementById('activeCategories').textContent = '24';
    document.getElementById('todaysOrders').textContent = '18';
    document.getElementById('totalRevenue').textContent = '$3,845';

    // Mock recent orders
    const recentOrders = [
        { id: '#ORD-001', customer: 'John Doe', status: 'Processing', amount: '$125.99' },
        { id: '#ORD-002', customer: 'Jane Smith', status: 'Shipped', amount: '$89.50' },
        { id: '#ORD-003', customer: 'Robert Johnson', status: 'Delivered', amount: '$234.75' },
        { id: '#ORD-004', customer: 'Emily Davis', status: 'Pending', amount: '$56.20' },
        { id: '#ORD-005', customer: 'Michael Wilson', status: 'Processing', amount: '$178.30' }
    ];

    const recentOrdersTable = document.getElementById('recentOrders');
    recentOrdersTable.innerHTML = '';
    recentOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${order.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.customer}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}">
                    ${order.status}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.amount}</td>
        `;
        recentOrdersTable.appendChild(row);
    });

    // Mock top products
    const topProducts = [
        { name: 'Classic White T-Shirt', sales: '142', revenue: '$1,845' },
        { name: 'Slim Fit Jeans', sales: '98', revenue: '$2,345' },
        { name: 'Leather Jacket', sales: '56', revenue: '$4,230' },
        { name: 'Running Shoes', sales: '87', revenue: '$3,120' },
        { name: 'Baseball Cap', sales: '124', revenue: '$745' }
    ];

    const topProductsContainer = document.getElementById('topProducts');
    topProductsContainer.innerHTML = '';
    topProducts.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-md';
        productDiv.innerHTML = `
            <div class="flex items-center">
                <span class="text-sm font-medium text-gray-500 mr-2">${index + 1}.</span>
                <div>
                    <p class="text-sm font-medium">${product.name}</p>
                    <p class="text-xs text-gray-500">${product.sales} sales</p>
                </div>
            </div>
            <span class="text-sm font-medium">${product.revenue}</span>
        `;
        topProductsContainer.appendChild(productDiv);
    });
}

function getStatusClass(status) {
    switch(status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Processing': return 'bg-blue-100 text-blue-800';
        case 'Shipped': return 'bg-indigo-100 text-indigo-800';
        case 'Delivered': return 'bg-green-100 text-green-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

// Category functions
function loadCategories() {
    const searchTerm = document.getElementById('categorySearch').value.toLowerCase();

    // In a real app, you would fetch categories from your API
    // For demo purposes, we'll use mock data
    const mockCategories = [
        { id: '1', name: 'Men\'s Clothing', parentName: null, isActive: true, createdAt: '2023-05-15T10:30:00', childrenNames: ['T-Shirts', 'Jeans', 'Jackets'] },
        { id: '2', name: 'Women\'s Clothing', parentName: null, isActive: true, createdAt: '2023-05-15T10:30:00', childrenNames: ['Dresses', 'Skirts', 'Blouses'] },
        { id: '3', name: 'T-Shirts', parentName: 'Men\'s Clothing', isActive: true, createdAt: '2023-05-16T09:15:00', childrenNames: [] },
        { id: '4', name: 'Jeans', parentName: 'Men\'s Clothing', isActive: true, createdAt: '2023-05-16T09:15:00', childrenNames: [] },
        { id: '5', name: 'Jackets', parentName: 'Men\'s Clothing', isActive: false, createdAt: '2023-05-16T09:15:00', childrenNames: [] },
        { id: '6', name: 'Dresses', parentName: 'Women\'s Clothing', isActive: true, createdAt: '2023-05-17T11:20:00', childrenNames: [] },
        { id: '7', name: 'Skirts', parentName: 'Women\'s Clothing', isActive: true, createdAt: '2023-05-17T11:20:00', childrenNames: [] },
        { id: '8', name: 'Blouses', parentName: 'Women\'s Clothing', isActive: true, createdAt: '2023-05-17T11:20:00', childrenNames: [] },
        { id: '9', name: 'Accessories', parentName: null, isActive: true, createdAt: '2023-05-18T14:45:00', childrenNames: ['Hats', 'Belts', 'Watches'] },
        { id: '10', name: 'Hats', parentName: 'Accessories', isActive: true, createdAt: '2023-05-19T16:30:00', childrenNames: [] },
        { id: '11', name: 'Belts', parentName: 'Accessories', isActive: true, createdAt: '2023-05-19T16:30:00', childrenNames: [] },
        { id: '12', name: 'Watches', parentName: 'Accessories', isActive: false, createdAt: '2023-05-19T16:30:00', childrenNames: [] }
    ];

    // Filter categories based on search term
    let filteredCategories = mockCategories.filter(category =>
        category.name.toLowerCase().includes(searchTerm) ||
        (category.parentName && category.parentName.toLowerCase().includes(searchTerm))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

    // Pagination
    const startIndex = (currentPage.categories - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

    // Update table
    const tableBody = document.getElementById('categoriesTableBody');
    tableBody.innerHTML = '';

    paginatedCategories.forEach(category => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="text-sm font-medium text-gray-900">${category.name}</div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">${category.parentName || '-'}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                    ${category.isActive ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${formatDate(category.createdAt)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onclick="viewCategory('${category.id}')" class="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                <button onclick="editCategory('${category.id}')" class="text-yellow-600 hover:text-yellow-900 mr-3">Edit</button>
                <button onclick="toggleCategoryStatus('${category.id}', ${category.isActive})" class="${category.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}">
                    ${category.isActive ? 'Disable' : 'Enable'}
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Update pagination info
    document.getElementById('categoryPaginationInfo').textContent = `Showing ${startIndex + 1} to ${Math.min(endIndex, filteredCategories.length)} of ${filteredCategories.length} categories`;
    document.getElementById('prevCategoryPage').disabled = currentPage.categories === 1;
    document.getElementById('nextCategoryPage').disabled = endIndex >= filteredCategories.length;

    // Update parent category dropdown in modal
    updateParentCategoryDropdown();
    // Update product category filter dropdown
    updateProductCategoryFilterDropdown();
    // Update product details filter dropdown
    updateProductDetailsFilterDropdown();
}

function updateParentCategoryDropdown() {
    const dropdown = document.getElementById('parentCategory');
    dropdown.innerHTML = '<option value="">None</option>';

    // Get only parent categories (those with no parent)
    const parentCategories = categories.filter(cat => !cat.parentName);

    parentCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        dropdown.appendChild(option);
    });
}

function showCreateCategoryModal() {
    document.getElementById('categoryModalTitle').textContent = 'Add New Category';
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryName').value = '';
    document.getElementById('parentCategory').value = '';
    document.getElementById('categoryImageName').textContent = 'No image selected';
    document.getElementById('categoryImagePreview').classList.add('hidden');
    document.getElementById('existingCategoryImage').classList.add('hidden');
    document.getElementById('categoryImage').value = '';
    openModal('categoryModal');
}

function editCategory(categoryId) {
    // In a real app, you would fetch the category details from your API
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    document.getElementById('categoryModalTitle').textContent = 'Edit Category';
    document.getElementById('categoryId').value = category.id;
    document.getElementById('categoryName').value = category.name;
    document.getElementById('parentCategory').value = category.parentId || '';

    // Show existing image (in a real app, you would fetch the image URL)
    document.getElementById('existingCategoryImage').classList.remove('hidden');
    document.getElementById('existingCategoryImageImg').src = 'https://via.placeholder.com/150';
    document.getElementById('categoryImageName').textContent = 'Current image selected';
    document.getElementById('categoryImagePreview').classList.add('hidden');
    document.getElementById('categoryImage').value = '';

    openModal('categoryModal');
}

function previewCategoryImage(input) {
    if (input.files && input.files[0]) {
        const fileName = input.files[0].name;
        document.getElementById('categoryImageName').textContent = fileName;

        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('categoryImagePreview').classList.remove('hidden');
            document.getElementById('categoryImagePreviewImg').src = e.target.result;
            document.getElementById('existingCategoryImage').classList.add('hidden');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function saveCategory() {
    const categoryId = document.getElementById('categoryId').value;
    const name = document.getElementById('categoryName').value;
    const parentId = document.getElementById('parentCategory').value;
    const imageFile = document.getElementById('categoryImage').files[0];

    if (!name) {
        alert('Category name is required');
        return;
    }

    // In a real app, you would:
    // 1. First upload the image if it's a new file (POST /api/v1/admin/attachment)
    // 2. Then save the category with the attachment ID (POST /api/v1/admin/category or PUT /api/v1/admin/category/{categoryId})

    // For demo purposes, we'll just update our mock data
    if (categoryId) {
        // Update existing category
        const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
        if (categoryIndex !== -1) {
            categories[categoryIndex].name = name;
            categories[categoryIndex].parentId = parentId || null;
            categories[categoryIndex].parentName = parentId ? categories.find(cat => cat.id === parentId)?.name : null;
        }
    } else {
        // Add new category
        const newCategory = {
            id: (categories.length + 1).toString(),
            name,
            parentId: parentId || null,
            parentName: parentId ? categories.find(cat => cat.id === parentId)?.name : null,
            isActive: true,
            createdAt: new Date().toISOString(),
            childrenNames: []
        };
        categories.push(newCategory);

        // If this is a child category, add it to the parent's children
        if (parentId) {
            const parentCategory = categories.find(cat => cat.id === parentId);
            if (parentCategory) {
                parentCategory.childrenNames.push(name);
            }
        }
    }

    closeModal('categoryModal');
    loadCategories();
    showToast('Category saved successfully');
}

function viewCategory(categoryId) {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    // In a real app, you would show a detailed view modal
    // For demo purposes, we'll just show an alert
    alert(`Category Details:\n\nName: ${category.name}\nParent: ${category.parentName || 'None'}\nStatus: ${category.isActive ? 'Active' : 'Inactive'}\nCreated: ${formatDate(category.createdAt)}`);
}

function toggleCategoryStatus(categoryId, isCurrentlyActive) {
    const action = isCurrentlyActive ? 'disable' : 'enable';
    showConfirmationModal(
        'Confirm Status Change',
        `Are you sure you want to ${action} this category?`,
        () => {
            // In a real app, you would call PATCH /api/v1/admin/category/{categoryId}
            const category = categories.find(cat => cat.id === categoryId);
            if (category) {
                category.isActive = !isCurrentlyActive;
                loadCategories();
                showToast(`Category ${action}d successfully`);
            }
        }
    );
}

// Product functions
function loadProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const statusFilter = document.getElementById('productStatusFilter').value;
    const categoryFilter = document.getElementById('productCategoryFilter').value;

    // In a real app, you would fetch products from your API
    // For demo purposes, we'll use mock data
    const mockProducts = [
        { id: '1', name: 'Classic White T-Shirt', categoryName: 'T-Shirts', price: 29.99, discount: 0, status: 'NEW', stock: 142, isActive: true, createdAt: '2023-05-20T10:30:00', gender: 'MALE' },
        { id: '2', name: 'Slim Fit Jeans', categoryName: 'Jeans', price: 59.99, discount: 10, status: 'HOT', stock: 87, isActive: true, createdAt: '2023-05-21T11:15:00', gender: 'MALE' },
        { id: '3', name: 'Leather Jacket', categoryName: 'Jackets', price: 199.99, discount: 20, status: 'SALE', stock: 24, isActive: true, createdAt: '2023-05-22T09:45:00', gender: 'MALE' },
        { id: '4', name: 'Summer Dress', categoryName: 'Dresses', price: 49.99, discount: 15, status: 'NEW', stock: 65, isActive: true, createdAt: '2023-05-23T14:20:00', gender: 'FEMALE' },
        { id: '5', name: 'Floral Blouse', categoryName: 'Blouses', price: 39.99, discount: 0, status: 'NEW', stock: 92, isActive: true, createdAt: '2023-05-24T16:30:00', gender: 'FEMALE' },
        { id: '6', name: 'Baseball Cap', categoryName: 'Hats', price: 24.99, discount: 5, status: 'HOT', stock: 124, isActive: true, createdAt: '2023-05-25T10:10:00', gender: 'MALE' },
        { id: '7', name: 'Leather Belt', categoryName: 'Belts', price: 34.99, discount: 0, status: 'NEW', stock: 78, isActive: false, createdAt: '2023-05-26T11:45:00', gender: 'MALE' },
        { id: '8', name: 'Smart Watch', categoryName: 'Watches', price: 149.99, discount: 25, status: 'SALE', stock: 36, isActive: true, createdAt: '2023-05-27T13:20:00', gender: 'MALE' },
        { id: '9', name: 'Denim Skirt', categoryName: 'Skirts', price: 44.99, discount: 10, status: 'HOT', stock: 53, isActive: true, createdAt: '2023-05-28T15:30:00', gender: 'FEMALE' },
        { id: '10', name: 'Running Shoes', categoryName: 'Shoes', price: 89.99, discount: 0, status: 'NEW', stock: 67, isActive: true, createdAt: '2023-05-29T17:45:00', gender: 'MALE' }
    ];

    // Filter products
    let filteredProducts = mockProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.categoryName.toLowerCase().includes(searchTerm));

    if (statusFilter) {
        filteredProducts = filteredProducts.filter(product => product.status === statusFilter);
    }

    if (categoryFilter) {
        filteredProducts = filteredProducts.filter(product => product.categoryName === categoryFilter);
    }

    // Sort by creation date (newest first)
    filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = (currentPage.products - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Update table
    const tableBody = document.getElementById('productsTableBody');
    tableBody.innerHTML = '';

    paginatedProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="text-sm font-medium text-gray-900">${product.name}</div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">${product.categoryName}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">$${product.price.toFixed(2)}${product.discount > 0 ? ` <span class="text-red-500">(-${product.discount}%)</span>` : ''}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getProductStatusClass(product.status)}">
                    ${product.status}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${product.stock}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onclick="viewProduct('${product.id}')" class="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                <button onclick="editProduct('${product.id}')" class="text-yellow-600 hover:text-yellow-900 mr-3">Edit</button>
                <button onclick="toggleProductStatus('${product.id}', ${product.isActive})" class="${product.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}">
                    ${product.isActive ? 'Disable' : 'Enable'}
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Update pagination info
    document.getElementById('productPaginationInfo').textContent = `Showing ${startIndex + 1} to ${Math.min(endIndex, filteredProducts.length)} of ${filteredProducts.length} products`;
    document.getElementById('prevProductPage').disabled = currentPage.products === 1;
    document.getElementById('nextProductPage').disabled = endIndex >= filteredProducts.length;
}

function getProductStatusClass(status) {
    switch(status) {
        case 'NEW': return 'bg-blue-100 text-blue-800';
        case 'HOT': return 'bg-red-100 text-red-800';
        case 'SALE': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function updateProductCategoryFilterDropdown() {
    const dropdown = document.getElementById('productCategoryFilter');
    const productCategoryDropdown = document.getElementById('productCategory');

    // Clear existing options except the first one
    while (dropdown.options.length > 1) {
        dropdown.remove(1);
    }
    while (productCategoryDropdown.options.length > 0) {
        productCategoryDropdown.remove(0);
    }

    // Add default option to product form dropdown
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a category';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    productCategoryDropdown.appendChild(defaultOption);

    // Get unique category names
    const uniqueCategories = [...new Set(categories.map(cat => cat.name))];

    uniqueCategories.forEach(category => {
        // Add to filter dropdown
        const filterOption = document.createElement('option');
        filterOption.value = category;
        filterOption.textContent = category;
        dropdown.appendChild(filterOption);

        // Add to product form dropdown
        const productOption = document.createElement('option');
        productOption.value = category; // In a real app, this would be the category ID
        productOption.textContent = category;
        productCategoryDropdown.appendChild(productOption);
    });
}

function showCreateProductModal() {
    document.getElementById('productModalTitle').textContent = 'Add New Product';
    document.getElementById('productId').value = '';
    document.getElementById('productForm').reset();
    document.getElementById('productIsActive').checked = true;
    openModal('productModal');
}

function editProduct(productId) {
    // In a real app, you would fetch the product details from your API
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('productModalTitle').textContent = 'Edit Product';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.categoryName;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productDiscount').value = product.discount || '';
    document.getElementById('productGender').value = product.gender;
    document.getElementById('productStatus').value = product.status;
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productIsActive').checked = product.isActive;

    openModal('productModal');
}

function saveProduct() {
    const productId = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const category = document.getElementById('productCategory').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const discount = document.getElementById('productDiscount').value ? parseInt(document.getElementById('productDiscount').value) : 0;
    const gender = document.getElementById('productGender').value;
    const status = document.getElementById('productStatus').value;
    const description = document.getElementById('productDescription').value;
    const isActive = document.getElementById('productIsActive').checked;

    if (!name || !category || !price || !description) {
        alert('Please fill in all required fields');
        return;
    }

    // In a real app, you would:
    // POST /api/v1/admin/product (for new) or PUT /api/v1/admin/product/{productId} (for update)

    // For demo purposes, we'll just update our mock data
    if (productId) {
        // Update existing product
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            products[productIndex] = {
                ...products[productIndex],
                name,
                categoryName: category,
                price,
                discount,
                gender,
                status,
                description,
                isActive
            };
        }
    } else {
        // Add new product
        const newProduct = {
            id: (products.length + 1).toString(),
            name,
            categoryName: category,
            price,
            discount,
            gender,
            status,
            description,
            stock: 0, // Will be calculated from variants
            isActive,
            createdAt: new Date().toISOString(),
            colours: 0,
            sizes: 0
        };
        products.push(newProduct);
    }

    closeModal('productModal');
    loadProducts();
    showToast('Product saved successfully');
}

function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('viewProductModalTitle').textContent = product.name;
    document.getElementById('viewProductName').textContent = product.name;
    document.getElementById('viewProductCategory').textContent = product.categoryName;
    document.getElementById('viewProductPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('viewProductDiscount').textContent = product.discount > 0 ? `${product.discount}%` : 'None';
    document.getElementById('viewProductGender').textContent = product.gender === 'MALE' ? 'Male' : 'Female';
    document.getElementById('viewProductStatus').textContent = product.status;
    document.getElementById('viewProductIsActive').textContent = product.isActive ? 'Yes' : 'No';
    document.getElementById('viewProductStock').textContent = product.stock;
    document.getElementById('viewProductDescription').textContent = product.description;
    document.getElementById('viewProductCreatedAt').textContent = formatDate(product.createdAt);
    document.getElementById('viewProductUpdatedAt').textContent = formatDate(product.updatedAt || product.createdAt);
    document.getElementById('viewProductCreatedBy').textContent = product.createdBy || 'Admin';
    document.getElementById('viewProductUpdatedBy').textContent = product.updatedBy || 'Admin';

    openModal('viewProductModal');
}

function toggleProductStatus(productId, isCurrentlyActive) {
    const action = isCurrentlyActive ? 'disable' : 'enable';
    showConfirmationModal(
        'Confirm Status Change',
        `Are you sure you want to ${action} this product?`,
        () => {
            // In a real app, you would call PATCH /api/v1/admin/product/{productId}
            const product = products.find(p => p.id === productId);
            if (product) {
                product.isActive = !isCurrentlyActive;
                loadProducts();
                showToast(`Product ${action}d successfully`);
            }
        }
    );
}

// Product Details functions
function loadProductDetails() {
    const selectedProductId = document.getElementById('productDetailsFilter').value;

    // Update product dropdown
    updateProductDetailsFilterDropdown();

    if (!selectedProductId) {
        document.getElementById('selectedProductDetails').innerHTML = `
            <div class="text-center py-8 text-gray-500">
                Select a product to view details
            </div>
        `;
        document.getElementById('colourVariantsSection').style.display = 'none';
        return;
    }

    // In a real app, you would fetch the product details with variants from your API
    // GET /api/v1/admin/product/{productId}/entire

    // For demo purposes, we'll use mock data
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    // Display product details
    document.getElementById('selectedProductDetails').innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h4 class="text-lg font-semibold mb-2">${product.name}</h4>
                <p class="text-gray-600 mb-1"><span class="font-medium">Category:</span> ${product.categoryName}</p>
                <p class="text-gray-600 mb-1"><span class="font-medium">Price:</span> $${product.price.toFixed(2)}</p>
                <p class="text-gray-600 mb-1"><span class="font-medium">Discount:</span> ${product.discount > 0 ? `${product.discount}%` : 'None'}</p>
                <p class="text-gray-600 mb-1"><span class="font-medium">Gender:</span> ${product.gender === 'MALE' ? 'Male' : 'Female'}</p>
                <p class="text-gray-600 mb-1"><span class="font-medium">Status:</span> <span class="${getProductStatusClass(product.status)} px-2 py-1 rounded-full text-xs">${product.status}</span></p>
                <p class="text-gray-600 mb-1"><span class="font-medium">Stock:</span> ${product.stock}</p>
                <p class="text-gray-600 mb-1"><span class="font-medium">Active:</span> ${product.isActive ? 'Yes' : 'No'}</p>
            </div>
            <div>
                <h5 class="text-md font-medium mb-1">Description</h5>
                <p class="text-gray-600">${product.description}</p>
                <div class="mt-4">
                    <button onclick="showCreateColourVariantModal('${product.id}')" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm">
                        <i class="fas fa-plus mr-2"></i>Add Colour Variant
                    </button>
                </div>
            </div>
        </div>
    `;

    // Load colour variants for this product
    loadColourVariants(selectedProductId);
    document.getElementById('colourVariantsSection').style.display = 'block';
}

function updateProductDetailsFilterDropdown() {
    const dropdown = document.getElementById('productDetailsFilter');

    // Clear existing options except the first one
    while (dropdown.options.length > 1) {
        dropdown.remove(1);
    }

    // Add products
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = product.name;
        dropdown.appendChild(option);
    });
}

function loadColourVariants(productId) {
    // In a real app, you would fetch colour variants from your API
    // GET /api/v1/admin/product/{productId}/entire

    // For demo purposes, we'll use mock data
    const mockColourVariants = [
        {
            id: '1',
            colourName: 'Black',
            productId: '1',
            productName: 'Classic White T-Shirt',
            isActive: true,
            totalStock: 142,
            images: [
                { id: '1', url: 'https://via.placeholder.com/150/000000/FFFFFF?text=Black' },
                { id: '2', url: 'https://via.placeholder.com/150/000000/FFFFFF?text=Black+2' }
            ],
            sizeVariants: [
                { id: '1', size: 'S', quantity: 30, colourVariantId: '1' },
                { id: '2', size: 'M', quantity: 50, colourVariantId: '1' },
                { id: '3', size: 'L', quantity: 42, colourVariantId: '1' },
                { id: '4', size: 'XL', quantity: 20, colourVariantId: '1' }
            ],
            createdAt: '2023-05-20T10:30:00',
            updatedAt: '2023-05-20T10:30:00',
            createdBy: 'Admin',
            updatedBy: 'Admin'
        },
        {
            id: '2',
            colourName: 'White',
            productId: '1',
            productName: 'Classic White T-Shirt',
            isActive: true,
            totalStock: 120,
            images: [
                { id: '3', url: 'https://via.placeholder.com/150/FFFFFF/000000?text=White' },
                { id: '4', url: 'https://via.placeholder.com/150/FFFFFF/000000?text=White+2' }
            ],
            sizeVariants: [
                { id: '5', size: 'S', quantity: 25, colourVariantId: '2' },
                { id: '6', size: 'M', quantity: 45, colourVariantId: '2' },
                { id: '7', size: 'L', quantity: 35, colourVariantId: '2' },
                { id: '8', size: 'XL', quantity: 15, colourVariantId: '2' }
            ],
            createdAt: '2023-05-20T11:30:00',
            updatedAt: '2023-05-20T11:30:00',
            createdBy: 'Admin',
            updatedBy: 'Admin'
        },
        {
            id: '3',
            colourName: 'Blue',
            productId: '1',
            productName: 'Classic White T-Shirt',
            isActive: false,
            totalStock: 85,
            images: [
                { id: '5', url: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Blue' }
            ],
            sizeVariants: [
                { id: '9', size: 'S', quantity: 20, colourVariantId: '3' },
                { id: '10', size: 'M', quantity: 35, colourVariantId: '3' },
                { id: '11', size: 'L', quantity: 25, colourVariantId: '3' },
                { id: '12', size: 'XL', quantity: 5, colourVariantId: '3' }
            ],
            createdAt: '2023-05-21T09:15:00',
            updatedAt: '2023-05-21T09:15:00',
            createdBy: 'Admin',
            updatedBy: 'Admin'
        }
    ];

    // Filter variants for the selected product
    const variants = mockColourVariants.filter(variant => variant.productId === productId);

    // Display as cards
    const container = document.getElementById('colourVariantsContainer');
    container.innerHTML = '';

    variants.forEach(variant => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow overflow-hidden border border-gray-200';
        card.innerHTML = `
            <div class="relative">
                <img src="${variant.images[0].url}" alt="${variant.colourName}" class="w-full h-48 object-cover">
                <span class="absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${variant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                    ${variant.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>
            <div class="p-4">
                <h5 class="text-lg font-semibold mb-1">${variant.colourName}</h5>
                <p class="text-gray-600 text-sm mb-2">${variant.sizeVariants.length} sizes, ${variant.totalStock} in stock</p>
                <div class="flex justify-between mt-4">
                    <button onclick="viewColourVariant('${variant.id}')" class="text-indigo-600 hover:text-indigo-900 text-sm font-medium">View</button>
                    <button onclick="editColourVariant('${variant.id}')" class="text-yellow-600 hover:text-yellow-900 text-sm font-medium">Edit</button>
                    <button onclick="toggleColourVariantStatus('${variant.id}', ${variant.isActive})" class="${variant.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'} text-sm font-medium">
                        ${variant.isActive ? 'Disable' : 'Enable'}
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function showCreateColourVariantModal(productId) {
    document.getElementById('colourVariantModalTitle').textContent = 'Add Colour Variant';
    document.getElementById('colourVariantId').value = '';
    document.getElementById('colourVariantProductId').value = productId;
    document.getElementById('colourName').value = '';
    document.getElementById('colourVariantImages').value = '';
    document.getElementById('colourVariantImagesCount').textContent = 'No images selected';
    document.getElementById('colourVariantImagesPreview').classList.add('hidden');
    document.getElementById('existingColourVariantImages').classList.add('hidden');
    document.getElementById('colourVariantIsActive').checked = true;

    // Clear size variants table
    document.getElementById('sizeVariantsTable').innerHTML = `
        <tr id="noSizesRow">
            <td colspan="3" class="px-3 py-2 text-sm text-gray-500 text-center">No size variants added yet</td>
        </tr>
    `;

    openModal('colourVariantModal');
}

function previewColourVariantImages(input) {
    if (input.files && input.files.length > 0) {
        document.getElementById('colourVariantImagesCount').textContent = `${input.files.length} image(s) selected`;
        document.getElementById('colourVariantImagesPreview').classList.remove('hidden');
        document.getElementById('colourVariantImagesPreview').innerHTML = '';
        document.getElementById('existingColourVariantImages').classList.add('hidden');

        for (let i = 0; i < Math.min(input.files.length, 3); i++) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgDiv = document.createElement('div');
                imgDiv.className = 'relative';
                imgDiv.innerHTML = `
                    <img src="${e.target.result}" alt="Preview ${i + 1}" class="w-full h-24 object-cover rounded-md">
                    <span class="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">New</span>
                `;
                document.getElementById('colourVariantImagesPreview').appendChild(imgDiv);
            };
            reader.readAsDataURL(input.files[i]);
        }
    }
}

function addSizeVariantRow() {
    const noSizesRow = document.getElementById('noSizesRow');
    if (noSizesRow) noSizesRow.remove();

    const rowId = Date.now(); // Unique ID for the row

    const row = document.createElement('tr');
    row.id = `sizeRow_${rowId}`;
    row.innerHTML = `
        <td class="px-3 py-2 whitespace-nowrap">
            <select class="w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm" id="sizeSelect_${rowId}">
                ${getSizeOptions()}
            </select>
        </td>
        <td class="px-3 py-2 whitespace-nowrap">
            <input type="number" min="0" class="w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm" id="sizeQuantity_${rowId}" value="0">
        </td>
        <td class="px-3 py-2 whitespace-nowrap text-right">
            <button onclick="removeSizeVariantRow('${rowId}')" class="text-red-600 hover:text-red-900 text-sm">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    document.getElementById('sizeVariantsTable').appendChild(row);
}

function getSizeOptions() {
    // In a real app, you might fetch these from your API or use the Size enum
    const sizes = [
        'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
        '32', '34', '36', '38', '40', '42', '44', '46', '48', '50',
        '52', '54', '56', '58', '60', '62', '64', '66'
    ];

    return sizes.map(size => `<option value="${size}">${size}</option>`).join('');
}

function removeSizeVariantRow(rowId) {
    document.getElementById(`sizeRow_${rowId}`).remove();

    // Show "no sizes" message if table is empty
    if (document.getElementById('sizeVariantsTable').children.length === 0) {
        document.getElementById('sizeVariantsTable').innerHTML = `
            <tr id="noSizesRow">
                <td colspan="3" class="px-3 py-2 text-sm text-gray-500 text-center">No size variants added yet</td>
            </tr>
        `;
    }
}

function saveColourVariant() {
    const colourVariantId = document.getElementById('colourVariantId').value;
    const productId = document.getElementById('colourVariantProductId').value;
    const colourName = document.getElementById('colourName').value;
    const isActive = document.getElementById('colourVariantIsActive').checked;
    const imageFiles = document.getElementById('colourVariantImages').files;

    if (!colourName) {
        alert('Colour name is required');
        return;
    }

    if (!colourVariantId && (!imageFiles || imageFiles.length === 0)) {
        alert('At least one image is required');
        return;
    }

    // Collect size variants
    const sizeVariants = [];
    const sizeRows = document.getElementById('sizeVariantsTable').querySelectorAll('tr[id^="sizeRow_"]');

    sizeRows.forEach(row => {
        const rowId = row.id.split('_')[1];
        const size = document.getElementById(`sizeSelect_${rowId}`).value;
        const quantity = parseInt(document.getElementById(`sizeQuantity_${rowId}`).value);

        if (size && !isNaN(quantity)) {
            sizeVariants.push({ size, quantity });
        }
    });

    if (sizeVariants.length === 0) {
        alert('At least one size variant is required');
        return;
    }

    // In a real app, you would:
    // 1. First upload the images if they are new (POST /api/v1/admin/attachment)
    // 2. Then save the colour variant with size variants (POST /api/v1/admin/colour-variant)
    // For updates, you would use PUT /api/v1/admin/colour-variant/{colourVariantId}

    // For demo purposes, we'll just show a success message
    closeModal('colourVariantModal');
    loadProductDetails();
    showToast(`Colour variant ${colourVariantId ? 'updated' : 'created'} successfully`);
}

function editColourVariant(colourVariantId) {
    // In a real app, you would fetch the colour variant details from your API
    // GET /api/v1/admin/colour-variant/{colourVariantId}

    // For demo purposes, we'll use mock data
    const mockColourVariants = [
        {
            id: '1',
            colourName: 'Black',
            productId: '1',
            productName: 'Classic White T-Shirt',
            isActive: true,
            totalStock: 142,
            images: [
                { id: '1', url: 'https://via.placeholder.com/150/000000/FFFFFF?text=Black' },
                { id: '2', url: 'https://via.placeholder.com/150/000000/FFFFFF?text=Black+2' }
            ],
            sizeVariants: [
                { id: '1', size: 'S', quantity: 30, colourVariantId: '1' },
                { id: '2', size: 'M', quantity: 50, colourVariantId: '1' },
                { id: '3', size: 'L', quantity: 42, colourVariantId: '1' },
                { id: '4', size: 'XL', quantity: 20, colourVariantId: '1' }
            ],
            createdAt: '2023-05-20T10:30:00',
            updatedAt: '2023-05-20T10:30:00',
            createdBy: 'Admin',
            updatedBy: 'Admin'
        }
    ];

    const variant = mockColourVariants.find(v => v.id === colourVariantId);
    if (!variant) return;

    document.getElementById('colourVariantModalTitle').textContent = 'Edit Colour Variant';
    document.getElementById('colourVariantId').value = variant.id;
    document.getElementById('colourVariantProductId').value = variant.productId;
    document.getElementById('colourName').value = variant.colourName;
    document.getElementById('colourVariantImages').value = '';
    document.getElementById('colourVariantImagesCount').textContent = 'Current images selected';
    document.getElementById('colourVariantImagesPreview').classList.add('hidden');
    document.getElementById('colourVariantIsActive').checked = variant.isActive;

    // Show existing images
    const existingImagesContainer = document.getElementById('existingColourVariantImagesContainer');
    existingImagesContainer.innerHTML = '';
    variant.images.forEach(image => {
        const imgDiv = document.createElement('div');
        imgDiv.className = 'relative';
        imgDiv.innerHTML = `
            <img src="${image.url}" alt="Current Image" class="w-full h-24 object-cover rounded-md">
            <span class="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">Current</span>
        `;
        existingImagesContainer.appendChild(imgDiv);
    });
    document.getElementById('existingColourVariantImages').classList.remove('hidden');

    // Add size variants to table
    document.getElementById('sizeVariantsTable').innerHTML = '';
    variant.sizeVariants.forEach((sizeVariant, index) => {
        const rowId = `existing_${index}`;
        const row = document.createElement('tr');
        row.id = `sizeRow_${rowId}`;
        row.innerHTML = `
            <td class="px-3 py-2 whitespace-nowrap">
                <select class="w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm" id="sizeSelect_${rowId}">
                    ${getSizeOptions(sizeVariant.size)}
                </select>
            </td>
            <td class="px-3 py-2 whitespace-nowrap">
                <input type="number" min="0" class="w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm" id="sizeQuantity_${rowId}" value="${sizeVariant.quantity}">
            </td>
            <td class="px-3 py-2 whitespace-nowrap text-right">
                <button onclick="removeSizeVariantRow('${rowId}')" class="text-red-600 hover:text-red-900 text-sm">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        document.getElementById('sizeVariantsTable').appendChild(row);
    });

    openModal('colourVariantModal');
}

function getSizeOptions(selectedSize = '') {
    // In a real app, you might fetch these from your API or use the Size enum
    const sizes = [
        'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
        '32', '34', '36', '38', '40', '42', '44', '46', '48', '50',
        '52', '54', '56', '58', '60', '62', '64', '66'
    ];

    return sizes.map(size =>
        `<option value="${size}" ${size === selectedSize ? 'selected' : ''}>${size}</option>`
    ).join('');
}

function viewColourVariant(colourVariantId) {
    // In a real app, you would fetch the colour variant details from your API
    // GET /api/v1/admin/colour-variant/{colourVariantId}

    // For demo purposes, we'll use mock data
    const mockColourVariants = [
        {
            id: '1',
            colourName: 'Black',
            productId: '1',
            productName: 'Classic White T-Shirt',
            isActive: true,
            totalStock: 142,
            images: [
                { id: '1', url: 'https://via.placeholder.com/150/000000/FFFFFF?text=Black' },
                { id: '2', url: 'https://via.placeholder.com/150/000000/FFFFFF?text=Black+2' }
            ],
            sizeVariants: [
                { id: '1', size: 'S', quantity: 30, colourVariantId: '1' },
                { id: '2', size: 'M', quantity: 50, colourVariantId: '1' },
                { id: '3', size: 'L', quantity: 42, colourVariantId: '1' },
                { id: '4', size: 'XL', quantity: 20, colourVariantId: '1' }
            ],
            createdAt: '2023-05-20T10:30:00',
            updatedAt: '2023-05-20T10:30:00',
            createdBy: 'Admin',
            updatedBy: 'Admin'
        }
    ];

    const variant = mockColourVariants.find(v => v.id === colourVariantId);
    if (!variant) return;

    document.getElementById('viewColourVariantModalTitle').textContent = `${variant.colourName} Variant`;
    document.getElementById('viewColourName').textContent = variant.colourName;
    document.getElementById('viewColourStatus').textContent = variant.isActive ? 'Active' : 'Inactive';
    document.getElementById('viewColourProduct').textContent = variant.productName;
    document.getElementById('viewColourTotalStock').textContent = variant.totalStock;
    document.getElementById('viewColourCreatedAt').textContent = formatDate(variant.createdAt);
    document.getElementById('viewColourUpdatedAt').textContent = formatDate(variant.updatedAt);
    document.getElementById('viewColourCreatedBy').textContent = variant.createdBy;
    document.getElementById('viewColourUpdatedBy').textContent = variant.updatedBy;

    // Display images
    const imagesContainer = document.getElementById('viewColourImages');
    imagesContainer.innerHTML = '';
    variant.images.forEach(image => {
        const imgDiv = document.createElement('div');
        imgDiv.className = 'relative';
        imgDiv.innerHTML = `
            <img src="${image.url}" alt="${variant.colourName}" class="w-full h-24 object-cover rounded-md">
        `;
        imagesContainer.appendChild(imgDiv);
    });

    // Display size variants
    const sizesTable = document.getElementById('viewSizeVariantsTable');
    sizesTable.innerHTML = '';
    variant.sizeVariants.forEach(sizeVariant => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${sizeVariant.size}</td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${sizeVariant.quantity}</td>
            <td class="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                <button onclick="editSizeVariant('${sizeVariant.id}')" class="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
                <button onclick="viewSizeVariant('${sizeVariant.id}')" class="text-green-600 hover:text-green-900">View</button>
            </td>
        `;
        sizesTable.appendChild(row);
    });

    openModal('viewColourVariantModal');
}

function toggleColourVariantStatus(colourVariantId, isCurrentlyActive) {
    const action = isCurrentlyActive ? 'disable' : 'enable';
    showConfirmationModal(
        'Confirm Status Change',
        `Are you sure you want to ${action} this colour variant?`,
        () => {
            // In a real app, you would call PATCH /api/v1/admin/colour-variant/{colourVariantId}
            // For demo purposes, we'll just show a success message
            showToast(`Colour variant ${action}d successfully`);
            loadProductDetails();
        }
    );
}

// Size Variant functions
function editSizeVariant(sizeVariantId) {
    // In a real app, you would fetch the size variant details from your API
    // GET /api/v1/admin/size-variant/{sizeVariantId}

    // For demo purposes, we'll use mock data
    const mockSizeVariants = [
        { id: '1', size: 'S', quantity: 30, colourVariantId: '1' },
        { id: '2', size: 'M', quantity: 50, colourVariantId: '1' },
        { id: '3', size: 'L', quantity: 42, colourVariantId: '1' },
        { id: '4', size: 'XL', quantity: 20, colourVariantId: '1' }
    ];

    const sizeVariant = mockSizeVariants.find(s => s.id === sizeVariantId);
    if (!sizeVariant) return;

    document.getElementById('sizeVariantModalTitle').textContent = 'Edit Size Variant';
    document.getElementById('sizeVariantId').value = sizeVariant.id;
    document.getElementById('sizeVariantColourVariantId').value = sizeVariant.colourVariantId;

    // Set size options
    const sizeSelect = document.getElementById('sizeVariantSize');
    sizeSelect.innerHTML = getSizeOptions(sizeVariant.size);

    document.getElementById('sizeVariantQuantity').value = sizeVariant.quantity;

    openModal('sizeVariantModal');
}

function viewSizeVariant(sizeVariantId) {
    // In a real app, you would fetch the size variant details from your API
    // GET /api/v1/admin/size-variant/{sizeVariantId}

    // For demo purposes, we'll use mock data
    const mockSizeVariants = [
        { id: '1', size: 'S', quantity: 30, colourVariantId: '1', colourName: 'Black', createdAt: '2023-05-20T10:30:00', updatedAt: '2023-05-20T10:30:00' }
    ];

    const sizeVariant = mockSizeVariants.find(s => s.id === sizeVariantId);
    if (!sizeVariant) return;

    // In a real app, you would show a detailed view modal
    // For demo purposes, we'll just show an alert
    alert(`Size Variant Details:\n\nSize: ${sizeVariant.size}\nQuantity: ${sizeVariant.quantity}\nColour: ${sizeVariant.colourName}\nCreated: ${formatDate(sizeVariant.createdAt)}`);
}

function saveSizeVariant() {
    const sizeVariantId = document.getElementById('sizeVariantId').value;
    const size = document.getElementById('sizeVariantSize').value;
    const quantity = parseInt(document.getElementById('sizeVariantQuantity').value);
    const colourVariantId = document.getElementById('sizeVariantColourVariantId').value;

    if (!size || isNaN(quantity)) {
        alert('Please fill in all required fields');
        return;
    }

    // In a real app, you would:
    // POST /api/v1/admin/size-variant (for new) or PUT /api/v1/admin/size-variant/{sizeVariantId} (for update)

    // For demo purposes, we'll just show a success message
    closeModal('sizeVariantModal');
    showToast(`Size variant ${sizeVariantId ? 'updated' : 'created'} successfully`);

    // If we're editing from the colour variant view, refresh it
    if (document.getElementById('viewColourVariantModal').classList.contains('hidden')) {
        loadProductDetails();
    } else {
        viewColourVariant(colourVariantId);
    }
}

// Order functions
function loadOrders() {
    const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
    const statusFilter = document.getElementById('orderStatusFilter').value;
    const dateFilter = document.getElementById('orderDateFilter').value;

    // In a real app, you would fetch orders from your API
    // For demo purposes, we'll use mock data
    const mockOrders = [
        { id: 'ORD-001', customer: 'John Doe', date: '2023-06-01T14:30:00', status: 'PROCESSING', amount: 125.99 },
        { id: 'ORD-002', customer: 'Jane Smith', date: '2023-06-02T10:15:00', status: 'SHIPPED', amount: 89.50 },
        { id: 'ORD-003', customer: 'Robert Johnson', date: '2023-06-03T16:45:00', status: 'DELIVERED', amount: 234.75 },
        { id: 'ORD-004', customer: 'Emily Davis', date: '2023-06-04T09:20:00', status: 'PENDING', amount: 56.20 },
        { id: 'ORD-005', customer: 'Michael Wilson', date: '2023-06-05T11:30:00', status: 'PROCESSING', amount: 178.30 },
        { id: 'ORD-006', customer: 'Sarah Brown', date: '2023-06-06T13:25:00', status: 'CANCELLED', amount: 99.99 },
        { id: 'ORD-007', customer: 'David Taylor', date: '2023-06-07T15:40:00', status: 'DELIVERED', amount: 145.60 },
        { id: 'ORD-008', customer: 'Jessica Lee', date: '2023-06-08T12:10:00', status: 'SHIPPED', amount: 67.85 },
        { id: 'ORD-009', customer: 'Thomas Harris', date: '2023-06-09T17:55:00', status: 'PENDING', amount: 210.45 },
        { id: 'ORD-010', customer: 'Jennifer Clark', date: '2023-06-10T14:20:00', status: 'PROCESSING', amount: 89.99 }
    ];

    // Filter orders
    let filteredOrders = mockOrders.filter(order =>
        order.id.toLowerCase().includes(searchTerm) ||
        order.customer.toLowerCase().includes(searchTerm));

    if (statusFilter) {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }

    if (dateFilter) {
        const filterDate = new Date(dateFilter).toDateString();
        filteredOrders = filteredOrders.filter(order => new Date(order.date).toDateString() === filterDate);
    }

    // Sort by date (newest first)
    filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Pagination
    const startIndex = (currentPage.orders - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    // Update table
    const tableBody = document.getElementById('ordersTableBody');
    tableBody.innerHTML = '';

    paginatedOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${order.id}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">${order.customer}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">${formatDate(order.date)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getOrderStatusClass(order.status)}">
                    ${order.status}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                $${order.amount.toFixed(2)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onclick="viewOrder('${order.id}')" class="text-indigo-600 hover:text-indigo-900">View</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Update pagination info
    document.getElementById('orderPaginationInfo').textContent = `Showing ${startIndex + 1} to ${Math.min(endIndex, filteredOrders.length)} of ${filteredOrders.length} orders`;
    document.getElementById('prevOrderPage').disabled = currentPage.orders === 1;
    document.getElementById('nextOrderPage').disabled = endIndex >= filteredOrders.length;
}

function getOrderStatusClass(status) {
    switch(status) {
        case 'PENDING': return 'bg-yellow-100 text-yellow-800';
        case 'PROCESSING': return 'bg-blue-100 text-blue-800';
        case 'SHIPPED': return 'bg-indigo-100 text-indigo-800';
        case 'DELIVERED': return 'bg-green-100 text-green-800';
        case 'CANCELLED': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function viewOrder(orderId) {
    // In a real app, you would fetch the order details from your API

    // For demo purposes, we'll use mock data
    const mockOrder = {
        id: 'ORD-001',
        customer: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        shippingAddress: '123 Main St, Apt 4B, New York, NY 10001, United States',
        status: 'PROCESSING',
        date: '2023-06-01T14:30:00',
        subtotal: 115.99,
        shipping: 10.00,
        total: 125.99,
        items: [
            { product: 'Classic White T-Shirt', colour: 'Black', size: 'M', price: 29.99, quantity: 2, total: 59.98 },
            { product: 'Slim Fit Jeans', colour: 'Blue', size: '32', price: 59.99, quantity: 1, total: 59.99 }
        ],
        createdAt: '2023-06-01T14:30:00',
        updatedAt: '2023-06-02T09:15:00'
    };

    document.getElementById('viewOrderId').textContent = orderId;
    document.getElementById('viewOrderCustomer').textContent = mockOrder.customer;
    document.getElementById('viewOrderEmail').textContent = mockOrder.email;
    document.getElementById('viewOrderPhone').textContent = mockOrder.phone;
    document.getElementById('viewOrderShippingAddress').textContent = mockOrder.shippingAddress;
    document.getElementById('viewOrderStatus').textContent = mockOrder.status;
    document.getElementById('viewOrderDate').textContent = formatDate(mockOrder.date);
    document.getElementById('viewOrderSubtotal').textContent = `$${mockOrder.subtotal.toFixed(2)}`;
    document.getElementById('viewOrderShipping').textContent = `$${mockOrder.shipping.toFixed(2)}`;
    document.getElementById('viewOrderTotal').textContent = `$${mockOrder.total.toFixed(2)}`;
    document.getElementById('viewOrderCreatedAt').textContent = formatDate(mockOrder.createdAt);
    document.getElementById('viewOrderUpdatedAt').textContent = formatDate(mockOrder.updatedAt);

    // Display order items
    const itemsTable = document.getElementById('viewOrderItems');
    itemsTable.innerHTML = '';
    mockOrder.items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${item.product}</td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${item.colour}</td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${item.size}</td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">$${item.price.toFixed(2)}</td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${item.quantity}</td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">$${item.total.toFixed(2)}</td>
        `;
        itemsTable.appendChild(row);
    });

    openModal('viewOrderModal');
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function showToast(message) {
    // In a real app, you would implement a proper toast notification
    alert(message);
}