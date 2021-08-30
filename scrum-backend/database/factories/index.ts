import Factory from '@ioc:Adonis/Lucid/Factory'
import Person from 'App/Models/Person'
import Manager from 'App/Models/Manager'
import Sprint from 'App/Models/Sprint'
import Project from 'App/Models/Project'
import { DateTime } from 'luxon'

const DAYS = 1000 * 60 * 60 * 24

export const PersonFactory = Factory.define(Person, ({ faker }) => {
  return {
    user: faker.internet.userName(),
    password: faker.internet.password(),
  }
}).build()

export const ManagerFactory = Factory.define(Manager, () => ({}))
  .relation('person', () => PersonFactory)
  .build()

export const ProjectFactory = Factory.define(Project, ({ faker }) => {
  return {
    name: 
  }
}).build()

export const SprintFactory = Factory.define(Sprint, () => {
  const now = Date.now()

  return {
    startDate: DateTime.fromMillis(now),
    finalDate: DateTime.fromMillis(now + DAYS * 7),
  }
}).build()
