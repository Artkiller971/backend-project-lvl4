export default {
  translation: {
    appName: 'Менеджер Задач',
    layout: {
      application: {
        users: 'Пользователи',
        statuses: 'Статусы',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выйти',
        edit: 'Изменить',
        delete: 'Удалить',
        submit: 'Сохранить',
        createStatus: 'Создание статуса',
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
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        edit: {
          error: 'Ошбика при редактировании пользователя',
          success: 'Пользователь успешно отредактирован'
        },
        delete: {
          error: 'Вы не можете удалять других пользователей',
          success: 'Пользователь успешно удален'
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
          success: 'Статус успешно удален'
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
        createdAt: 'Дата создания',
        actions: 'Действия'
      },
      session: {
        signIn: 'Войти',
      },
      statuses: {
        title: 'Статусы',
        name: 'Наименование',
        createdAt: 'Дата создания',
        actions: 'Действия',
        createStatus: 'Создать статус',
      }
    }
  },
}