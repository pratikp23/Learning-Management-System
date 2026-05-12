import axios from 'axios';

(async () => {
  try {
    const res = await axios.post('https://learning-management-system-96e4.onrender.com/api/auth/signup', {
      name: 'Tester',
      email: 'tester123@example.com',
      password: 'Password123!',
      role: 'student'
    }, { withCredentials: true });
    console.log('Status:', res.status);
    console.log('Data:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('Error status:', err.response.status);
      console.error('Error data:', err.response.data);
    } else {
      console.error('Network error:', err.message);
    }
  }
})();
