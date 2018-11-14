
export function loginPage({ message = '', username = '', password = '' } = {}) {
    return `
    <h2>Login Page</h2>
    <div class="login-content">
          <div class="alert alert-warning">
              ${message}
          </div>
          <form action="" method="POST">
            <label for="username">Username:</label>
            <input type="text" placeholder="Username" name="username" value="${username}" required />
            <div></div>
            <label for="password">Password:</label>
            <input type="password" placeholder="Password" name="password" value="${password}" required />
            <div></div>
            <button type="submit" >Login</button>
          </form>
    </div>`;
}
