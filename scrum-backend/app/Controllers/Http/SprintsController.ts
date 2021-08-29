// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from '@adonisjs/core/build/standalone'

export default class SprintsController {
  public async store({ request }: HttpContext) {
    const data = request.all()
    return data
  }
}
