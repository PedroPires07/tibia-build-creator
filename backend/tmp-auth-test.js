(async () => {
  try {
    const username = 'testuser' + Date.now();
    const email = username + '@example.com';
    const password = 'Test1234!';

    const registerRes = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, mainClass: 'Knight' })
    });

    console.log('REGISTER STATUS', registerRes.status);
    const registerBody = await registerRes.text();
    console.log(registerBody.slice(0, 500));

    if (!registerRes.ok) return;
    const registerData = JSON.parse(registerBody);

    const loginRes = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrUsername: registerData.user.email, password })
    });

    console.log('LOGIN STATUS', loginRes.status);
    console.log((await loginRes.text()).slice(0, 500));
  } catch (err) {
    console.error('ERROR', err);
  }
})();
