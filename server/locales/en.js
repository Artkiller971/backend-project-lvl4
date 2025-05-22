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
      statuses: {
        create: {
          error: 'Failed to create status',
          success: 'Status created successfully',
        },
        update: {
          error: 'Failed to update status',
          success: 'Status successfully updated',
        },
        delete: {
          error: 'Failed to delete status',
          success: 'Status successfully deleted',
        },
        authError: 'Access Denied',
      },
      authError: 'Access denied! Please login',
    },
    layouts: {
      application: {
        users: 'Users',
        statuses: 'Statuses',
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
        createUser: 'Create user',
        usersList: 'Users',
      },
      statuses: {
        id: 'ID',
        name: 'Name',
        createdAt: 'Created at',
        edit: {
          status: 'Edit Status',
          submit: 'Edit',
        },
        delete: 'Delete',
        new: {
          submit: 'Create',
          creation: 'Create status',
        },
        statusesList: 'Statuses',
        createStatus: 'Create status',
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
