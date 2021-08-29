// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from "@adonisjs/core/build/standalone";

export default class TasksController {
  public async index({ params }: HttpContext) {
    const projectId = Number(params.projectId)
    return { id: projectId }
  }

  public async nextStage({ params }: HttpContext) {
    const taskId = Number(params.taskId)
    return { id: taskId }
  }

  public async prevStage({ params }: HttpContext) {
    const taskId = Number(params.taskId)
    return { id: taskId }
  }
}
