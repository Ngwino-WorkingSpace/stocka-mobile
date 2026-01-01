import { BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getHeaders = async () => {
    const token = await AsyncStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    if (!token) {
        console.warn('⚠️ No authentication token found in AsyncStorage');
    } else {
        console.log('✅ Token found, length:', token.length);
    }
    return headers;
};

const handleResponse = async (response) => {
    const text = await response.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch (error) {
        data = { message: text || response.statusText };
    }

    if (!response.ok) {
        const error = (data && (data.error || data.message)) || response.statusText;
        console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            error: error,
            data: data
        });
        throw new Error(error);
    }
    return data;
};

export const api = {
    // Auth
    register: async (userData) => {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return handleResponse(response);
    },
    login: async (credentials) => {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        return handleResponse(response);
    },
    verifyRecoveryPin: async (data) => {
        // Backend expects { recoverypin, phoneNumber }
        const response = await fetch(`${BASE_URL}/auth/recovery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recoverypin: data.recoveryPin || data.recoverypin,
                phoneNumber: data.phoneNumber
            }),
        });
        return handleResponse(response);
    },
    resetPassword: async (data, recoveryToken = null) => {
        const headers = await getHeaders();
        // If we are in the recovery flow, we use the temporary recovery token
        const finalHeaders = recoveryToken
            ? { ...headers, Authorization: `Bearer ${recoveryToken}` }
            : headers;

        const response = await fetch(`${BASE_URL}/auth/newPassword`, {
            method: 'POST',
            headers: finalHeaders,
            body: JSON.stringify({ newPassword: data.newPassword }),
        });
        return handleResponse(response);
    },
    getProfile: async () => {
        const headers = await getHeaders();
        const response = await fetch(`${BASE_URL}/user/profile`, {
            headers,
        });
        return handleResponse(response);
    },

    // Dashboard
    getDashboardMetrics: async () => {
        const headers = await getHeaders();
        const response = await fetch(`${BASE_URL}/dashboard/metrics`, {
            headers,
        });
        return handleResponse(response);
    },

    // Products
    addProduct: async (data) => {
        const headers = await getHeaders();
        const response = await fetch(`${BASE_URL}/product/add`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                productName: data.productName,
                categoryId: data.categoryId,
                lowStockThresHold: data.lowStockThresHold || data.lowStockThreshold,
                productImage: data.productImage
            }),
        });
        return handleResponse(response);
    },
    getAllProducts: async () => {
        try {
            const headers = await getHeaders();
            console.log('Fetching products from:', `${BASE_URL}/product/all`);
            console.log('Headers:', headers);
            const response = await fetch(`${BASE_URL}/product/all`, {
                method: 'GET',
                headers,
            });
            console.log('Products response status:', response.status);
            return handleResponse(response);
        } catch (error) {
            console.error('getAllProducts error:', error);
            throw error;
        }
    },
    getProductById: async (productId) => {
        const headers = await getHeaders();
        const response = await fetch(`${BASE_URL}/product/single/${productId}`, {
            headers,
        });
        return handleResponse(response);
    },
    getLowStockProducts: async () => {
        const headers = await getHeaders();
        const response = await fetch(`${BASE_URL}/product/low`, {
            headers,
        });
        return handleResponse(response);
    },
    updateProduct: async (productId, data) => {
        const headers = await getHeaders();
        const response = await fetch(`${BASE_URL}/product/update/${productId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({
                productName: data.productName,
                categoryId: data.categoryId,
                lowStockThresHold: data.lowStockThresHold || data.lowStockThreshold,
                productImage: data.productImage
            }),
        });
        return handleResponse(response);
    },
    deleteProduct: async (productId) => {
        const headers = await getHeaders();
        const response = await fetch(`${BASE_URL}/product/delete/${productId}`, {
            method: 'DELETE',
            headers,
        });
        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (error) {
            data = { message: text || response.statusText };
        }
        // Backend bug: returns 200 for not found, 400 for success (reversed)
        if (response.status === 400 && data.error && data.error.includes("delete successfully")) {
            return { message: data.error }; // Success case
        }
        if (response.status === 200 && data.message && data.message.includes("doesn't exist")) {
            throw new Error(data.message); // Not found case
        }
        if (!response.ok) {
            throw new Error(data.error || data.message || response.statusText);
        }
        return data;
    },

    // Stock Batches
    addStockBatch: async (productId, data) => {
        const headers = await getHeaders();
        const response = await fetch(`${BASE_URL}/stock/add/${productId}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },
    getAllStockBatches: async () => {
        const headers = await getHeaders();
        const response = await fetch(`${BASE_URL}/stock/all`, {
            headers,
        });
        return handleResponse(response);
    },
    getExpiringStockBatches: async () => {
        const headers = await getHeaders();
        const response = await fetch(`${BASE_URL}/stock/expiry`, {
            headers,
        });
        return handleResponse(response);
    },

    // Sales
    createSale: async (data) => {
        const headers = await getHeaders();
        const response = await fetch(`${BASE_URL}/sales/add`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },
    getSalesHistory: async (range = 'today') => {
        const headers = await getHeaders();
        const response = await fetch(`${BASE_URL}/sales/history?range=${range}`, {
            headers,
        });
        return handleResponse(response);
    },

    // Debtors
    createDebtor: async (data) => {
        const headers = await getHeaders();
        const response = await fetch(`${BASE_URL}/debtor/add`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },
    getDebtors: async (type = 'debtors') => {
        try {
            const headers = await getHeaders();
            console.log('Fetching debtors from:', `${BASE_URL}/debtor/all/${type}`);
            console.log('Headers:', headers);
            const response = await fetch(`${BASE_URL}/debtor/all/${type}`, {
                method: 'GET',
                headers,
            });
            console.log('Debtors response status:', response.status);
            return handleResponse(response);
        } catch (error) {
            console.error('getDebtors error:', error);
            throw error;
        }
    },
    getSingleDebtorLedger: async (debtorId) => {
        const headers = await getHeaders();
        const response = await fetch(`${BASE_URL}/debtors/single/${debtorId}`, {
            headers,
        });
        return handleResponse(response);
    },
    recordDebt: async (data) => {
        const headers = await getHeaders();
        const response = await fetch(`${BASE_URL}/debtor/record-debt`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },
    recordPayment: async (data) => {
        const headers = await getHeaders();
        const response = await fetch(`${BASE_URL}/debtor/record-payment`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },
    deleteDebtor: async (debtorId) => {
        const headers = await getHeaders();
        const response = await fetch(`${BASE_URL}/debtor/delete/${debtorId}`, {
            method: 'DELETE',
            headers,
        });
        return handleResponse(response);
    },
    // Categories
    addCategory: async (data) => {
        const headers = await getHeaders();
        const response = await fetch(`${BASE_URL}/category/add`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },
    getAllCategories: async () => {
        const headers = await getHeaders();
        const response = await fetch(`${BASE_URL}/category/all`, {
            headers,
        });
        return handleResponse(response);
    },
    updateCategory: async (categoryId, data) => {
        const headers = await getHeaders();
        const response = await fetch(`${BASE_URL}/category/update/${categoryId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },
    deleteCategory: async (categoryId) => {
        const headers = await getHeaders();
        const response = await fetch(`${BASE_URL}/category/delete/${categoryId}`, {
            method: 'DELETE',
            headers,
        });
        return handleResponse(response);
    },
};
