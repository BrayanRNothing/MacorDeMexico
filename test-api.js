// Test API Connection
const API_URL = 'https://focused-presence-production-6e28.up.railway.app/api';

async function testLogin() {
    try {
        console.log('🔍 Testing DAE Login endpoint...');
        const response = await fetch(`${API_URL}/dae/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@dae.com', password: 'dae123' })
        });

        const data = await response.json();
        console.log('✅ Login Response:', data);
        return data;
    } catch (error) {
        console.error('❌ Login Error:', error.message);
    }
}

async function testCatalogs() {
    try {
        console.log('\n🔍 Testing DAE Catalogs endpoint...');
        const response = await fetch(`${API_URL}/dae/catalogs`);
        const data = await response.json();
        console.log('✅ Catalogs Response:', data.success ? `${data.catalogs.length} items` : 'Failed');
        return data;
    } catch (error) {
        console.error('❌ Catalogs Error:', error.message);
    }
}

async function testPNC() {
    try {
        console.log('\n🔍 Testing PNC endpoint...');
        const response = await fetch(`${API_URL}/pnc`);
        const data = await response.json();
        console.log('✅ PNC Response:', data.success ? `${data.reports.length} reports` : 'Failed');
        return data;
    } catch (error) {
        console.error('❌ PNC Error:', error.message);
    }
}

async function runTests() {
    console.log('🚀 Starting API Tests...\n');
    await testLogin();
    await testCatalogs();
    await testPNC();
    console.log('\n✅ All tests completed!');
}

runTests();
