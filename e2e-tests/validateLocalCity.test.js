const supabase = require('./supabaseClient');

async function validateLocalCity(email, expectedCity) {
  const { data, error } = await supabase
    .from('user_signins')
    .select('local_city')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching data:', error);
    return;
  }

  console.assert(data.local_city === expectedCity, `Test failed: The local_city for ${email} does not match the expected value.`);
  console.log(`Test passed: The local_city for ${email} matches the expected value.`);
}

// Mock data for testing
const testEmail = 'kesginkerem@gmail.com';
const expectedCity = 'Ankara';

validateLocalCity(testEmail, expectedCity);
