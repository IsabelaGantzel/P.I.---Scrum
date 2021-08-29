// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from '@adonisjs/core/build/standalone'

export default class ProjectsController {
  public async index() {
    return {
      result: [
        {
          name: 'Project 0',
          start_date: Date.now(),
          final_date: null,
          manager_id: 0,
          client_id: 0,
        },
      ].map((x, index) => ({ ...x, id: index })),
    }
  }

  public async store({ request }: HttpContext) {
    const data = request.all()
    return data
  }

  public async show({ params }: HttpContext) {
    const projectId = Number(params.projectId)
    return { id: projectId }
  }
}
