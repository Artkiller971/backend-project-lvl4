export default {
  translation: {
    appName: 'Менеджер Задач',
    layout: {
      application: {
        actions: 'Действия',
        users: 'Пользователи',
        statuses: 'Статусы',
        tasks: 'Задачи',
        labels: 'Метки',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выйти',
        edit: 'Изменить',
        delete: 'Удалить',
        submit: 'Сохранить',
        createStatus: 'Создание статуса',
        createTask: 'Создание задачи',
        createLabel: 'Создание метки',
        createdAt: 'Дата создания',
      }
    },
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
        edit: {
          error: 'Ошбика при редактировании пользователя',
          success: 'Пользователь успешно отредактирован'
        },
        delete: {
          error: 'Вы не можете удалять других пользователей',
          success: 'Пользователь успешно удален',
          existsError: 'Нельзя удалять пользователей связанных с задачами'
        }
      },
      statuses: {
        create: {
          error: 'Не удалось создать статус',
          success: 'Статус успешно создан',
        },
        edit: {
          error: 'Ошбика при редактировании статуса',
          success: 'Статус успешно отредактирован'
        },
        delete: {
          error: 'Ошибка при удалении статуса',
          success: 'Статус успешно удален',
          existError: 'Нельзя удалять статусы связанные с задачами',
        }
      },
      tasks: {
        create: {
          error: 'Не удалось создать задачу',
          success: 'Задача успешно создана',
        },
        edit: {
          error: 'Ошбика при редактировании задачи',
          success: 'Задача успешно отредактирована'
        },
        delete: {
          error: 'Задачу может удалить только ее автор',
          success: 'Задача успешно удалена'
        }
      },
      labels: {
        create: {
          error: 'Не удалось создать метку',
          success: 'Метка успешно создана',
        },
        edit: {
          error: 'Ошбика при редактировании метки',
          success: 'Метка успешно отредактирована'
        },
        delete: {
          error: 'Ошибка при удалении метки',
          success: 'Метка успешно удалена',
          existError: 'Нельзя удалять метки связанные с задачами',
        }
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    views: {
      welcome: {
        index: {
          hello: 'Добро Пожаловать!',
          main: 'На главную'
        }
      },
      users: {
        edit: {
          title: 'Изменение пользователя'
        },
        firstName: 'Имя',
        lastName: 'Фамилия',
        password: 'Пароль',
        title: 'Пользователи',
        fullName: 'Полное имя',
        email: 'Email',
      },
      session: {
        signIn: 'Войти',
      },
      statuses: {
        title: 'Статусы',
        name: 'Наименование',
        createStatus: 'Создать статус',
      },
      tasks: {
        edit: {
          title: 'Редактирование задачи'
        },
        title: 'Задачи',
        createTask: 'Создать задачу',
        name: 'Наименование',
        description: 'Описание',
        statusId: 'Статус',
        creator: 'Автор',
        executorId: 'Исполнитель',
        noTasks: 'Задач нет'
      },
      labels: {
        edit: {
          title: 'Редактирование метки'
        },
        title: 'Метки',
        createLabel: 'Создать метку',
        name: 'Наименование',
      }
    }
  },
}