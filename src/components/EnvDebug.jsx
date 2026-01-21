import React, { useEffect, useState } from 'react';

export default function EnvDebug() {
    const [apiTest, setApiTest] = useState('Testing...');

    const API_URL = import.meta.env.VITE_API_URL;
    const FINAL_URL = import.meta.env.VITE_API_URL || 'https://focused-presence-production-6e28.up.railway.app/api';

    useEffect(() => {
        fetch(`${FINAL_URL}/dae/catalogs`)
            .then(res => res.json())
            .then(data => {
                setApiTest(`✅ Success! ${data.catalogs?.length || 0} catalogs`);
            })
            .catch(error => {
                setApiTest(`❌ Error: ${error.message}`);
            });
    }, []);

    return (
        <div style={{
            padding: '20px',
            fontFamily: 'monospace',
            background: '#1a1a1a',
            color: '#00ff00',
            minHeight: '100vh'
        }}>
            <h1>🔍 DAE Environment Debug</h1>
            <div style={{ background: '#2a2a2a', padding: '15px', margin: '10px 0', borderLeft: '3px solid #00ff00' }}>
                <strong>VITE_API_URL:</strong><br />
                {API_URL || '❌ undefined'}
            </div>
            <div style={{ background: '#2a2a2a', padding: '15px', margin: '10px 0', borderLeft: '3px solid #00ff00' }}>
                <strong>Final API URL:</strong><br />
                {FINAL_URL}
            </div>
            <div style={{ background: '#2a2a2a', padding: '15px', margin: '10px 0', borderLeft: '3px solid #00ff00' }}>
                <strong>API Test:</strong><br />
                {apiTest}
            </div>
            <div style={{ background: '#2a2a2a', padding: '15px', margin: '10px 0', borderLeft: '3px solid #00ff00' }}>
                <strong>All Env Vars:</strong><br />
                <pre>{JSON.stringify(import.meta.env, null, 2)}</pre>
            </div>
        </div>
    );
}
