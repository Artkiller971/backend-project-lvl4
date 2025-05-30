export default {
  translation: {
    appName: 'Менеджер Задач',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать пользователя',
          success: 'Пользователь успешно зарегистрирован',
        },
        update: {
          error: 'Не удалось обновить пользователя',
          success: 'Пользователь успешно обновлен',
        },
        delete: {
          error: 'Не удалось удалить пользователя',
          success: 'Пользователь успешно удален',
        },
      },
      statuses: {
        create: {
          error: 'Не удалось создать статус',
          success: 'Статус успешно создан',
        },
        update: {
          error: 'Не удалось обновить статус',
          success: 'Статус успешно обновлен',
        },
        delete: {
          error: 'Не удалось удалить статус',
          success: 'Статус успешно удален',
        },
        authError: 'Отказано в доступе',
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        statuses: 'Статусы',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
        tasks: 'Задачи',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        id: 'ID',
        firstName: 'Имя',
        lastName: 'Фамилия',
        email: 'Email',
        createdAt: 'Дата создания',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
        edit: {
          user: 'Редактировать',
          submit: 'Редактировать',
        },
        delete: 'Удалить',
        createUser: 'Создать пользователя',
        usersList: 'Пользователи',
      },
      statuses: {
        id: 'ID',
        name: 'Название',
        createdAt: 'Дата создания',
        edit: {
          status: 'Редактировать статус',
          submit: 'Редактировать',
        },
        delete: 'Удалить',
        new: {
          submit: 'Создать',
          creation: 'Создание статус',
        },
        statusesList: 'Статусы',
        createStatus: 'Создать статус',
      },
      tasks: {
        id: 'ID',
        name: 'Название',
        createdAt: 'Дата создания',
        status: 'Статус',
        creator: 'Создатель',
        executor: 'Исполнитель',
        edit: 'Редактировать',
        delete: 'Удалить',
        createTask: 'Создать задачу',
        tasksList: 'Задачи',
        new: 'Новая задача',
        create: 'Создать',
      },
      welcome: {
        index: {
          hello: 'Добро пожаловать в Менеджер Задач',
          description: 'Приложение для отслеживания выполнения задач',
          more: 'Узнать Больше',
        },
      },
    },
    form: {
      name: 'Название',
      description: 'Описание',
      statusId: 'Статус',
      creatorId: 'Создатель',
      executorId: 'Исполнитель',
      firstName: 'Имя',
      lastName: 'Фамилия',
      email: 'Email',
      password: 'Пароль',
    },
  },
};
