// Test script to verify M-Pesa server is working
const testMpesaServer = async () => {
  try {
    console.log('Testing M-Pesa server connection...')
    
    // Test health check
    const healthResponse = await fetch('http://localhost:3001/')
    if (healthResponse.ok) {
      console.log('✅ M-Pesa server is running!')
    } else {
      console.log('❌ M-Pesa server health check failed')
      return
    }
    
    // Test STK endpoint (this will fail with sandbox credentials, but we can test the connection)
    console.log('Testing STK endpoint...')
    const stkResponse = await fetch('http://localhost:3001/stk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: '254700000000',
        amount: 10
      })
    })
    
    const stkData = await stkResponse.json()
    console.log('STK Response:', stkData)
    
    if (stkResponse.ok) {
      console.log('✅ STK endpoint is working!')
    } else {
      console.log('⚠️ STK endpoint responded with error (expected with sandbox credentials)')
      console.log('Error:', stkData.error || stkData.message)
    }
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message)
  }
}

testMpesaServer() 