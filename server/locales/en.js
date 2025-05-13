export default {
  translation: {
    appName: 'Task Manager',
    flash: {
      session: {
        create: {
          success: 'You are logged in',
          error: 'Wrong email or password',
        },
        delete: {
          success: 'You are logged out',
        },
      },
      users: {
        create: {
          error: 'Failed to register',
          success: 'User registered successfully',
        },
        update: {
          error: 'Failed to update the user',
          success: 'User successfully updated',
        },
        delete: {
          error: 'Failed to delete the user',
          success: 'User successfully deleted',
        },
        authError: 'Access Denied',
      },
      authError: 'Access denied! Please login',
    },
    layouts: {
      application: {
        users: 'Users',
        signIn: 'Log in',
        signUp: 'Register',
        signOut: 'Log out',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Login',
          submit: 'Login',
        },
      },
      users: {
        id: 'ID',
        email: 'Email',
        firstName: 'First Name',
        lastName: 'Last Name',
        createdAt: 'Created at',
        new: {
          submit: 'Register',
          signUp: 'Register',
        },
        edit: {
          user: 'Edit user',
          submit: 'Edit',
        },
        delete: 'Delete',
      },
      welcome: {
        index: {
          hello: 'Welcome to the Task Manager app',
          description: 'Manage your tasks and their progress',
          more: 'Learn more',
        },
      },
    },
  },
};
