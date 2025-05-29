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
      tasks: {
        create: {
          error: 'Failed to create task',
          success: 'Task created successfully',
        },
        update: {
          error: 'Failed to update task',
          success: 'Task successfully updated',
        },
        delete: {
          error: 'Failed to delete task',
          success: 'Task successfully deleted',
        },
        authError: 'Access Denied',
      },
      labels: {
        create: {
          error: 'Failed to create label',
          success: 'Label created successfully',
        },
        update: {
          error: 'Failed to update label',
          success: 'Label successfully updated',
        },
        delete: {
          error: 'Failed to delete label',
          success: 'Label successfully deleted',
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
        tasks: 'Tasks',
        labels: 'Labels',
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
      labels: {
        id: 'ID',
        name: 'Name',
        createdAt: 'Created at',
        edit: {
          label: 'Edit Label',
          submit: 'Edit',
        },
        delete: 'Delete',
        new: {
          submit: 'Create',
          creation: 'Create Label',
        },
        labelsList: 'Labels',
        createLabel: 'Create label',
      },
      tasks: {
        id: 'ID',
        name: 'Name',
        createdAt: 'Created at',
        status: 'Status',
        creator: 'Creator',
        executor: 'Executor',
        edit: 'Edit',
        delete: 'Delete',
        createTask: 'Create task',
        tasksList: 'Tasks',
        new: 'New Task',
        create: 'Create',
        editTask: 'Edit task',
      },
      welcome: {
        index: {
          hello: 'Welcome to the Task Manager app',
          description: 'Manage your tasks and their progress',
          more: 'Learn more',
        },
      },
    },
    form: {
      name: 'Name',
      description: 'Description',
      statusId: 'Status',
      creatorId: 'Creator',
      executorId: 'Executor',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      password: 'Password',
      labels: 'Labels',
    },
  },
};
