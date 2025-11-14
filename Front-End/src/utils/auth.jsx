
export class MobileAuth {
  static STORAGE_KEYS = {
    USERS: 'foodApp_mobileUsers',
    CURRENT_USER: 'user',
    LOGIN_STATUS: 'isLoggedIn'
  };

  // Initialize with some demo users for testing
  static initializeDemoUsers() {
    const existingUsers = this.getUsers();
    if (existingUsers.length === 0) {
      const demoUsers = [
        {
          id: 'demo_1',
          fullName: 'Demo User',
          username: 'demo',
          emailAddress: 'demo@example.com',
          phoneNumber: '9876543210',
          password: 'demo123',
          createdAt: new Date().toISOString()
        },
        {
          id: 'demo_2',
          fullName: 'Test User',
          username: 'test',
          emailAddress: 'test@example.com',
          phoneNumber: '9876543211',
          password: 'test123',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(demoUsers));
      console.log('📱 Demo users initialized for mobile');
    }
  }

  // Get all users from localStorage
  static getUsers() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USERS) || '[]');
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  // Register new user (offline)
  static register(userData) {
    return new Promise((resolve, reject) => {
      try {
        const users = this.getUsers();
        
        // Check if user already exists
        const existingUser = users.find(user => 
          user.username === userData.username || 
          user.emailAddress === userData.emailAddress
        );

        if (existingUser) {
          reject(new Error('User already exists with this username or email'));
          return;
        }

        // Create new user
        const newUser = {
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          fullName: userData.fullName,
          username: userData.username,
          emailAddress: userData.emailAddress,
          phoneNumber: userData.phoneNumber,
          password: userData.password,
          createdAt: new Date().toISOString()
        };

        // Add to users array
        users.push(newUser);
        localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));

        console.log('✅ User registered offline:', newUser);
        resolve(newUser);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Login user (offline)
  static login(username, password) {
    return new Promise((resolve, reject) => {
      try {
        const users = this.getUsers();
        const user = users.find(u => 
          u.username === username && 
          u.password === password
        );

        if (user) {
          const userInfo = {
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            emailAddress: user.emailAddress,
            phoneNumber: user.phoneNumber,
            isLoggedIn: true,
            loginTime: new Date().toISOString()
          };

          // Save current user
          localStorage.setItem(this.STORAGE_KEYS.CURRENT_USER, JSON.stringify(userInfo));
          localStorage.setItem(this.STORAGE_KEYS.LOGIN_STATUS, 'true');

          resolve(userInfo);
        } else {
          const userExists = users.find(u => u.username === username);
          if (userExists) {
            reject(new Error('Invalid password! Please check your password.'));
          } else {
            reject(new Error('User not found! Please register first.'));
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  // Check if user is logged in
  static isLoggedIn() {
    try {
      return localStorage.getItem(this.STORAGE_KEYS.LOGIN_STATUS) === 'true';
    } catch (error) {
      return false;
    }
  }

  // Get current user
  static getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CURRENT_USER) || 'null');
    } catch (error) {
      return null;
    }
  }

  // Logout
  static logout() {
    localStorage.removeItem(this.SORAGE_KEYS.CURRENT_USER);
    localStorage.setItem(this.STORAGE_KEYS.LOGIN_STATUS, 'false');
  }
}

// Initialize demo users when this module loads
MobileAuth.initializeDemoUsers();