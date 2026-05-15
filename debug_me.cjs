const axios = require('axios');

async function test() {
  try {
    const login = await axios.post('https://titipin-api.bccdev.id/api/v1/login', {
      email: 'oktavianus.s.m@gmail.com', // Let's guess a valid email or create one
      password: 'password'
    }).catch(e => e.response);

    // Instead of real login, we can register a test user
    const randomStr = Math.random().toString(36).substring(7);
    const reg = await axios.post('https://titipin-api.bccdev.id/api/v1/register', {
      name: 'Test Agent',
      email: `test_${randomStr}@example.com`,
      password: 'password',
      wa_number: '08123454034'
    });
    
    const token = reg.data.data.access_token;
    
    // Create a listing
    await axios.post('https://titipin-api.bccdev.id/api/v1/jastip/listings', {
      from_loc: 'Loc A',
      to_loc: 'Loc B',
      deadline: new Date(Date.now() + 86400000).toISOString(),
      images: ['https://example.com/img.jpg']
    }, { headers: { Authorization: `Bearer ${token}` } });
    
    // Fetch mine
    const mine = await axios.get('https://titipin-api.bccdev.id/api/v1/me/jastip/listings', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(JSON.stringify(mine.data.data.data[0], null, 2));
  } catch (e) {
    console.error(e.message);
    if(e.response) console.error(e.response.data);
  }
}
test();
